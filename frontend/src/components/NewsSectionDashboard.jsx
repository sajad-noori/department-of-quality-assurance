import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/news';

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

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const statItemStyle = {
  textAlign: 'center',
  padding: '0.75rem',
  borderRadius: '8px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
};

const statValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#00d4ff',
  marginBottom: '0.25rem',
};

const statLabelStyle = {
  fontSize: '0.75rem',
  color: '#999999',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const searchInputStyle = {
  flex: 1,
  minWidth: '250px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const searchInputFocusStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#00d4ff',
  border: 'none',
  color: '#000000',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
};

const buttonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const buttonDangerStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
  color: '#ffffff',
};

const buttonDangerHoverStyle = {
  backgroundColor: '#c82333',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
};

const newsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1rem',
};

const newsCardStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1rem',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '200px',
};

const newsCardHoverStyle = {
  borderColor: '#00d4ff',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
};

const newsTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '0.5rem',
  lineHeight: '1.4',
};

const newsDescriptionStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  marginBottom: '0.75rem',
  lineHeight: '1.5',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  flex: 1,
};

const newsMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const authorStyle = {
  fontSize: '0.75rem',
  color: '#00d4ff',
  backgroundColor: 'rgba(0, 212, 255, 0.1)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
};

const dateStyle = {
  fontSize: '0.75rem',
  color: '#666666',
};

const cardActionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'flex-end',
  marginTop: 'auto',
  paddingTop: '0.75rem',
  borderTop: '1px solid #333333',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem 1rem',
  color: '#999999',
};

const emptyStateIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
  opacity: 0.5,
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem',
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

const NewsList = () => {
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

  const handleButtonHover = (e, isDanger = false) => {
    const style = isDanger ? buttonDangerHoverStyle : buttonHoverStyle;
    Object.assign(e.currentTarget.style, style);
  };

  const handleButtonLeave = (e, isDanger = false) => {
    const style = isDanger ? buttonDangerStyle : buttonStyle;
    Object.assign(e.currentTarget.style, style);
  };

  const handleCardHover = (e) => {
    Object.assign(e.currentTarget.style, newsCardHoverStyle);
  };

  const handleCardLeave = (e) => {
    Object.assign(e.currentTarget.style, newsCardStyle);
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
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <div style={emptyStateIconStyle}>⚠️</div>
          <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>خطا</h3>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={fetchNews}
            style={buttonStyle}
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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>مدیریت اخبار</h1>
        <p style={subtitleStyle}>کنترل و مدیریت اخبار سیستم</p>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.total}</div>
            <div style={statLabelStyle}>کل اخبار</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.withImages}</div>
            <div style={statLabelStyle}>با تصویر</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.recent}</div>
            <div style={statLabelStyle}>اخیر</div>
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
            ...searchInputStyle,
            ...(searchFocused ? searchInputFocusStyle : {})
          }}
        />
        
        <button
          onClick={() => navigate('/news/create')}
          style={buttonStyle}
          onMouseEnter={(e) => handleButtonHover(e)}
          onMouseLeave={(e) => handleButtonLeave(e)}
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
              style={newsCardStyle}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <h3 style={newsTitleStyle}>{item.title}</h3>
              <p style={newsDescriptionStyle}>{item.description}</p>
              
              <div style={newsMetaStyle}>
                <span style={authorStyle}>{item.author}</span>
                <span style={dateStyle}>{formatDate(item.created_at || item.updated_at)}</span>
              </div>
              
              <div style={cardActionsStyle}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/news/edit/${item.id}`);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => handleButtonHover(e)}
                  onMouseLeave={(e) => handleButtonLeave(e)}
                >
                  <span>✏️</span>
                  <span>ویرایش</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  style={buttonDangerStyle}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonLeave(e, true)}
                >
                  <span>🗑️</span>
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyStateIconStyle}>📰</div>
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
            {searchTerm ? 'هیچ خبری یافت نشد' : 'هیچ خبری وجود ندارد'}
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#999999' }}>
            {searchTerm 
              ? `هیچ خبری با عبارت "${searchTerm}" یافت نشد`
              : 'هنوز هیچ خبری در سیستم ثبت نشده است'
            }
          </p>
          <button
            onClick={() => navigate('/news/create')}
            style={buttonStyle}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e)}
          >
            <span>➕</span>
            <span>افزودن اولین خبر</span>
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