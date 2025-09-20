import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = '/api/news';

const containerStyle = (theme) => ({
  backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
  color: theme === 'dark' ? '#eeeeee' : '#333333',
  minHeight: '100vh',
  padding: '1rem',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
  transition: 'background-color 0.3s ease, color 0.3s ease',
});

const headerStyle = (theme) => ({
  background: theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  color: theme === 'dark' ? '#eeeeee' : '#333333',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  boxShadow: theme === 'dark' 
    ? '0 4px 20px rgba(0,0,0,0.3)' 
    : '0 4px 20px rgba(0,0,0,0.05)',
  border: theme === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
});

const titleStyle = (theme) => ({
  margin: '0 0 0.5rem 0',
  fontSize: '2rem',
  fontWeight: '700',
  color: theme === 'dark' ? '#ffffff' : '#333333',
  textAlign: 'center',
  transition: 'color 0.3s ease',
});

const subtitleStyle = (theme) => ({
  margin: 0,
  fontSize: '0.9rem',
  color: theme === 'dark' ? '#cccccc' : '#666666',
  textAlign: 'center',
  transition: 'color 0.3s ease',
});

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const statItemStyle = (theme) => ({
  textAlign: 'center',
  padding: '0.75rem',
  borderRadius: '8px',
  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
  border: theme === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  boxShadow: theme === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
});

const statValueStyle = (theme) => ({
  fontSize: '1.25rem',
  fontWeight: '600',
  color: theme === 'dark' ? '#00d4ff' : '#4a6cf7',
  marginBottom: '0.25rem',
  transition: 'color 0.3s ease',
});

const statLabelStyle = (theme) => ({
  fontSize: '0.75rem',
  color: theme === 'dark' ? '#999999' : '#666666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  transition: 'color 0.3s ease',
});

const controlsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const searchInputStyle = (theme) => ({
  flexGrow: 1,
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: theme === 'dark' ? '1px solid #2d2d2d' : '1px solid #d1d5db',
  borderRadius: '6px',
  backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
  color: theme === 'dark' ? '#eeeeee' : '#333333',
  outline: 'none',
  transition: 'all 0.3s ease',
  '&:focus': {
    borderColor: '#0dcaf0',
    boxShadow: '0 0 0 2px rgba(13, 202, 240, 0.2)',
  },
  '&::placeholder': {
    color: theme === 'dark' ? '#666666' : '#999999',
  },
});

const searchInputFocusStyle = (theme) => ({
  borderColor: '#00d4ff',
  boxShadow: `0 0 0 2px ${theme === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 212, 255, 0.1)'}`,
  outline: 'none',
});

const buttonStyle = (theme) => ({
  backgroundColor: theme === 'dark' ? '#0dcaf0' : '#0dcaf0',
  border: 'none',
  color: theme === 'dark' ? '#121212' : '#ffffff',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
});

const buttonDangerStyle = (theme) => ({
  ...buttonStyle(theme),
  backgroundColor: theme === 'dark' ? '#dc3545' : '#ff6b6b',
  color: '#ffffff',
});

const newsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1rem',
};

const newsCardStyle = (theme) => ({
  backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
  borderRadius: '8px',
  padding: '1rem',
  border: theme === 'dark' ? '1px solid #2d2d2d' : '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '200px',
  boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme === 'dark' 
      ? '0 8px 24px rgba(13, 202, 240, 0.2)' 
      : '0 8px 24px rgba(0, 0, 0, 0.1)',
    borderColor: theme === 'dark' ? '#0dcaf0' : '#0dcaf0',
  },
});

const newsTitleStyle = (theme) => ({
  fontSize: '1rem',
  fontWeight: '600',
  color: theme === 'dark' ? '#ffffff' : '#333333',
  marginBottom: '0.5rem',
  lineHeight: '1.4',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme === 'dark' ? '#0dcaf0' : '#00b5d7',
  },
});

const newsDescriptionStyle = (theme) => ({
  fontSize: '0.875rem',
  color: theme === 'dark' ? '#bbbbbb' : '#555555',
  marginBottom: '1rem',
  flexGrow: 1,
  lineHeight: '1.6',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color 0.3s ease',
});

const newsMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const authorStyle = (theme) => ({
  fontSize: '0.75rem',
  color: theme === 'dark' ? '#00d4ff' : '#4a6cf7',
  backgroundColor: theme === 'dark' 
    ? 'rgba(0, 212, 255, 0.1)' 
    : 'rgba(74, 108, 247, 0.1)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
});

const dateStyle = (theme) => ({
  fontSize: '0.75rem',
  color: theme === 'dark' ? '#666666' : '#888888',
  transition: 'color 0.3s ease',
});

const cardActionsStyle = (theme) => ({
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'flex-end',
  marginTop: 'auto',
  paddingTop: '0.75rem',
  borderTop: theme === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
  transition: 'border-color 0.3s ease',
});

const emptyStateStyle = (theme) => ({
  textAlign: 'center',
  padding: '3rem 1rem',
  color: theme === 'dark' ? '#999999' : '#666666',
  transition: 'color 0.3s ease',
});

const emptyStateIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
  opacity: 0.5,
};

const spinnerStyle = (theme) => ({
  width: '40px',
  height: '40px',
  border: `3px solid ${theme === 'dark' ? '#333333' : '#e0e0e0'}`,
  borderTop: `3px solid ${theme === 'dark' ? '#00d4ff' : '#4a6cf7'}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginRight: '1rem',
});

const NewsList = () => {
  const { theme } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('خطا در بارگذاری اخبار');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟')) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete news');
      await fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('خطا در حذف خبر');
    }
  };

  const handleButtonHover = (e, isDanger = false, theme) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = theme === 'dark' 
      ? '0 4px 12px rgba(13, 202, 240, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)';
    
    if (isDanger) {
      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ff6b81' : '#ff4757';
    } else {
      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#00b5d7' : '#00a0b8';
    }
  };

  const handleButtonLeave = (e, isDanger = false, theme) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = theme === 'dark' 
      ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)';
    
    if (isDanger) {
      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#dc3545' : '#ff6b6b';
    } else {
      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#0dcaf0' : '#0dcaf0';
    }
  };

  const handleCardHover = (e, theme) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = theme === 'dark' 
      ? '0 8px 24px rgba(13, 202, 240, 0.2)' 
      : '0 8px 24px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.borderColor = theme === 'dark' ? '#0dcaf0' : '#0dcaf0';
  };

  const handleCardLeave = (e, theme) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = theme === 'dark' 
      ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
      : '0 2px 8px rgba(0, 0, 0, 0.05)';
    e.currentTarget.style.borderColor = theme === 'dark' ? '#2d2d2d' : '#e0e0e0';
  };

  const filteredNews = news.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: news.length,
    withImages: news.filter(item => item.image_path).length,
    recent: news.filter(item => {
      const date = new Date(item.created_at || item.updated_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={containerStyle(theme)}>
        <div style={headerStyle(theme)}>
          <h1 style={titleStyle(theme)}>در حال بارگذاری...</h1>
          <p style={subtitleStyle(theme)}>لطفاً صبر کنید</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <div style={spinnerStyle(theme)}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle(theme)}>
        <div style={emptyStateStyle(theme)}>
          <div style={emptyStateIconStyle}>⚠️</div>
          <h3 style={{ 
            color: theme === 'dark' ? '#dc3545' : '#ff6b6b', 
            marginBottom: '1rem' 
          }}>
            خطا
          </h3>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={fetchNews}
            style={buttonStyle(theme)}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e)}
          >
            <span>🔄</span>
            <span>تلاش مجدد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle(theme)}>
      <div style={headerStyle(theme)}>
        <h1 style={titleStyle(theme)}>مدیریت اخبار</h1>
        <p style={subtitleStyle(theme)}>کنترل و مدیریت اخبار سیستم</p>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle(theme)}>
            <div style={statValueStyle(theme)}>{stats.total}</div>
            <div style={statLabelStyle(theme)}>کل اخبار</div>
          </div>
          <div style={statItemStyle(theme)}>
            <div style={statValueStyle(theme)}>{stats.withImages}</div>
            <div style={statLabelStyle(theme)}>با تصویر</div>
          </div>
          <div style={statItemStyle(theme)}>
            <div style={statValueStyle(theme)}>{stats.recent}</div>
            <div style={statLabelStyle(theme)}>اخیر</div>
          </div>
        </div>
      </div>

      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="جستجو در اخبار..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            ...searchInputStyle(theme),
            ...(searchFocused ? searchInputFocusStyle(theme) : {})
          }}
        />
        
        <button
          onClick={() => navigate('/news/create')}
          style={buttonStyle(theme)}
          onMouseEnter={(e) => handleButtonHover(e, false, theme)}
          onMouseLeave={(e) => handleButtonLeave(e, false, theme)}
        >
          <span>➕</span>
          <span>خبر جدید</span>
        </button>
      </div>

      {filteredNews.length > 0 ? (
        <div style={newsGridStyle}>
          {filteredNews.map((item) => (
            <div
              key={item.id}
              style={newsCardStyle(theme)}
              onMouseEnter={(e) => handleCardHover(e, theme)}
              onMouseLeave={(e) => handleCardLeave(e, theme)}
              onClick={() => navigate(`/news/edit/${item.id}`)}
            >
              <h3 style={newsTitleStyle(theme)}>{item.title}</h3>
              <p style={newsDescriptionStyle(theme)}>{item.description}</p>
              <div style={newsMetaStyle}>
                <span style={authorStyle(theme)}>{item.author || 'ناشناس'}</span>
                <span style={dateStyle(theme)}>{formatDate(item.created_at || item.updated_at)}</span>
              </div>
              <div style={cardActionsStyle(theme)}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  style={buttonDangerStyle(theme)}
                  onMouseEnter={(e) => handleButtonHover(e, true, theme)}
                  onMouseLeave={(e) => handleButtonLeave(e, true, theme)}
                >
                  <span>🗑️</span>
                  <span>حذف</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/news/edit/${item.id}`);
                  }}
                  style={buttonStyle(theme)}
                  onMouseEnter={(e) => handleButtonHover(e, false, theme)}
                  onMouseLeave={(e) => handleButtonLeave(e, false, theme)}
                >
                  <span>✏️</span>
                  <span>ویرایش</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle(theme)}>
          <div style={emptyStateIconStyle}>📰</div>
          <h3 style={{ 
            marginBottom: '1rem',
            color: theme === 'dark' ? '#ffffff' : '#333333'
          }}>
            خبری یافت نشد
          </h3>
          <p style={{ 
            marginBottom: '1.5rem',
            color: theme === 'dark' ? '#cccccc' : '#666666'
          }}>
            {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد.' : 'هنوز خبری ثبت نشده است.'}
          </p>
          <button
            onClick={() => navigate('/news/create')}
            style={buttonStyle(theme)}
            onMouseEnter={(e) => handleButtonHover(e, false, theme)}
            onMouseLeave={(e) => handleButtonLeave(e, false, theme)}
          >
            <span>📝</span>
            <span>ایجاد خبر جدید</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewsList;