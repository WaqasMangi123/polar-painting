import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaTimes } from 'react-icons/fa';
import './blog.css';
import Navbar from './navbar';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set(JSON.parse(localStorage.getItem('userLikes')) || []));

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://polar-painting-backend.onrender.com/api/blogroutes/blogs');
        
        // Sort blogs by publishDate in descending order (latest first)
        const sortedBlogs = response.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          
          // Compare the dates to sort in descending order (latest first)
          return dateB - dateA;
        });

        setBlogs(sortedBlogs); // Set the sorted blogs
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  const handleLikeToggle = async (blogId) => {
    const isLiked = userLikes.has(blogId);
    try {
      // Determine the URL to like or unlike the blog
      const url = `https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${blogId}/${isLiked ? 'unlike' : 'like'}`;
      const response = await axios.put(url);
  
      // Get the updated likes count from the server response
      const updatedBlog = response.data;
      const updatedLikesCount = updatedBlog.likes; // Ensure this is the correct updated likes count
  
      // Update the blog state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: updatedLikesCount } : blog
        )
      );
  
      // Update the userLikes set and localStorage
      const updatedLikes = new Set(userLikes);
      if (isLiked) {
        updatedLikes.delete(blogId); // Remove like
      } else {
        updatedLikes.add(blogId); // Add like
      }
      setUserLikes(updatedLikes);
      localStorage.setItem('userLikes', JSON.stringify([...updatedLikes])); // Save updated likes to localStorage
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };
  

  // Function to fix the image URL if needed
  const getImageUrl = (url) => {
    // Only prepend the base URL if it's missing from the start of the URL
    if (url && !url.startsWith('https://polar-painting-backend.onrender.com/')) {
      return `https://polar-painting-backend.onrender.com/${url}`;
    }
    return url;
  };


  return (
    <>
      <Navbar />
      <section className="blog-hero-section">
        <div className="blog-hero-overlay">
          <h1 className="blog-hero-heading">Explore Our Latest Blogs</h1>
          <p className="blog-hero-subheading">Stay updated with the latest insights and trends</p>
        </div>
      </section>

      <div className="blog-page-container">
        <h1 className="blog-page-title">Featured Blogs</h1>
        <div className="blog-list-container">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card-container">
                <div className="blog-card-header">
                  {/* Remove inverted commas from the blog title */}
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <div className="blog-meta-info">
                    <p className="blog-author-name">By {blog.author || 'Anonymous'}</p>
                    <p className="blog-publish-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="blog-card-content">
                  {blog.media && (
                    <div className="blog-thumbnail-container">
                      <img
                        src={getImageUrl(blog.media)} // Use the helper function to get the correct image URL
                        alt="Blog Thumbnail"
                        className="blog-thumbnail-image"
                      />
                    </div>
                  )}
                  <p className="blog-card-description">
                    {blog.content.length > 150 ? blog.content.substring(0, 150) : blog.content}
                    {blog.content.length > 150 && '...'}
                  </p>
                  <div className="blog-like-section">
                    <button className="blog-like-button" onClick={() => handleLikeToggle(blog._id)}>
                      <FaHeart color={userLikes.has(blog._id) ? 'red' : 'gray'} />
                    </button>
                    <span className="blog-likes-count">{blog.likes} Likes</span>
                  </div>
                  {blog.content.length > 150 && (
                    <button className="blog-read-more-button" onClick={() => handleReadMore(blog)}>
                      Read More
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available at the moment.</p>
          )}
        </div>
      </div>

      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeModal}>
          <div className="blog-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <div className="blog-modal-content">
              {/* Remove inverted commas from the modal blog title */}
              <h2 className="blog-modal-title">{selectedBlog.title}</h2>
              <p className="blog-modal-author">By {selectedBlog.author || 'Anonymous'}</p>
              <p className="blog-modal-date">
                Published on {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </p>
              <div className="blog-modal-body">
                <p>{selectedBlog.content}</p>
              </div>
              {selectedBlog.media && (
                <div className="blog-modal-main-image">
                  <img
                    src={getImageUrl(selectedBlog.media)} // Use the helper function to get the correct image URL
                    alt="Blog Medias"
                    className="blog-modal-image"
                  />
                </div>
              )}
              {selectedBlog.subheadings &&
                selectedBlog.subheadings.map((subheading, index) => (
                  <div key={index} className="blog-modal-subheading">
                    <h3 className="blog-modal-subheading-title">{subheading.title}</h3>
                    <p className="blog-modal-subheading-content">{subheading.content}</p>
                    {subheading.media && (
                      <div className="blog-modal-subheading-image-container">
                        <img
                          src={getImageUrl(subheading.media)} // Use the helper function to get the correct image URL
                          alt={`Subheading Media ${index + 1}`}
                          className="blog-modal-subheading-image"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;