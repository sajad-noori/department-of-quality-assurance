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
      
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="feedback-container">
        {/* Glowing Header */}
        <div className="header-glow">
          <h2 className="feedback-heading">
            <span className="gradient-text">ارسال باز خورد</span>
            <div className="heading-underline"></div>
          </h2>
          <p className="feedback-subtitle">نظرات شما برای ما ارزشمند است</p>
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

        {/* Glassmorphism Form */}
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
                  className={`floating-input ${errors.firstName ? "error" : ""} ${activeField === 'firstName' ? "active" : ""}`}
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
                  className={`floating-input ${errors.lastName ? "error" : ""} ${activeField === 'lastName' ? "active" : ""}`}
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
                className={`floating-input ${errors.email ? "error" : ""} ${activeField === 'email' ? "active" : ""}`}
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
                className={`floating-textarea ${errors.message ? "error" : ""} ${activeField === 'message' ? "active" : ""}`}
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
              className={`submit-button ${!isFormValid() || submitting ? "disabled" : ""}`}
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
    </section>
  );
};

export default FeedbackSection;
