// NewsDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

const containerStyle = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '1rem',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
};

const headerStyle = {
  color: '#ffffff',
  padding: '1.5rem',
  marginBottom: '1.5rem',
};

const titleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center',
};

const newsContainerStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
  gap: '2rem',
  alignItems: 'flex-start',
  marginBottom: '2rem',
};

const newsImageBoxStyle = {
  flex: 1,
  maxWidth: '45%',
  position: 'relative',
  cursor: 'pointer',
};

const newsImageStyle = {
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  objectFit: 'cover',
  border: '4px solid #333333',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
};

const newsImageHoverStyle = {
  transform: 'scale(1.02)',
  boxShadow: '0 12px 25px rgba(0, 212, 255, 0.2)',
  borderColor: '#00d4ff',
};

const zoomedImageStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  zIndex: 9999,
  border: '6px solid #1a1a1a',
  borderRadius: '10px',
  boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
  backgroundColor: '#1a1a1a',
  cursor: 'pointer',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 9998,
  cursor: 'pointer',
};

const newsContentBoxStyle = {
  flex: 1,
  maxWidth: '50%',
};

const newsHeadingStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '1rem',
  lineHeight: '1.3',
};

const newsMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
};

const newsDateStyle = {
  fontSize: '0.875rem',
  color: '#00d4ff',
  backgroundColor: 'rgba(0, 212, 255, 0.1)',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: '500',
};

const authorStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  backgroundColor: '#2a2a2a',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: '500',
};

const newsDescriptionStyle = {
  fontSize: '1.1rem',
  color: '#cccccc',
  marginBottom: '1.5rem',
  lineHeight: '1.6',
  textAlign: 'justify',
};

const newsContentStyle = {
  lineHeight: '1.8',
  fontSize: '1rem',
  color: '#ffffff',
  textAlign: 'justify',
  marginBottom: '2rem',
};

const otherNewsContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  marginBottom: '2rem',
};

const otherNewsTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '1rem',
  borderBottom: '2px solid #00d4ff',
  paddingBottom: '0.5rem',
};

const otherNewsListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const otherNewsItemStyle = {
  marginBottom: '0.75rem',
  padding: '0.75rem',
  backgroundColor: '#2a2a2a',
  borderRadius: '6px',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
};

const otherNewsItemHoverStyle = {
  borderColor: '#00d4ff',
  transform: 'translateX(-4px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
};

const otherNewsLinkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '0.95rem',
  lineHeight: '1.4',
  display: 'block',
  transition: 'color 0.2s ease',
};

const otherNewsLinkHoverStyle = {
  color: '#00d4ff',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#00d4ff',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
  marginBottom: '2rem',
};

const backLinkHoverStyle = {
  backgroundColor: '#00d4ff',
  color: '#000000',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
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

const errorStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: '#dc3545',
};

const mobileBreakpoint = '@media (max-width: 768px)';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Failed to fetch news detail", err);
        setError('خطا در بارگذاری خبر');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  useEffect(() => {
    const fetchOtherNews = async () => {
      try {
        const res = await axios.get(`/api/news`);
        const filtered = res.data.filter(item => item.id !== Number(id));
        setOtherNews(filtered);
      } catch (err) {
        console.error("Failed to fetch other news", err);
      }
    };

    fetchOtherNews();
  }, [id]);

  const handleImageHover = (e) => {
    Object.assign(e.currentTarget.style, newsImageHoverStyle);
  };

  const handleImageLeave = (e) => {
    Object.assign(e.currentTarget.style, newsImageStyle);
  };

  const handleOtherNewsHover = (e) => {
    Object.assign(e.currentTarget.style, otherNewsItemHoverStyle);
  };

  const handleOtherNewsLeave = (e) => {
    Object.assign(e.currentTarget.style, otherNewsItemStyle);
  };

  const handleBackLinkHover = (e) => {
    Object.assign(e.currentTarget.style, backLinkHoverStyle);
  };

  const handleBackLinkLeave = (e) => {
    Object.assign(e.currentTarget.style, backLinkStyle);
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

  if (error || !news) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>خطا</h3>
          <p style={{ marginBottom: '1.5rem' }}>{error || 'خبر مورد نظر یافت نشد'}</p>
          <Link to="/" style={backLinkStyle}>
            <span>🏠</span>
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>جزئیات خبر</h1>
      </div>

      <div style={newsContainerStyle}>
        <div 
          style={newsImageBoxStyle} 
          onClick={() => setZoomed(true)}
        >
          <img
            src={`${news.image_path}`}
            alt={news.title}
            style={newsImageStyle}
            onMouseEnter={handleImageHover}
            onMouseLeave={handleImageLeave}
          />
        </div>

        <div style={newsContentBoxStyle}>
          <h2 style={newsHeadingStyle}>{news.title}</h2>
          
          <div style={newsMetaStyle}>
            <span style={newsDateStyle}>
              📅 {formatDate(news.published_date)}
            </span>
            <span style={authorStyle}>
              ✍️ {news.author || "ناشناخته"}
            </span>
          </div>
          
          <p style={newsDescriptionStyle}>{news.description}</p>
          
          <div 
            style={newsContentStyle} 
            dangerouslySetInnerHTML={{ __html: news.content }} 
          />
        </div>
      </div>

      {otherNews.length > 0 && (
        <div style={otherNewsContainerStyle}>
          <h3 style={otherNewsTitleStyle}>📰 اخبار دیگر</h3>
          <ul style={otherNewsListStyle}>
            {otherNews.slice(0, 5).map(other => (
              <li 
                key={other.id}
                style={otherNewsItemStyle}
                onMouseEnter={handleOtherNewsHover}
                onMouseLeave={handleOtherNewsLeave}
              >
                <Link 
                  to={`/news/${other.id}`} 
                  style={otherNewsLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, otherNewsLinkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, otherNewsLinkStyle)}
                >
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link 
        to="/" 
        style={backLinkStyle}
        onMouseEnter={handleBackLinkHover}
        onMouseLeave={handleBackLinkLeave}
      >
        <span>🏠</span>
        <span>بازگشت به صفحه اصلی</span>
      </Link>

      {zoomed && (
        <>
          <div style={overlayStyle} onClick={() => setZoomed(false)} />
          <img
            src={`${news.image_path}`}
            alt={news.title}
            style={zoomedImageStyle}
            onClick={() => setZoomed(false)}
          />
        </>
      )}

      <Comments newsId={id} />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .news-container {
            flex-direction: column !important;
            align-items: center !important;
          }
          .news-image-box,
          .news-content-box {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
