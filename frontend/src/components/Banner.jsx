import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { FaCheckCircle, FaUsers, FaClipboardCheck, FaGraduationCap } from 'react-icons/fa';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    title: 'آموزش، توسعه و پیشرفت',
    slogans: [
      'توسعه مهارت‌های کارآفرینی',
      'تقویت نیروی کار ماهر',
      'حمایت از نوآوری آموزشی',
    ],
    description:
      'با تمرکز بر مهارت‌ها و نوآوری، آینده‌ای روشن برای نیروی کار کشور می‌سازیم.',
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
  const typedRef = useRef(null);
  const typedEl = useRef(null);
  const slideTimeout = useRef(null);

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
    slideTimeout.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, slideDuration);
    return () => clearTimeout(slideTimeout.current);
  }, [current]);

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

  return (
    <>
      <section className="banner" dir="rtl" aria-label="بنر ریاست تضمین کیفیت">
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
              <a href="/about" className="btn btn--primary">
                درباره ما
              </a>
              <a href="#feedback-section" className="btn btn--outline">
                تماس با ما
              </a>
            </div>
          </div>
          <div className="banner__image-wrapper" aria-hidden="true">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide.image}
                alt=""
                className={`banner__image ${
                  index === current ? 'banner__image--active' : ''
                }`}
                draggable={false}
              />
            ))}
            <button
              onClick={goToPrev}
              aria-label="اسلاید قبلی"
              className="banner__nav banner__nav--left"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              aria-label="اسلاید بعدی"
              className="banner__nav banner__nav--right"
            >
              ›
            </button>
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
      </section>

      <style>{`
        /* Reset and basics */
        .banner {
          background-color: #030305;
          color: #eee;
          padding: 3rem 1rem 8rem;
          box-sizing: border-box;
          min-height: 550px;
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
        }

        .banner__subtitle {
          display: block;
          color: #0dcaf0;
          letter-spacing: 0.2em;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .banner__title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
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
        }

        .banner__icon {
          color: #0dcaf0;
          margin-left: 0.5rem;
          min-width: 22px;
          flex-shrink: 0;
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
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .btn--primary {
          background-color: #0dcaf0;
          color: #030305;
          border: none;
        }
        .btn--primary:hover,
        .btn--primary:focus {
          background-color: #00b5d7;
          outline: none;
          color: #030305;
        }

        .btn--outline {
          background-color: transparent;
          border: 2px solid #0dcaf0;
          color: #0dcaf0;
        }
        .btn--outline:hover,
        .btn--outline:focus {
          background-color: #0dcaf0;
          color: #030305;
          outline: none;
        }

        /* Image container */
        .banner__image-wrapper {
          flex: 1 1 400px;
          position: relative;
          max-width: 600px;
          min-width: 280px;
          height: 350px;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 12px 24px rgba(13, 202, 240, 0.35);
          user-select: none;
        }

        .banner__image {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.05);
          transition: opacity 0.8s ease, transform 0.8s ease;
          pointer-events: none;
        }
        .banner__image--active {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          pointer-events: auto;
        }

        /* Navigation arrows */
        .banner__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(13, 202, 240, 0.85);
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          font-size: 1.8rem;
          color: #030305;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          transition: background-color 0.3s ease;
          z-index: 10;
        }
        .banner__nav:hover,
        .banner__nav:focus {
          background-color: #00b5d7;
          outline: none;
        }
        .banner__nav--left {
          left: 10px;
        }
        .banner__nav--right {
          right: 10px;
        }

        /* Stats bar */
        .banner__stats {
          max-width: 1200px;
          margin: 3rem auto 0 auto;
          padding: 1rem 1rem 2rem;
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
          color: #0dcaf0;
          font-weight: 700;
          font-size: 1rem;
          user-select: none;
        }

        .banner__stat {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 140px;
          justify-content: center;
        }
        .banner__stat-icon {
          font-size: 1.6rem;
          color: #0dcaf0;
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
            display: none;
            border-radius: 10px;
          }
          .banner__nav {
            width: 34px;
            height: 34px;
            font-size: 1.4rem;
          }
          .banner__stats {
            font-size: 0.85rem;
            gap: 1.5rem;
          }
          .banner__stat-icon {
            font-size: 1.3rem;
          }
          .banner__stat-label {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}
