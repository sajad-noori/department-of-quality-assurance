import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/news';

const buttonStyle = {
  backgroundColor: '#1e90ff', // DodgerBlue like previous
  border: 'none',
  color: 'white',
  padding: '6px 14px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
  transition: 'background-color 0.3s ease',
};

const buttonDangerStyle = {
  ...buttonStyle,
  backgroundColor: '#e74c3c', // red-ish for delete
};

const buttonHoverStyle = {
  backgroundColor: '#187bcd',
};

const NewsList = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div className="container py-4" style={{ direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h2 className="mb-4 text-center">مدیریت اخبار</h2>

      <div className="d-flex justify-content-start mb-3">
        <button
          onClick={() => navigate('/news/create')}
          style={buttonStyle}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#187bcd')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e90ff')}
        >
          + خبر جدید
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-end align-middle">
          <thead className="table-light">
            <tr>
              <th>عنوان</th>
              <th>توضیح</th>
              <th>نویسنده</th>
              <th style={{ width: 110 }}>تصویر</th>
              <th style={{ width: 140 }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {news.length > 0 ? (
              news.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.author}</td>
                  <td>
                    {item.image_path ? (
                      <img
                        src={`/uploads/news-images/${item.image_path}`}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: 60, objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted small">تصویر ندارد</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/news/edit/${item.id}`)}
                      style={buttonStyle}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#187bcd')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e90ff')}
                      className="me-2"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={buttonDangerStyle}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c0392b')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e74c3c')}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">هیچ خبری یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsList;
