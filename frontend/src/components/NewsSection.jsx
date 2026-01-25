import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle, FaNewspaper } from "react-icons/fa";
import "../styles/NewsSection.css";
import NewsSkeleton from "./skeletons/NewsSkeleton";

// Persian date formatting utility
const formatPersianDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  
  return persianDate;
};

// Convert English numbers to Persian (unused function removed)
// const toPersianNumbers = (str) => {
//   if (!str) return '';
//   
//   const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//   return str.toString().replace(/[0-9]/g, (w) => persianNumbers[w]);
// };

// Truncate description text with Persian ellipsis
const truncatePersianText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const NewsSection = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/news");
      setNewsData(response.data);
    } catch (err) {
      console.error("Failed to fetch news", err);
      setError("خطا در بارگذاری اخبار. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const ErrorState = () => (
    <div className="error-container">
      <FaExclamationTriangle className="error-icon" />
      <p className="error-message">{error}</p>
      <button onClick={fetchNews} className="retry-button">
        تلاش مجدد
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-container">
      <FaNewspaper className="empty-icon" />
      <p className="empty-message">هیچ خبری در حال حاضر موجود نیست</p>
    </div>
  );

  return (
    <section className="news-section" id="news-section" dir="rtl">
      <div className="news-container">
        <h2 className="news-heading">
          <span className="news-heading-text">آخرین اخبار</span>
          <div className="news-heading-underline"></div>
        </h2>
        
        {loading ? (
          <div className="news-list">
            {[...Array(6)].map((_, index) => (
              <NewsSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState />
        ) : newsData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="news-list">
              {newsData.slice(0, 6).map((news) => (
                <article key={news.id} className="news-card" tabIndex="0">
                  <div className="news-image-container">
                    <img 
                      src={`${news.image_path}`} 
                      alt={news.title} 
                      className="news-image"
                      loading="lazy"
                    />
                    <div className="news-overlay">
                      <span className="read-more-text">بیشتر بخوانید</span>
                    </div>
                  </div>
                  <div className="news-info">
                    <h3 className="news-title">{news.title}</h3>
                    <time className="news-date" dateTime={news.published_date}>
                      {formatPersianDate(news.published_date)}
                    </time>
                    <p className="news-description">
                      {truncatePersianText(news.description, 80)}
                    </p>
                    <Link 
                      to={`/news/${news.id}`} 
                      className="news-link"
                      aria-label={`خواندن خبر: ${news.title}`}
                    >
                      بیشتر بخوانید
                      <FaArrowLeft className="arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            {/* See All News Button */}
            <div className="view-all-container">
              <Link to="/public-news" className="view-all-link" aria-label="مشاهده همه اخبار">
                <span className="view-all-text">مشاهده همه اخبار</span>
                <FaArrowLeft className="arrow" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
