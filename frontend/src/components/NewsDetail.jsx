// NewsDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useTheme } from "../contexts/ThemeContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const containerStyle = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  minHeight: "100vh",
  padding: "1rem",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  direction: "rtl",
};

const headerStyle = {
  color: "#ffffff",
  padding: "1.5rem",
  marginBottom: "1.5rem",
};

const titleStyle = {
  margin: "0 0 0.5rem 0",
  fontSize: "2rem",
  fontWeight: "700",
  color: "#ffffff",
  textAlign: "center",
};

const newsContainerStyle = {
  display: "flex",
  flexDirection: "row-reverse",
  gap: "2rem",
  alignItems: "flex-start",
  marginBottom: "2rem",
};

const newsImageBoxStyle = {
  flex: 1,
  maxWidth: "45%",
  position: "relative",
  cursor: "pointer",
};

const newsImageStyle = {
  width: "100%",
  height: "auto",
  maxHeight: "500px",
  objectFit: "cover",
  border: "4px solid #333333",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s ease",
};

const newsImageHoverStyle = {
  transform: "scale(1.02)",
  boxShadow: "0 12px 25px rgba(0, 212, 255, 0.2)",
  borderColor: "#00d4ff",
};

const zoomedImageStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90vw",
  maxHeight: "90vh",
  zIndex: 9999,
  border: "6px solid #1a1a1a",
  borderRadius: "10px",
  boxShadow: "0 0 30px rgba(0, 0, 0, 0.8)",
  backgroundColor: "#1a1a1a",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 9998,
  cursor: "pointer",
};

const newsContentBoxStyle = {
  flex: 1,
  maxWidth: "50%",
};

const newsHeadingStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "1rem",
  lineHeight: "1.3",
};

const newsMetaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

const newsDateStyle = {
  fontSize: "0.875rem",
  color: "#00d4ff",
  backgroundColor: "rgba(0, 212, 255, 0.1)",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "500",
};

const authorStyle = {
  fontSize: "0.875rem",
  color: "#cccccc",
  backgroundColor: "#2a2a2a",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "500",
};

const newsDescriptionStyle = {
  fontSize: "1.1rem",
  color: "#cccccc",
  marginBottom: "1.5rem",
  lineHeight: "1.6",
  textAlign: "justify",
  whiteSpace: "pre-wrap",
};

const newsContentStyle = {
  lineHeight: "1.8",
  fontSize: "1rem",
  color: "#ffffff",
  textAlign: "justify",
  marginBottom: "2rem",
  whiteSpace: "pre-wrap",
};

const otherNewsContainerStyle = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "1.5rem",
  border: "1px solid #333333",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  marginBottom: "2rem",
};

const otherNewsTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "1rem",
  borderBottom: "2px solid #00d4ff",
  paddingBottom: "0.5rem",
};

const otherNewsListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const otherNewsItemStyle = {
  marginBottom: "0.75rem",
  padding: "0.75rem",
  backgroundColor: "#2a2a2a",
  borderRadius: "6px",
  border: "1px solid #333333",
  transition: "all 0.2s ease",
};

const otherNewsItemHoverStyle = {
  borderColor: "#00d4ff",
  transform: "translateX(-4px)",
  boxShadow: "0 4px 12px rgba(0, 212, 255, 0.2)",
};

const otherNewsLinkStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "0.95rem",
  lineHeight: "1.4",
  display: "block",
  transition: "color 0.2s ease",
};

const otherNewsLinkHoverStyle = {
  color: "#00d4ff",
};

const backLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#00d4ff",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "500",
  padding: "0.75rem 1.5rem",
  backgroundColor: "#1a1a1a",
  borderRadius: "6px",
  border: "1px solid #333333",
  transition: "all 0.2s ease",
  marginBottom: "2rem",
};

const backLinkHoverStyle = {
  backgroundColor: "#00d4ff",
  color: "#000000",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(0, 212, 255, 0.3)",
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "3rem",
  color: "#999999",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #333333",
  borderTop: "3px solid #00d4ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "1rem",
};

const errorStyle = {
  textAlign: "center",
  padding: "3rem",
  color: "#dc3545",
};


const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Light mode style overrides
  const isLight = theme === "light";
  const containerStyleLight = {
    backgroundColor: "#f7fcfd",
    color: "#222",
    minHeight: "100vh",
    padding: "1rem",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    direction: "rtl",
  };
  const headerStyleLight = {
    color: "#0dcaf0",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };
  const titleStyleLight = {
    margin: "0 0 0.5rem 0",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#0dcaf0",
    textAlign: "center",
  };
  const newsContainerStyleLight = {
    display: "flex",
    flexDirection: "row-reverse",
    gap: "2rem",
    alignItems: "flex-start",
    marginBottom: "2rem",
  };
  const newsImageBoxStyleLight = { ...newsImageBoxStyle };
  const newsImageStyleLight = {
    ...newsImageStyle,
    border: "4px solid #e0f7fa",
    boxShadow: "0 8px 20px rgba(13,202,240,0.10)",
  };
  const newsImageHoverStyleLight = {
    transform: "scale(1.02)",
    boxShadow: "0 12px 25px rgba(13,202,240,0.15)",
    borderColor: "#0dcaf0",
  };
  const zoomedImageStyleLight = {
    ...zoomedImageStyle,
    border: "6px solid #e0f7fa",
    backgroundColor: "#fff",
  };
  const overlayStyleLight = {
    ...overlayStyle,
    backgroundColor: "rgba(0,0,0,0.5)",
  };
  const newsContentBoxStyleLight = { ...newsContentBoxStyle };
  const newsHeadingStyleLight = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#0dcaf0",
    marginBottom: "1rem",
    lineHeight: "1.3",
  };
  const newsMetaStyleLight = { ...newsMetaStyle };
  const newsDateStyleLight = {
    fontSize: "0.875rem",
    color: "#00b5d7",
    backgroundColor: "#e0f7fa",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "500",
  };
  const authorStyleLight = {
    fontSize: "0.875rem",
    color: "#666",
    backgroundColor: "#f7fcfd",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "500",
    border: "1px solid #e0f7fa",
  };
  const newsDescriptionStyleLight = {
    fontSize: "1.1rem",
    color: "#444",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
    textAlign: "justify",
    whiteSpace: "pre-wrap",
  };
  const newsContentStyleLight = {
    lineHeight: "1.8",
    fontSize: "1rem",
    color: "#222",
    textAlign: "justify",
    marginBottom: "2rem",
    whiteSpace: "pre-wrap",
  };
  const otherNewsContainerStyleLight = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1.5rem",
    border: "1px solid #e0f7fa",
    boxShadow: "0 4px 20px rgba(13,202,240,0.08)",
    marginBottom: "2rem",
  };
  const otherNewsTitleStyleLight = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#0dcaf0",
    marginBottom: "1rem",
    borderBottom: "2px solid #0dcaf0",
    paddingBottom: "0.5rem",
  };
  const otherNewsListStyleLight = { ...otherNewsListStyle };
  const otherNewsItemStyleLight = {
    marginBottom: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#f7fcfd",
    borderRadius: "6px",
    border: "1px solid #e0f7fa",
    transition: "all 0.2s ease",
  };
  const otherNewsItemHoverStyleLight = {
    borderColor: "#0dcaf0",
    transform: "translateX(-4px)",
    boxShadow: "0 4px 12px rgba(13,202,240,0.10)",
  };
  const otherNewsLinkStyleLight = {
    color: "#00b5d7",
    textDecoration: "none",
    fontSize: "0.95rem",
    lineHeight: "1.4",
    display: "block",
    transition: "color 0.2s ease",
  };
  const otherNewsLinkHoverStyleLight = {
    color: "#0dcaf0",
  };
  const backLinkStyleLight = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0dcaf0",
    borderRadius: "6px",
    border: "1px solid #0dcaf0",
    transition: "all 0.2s ease",
    marginBottom: "2rem",
  };
  const backLinkHoverStyleLight = {
    backgroundColor: "#00b5d7",
    color: "#fff",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(13,202,240,0.10)",
  };
  const loadingStyleLight = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem",
    color: "#00b5d7",
  };
  const spinnerStyleLight = {
    width: "40px",
    height: "40px",
    border: "3px solid #e0f7fa",
    borderTop: "3px solid #0dcaf0",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "1rem",
  };
  const errorStyleLight = {
    textAlign: "center",
    padding: "3rem",
    color: "#ff6b6b",
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Failed to fetch news detail", err);
        setError("خطا در بارگذاری خبر");
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
        const filtered = res.data.filter((item) => item.id !== Number(id));
        setOtherNews(filtered);
      } catch (err) {
        console.error("Failed to fetch other news", err);
      }
    };

    fetchOtherNews();
  }, [id]);


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={isLight ? containerStyleLight : containerStyle}>
        <div style={isLight ? loadingStyleLight : loadingStyle}>
          <div style={isLight ? spinnerStyleLight : spinnerStyle}></div>
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={isLight ? containerStyleLight : containerStyle}>
        <div style={isLight ? errorStyleLight : errorStyle}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h3
            style={{
              color: isLight ? "#ff6b6b" : "#dc3545",
              marginBottom: "1rem",
            }}
          >
            خطا
          </h3>
          <p style={{ marginBottom: "1.5rem" }}>
            {error || "خبر مورد نظر یافت نشد"}
          </p>
          <Link
            to="/"
            className="back-link"
            style={isLight ? backLinkStyleLight : backLinkStyle}
          >
            <span>🏠</span>
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={isLight ? containerStyleLight : containerStyle}>
      <div style={isLight ? headerStyleLight : headerStyle}>
        <h1
          className="page-title"
          style={isLight ? titleStyleLight : titleStyle}
        >
          جزئیات خبر
        </h1>
      </div>

      <div
        className="news-container"
        style={isLight ? newsContainerStyleLight : newsContainerStyle}
      >
        <div
          className="news-image-box"
          style={isLight ? newsImageBoxStyleLight : newsImageBoxStyle}
          onClick={() => setZoomed(true)}
        >
          <img
            src={`${API_BASE_URL}${news.image_path}`}
            alt={news.title}
            style={isLight ? newsImageStyleLight : newsImageStyle}
            onMouseEnter={(e) =>
              Object.assign(
                e.currentTarget.style,
                isLight ? newsImageHoverStyleLight : newsImageHoverStyle
              )
            }
            onMouseLeave={(e) =>
              Object.assign(
                e.currentTarget.style,
                isLight ? newsImageStyleLight : newsImageStyle
              )
            }
          />
        </div>

        <div
          className="news-content-box"
          style={isLight ? newsContentBoxStyleLight : newsContentBoxStyle}
        >
          <h2
            className="news-heading"
            style={isLight ? newsHeadingStyleLight : newsHeadingStyle}
          >
            {news.title}
          </h2>

          <div
            className="news-meta"
            style={isLight ? newsMetaStyleLight : newsMetaStyle}
          >
            <span
              className="news-date"
              style={isLight ? newsDateStyleLight : newsDateStyle}
            >
              📅 {formatDate(news.published_date)}
            </span>
            <span
              className="author"
              style={isLight ? authorStyleLight : authorStyle}
            >
              ✍️ {news.author || "ناشناخته"}
            </span>
          </div>

          <p
            className="news-description"
            style={isLight ? newsDescriptionStyleLight : newsDescriptionStyle}
          >
            {news.description}
          </p>

          <div
            className="news-content"
            style={isLight ? newsContentStyleLight : newsContentStyle}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </div>

      {otherNews.length > 0 && (
        <div
          style={
            isLight ? otherNewsContainerStyleLight : otherNewsContainerStyle
          }
        >
          <h3
            className="other-news-title"
            style={isLight ? otherNewsTitleStyleLight : otherNewsTitleStyle}
          >
            📰 اخبار دیگر
          </h3>
          <ul style={isLight ? otherNewsListStyleLight : otherNewsListStyle}>
            {otherNews.slice(0, 5).map((other) => (
              <li
                key={other.id}
                style={isLight ? otherNewsItemStyleLight : otherNewsItemStyle}
                onMouseEnter={(e) =>
                  Object.assign(
                    e.currentTarget.style,
                    isLight
                      ? otherNewsItemHoverStyleLight
                      : otherNewsItemHoverStyle
                  )
                }
                onMouseLeave={(e) =>
                  Object.assign(
                    e.currentTarget.style,
                    isLight ? otherNewsItemStyleLight : otherNewsItemStyle
                  )
                }
              >
                <Link
                  to={`/news/${other.id}`}
                  className="other-news-link"
                  style={isLight ? otherNewsLinkStyleLight : otherNewsLinkStyle}
                  onMouseEnter={(e) =>
                    Object.assign(
                      e.target.style,
                      isLight
                        ? otherNewsLinkHoverStyleLight
                        : otherNewsLinkHoverStyle
                    )
                  }
                  onMouseLeave={(e) =>
                    Object.assign(
                      e.target.style,
                      isLight ? otherNewsLinkStyleLight : otherNewsLinkStyle
                    )
                  }
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
        className="back-link"
        style={isLight ? backLinkStyleLight : backLinkStyle}
        onMouseEnter={(e) =>
          Object.assign(
            e.currentTarget.style,
            isLight ? backLinkHoverStyleLight : backLinkHoverStyle
          )
        }
        onMouseLeave={(e) =>
          Object.assign(
            e.currentTarget.style,
            isLight ? backLinkStyleLight : backLinkStyle
          )
        }
      >
        <span>🏠</span>
        <span>بازگشت به صفحه اصلی</span>
      </Link>

      {zoomed && (
        <>
          <div
            style={isLight ? overlayStyleLight : overlayStyle}
            onClick={() => setZoomed(false)}
          />
          <img
            src={`${API_BASE_URL}${news.image_path}`}
            alt={news.title}
            style={isLight ? zoomedImageStyleLight : zoomedImageStyle}
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
          .news-image-box {
            display: none !important;
          }
          .news-content-box {
            max-width: 100% !important;
          }
          .news-heading {
            font-size: 1.5rem !important;
          }
          .news-description {
            font-size: 0.95rem !important;
          }
          .news-content {
            font-size: 0.9rem !important;
          }
          .news-meta {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .news-date,
          .author {
            font-size: 0.75rem !important;
            padding: 0.4rem 0.8rem !important;
          }
          .other-news-title {
            font-size: 1.25rem !important;
          }
          .other-news-link {
            font-size: 0.85rem !important;
          }
          .back-link {
            font-size: 0.9rem !important;
            padding: 0.6rem 1.2rem !important;
          }
          .page-title {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
