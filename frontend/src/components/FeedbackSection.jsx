import React, { useState, useEffect, useRef } from "react";
import "../styles/FeedbackSection.css";

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [activeField, setActiveField] = useState(null);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  // Copy-to-clipboard tooltip state
  const [copiedField, setCopiedField] = useState(null);
  const copyTimeoutRef = useRef(null);

  const [showConfetti, setShowConfetti] = useState(false);

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setShowConfetti(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedField(null);
      setShowConfetti(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Particle animation system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reduced particle count for better performance
    const particleCount = 20;
    const particles = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Reduced velocity
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5, // Smaller particles
        opacity: Math.random() * 0.3 + 0.1, // Lower opacity
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
      });
    }

    let animationId;
    let lastTime = 0;
    const targetFPS = 30; // Reduced FPS for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      if (currentTime - lastTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime;
      
      // Clear canvas with slight transparency for trail effect
      ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1; // Reset alpha
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reposition particles after resize
      particles.forEach(particle => {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); // Removed particles dependency to prevent re-initialization

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (value.trim().length < 2) {
          return "اسم باید حداقل ۲ حرف داشته باشد.";
        }
        break;
      case "lastName":
        if (value.trim().length < 2) {
          return "تخلص باید حداقل ۲ حرف داشته باشد.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "لطفاً یک ایمیل معتبر وارد کنید.";
        }
        break;
      case "message":
        if (value.trim().length === 0) {
          return "پیام نمی‌تواند خالی باشد.";
        }
        if (value.trim().length > 1000) {
          return "پیام نمی‌تواند بیشتر از ۱۰۰۰ حرف باشد.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setActiveField(null);
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true
    });

    if (!validateForm()) {
      showNotification("error", "لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        if (data.message && data.message.includes('not configured')) {
          showNotification("success", "پیام شما دریافت شد! (اعلان ایمیل تنظیم نشده است)");
        } else {
          showNotification("success", "پیام شما با موفقیت ارسال شد. تشکر!");
        }
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        setTouched({});
        setErrors({});
      } else {
        const errorMessage = data.message || "خطا در ارسال پیام. لطفاً دوباره کوشش کنید.";
        showNotification("error", errorMessage);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      showNotification("error", "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
    }

    setSubmitting(false);
  };

  const getCharacterCount = () => {
    return formData.message.length;
  };

  const isFormValid = () => {
    const hasAllFields = formData.firstName.trim() && 
                        formData.lastName.trim() && 
                        formData.email.trim() && 
                        formData.message.trim();
    
    // Only true if all error values are empty strings
    const hasNoErrors = Object.values(errors).every(error => !error);
    
    return hasAllFields && hasNoErrors;
  };

  return (
    <section className="feedback-section" id="feedback-section">
      {/* Animated Background Canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {/* Floating SVG Blob Backgrounds */}
      <svg className="floating-blob-bg blob1" viewBox="0 0 600 400" width="600" height="400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blobGradient1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0dcaf0" />
            <stop offset="100%" stopColor="#00b5d7" />
          </linearGradient>
        </defs>
        <path fill="url(#blobGradient1)" fillOpacity="0.15" d="M421.5,320Q370,400,260,370Q150,340,120,220Q90,100,220,80Q350,60,420,140Q490,220,421.5,320Z"/>
      </svg>
      <svg className="floating-blob-bg blob2" viewBox="0 0 600 400" width="600" height="400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blobGradient2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00b5d7" />
            <stop offset="100%" stopColor="#0dcaf0" />
          </linearGradient>
        </defs>
        <path fill="url(#blobGradient2)" fillOpacity="0.12" d="M421.5,320Q370,400,260,370Q150,340,120,220Q90,100,220,80Q350,60,420,140Q490,220,421.5,320Z"/>
      </svg>
      
      {/* Confetti burst animation */}
      {showConfetti && <div className="confetti-burst" aria-hidden="true"></div>}
      
      {/* Hero Section */}
      <div className="feedback-hero">
        <div className="hero-content">
          <span className="mascot-emoji" aria-label="Mascot">🤗</span>
          <h1 className="hero-title">ارتباط با ما</h1>
          <p className="hero-subtitle">ما همیشه آماده شنیدن نظرات و پیشنهادات شما هستیم!</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="feedback-content">
        <div className="feedback-grid">
          {/* Contact Information Card */}
          <div className="contact-card fade-in-card">
            <div className="card-header">
              <h3 className="card-title">اطلاعات تماس</h3>
              <p className="card-subtitle">برای ارتباط با ما می‌توانید از راه‌های زیر استفاده کنید</p>
            </div>
            
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <polyline points="3 7 12 13 21 7"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">ایمیل</span>
                  <div className="contact-value">
                    <a href="mailto:sajadnooribayany2@gmail.com" className="contact-link">sajadnooribayany2@gmail.com</a>
                    <button
                      type="button"
                      className={`copy-btn${copiedField === 'email' ? ' copied' : ''}`}
                      title="کپی ایمیل"
                      aria-label="کپی ایمیل"
                      onClick={() => handleCopy('email', 'sajadnooribayany@gmail.com')}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                      </svg>
                      <span className="copied-tooltip" aria-live="polite">
                        {copiedField === 'email' ? 'کپی شد!' : ''}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">تلفن</span>
                  <div className="contact-value">
                    <div className="phone-number-container">
                      <a href="tel:0778558968" className="contact-link">+93 77 8558968</a>
                    </div>
                    <button
                      type="button"
                      className={`copy-btn${copiedField === 'phone' ? ' copied' : ''}`}
                      title="کپی شماره"
                      aria-label="کپی شماره"
                      onClick={() => handleCopy('phone', '0778558968')}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                      </svg>
                      <span className="copied-tooltip" aria-live="polite">
                        {copiedField === 'phone' ? 'کپی شد!' : ''}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">آدرس</span>
                  <a href="https://maps.google.com/?q=کابل، افغانستان، اداره ملی تعلیمات تخنیکی و مسلکی" target="_blank" rel="noopener noreferrer" className="contact-link">کابل، افغانستان، اداره ملی تعلیمات تخنیکی و مسلکی</a>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form Card */}
          <div className="form-card fade-in-card">
            <div className="card-header">
              <div className="cta-badge">👋 ما منتظر پیام شما هستیم!</div>
              <h3 className="card-title">ارسال باز خورد</h3>
              <p className="card-subtitle">نظرات شما برای ما ارزشمند است</p>
            </div>
            
            {/* Enhanced Notification */}
            {notification.show && (
              <div className={`notification ${notification.type}`}>
                <div className="notification-icon">
                  {notification.type === 'success' ? '✓' : '⚠'}
                </div>
                <span className="notification-message">{notification.message}</span>
                <button 
                  className="notification-close"
                  onClick={() => setNotification({ show: false, type: "", message: "" })}
                  aria-label="بستن اعلان"
                >
                  ×
                </button>
              </div>
            )}

            {/* Feedback Form */}
            <form className="feedback-form" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <div className="input-container">
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => handleFocus('firstName')}
                      onBlur={handleBlur}
                      required
                      disabled={submitting}
                      className={`floating-input${errors.firstName ? " error" : ""}${activeField === 'firstName' ? " active" : ""} animated-field`}
                      placeholder=" "
                    />
                    <label htmlFor="firstName" className="floating-label">
                      <span className="label-text">اسم</span>
                      <span className="required-star">*</span>
                    </label>
                    <div className="input-border"></div>
                  </div>
                  {errors.firstName && (
                    <span className="error-message" role="alert">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => handleFocus('lastName')}
                      onBlur={handleBlur}
                      required
                      disabled={submitting}
                      className={`floating-input${errors.lastName ? " error" : ""}${activeField === 'lastName' ? " active" : ""} animated-field`}
                      placeholder=" "
                    />
                    <label htmlFor="lastName" className="floating-label">
                      <span className="label-text">تخلص</span>
                      <span className="required-star">*</span>
                    </label>
                    <div className="input-border"></div>
                  </div>
                  {errors.lastName && (
                    <span className="error-message" role="alert">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    disabled={submitting}
                    className={`floating-input${errors.email ? " error" : ""}${activeField === 'email' ? " active" : ""} animated-field`}
                    placeholder=" "
                  />
                  <label htmlFor="email" className="floating-label">
                    <span className="label-text">ایمل آدرس</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.email && (
                  <span className="error-message" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <div className="textarea-container">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    required
                    disabled={submitting}
                    className={`floating-textarea${errors.message ? " error" : ""}${activeField === 'message' ? " active" : ""} animated-field`}
                    placeholder=" "
                    maxLength={1000}
                  ></textarea>
                  <label htmlFor="message" className="floating-label">
                    <span className="label-text">پیام شما</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="textarea-border"></div>
                </div>
                <div className="textarea-footer">
                  {errors.message && (
                    <span className="error-message" role="alert">
                      {errors.message}
                    </span>
                  )}
                  <span className="character-count">
                    {getCharacterCount()}/1000
                  </span>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="button-container">
                <button
                  type="submit"
                  className={`submit-button${!isFormValid() || submitting ? " disabled" : ""} animated-submit`}
                  disabled={!isFormValid() || submitting}
                  aria-describedby={submitting ? "submitting-status" : undefined}
                >
                  <span className="button-content">
                    {submitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>در حال ارسال...</span>
                      </>
                    ) : (
                      <>
                        <span className="button-text">ارسال پیام</span>
                        <span className="button-icon">→</span>
                      </>
                    )}
                  </span>
                  <div className="button-glow"></div>
                </button>
              </div>
              
              {submitting && (
                <div id="submitting-status" className="sr-only" role="status">
                  در حال ارسال فرم...
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;