import React, { useEffect, useState } from "react";
import { FaXTwitter, FaWhatsapp, FaYoutube, FaFacebook, FaUsers, FaCalendarDay, FaCalendarWeek, FaCalendar, FaGlobe, FaArrowUp } from "react-icons/fa6";
import PropTypes from 'prop-types';
import "../styles/FooterSection.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const FooterSection = () => {
  const [visitorStats, setVisitorStats] = useState({
    activeUsers: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Generate or retrieve visitorId
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    }

    // Record the visit, then fetch stats
    fetch("http://localhost:5000/api/visitors/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    })
      .then(res => res.json())
      .then(() => fetch("http://localhost:5000/api/visitors/visitor-stats"))
      .then(res => res.json())
      .then(stats => {
        setVisitorStats(stats);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching visitor stats:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll handler utility function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handlers with navigation and scrolling
  const handleNewsClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection("news-section"), 300);
    } else {
      scrollToSection("news-section");
    }
  };

  const handleFeedBackClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection("feedback-section"), 300);
    } else {
      scrollToSection("feedback-section");
    }
  };

  const StatItem = ({ icon: Icon, label, value, loading }) => (
    <div className="stat-item">
      <div className="stat-icon">
        <Icon />
      </div>
      <div className="stat-content">
        <span className="stat-value">
          {loading ? (
            <div className="stat-skeleton"></div>
          ) : (
            value.toLocaleString()
          )}
        </span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );

  // PropTypes for StatItem component
  StatItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Social Media */}
          <div className="footer-column social">
            <h3 className="footer-title">
              <span className="title-icon">📱</span>
              ما را دنبال کنید
            </h3>
            <p className="footer-description">
              در شبکه‌های اجتماعی با ما در ارتباط باشید
            </p>
            <div className="social-icons">
              <a href="#" className="social-link twitter" aria-label="Twitter">
                <FaXTwitter />
              </a>
              <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="#" className="social-link youtube" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">
              <span className="title-icon">🔗</span>
              لینک‌های سریع
            </h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <span className="link-icon">🏠</span>
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  <span className="link-icon">ℹ️</span>
                  درباره ما
                </Link>
              </li>
              <li>
                <a href="#news-section" onClick={handleNewsClick} className="footer-link">
                  <span className="link-icon">📰</span>
                  اخبار و اعلام ها
                </a>
              </li>
              <li>
                <a href="#feedback-section" onClick={handleFeedBackClick} className="footer-link">
                  <span className="link-icon">📞</span>
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          {/* Visitor Stats */}
          <div className="footer-column">
            <h3 className="footer-title">
              <span className="title-icon">📊</span>
              آمار بازدیدکنندگان
            </h3>
            <div className="stats-container">
              <StatItem 
                icon={FaUsers} 
                label="کاربران فعال" 
                value={visitorStats.activeUsers} 
                loading={isLoading}
              />
              <StatItem 
                icon={FaCalendarDay} 
                label="بازدید روزانه" 
                value={visitorStats.daily} 
                loading={isLoading}
              />
              <StatItem 
                icon={FaCalendarWeek} 
                label="بازدید هفتگی" 
                value={visitorStats.weekly} 
                loading={isLoading}
              />
              <StatItem 
                icon={FaCalendar} 
                label="بازدید ماهانه" 
                value={visitorStats.monthly} 
                loading={isLoading}
              />
              <StatItem 
                icon={FaGlobe} 
                label="کل بازدیدها" 
                value={visitorStats.total} 
                loading={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 ریاست تضمین کیفیت - اداره تعلیمات تخنیکی و مسلکی
            </p>
            <div className="footer-actions">
              <button 
                className="scroll-top-btn" 
                onClick={scrollToTop}
                style={{ opacity: showScrollTop ? 1 : 0, visibility: showScrollTop ? 'visible' : 'hidden' }}
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
