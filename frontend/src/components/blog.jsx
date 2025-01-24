import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaTimes } from 'react-icons/fa';
import './blog.css';
import Navbar from './navbar';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set()); // To track user likes

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://polar-painting-backend.onrender.com/api/blogroutes/blogs');
        setBlogs(response.data);
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

  // Handle like/unlike actions
  const handleLike = async (blogId, isLiked) => {
    if (userLikes.has(blogId) && isLiked) {
      // User has already liked this post, so we will unlike it
      return handleUnlike(blogId);
    }

    try {
      // Determine the action: "like"
      const response = await axios.put(
        `https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${blogId}/like`
      );

      // Get the updated blog data from the response
      const updatedBlog = response.data;

      // Update the local state with the new like count and like status
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likes: updatedBlog.likes, // Update like count from response
                isLiked: true, // Mark it as liked
              }
            : blog
        )
      );

      // Mark this blog as liked by the user
      setUserLikes((prevLikes) => new Set(prevLikes).add(blogId));
    } catch (error) {
      console.error('Error liking the blog:', error);
    }
  };

  // Handle unlike action
  const handleUnlike = async (blogId) => {
    try {
      // Send request to the backend to unlike the blog
      const response = await axios.put(
        `https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${blogId}/unlike`
      );

      // Get the updated blog data from the response
      const updatedBlog = response.data;

      // Update the local state with the new like count and like status
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likes: updatedBlog.likes, // Update like count from response
                isLiked: false, // Mark it as unliked
              }
            : blog
        )
      );

      // Remove this blog from the liked set
      setUserLikes((prevLikes) => {
        const updatedLikes = new Set(prevLikes);
        updatedLikes.delete(blogId);
        return updatedLikes;
      });
    } catch (error) {
      console.error('Error unliking the blog:', error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Blog Hero Section */}
      <section className="blog-hero-section">
        <div className="blog-hero-overlay">
          <h1 className="blog-hero-heading">Explore Our Latest Blogs</h1>
          <p className="blog-hero-subheading">Stay updated with the latest insights and trends</p>
        </div>
      </section>

      {/* Blog Page Content */}
      <div className="blog-page-container">
        <h1 className="blog-page-title">Featured Blogs</h1>
        <div className="blog-list-container">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card-container">
                <div className="blog-card-header">
                  <h2 className="blog-card-title">"{blog.title}"</h2>
                  <div className="blog-meta-info">
                    <p className="blog-author-name">By {blog.author || 'Anonymous'}</p>
                    <p className="blog-publish-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="blog-card-content">
                  {/* Main Blog Image */}
                  {blog.media && (
                    <div className="blog-thumbnail-container">
                      <img
                        src={`https://polar-painting-backend.onrender.com/${blog.media}`}
                        alt="Blog Thumbnail"
                        className="blog-thumbnail-image"
                      />
                    </div>
                  )}
                  <p className="blog-card-description">
                    {blog.content.length > 150 ? blog.content.substring(0, 150) : blog.content}
                    {blog.content.length > 150 && '...'}
                  </p>

                  {/* Like Button */}
                  <div className="blog-like-section">
                    <button
                      className="blog-like-button"
                      onClick={() => handleLike(blog._id, blog.isLiked)}
                    >
                      <FaHeart /> {blog.isLiked ? 'Liked Already' : 'Like'}
                    </button>
                    <span className="blog-likes-count">{blog.likes} Likes</span>
                  </div>

                  {/* Read More Button */}
                  {blog.content.length > 150 && (
                    <button
                      className="blog-read-more-button"
                      onClick={() => handleReadMore(blog)}
                    >
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

  {/* Blog Modal for Detailed View */}
{selectedBlog && (
  <div className="blog-modal-overlay" onClick={closeModal}>
    <div className="blog-modal-container" onClick={(e) => e.stopPropagation()}>
      <button className="blog-modal-close" onClick={closeModal}>
        <FaTimes />
      </button>
      <div className="blog-modal-content">
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
              src={`https://polar-painting-backend.onrender.com/${selectedBlog.media}`}
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
                <img
                  src={`https://polar-painting-backend.onrender.com/${subheading.media}`}
                  alt={`Subheading Media ${index + 1}`}
                  className="blog-modal-subheading-image"
                />
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
