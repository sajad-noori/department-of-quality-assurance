import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const containerStyle = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '1rem',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  border: '1px solid #333333',
};

const titleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center',
};

const subtitleStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#cccccc',
  textAlign: 'center',
};

const formContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  marginBottom: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formGroupStyle = {
  marginBottom: '1.5rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#ffffff',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const inputFocusStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '100px',
};

const fileInputStyle = {
  ...inputStyle,
  padding: '0.5rem',
  cursor: 'pointer',
};

const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  accentColor: '#00d4ff',
  cursor: 'pointer',
};

const checkboxLabelStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  cursor: 'pointer',
};

const buttonStyle = {
  backgroundColor: '#00d4ff',
  border: 'none',
  color: '#000000',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginRight: '0.75rem',
};

const buttonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const buttonSecondaryStyle = {
  ...buttonStyle,
  backgroundColor: '#666666',
  color: '#ffffff',
};

const buttonSecondaryHoverStyle = {
  backgroundColor: '#555555',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(102, 102, 102, 0.3)',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const tableContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  color: '#ffffff',
};

const tableHeaderStyle = {
  backgroundColor: '#2d2d2d',
  borderBottom: '2px solid #333333',
};

const tableHeaderCellStyle = {
  padding: '1rem 0.75rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#ffffff',
  borderBottom: '1px solid #333333',
};

const tableCellStyle = {
  padding: '0.75rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: '#cccccc',
  borderBottom: '1px solid #333333',
};

const tableRowHoverStyle = {
  backgroundColor: '#2a2a2a',
};

const imageStyle = {
  width: '60px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: '1px solid #333333',
};

const actionButtonStyle = {
  padding: '0.5rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  margin: '0 0.25rem',
  transition: 'all 0.2s ease',
};

const editButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: '#ffc107',
  color: '#000000',
};

const deleteButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: '#dc3545',
  color: '#ffffff',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#999999',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  color: '#999999',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid #333333',
  borderTop: '3px solid #00d4ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginRight: '1rem',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '1.5rem',
  padding: '1rem',
};

const pageButtonStyle = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #333333',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};

const activePageButtonStyle = {
  ...pageButtonStyle,
  backgroundColor: '#00d4ff',
  color: '#000000',
  borderColor: '#00d4ff',
};

const disabledPageButtonStyle = {
  ...pageButtonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};

const pageInfoStyle = {
  color: '#999999',
  fontSize: '0.875rem',
  margin: '0 1rem',
};

const NewsForm = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    image: null,
    is_published: true,
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/news`);
      console.log('News data received:', res.data);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('content', formData.content);
    payload.append('author', formData.author);
    payload.append('is_published', formData.is_published);
    if (formData.image) payload.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/news/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/news`, payload);
      }
      await fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('خطا در ذخیره خبر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      author: item.author,
      image: null,
      is_published: item.is_published,
    });
    // Scroll to form
    document.getElementById('news-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/news/${id}`);
      await fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('خطا در حذف خبر');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      author: '',
      image: null,
      is_published: true,
    });
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>مدیریت اخبار</h1>
        <p style={subtitleStyle}>ایجاد و ویرایش اخبار سیستم</p>
      </div>

      <div id="news-form" style={formContainerStyle}>
        <h3 style={{ marginBottom: '1.5rem', color: '#ffffff' }}>
          {editingId ? 'ویرایش خبر' : 'ایجاد خبر جدید'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="title" style={labelStyle}>عنوان</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عنوان خبر را وارد کنید..."
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="description" style={labelStyle}>توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات کوتاه خبر..."
              required
              style={textareaStyle}
              rows={3}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="content" style={labelStyle}>محتوا</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="محتوای کامل خبر..."
              style={textareaStyle}
              rows={5}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="author" style={labelStyle}>نویسنده</label>
            <input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="نام نویسنده..."
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="image" style={labelStyle}>تصویر</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleChange}
              style={fileInputStyle}
              accept="image/*"
            />
          </div>

          <div style={checkboxContainerStyle}>
            <input
              id="is_published"
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              style={checkboxStyle}
            />
            <label htmlFor="is_published" style={checkboxLabelStyle}>
              منتشر شود؟
            </label>
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="submit"
              disabled={submitting}
              style={buttonStyle}
            >
              <span>{submitting ? '⏳' : editingId ? '✏️' : '➕'}</span>
              <span>{submitting ? 'در حال ذخیره...' : editingId ? 'به‌روزرسانی' : 'ایجاد'}</span>
            </button>
            
            {editingId && (
              <button
                type="button"
                style={buttonSecondaryStyle}
                onClick={resetForm}
              >
                <span>❌</span>
                <span>لغو</span>
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={tableContainerStyle}>
        <h3 style={{ marginBottom: '1.5rem', color: '#ffffff' }}>لیست اخبار</h3>
        
        {news.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📰</div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>هیچ خبری موجود نیست</h4>
            <p style={{ color: '#999999' }}>هنوز هیچ خبری در سیستم ثبت نشده است</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableHeaderCellStyle}>عنوان</th>
                  <th style={tableHeaderCellStyle}>توضیحات</th>
                  <th style={tableHeaderCellStyle}>نویسنده</th>
                  <th style={tableHeaderCellStyle}>تصویر</th>
                  <th style={tableHeaderCellStyle}>تاریخ</th>
                  <th style={tableHeaderCellStyle}>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr 
                    key={item.id}
                    style={{ transition: 'background-color 0.2s ease' }}
                  >
                    <td style={tableCellStyle}>{item.title}</td>
                    <td style={tableCellStyle}>
                      <div style={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={tableCellStyle}>{item.author}</td>
                    <td style={tableCellStyle}>
                      {item.image_path ? (
                        <img
                          src={`${API_BASE_URL}${item.image_path}`}
                          alt="news"
                          style={imageStyle}
                          onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                      ) : (
                        <span style={{ color: '#666666' }}>-</span>
                      )}
                      {item.image_path && (
                        <span 
                          style={{ 
                            color: '#666666', 
                            fontSize: '0.75rem',
                            display: 'none'
                          }}
                        >
                          تصویر موجود نیست
                        </span>
                      )}
                    </td>
                    <td style={tableCellStyle}>{formatDate(item.published_date || item.created_at)}</td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={editButtonStyle}
                        title="ویرایش"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={deleteButtonStyle}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={paginationStyle}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={currentPage === 1 ? disabledPageButtonStyle : pageButtonStyle}
        >
          قبلی
        </button>
        <span style={pageInfoStyle}>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? disabledPageButtonStyle : pageButtonStyle}
        >
          بعدی
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewsForm;
