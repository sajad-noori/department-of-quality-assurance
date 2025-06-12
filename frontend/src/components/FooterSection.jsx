import React, { useEffect, useState } from "react";
import { FaXTwitter, FaWhatsapp, FaYoutube, FaFacebook } from "react-icons/fa6";
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
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    })
      .then(res => res.json())
      .then(() => fetch("/api/visitor-stats"))
      .then(res => res.json())
      .then(stats => setVisitorStats(stats))
      .catch(err => console.error("Error fetching visitor stats:", err));
  }, []);

  // Scroll handler utility function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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

  return (
    <footer className="footer">
      <div className="footer-container  footer-bottom">
        {/* Social Media */}
        <div className="footer-column social">
          <h3>ما را دنبال کنید</h3>
          <div className="icons">
            <a href="#"><FaXTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="#"><FaFacebook /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>لینک‌های سریع</h3>
          <ul>
            <li><a href="/">صفحه اصلی</a></li>
            <li><Link to="/about">درباره ما</Link></li>
            <li><a href="#news-section" onClick={handleNewsClick}>اخبار و اعلام ها</a></li>
            <li><a href="#feedback-section" onClick={handleFeedBackClick}>تماس با ما</a></li>
          </ul>
        </div>

        {/* Visitor Stats */}
        <div className="footer-column">
          <h3>بیننده‌ها</h3>
          <ul>
            <li>یوزر ها فعال در ویبسایت: {visitorStats.activeUsers}</li>
            <li>تعداد بیننده ها در روز: {visitorStats.daily}</li>
            <li>تعداد بیننده ها در هفته: {visitorStats.weekly}</li>
            <li>تعداد بیننده ها در ماه: {visitorStats.monthly}</li>
            <li>مجموعه بیننده: {visitorStats.total}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 ریاست تضمین کیفیت - اداره تعلیمات تخنیکی و مسلکی</p>
      </div>
    </footer>
  );
};

export default FooterSection;
