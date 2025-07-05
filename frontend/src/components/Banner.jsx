import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { FaCheckCircle, FaUsers, FaClipboardCheck, FaGraduationCap } from 'react-icons/fa';
import PresentationImg from '../assets/illustrations/presentation-6-30.png';
import CustomerServiceImg from '../assets/illustrations/customer-service-1-33.png';
import OfficeWorkImg from '../assets/illustrations/office-work-81.png';
import TeamPresentationImg from '../assets/illustrations/team-presentation-6-18.png';

const slides = [
  {
    component: <img src={PresentationImg} alt="ارائه - Presentation Illustration" style={{width: '100%', height: '100%', objectFit: 'contain'}} />,
    title: 'ریاست تضمین کیفیت',
    slogans: [
      'تضمین کیفیت؛ مسیر آموزش بهتر',
      'ارتقاء استانداردهای آموزشی',
      'نظارت مستمر و علمی',
    ],
    description:
      'مأموریت ما ارتقاء کیفیت آموزش‌های فنی و حرفه‌ای از طریق ارزیابی، نظارت و همکاری مستمر با مؤسسات آموزشی است.',
  },
  {
    component: <img src={CustomerServiceImg} alt="خدمات مشتری - Customer Service Illustration" style={{width: '100%', height: '100%', objectFit: 'contain'}} />,
    title: 'اداره تعلیمات تخنیکی و مسلکی',
    slogans: [
      'همکاری با مؤسسات آموزشی',
      'بهبود مستمر برنامه‌ها',
      'ایجاد استانداردهای روز',
    ],
    description:
      'ما با همکاری نزدیک با مؤسسات، استانداردهای آموزشی را به سطح جهانی می‌رسانیم.',
  },
  {
    component: <img src={OfficeWorkImg} alt="دفتر کار - Office Work Illustration" style={{width: '100%', height: '100%', objectFit: 'contain'}} />,
    title: 'آموزش، توسعه و پیشرفت',
    slogans: [
      'توسعه مهارت‌های کارآفرینی',
      'تقویت نیروی کار ماهر',
      'حمایت از نوآوری آموزشی',
    ],
    description:
      'با تمرکز بر مهارت‌ها و نوآوری، آینده‌ای روشن برای نیروی کار کشور می‌سازیم.',
  },
  {
    component: <img src={TeamPresentationImg} alt="ارائه تیمی - Team Presentation Illustration" style={{width: '100%', height: '100%', objectFit: 'contain'}} />,
    title: 'علوم و فناوری',
    slogans: [
      'پیشرفت علمی و فناوری',
      'نوآوری در آموزش',
      'تحقیق و توسعه',
    ],
    description:
      'ما به توسعه علوم و فناوری و ترویج نوآوری در آموزش متعهدیم.',
  },
];

const stats = [
  { icon: <FaUsers />, label: 'مؤسسات تحت نظارت', value: '۲۰۰+' },
  { icon: <FaClipboardCheck />, label: 'ارزیابی‌های انجام‌شده', value: '۵۰۰+' },
  { icon: <FaGraduationCap />, label: 'فارغ‌التحصیلان موفق', value: '۱۵۰۰+' },
  { icon: <FaCheckCircle />, label: 'رضایت آموزشی', value: '۹۵٪' },
];

const slideDuration = 7000;

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const typedRef = useRef(null);
  const typedEl = useRef(null);
  const slideTimeout = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (typedRef.current) typedRef.current.destroy();
    typedRef.current = new Typed(typedEl.current, {
      strings: slides[current].slogans,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      smartBackspace: true,
    });
    return () => typedRef.current.destroy();
  }, [current]);

  useEffect(() => {
    if (!isHovered) {
      slideTimeout.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, slideDuration);
    }
    return () => clearTimeout(slideTimeout.current);
  }, [current, isHovered]);

  const goToSlide = (index) => {
    clearTimeout(slideTimeout.current);
    setCurrent(index);
  };

  const goToPrev = () => {
    clearTimeout(slideTimeout.current);
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const goToNext = () => {
    clearTimeout(slideTimeout.current);
    setCurrent((current + 1) % slides.length);
  };

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      imageRef.current.style.transform = `
        translate(-50%, -50%) 
        scale(1.05) 
        rotateX(${(y - 0.5) * 5}deg) 
        rotateY(${(x - 0.5) * 5}deg)
      `;
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'translate(-50%, -50%) scale(1.05)';
    }
  };

  return (
    <>
      <section 
        className="banner" 
        dir="rtl" 
        aria-label="بنر ریاست تضمین کیفیت"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="banner__content">
          <div className="banner__text">
            <small className="banner__subtitle">اداره تعلیمات تخنیکی و مسلکی</small>
            <h1 className="banner__title">{slides[current].title}</h1>
            <h3
              className="banner__typed"
              aria-live="polite"
              aria-atomic="true"
              ref={typedEl}
            />
            <p className="banner__description">{slides[current].description}</p>
            <ul className="banner__list">
              {[
                'ارزیابی‌های دوره‌ای و تخصصی',
                'حمایت از آموزش استاندارد',
                'ارتقاء مهارت‌های نیروی کار کشور',
              ].map((item, i) => (
                <li key={i} className="banner__list-item">
                  <FaCheckCircle aria-hidden="true" className="banner__icon" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="banner__buttons">
              <a href="/profile" className="btn btn--primary">
                 پروسه تضمین کیفیت
              </a>
              <a href="#feedback-section" className="btn btn--outline">
                تماس با ما
              </a>
            </div>
          </div>
          <div 
            className="banner__image-wrapper" 
            aria-hidden="true"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {slides.map((slide, index) => (
              <div key={index} className="banner__image-container">
                <div className="banner__image-overlay" />
                <div
                  ref={index === current ? imageRef : null}
                  className={`banner__image ${
                    index === current ? 'banner__image--active' : ''
                  }`}
                >
                  {slide.component}
                </div>
              </div>
            ))}
            <div className="banner__progress">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`banner__progress-dot ${
                    index === current ? 'banner__progress-dot--active' : ''
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="banner__stats" aria-label="آمارها">
          {stats.map(({ icon, label, value }, i) => (
            <div key={i} className="banner__stat">
              <span className="banner__stat-icon" aria-hidden="true">
                {icon}
              </span>
              <span className="banner__stat-label">{label}:</span>{' '}
              <strong className="banner__stat-value">{value}</strong>
            </div>
          ))}
        </div>
        <div className="banner__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 320" width="100%" height="110" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path fill="#0dcaf0" fillOpacity="1" d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,186.7C672,213,768,235,864,218.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            <path fill="#00b5d7" fillOpacity="0.7" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            <path fill="#a9e5ff" fillOpacity="0.5" d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,250.7C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
          </svg>
        </div>
      </section>
      <style>{`
        /* Reset and basics */
        .banner {
          background-color: #121212;
          color: #eee;
          padding: 3rem 1rem 8rem;
          box-sizing: border-box;
          min-height: 550px;
          position: relative;
          overflow: hidden;
        }

        /* Light mode styles */
        [data-theme="light"] .banner {
          background-color: #ffffff;
          color: #333333;
        }

        [data-theme="light"] .banner__subtitle {
          color: #0dcaf0;
        }

        [data-theme="light"] .banner__title {
          background: linear-gradient(45deg, #0dcaf0, #00b5d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        [data-theme="light"] .banner__typed {
          color: #0dcaf0;
        }

        [data-theme="light"] .banner__description {
          color: #333333;
        }

        [data-theme="light"] .banner__list-item {
          color: #333333;
        }

        [data-theme="light"] .banner__icon {
          color: #0dcaf0;
        }

        [data-theme="light"] .banner__stat {
          color: #0dcaf0;
        }

        [data-theme="light"] .banner__stat-label {
          color: #333333;
        }

        [data-theme="light"] .banner__stat-value {
          color: #0dcaf0;
        }

        [data-theme="light"] .banner__progress-dot {
          border: 1px solid #0dcaf0;
        }

        .banner::before {
          display: none;
        }

        .banner__content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
        }

        /* Text block */
        .banner__text {
          flex: 1 1 480px;
          min-width: 280px;
          max-width: 600px;
          text-align: right;
          user-select: none;
          z-index: 2;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .banner__subtitle {
          display: block;
          color: #0dcaf0;
          letter-spacing: 0.2em;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          text-shadow: 0 0 10px rgba(13, 202, 240, 0.3);
        }

        .banner__title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #0dcaf0, #00b5d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(13, 202, 240, 0.2);
        }

        .banner__typed {
          color: #0dcaf0;
          min-height: 70px;
          font-weight: 600;
          font-size: 1.8rem;
          margin-bottom: 1.2rem;
          letter-spacing: 0.05em;
          min-width: 250px;
          direction: rtl;
          user-select: none;
          text-shadow: 0 0 15px rgba(13, 202, 240, 0.3);
        }

        .banner__description {
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 2rem;
          max-width: 500px;
          user-select: none;
        }

        .banner__list {
          list-style: none;
          padding: 0;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .banner__list-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.8rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: #a9e5ff;
          user-select: none;
          transition: transform 0.3s ease;
        }

        .banner__list-item:hover {
          transform: translateX(-5px);
        }

        .banner__icon {
          color: #0dcaf0;
          margin-left: 0.5rem;
          min-width: 22px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 5px rgba(13, 202, 240, 0.5));
        }

        .banner__buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .btn {
          font-weight: 700;
          font-size: 1.1rem;
          padding: 0.8rem 1.8rem;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          display: inline-block;
          min-width: 150px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .btn:hover::before {
          transform: translateX(100%);
        }

        .btn--primary {
          background-color: #0dcaf0;
          color: #030305;
          border: none;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.3);
        }

        .btn--primary:hover,
        .btn--primary:focus {
          background-color: #00b5d7;
          outline: none;
          color: #030305;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 202, 240, 0.4);
        }

        .btn--outline {
          background-color: transparent;
          border: 2px solid #0dcaf0;
          color: #0dcaf0;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.1);
        }

        .btn--outline:hover,
        .btn--outline:focus {
          background-color: #0dcaf0;
          color: #030305;
          outline: none;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 202, 240, 0.2);
        }

        /* Image container */
        .banner__image-wrapper {
          flex: 1 1 400px;
          position: relative;
          max-width: 600px;
          min-width: 280px;
          height: 350px;
          overflow: visible;
          user-select: none;
          perspective: 1000px;
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
        }

        .banner__image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
        }

        .banner__image-overlay {
          display: none;
        }

        .banner__image {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.05);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          will-change: transform;
          color: #0dcaf0;
          background: transparent;
        }

        .banner__image svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 20px rgba(13, 202, 240, 0.3));
        }

        .banner__image--active {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.05);
          pointer-events: auto;
        }

        /* Progress dots */
        .banner__progress {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .banner__progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .banner__progress-dot:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .banner__progress-dot--active {
          background: #0dcaf0;
          box-shadow: 0 0 10px rgba(13, 202, 240, 0.5);
          transform: scale(1.2);
        }

        /* Navigation arrows */
        .banner__nav {
          display: none;
        }

        .banner__nav--left,
        .banner__nav--right {
          display: none;
        }

        /* Stats bar */
        .banner__stats {
          max-width: 1200px;
          margin: 3rem auto 0 auto;
          padding: 1.5rem;
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
          color: #0dcaf0;
          font-weight: 700;
          font-size: 1rem;
          user-select: none;
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
        }

        .banner__stat {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 140px;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .banner__stat:hover {
          transform: translateY(-2px);
        }

        .banner__stat-icon {
          font-size: 1.6rem;
          color: #0dcaf0;
          filter: drop-shadow(0 0 8px rgba(13, 202, 240, 0.4));
        }

        .banner__stat-label {
          color: #a9e5ff;
          min-width: 120px;
          text-align: right;
          user-select: none;
        }

        .banner__stat-value {
          color: #00c7ff;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(13, 202, 240, 0.3);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .banner__content {
            flex-direction: column-reverse;
            padding: 0 1rem;
          }
          .banner__text,
          .banner__image-wrapper {
            max-width: 100%;
            flex: none;
            text-align: center;
            min-width: auto;
          }
          .banner__text {
            margin-top: 2rem;
          }
          .banner__list-item {
            justify-content: center;
          }
          .banner__buttons {
            justify-content: center;
          }
          .banner__stat-label {
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .banner__title {
            font-size: 2.2rem;
          }
          .banner__typed {
            font-size: 1.3rem;
            min-height: 50px;
          }
          .banner__description {
            font-size: 1rem;
            max-width: 100%;
          }
          .banner__buttons {
            gap: 0.6rem;
          }
          .btn {
            min-width: 120px;
            font-size: 1rem;
            padding: 0.6rem 1.2rem;
          }
          .banner__image-wrapper {
            height: 250px;
            border-radius: 10px;
          }
          .banner__image {
            width: 85%;
            height: 85%;
          }
          .banner__stats {
            font-size: 0.85rem;
            gap: 1.5rem;
            padding: 1rem;
          }
          .banner__stat-icon {
            font-size: 1.3rem;
          }
          .banner__stat-label {
            min-width: auto;
          }
        }

        /* Update animations for more dynamic movement */
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-2deg);
          }
        }

        @keyframes draw {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        .animate-draw {
          animation: draw 2s ease-in-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
          transform-origin: center;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Update image container styles to remove frame */
        .banner__image-wrapper {
          flex: 1 1 400px;
          position: relative;
          max-width: 600px;
          min-width: 280px;
          height: 350px;
          overflow: visible;
          user-select: none;
          perspective: 1000px;
          background: transparent;
          backdrop-filter: none;
          border: none;
        }

        .banner__image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .banner__image {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.05);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          will-change: transform;
          color: #0dcaf0;
        }

        .banner__image svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 20px rgba(13, 202, 240, 0.3));
        }

        .banner__image--active {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.05);
          pointer-events: auto;
        }

        /* Update animations for more dynamic movement */
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        /* Rest of the existing styles... */
        .banner__wave {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
