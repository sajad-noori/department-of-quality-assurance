import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NewsForm.css'; // keep your custom CSS if needed

const API_BASE_URL = 'http://localhost:5000';

const NewsSectionDashboard = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    image: null,
    is_published: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/news`);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching news:', error);
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
      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/news/${id}`);
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
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
  };

  return (
    <div className="container my-4" style={{ fontFamily: 'sans-serif' }}>
      <h2 className="mb-4">{editingId ? 'ویرایش خبر' : 'ایجاد خبر جدید'}</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">عنوان</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان"
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">توضیحات</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات"
            required
            className="form-control"
            rows={2}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">محتوا</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="محتوا"
            className="form-control"
            rows={4}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label">نویسنده</label>
          <input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="نویسنده"
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">تصویر</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={handleChange}
            className="form-control"
            accept="image/*"
          />
        </div>

        <div className="form-check mb-4">
          <input
            id="is_published"
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="form-check-input"
          />
          <label htmlFor="is_published" className="form-check-label">
            منتشر شود؟
          </label>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editingId ? 'به‌روزرسانی' : 'ایجاد'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              resetForm();
              setEditingId(null);
            }}
          >
            لغو
          </button>
        )}
      </form>

      <h2 className="mb-3">لیست اخبار</h2>
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>عنوان</th>
            <th>توضیحات</th>
            <th>نویسنده</th>
            <th>تصویر</th>
            <th>منتشر شده</th>
            <th>تاریخ</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {news.length === 0 ? (
            <tr>
              <td colSpan="7">هیچ خبری موجود نیست</td>
            </tr>
          ) : (
            news.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.author}</td>
                <td>
                  {item.image_path ? (
                    <img
                      src={`${API_BASE_URL}/uploads/news-images/${item.image_path}`}
                      alt="news"
                      width="80"
                      className="img-thumbnail"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{item.is_published ? 'بله' : 'خیر'}</td>
                <td>{new Date(item.published_date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-outline-warning btn-sm me-2"
                    title="ویرایش"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-outline-danger btn-sm"
                    title="حذف"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewsSectionDashboard;
