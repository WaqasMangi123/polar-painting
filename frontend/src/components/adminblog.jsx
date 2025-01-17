import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminblog.css';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: { value: '', fontSize: '16', bold: false, italic: false, language: 'English', fontFamily: 'Times New Roman' },
    content: { value: '', fontSize: '16', language: 'English', fontFamily: 'Times New Roman' },
    author: '',
    media: null,
    subheadings: [
      {
        title: '',
        content: '',
        media: null,
        fontSize: '16',
        bold: false,
        italic: false,
        language: 'English',
        fontFamily: 'Times New Roman',
      },
    ],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get('https://polar-painting-backend.onrender.com/api/blogroutes/blogs', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error.response?.data || error.message);
      alert('Error fetching blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleFormattingChange = (field, type) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [type]: !formData[field][type],
      },
    });
  };

  const handleFontSizeChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        fontSize: value,
      },
    });
  };

  const handleLanguageChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        language: value,
      },
    });
  };

  const handleFontFamilyChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        fontFamily: value,
      },
    });
  };

  const handleSubheadingChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index][name] = value;
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleFormattingChangeForSubheading = (index, type) => {
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index][type] = !updatedSubheadings[index][type];
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleFontSizeChangeForSubheading = (index, value) => {
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index].fontSize = value;
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleLanguageChangeForSubheading = (index, value) => {
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index].language = value;
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleFontFamilyChangeForSubheading = (index, value) => {
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index].fontFamily = value;
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleSubheadingFileChange = (e, index) => {
    const updatedSubheadings = [...formData.subheadings];
    updatedSubheadings[index].media = e.target.files[0];
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleAddSubheading = () => {
    setFormData({
      ...formData,
      subheadings: [
        ...formData.subheadings,
        {
          title: '',
          content: '',
          media: null,
          fontSize: '16',
          bold: false,
          italic: false,
          language: 'English',
          fontFamily: 'Times New Roman',
        },
      ],
    });
  };

  const handleRemoveSubheading = (index) => {
    const updatedSubheadings = formData.subheadings.filter((_, i) => i !== index);
    setFormData({ ...formData, subheadings: updatedSubheadings });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('adminToken');

    if (!formData.title.value.trim() || !formData.content.value.trim()) {
      alert('Title and Content are required.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', JSON.stringify(formData.title));
    formDataToSubmit.append('content', JSON.stringify(formData.content));
    formDataToSubmit.append('author', formData.author || 'Anonymous');
    if (formData.media) formDataToSubmit.append('media', formData.media);
    formDataToSubmit.append(
      'subheadings',
      JSON.stringify(
        formData.subheadings.map((subheading, index) => {
          if (subheading.media instanceof File) {
            formDataToSubmit.append(`subheadingMedia_${index}`, subheading.media);
          }
          return {
            title: subheading.title,
            content: subheading.content,
            fontSize: subheading.fontSize,
            bold: subheading.bold,
            italic: subheading.italic,
            language: subheading.language,
            fontFamily: subheading.fontFamily,
          };
        })
      )
    );

    try {
      setIsLoading(true);

      if (editMode) {
        await axios.put(`https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${editingBlogId}`, formDataToSubmit, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('https://polar-painting-backend.onrender.com/api/blogroutes/blogs', formDataToSubmit, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Blog submitted successfully');
      setFormData({
        title: { value: '', fontSize: '16', bold: false, italic: false, language: 'English', fontFamily: 'Times New Roman' },
        content: { value: '', fontSize: '16', language: 'English', fontFamily: 'Times New Roman' },
        author: '',
        media: null,
        subheadings: [
          {
            title: '',
            content: '',
            media: null,
            fontSize: '16',
            bold: false,
            italic: false,
            language: 'English',
            fontFamily: 'Times New Roman',
          },
        ],
      });
      setEditMode(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error submitting blog:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error submitting blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    setEditingBlogId(blogId);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      media: null,
      subheadings: blog.subheadings.map((subheading) => ({
        title: subheading.title,
        content: subheading.content,
        media: null,
        fontSize: subheading.fontSize || '16',
        bold: subheading.bold || false,
        italic: subheading.italic || false,
        language: subheading.language || 'English',
        fontFamily: subheading.fontFamily || 'Times New Roman',
      })),
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    try {
      setIsLoading(true);
      await axios.delete(`https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      alert('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error.response?.data || error.message);
      alert('Failed to delete blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    try {
      await axios.put(`https://polar-painting-backend.onrender.com/api/blogroutes/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error liking blog:', error.response?.data || error.message);
    }
  };

  return (
    <div className="admin-blog-container">
      <h2>{editMode ? 'Edit Blog' : 'Create New Blog'}</h2>
      <form onSubmit={handleSubmit} className="admin-blog-form" encType="multipart/form-data">
        <div className="admin-blog-input-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title.value}
            onChange={(e) =>
              handleInputChange({
                target: { name: 'title', value: { ...formData.title, value: e.target.value } },
              })
            }
            placeholder="Enter blog title"
            style={{
              fontSize: `${formData.title.fontSize}px`,
              fontWeight: formData.title.bold ? 'bold' : 'normal',
              fontStyle: formData.title.italic ? 'italic' : 'normal',
              fontFamily: formData.title.fontFamily,
            }}
            className="admin-blog-input"
          />
          <div className="admin-blog-formatting">
            <label>Font Size:</label>
            <input
              type="number"
              value={formData.title.fontSize}
              onChange={(e) => handleFontSizeChange('title', e.target.value)}
              className="admin-blog-input"
            />
            <label>Language:</label>
            <select
              value={formData.title.language}
              onChange={(e) => handleLanguageChange('title', e.target.value)}
              className="admin-blog-input"
            >
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
            <label>Font Family:</label>
            <select
              value={formData.title.fontFamily}
              onChange={(e) => handleFontFamilyChange('title', e.target.value)}
              className="admin-blog-input"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
            </select>
            <button
              type="button"
              onClick={() => handleFormattingChange('title', 'bold')}
              className={`admin-blog-format-btn ${formData.title.bold ? 'active' : ''}`}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => handleFormattingChange('title', 'italic')}
              className={`admin-blog-format-btn ${formData.title.italic ? 'active' : ''}`}
            >
              Italic
            </button>
          </div>
        </div>

        <textarea
          name="content"
          value={formData.content.value}
          onChange={(e) =>
            handleInputChange({
              target: { name: 'content', value: { ...formData.content, value: e.target.value } },
            })
          }
          placeholder="Content"
          style={{
            fontSize: `${formData.content.fontSize}px`,
            fontFamily: formData.content.fontFamily,
          }}
          className="admin-blog-textarea"
        />
        <div className="admin-blog-formatting">
          <label>Content Font Size:</label>
          <input
            type="number"
            value={formData.content.fontSize}
            onChange={(e) => handleFontSizeChange('content', e.target.value)}
            className="admin-blog-input"
          />
          <label>Language:</label>
          <select
            value={formData.content.language}
            onChange={(e) => handleLanguageChange('content', e.target.value)}
            className="admin-blog-input"
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </select>
          <label>Font Family:</label>
          <select
            value={formData.content.fontFamily}
            onChange={(e) => handleFontFamilyChange('content', e.target.value)}
            className="admin-blog-input"
          >
            <option value="Times New Roman">Times New Roman</option>
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
          </select>
        </div>

        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          placeholder="Author (Optional)"
          className="admin-blog-input"
        />
        <input
          type="file"
          name="media"
          onChange={handleFileChange}
          className="admin-blog-input"
        />
        <div className="admin-blog-subheadings">
          {formData.subheadings.map((subheading, index) => (
            <div key={index} className="admin-blog-subheading">
              <input
                type="text"
                name="title"
                value={subheading.title}
                onChange={(e) => handleSubheadingChange(e, index)}
                placeholder="Subheading Title"
                style={{
                  fontSize: `${subheading.fontSize}px`,
                  fontWeight: subheading.bold ? 'bold' : 'normal',
                  fontStyle: subheading.italic ? 'italic' : 'normal',
                  fontFamily: subheading.fontFamily,
                }}
                className="admin-blog-input"
              />
              <div className="admin-blog-formatting">
                <label>Font Size:</label>
                <input
                  type="number"
                  value={subheading.fontSize}
                  onChange={(e) => handleFontSizeChangeForSubheading(index, e.target.value)}
                  className="admin-blog-input"
                />
                <label>Language:</label>
                <select
                  value={subheading.language}
                  onChange={(e) => handleLanguageChangeForSubheading(index, e.target.value)}
                  className="admin-blog-input"
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
                <label>Font Family:</label>
                <select
                  value={subheading.fontFamily}
                  onChange={(e) => handleFontFamilyChangeForSubheading(index, e.target.value)}
                  className="admin-blog-input"
                >
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleFormattingChangeForSubheading(index, 'bold')}
                  className={`admin-blog-format-btn ${subheading.bold ? 'active' : ''}`}
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => handleFormattingChangeForSubheading(index, 'italic')}
                  className={`admin-blog-format-btn ${subheading.italic ? 'active' : ''}`}
                >
                  Italic
                </button>
              </div>
              <textarea
                name="content"
                value={subheading.content}
                onChange={(e) => handleSubheadingChange(e, index)}
                placeholder="Subheading Content"
                style={{
                  fontSize: `${subheading.fontSize}px`,
                  fontWeight: subheading.bold ? 'bold' : 'normal',
                  fontStyle: subheading.italic ? 'italic' : 'normal',
                  fontFamily: subheading.fontFamily,
                }}
                className="admin-blog-textarea"
              />
              <input
                type="file"
                name="media"
                onChange={(e) => handleSubheadingFileChange(e, index)}
                className="admin-blog-input"
              />
              <button
                type="button"
                onClick={() => handleRemoveSubheading(index)}
                className="admin-blog-remove-btn"
              >
                Remove Subheading
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubheading} className="admin-blog-add-btn">
            Add Subheading
          </button>
        </div>
        <button type="submit" className="admin-blog-submit-btn" disabled={isLoading}>
          {editMode ? 'Update Blog' : 'Submit Blog'}
        </button>
      </form>
      <h2>All Blogs</h2>
{isLoading ? (
  <p>Loading...</p>
) : (
  <div className="admin-blog-list">
    {blogs.map((blog) => (
      <div key={blog._id} className="admin-blog-item">
        <h3>{blog.title}</h3>
        <p>{blog.content}</p>
        <p><strong>Author:</strong> {blog.author}</p>
        <p><strong>Views:</strong> {blog.views}</p>
        <p><strong>Likes:</strong> {blog.likes}</p>
        {blog.media && <img src={`https://polar-painting-backend.onrender.com/${blog.media}`} alt="Blog Media" className="blog-media" />}
        <h4>Subheadings:</h4>
        {blog.subheadings.map((subheading, idx) => (
          <div key={idx} className="admin-blog-subheading">
            <strong>{subheading.title}</strong>
            <p>{subheading.content}</p>
            {subheading.media && <img src={`https://polar-painting-backend.onrender.com/${subheading.media}`} alt="Subheading Media" className="subheading-media" />}
          </div>
        ))}
        <button onClick={() => handleEdit(blog._id)} className="admin-blog-edit-btn">
          Edit
        </button>
        <button onClick={() => handleDelete(blog._id)} className="admin-blog-delete-btn">
          Delete
        </button>
        <button onClick={() => handleLike(blog._id)} className="admin-blog-like-btn">
          Like
        </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
