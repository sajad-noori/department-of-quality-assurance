import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle, FaNewspaper, FaSpinner, FaSearch, FaRegNewspaper, FaSort, FaCalendarAlt, FaCalendarPlus, FaSortAlphaDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "../styles/NewsSection.css";

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

// Truncate text with Persian ellipsis
const truncatePersianText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const PAGE_SIZE = 12;

const AllNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroIntervalRef = useRef(null);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);

  useEffect(() => {
    fetchNews();
    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, []);

  // Set up auto-rotation when news data changes
  useEffect(() => {
    if (filteredNews && filteredNews.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setIsHeroTransitioning(true);
        setTimeout(() => {
          setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
          setIsHeroTransitioning(false);
        }, 300); // Wait for fade out before changing
      }, 30000); // 30 seconds interval
    }
    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, [newsData, search, sort]); // Reset interval when data or filters change

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/news");
      setNewsData(response.data);
    } catch (err) {
      setError("خطا در بارگذاری اخبار. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  // Filter
  let filteredNews = newsData.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  if (sort === "newest") {
    filteredNews = filteredNews.sort((a, b) => {
      const dateA = new Date(a.published_date);
      const dateB = new Date(b.published_date);
      return dateB - dateA; // Newest first (most recent date at the top)
    });
  } else if (sort === "oldest") {
    filteredNews = filteredNews.sort((a, b) => {
      const dateA = new Date(a.published_date);
      const dateB = new Date(b.published_date);
      return dateA - dateB; // Oldest first (earliest date at the top)
    });
  } else if (sort === "title") {
    filteredNews = filteredNews.sort((a, b) => (a.title || "").localeCompare(b.title || "", 'fa'));
  }

  // Hero navigation functions
  const goToNextHero = () => {
    setIsHeroTransitioning(true);
    setTimeout(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
      setIsHeroTransitioning(false);
    }, 300);
  };

  const goToPrevHero = () => {
    setIsHeroTransitioning(true);
    setTimeout(() => {
      setCurrentHeroIndex((prevIndex) => 
        prevIndex === 0 ? filteredNews.length - 1 : prevIndex - 1
      );
      setIsHeroTransitioning(false);
    }, 300);
  };

  // Get current hero news
  const heroNews = filteredNews.length > 0 ? filteredNews[currentHeroIndex] : null;
  // Rest of the news (excluding current hero)
  const restNews = filteredNews.filter((_, index) => index !== currentHeroIndex);

  const totalPages = Math.ceil(restNews.length / PAGE_SIZE);
  const paginatedNews = restNews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Helper: is news recent (less than 3 days old)?
  const isRecent = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now - date) / (1000 * 60 * 60 * 24);
    return diff < 3;
  };

  // Parallax effect for hero image
  const heroRef = useRef();
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="news-section" dir="rtl">
      {/* Hero Banner */}
      {heroNews && (
        <div style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          minHeight: 340,
          maxHeight: 480,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          <img
            ref={heroRef}
            src={heroNews.image_path}
            alt={heroNews.title}
            style={{
              width: '100vw',
              height: '48vw',
              maxHeight: 480,
              minHeight: 340,
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.7)',
              willChange: 'transform',
              transition: 'transform 0.2s cubic-bezier(.4,0,.2,1), opacity 0.3s ease',
              opacity: isHeroTransitioning ? 0 : 1,
            }}
          />
          {/* Blue/cyan gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(13,202,240,0.7) 0%, rgba(0,181,215,0.5) 100%)',
            zIndex: 1,
          }} />
          {/* Content overlay */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '100%',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            padding: '2.5rem 7vw 2.5rem 2vw',
            boxSizing: 'border-box',
            opacity: isHeroTransitioning ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{
                background: '#fff',
                color: '#00b5d7',
                borderRadius: 10,
                padding: '0.25rem 1.1rem',
                fontWeight: 800,
                fontSize: '1.05rem',
                boxShadow: '0 2px 8px rgba(13,202,240,0.10)',
                alignSelf: 'flex-start',
              }}>{formatPersianDate(heroNews.published_date)}</span>
              {isRecent(heroNews.published_date) && (
                <span style={{
                  background: 'linear-gradient(90deg,#0dcaf0,#00b5d7)',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '0.25rem 1.1rem',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  boxShadow: '0 2px 8px rgba(13,202,240,0.18)',
                  letterSpacing: 1,
                  alignSelf: 'flex-start',
                }}>جدید</span>
              )}
            </div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.5rem', marginBottom: 18, lineHeight: 1.3, textShadow: '0 2px 16px rgba(0,181,215,0.18)' }}>{heroNews.title}</h1>
            <p style={{ color: '#e0f7fa', fontSize: '1.18rem', marginBottom: 28, lineHeight: 1.7, maxWidth: 600, textShadow: '0 2px 8px rgba(0,181,215,0.13)' }}>{truncatePersianText(heroNews.description, 220)}</p>
            <Link
              to={`/news/${heroNews.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                background: '#fff',
                color: '#00b5d7',
                fontWeight: 800,
                fontSize: '1.15rem',
                borderRadius: 10,
                padding: '0.9rem 2.2rem',
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(13,202,240,0.10)',
                transition: 'background 0.2s, color 0.2s',
              }}
              aria-label={`خواندن خبر: ${heroNews.title}`}
            >
              بیشتر بخوانید
              <FaArrowLeft />
            </Link>
          </div>

          {/* Navigation buttons */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1rem',
            zIndex: 3,
          }}>
            <button
              onClick={goToPrevHero}
              className="hero-nav-button"
              aria-label="خبر قبلی"
            >
              <FaChevronRight />
            </button>
            <button
              onClick={goToNextHero}
              className="hero-nav-button"
              aria-label="خبر بعدی"
            >
              <FaChevronLeft />
            </button>
          </div>

          {/* Progress indicator */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            zIndex: 3,
          }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                background: 'linear-gradient(90deg,#0dcaf0,#00b5d7)',
                transform: 'scaleX(0)',
                transformOrigin: 'right',
                animation: 'progressBar 30s linear infinite',
              }}
            />
          </div>
        </div>
      )}
      <div className="news-container">
        <div className="news-search-sort-underline">
          <div className="news-search-row">
            <input
              type="text"
              placeholder="جستجو در اخبار..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="news-search-underline-input"
              aria-label="جستجو در اخبار"
              dir="rtl"
            />
            <FaSearch className="news-search-underline-icon" />
          </div>
          <div className="news-sort-container">
            <button
              className="news-sort-button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-label="مرتب‌سازی اخبار"
              aria-expanded={showSortDropdown}
              dir="rtl"
            >
              <FaSort className="news-sort-icon" />
              <span>
                {sort === "newest" ? "جدیدترین" :
                 sort === "oldest" ? "قدیمی‌ترین" :
                 "عنوان (الف-ی)"}
              </span>
            </button>
            {showSortDropdown && (
              <div className="news-sort-dropdown">
                <button
                  className={`news-sort-option ${sort === "newest" ? "active" : ""}`}
                  onClick={() => { setSort("newest"); setPage(1); setShowSortDropdown(false); }}
                >
                  <FaCalendarPlus className="news-sort-option-icon" />
                  جدیدترین
                </button>
                <button
                  className={`news-sort-option ${sort === "oldest" ? "active" : ""}`}
                  onClick={() => { setSort("oldest"); setPage(1); setShowSortDropdown(false); }}
                >
                  <FaCalendarAlt className="news-sort-option-icon" />
                  قدیمی‌ترین
                </button>
                <button
                  className={`news-sort-option ${sort === "title" ? "active" : ""}`}
                  onClick={() => { setSort("title"); setPage(1); setShowSortDropdown(false); }}
                >
                  <FaSortAlphaDown className="news-sort-option-icon" />
                  عنوان (الف-ی)
                </button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="news-list">
            {[...Array(8)].map((_, index) => (
              <div className="news-card skeleton" key={index}>
                <div className="skeleton-image"></div>
                <div className="news-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-date"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-link"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p className="error-message">{error}</p>
            <button onClick={fetchNews} className="retry-button">تلاش مجدد</button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="empty-container">
            <FaNewspaper className="empty-icon" />
            <p className="empty-message">هیچ خبری یافت نشد</p>
          </div>
        ) : (
          <>
            <div className="news-list">
              {paginatedNews.map((news, idx) => (
                <article key={news.id} className="news-card all-news-card fade-in" tabIndex="0" style={{ boxShadow: '0 8px 32px rgba(13,202,240,0.10)', border: '2px solid #0dcaf0', borderRadius: 18, transition: 'box-shadow 0.3s, border 0.3s', background: '#181f2a', position: 'relative', overflow: 'hidden' }}>
                  <div className="news-image-container" style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', border: '1.5px solid #00b5d7' }}>
                    {/* Date badge */}
                    <span style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'linear-gradient(90deg,#0dcaf0,#00b5d7)',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '0.2rem 0.8rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(13,202,240,0.10)'
                    }}>{formatPersianDate(news.published_date)}</span>
                    <img
                      src={`${news.image_path}`}
                      alt={news.title}
                      className="news-image"
                      loading="lazy"
                      style={{ borderRadius: '14px', border: '1.5px solid #0dcaf0', transition: 'transform 0.3s', background: '#222' }}
                    />
                    <div className="news-overlay">
                      <span className="read-more-text">بیشتر بخوانید</span>
                    </div>
                  </div>
                  <div className="news-info" style={{ padding: '1.5rem 1.2rem 1.2rem 1.2rem', background: 'none' }}>
                    <h3 className="news-title" style={{ color: '#0dcaf0', fontWeight: 900, fontSize: '1.15rem', marginBottom: 8 }}>{news.title}</h3>
                    <p className="news-description" style={{ color: '#e0f7fa', fontSize: '1.01rem', marginBottom: 12 }}>
                      {truncatePersianText(news.description, 120)}
                    </p>
                    <Link
                      to={`/news/${news.id}`}
                      className="news-link"
                      aria-label={`خواندن خبر: ${news.title}`}
                      style={{ color: '#00b5d7', fontWeight: 700, fontSize: '1.05rem' }}
                    >
                      بیشتر بخوانید
                      <FaArrowLeft className="arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', gap: '0.5rem', flexWrap: 'wrap', background: '#0dcaf0', borderRadius: 12, padding: '0.7rem 1.5rem', boxShadow: '0 2px 12px rgba(13,202,240,0.10)' }}>
                <button
                  className="retry-button"
                  style={{ minWidth: 80, fontWeight: 700, opacity: page === 1 ? 0.5 : 1, background: 'white', color: '#00b5d7', borderRadius: 8, border: 'none' }}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  قبلی
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className="retry-button"
                    style={{ minWidth: 40, fontWeight: page === i + 1 ? 900 : 700, background: page === i + 1 ? '#00b5d7' : 'white', color: page === i + 1 ? '#fff' : '#00b5d7', borderRadius: 8, border: 'none', margin: '0 2px' }}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="retry-button"
                  style={{ minWidth: 80, fontWeight: 700, opacity: page === totalPages ? 0.5 : 1, background: 'white', color: '#00b5d7', borderRadius: 8, border: 'none' }}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Fade-in animation style */}
      <style>{`
        .fade-in {
          animation: fadeInNewsCard 0.7s ease;
        }
        @keyframes fadeInNewsCard {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      {/* Minimalist underline style for search/sort */}
      <style>{`
        .news-search-sort-underline {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: flex-end;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .news-search-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex: 1 1 0;
        }
        .news-search-underline-input {
          border: none;
          border-bottom: 2px solid #00b5d7;
          background: transparent;
          color: #222;
          font-size: 1.08rem;
          font-family: 'Tahoma', Arial, sans-serif;
          padding: 0.6rem 0.2rem 0.6rem 0.2rem;
          width: 100%;
          transition: border-color 0.2s;
        }
        .news-search-underline-input:focus {
          outline: none;
          border-bottom: 2.5px solid #0dcaf0;
        }
        .news-search-underline-icon {
          color: #00b5d7;
          font-size: 1.25rem;
        }
        .news-sort-underline-select {
          border: none;
          border-bottom: 2px solid #00b5d7;
          background: transparent;
          color: #00b5d7;
          font-size: 1.08rem;
          font-family: 'Tahoma', Arial, sans-serif;
          font-weight: 700;
          padding: 0.6rem 0.2rem 0.6rem 0.2rem;
          min-width: 120px;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .news-sort-underline-select:focus {
          outline: none;
          border-bottom: 2.5px solid #0dcaf0;
        }
        @media (max-width: 600px) {
          .news-search-sort-underline {
            flex-direction: column;
            align-items: stretch;
            gap: 1.2rem;
            padding: 0 0.5rem;
          }
          .news-search-row {
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AllNews; 