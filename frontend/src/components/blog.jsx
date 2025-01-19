import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaTimes } from 'react-icons/fa';
import './blog.css';
import Navbar from './navbar';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

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

  // Handle liking a blog
  const handleLike = async (blogId) => {
    try {
      const response = await axios.put(`https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${blogId}/like`);
      const updatedBlog = response.data;

      // Update the local state with the new likes count
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: updatedBlog.likes } : blog
        )
      );
    } catch (error) {
      console.error('Error liking the blog:', error);
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
                    {blog.content.substring(0, 150)}...
                  </p>

                  {/* Subheadings */}
                  {blog.subheadings &&
                    blog.subheadings.map((subheading, index) => (
                      <div key={index} className="blog-subheading-section">
                        <h3 className="blog-subheading-title">{subheading.title}</h3>
                        <p className="blog-subheading-content">{subheading.content}</p>
                        {subheading.media && (
                          <img
                            src={`https://polar-painting-backend.onrender.com/${subheading.media}`}
                            alt={`Subheading Media ${index + 1}`}
                            className="blog-subheading-image"
                          />
                        )}
                      </div>
                    ))}

                  {/* Like Button and Likes Count */}
                  <div className="blog-like-section">
                    <button
                      className="blog-like-button"
                      onClick={() => handleLike(blog._id)}
                    >
                      <FaHeart /> Like
                    </button>
                    <span className="blog-likes-count">{blog.likes} Likes</span>
                  </div>

                  {/* Read More Button */}
                  <button
                    className="blog-read-more-button"
                    onClick={() => handleReadMore(blog)}
                  >
                    Read More
                  </button>
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
        <div className="blog-modal">
          <div className="blog-modal-content">
            <button className="blog-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
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
      )}
    </>
  );
};

export default Blog;
