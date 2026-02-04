import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaUsers,
  FaClipboardCheck,
  FaGraduationCap,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

// Import images
import PresentationImg from "../assets/illustrations/presentation-6-30.webp";
import OfficeWorkImg from "../assets/illustrations/office-work-81.webp";
import TeamPresentationImg from "../assets/illustrations/team-presentation-6-18.webp";

import "../styles/Banner.css";

// --- Components & Data ---

const WaveDivider = () => (
  <div className="banner__wave" aria-hidden="true">
    <svg
      viewBox="0 0 1440 320"
      width="100%"
      height="110"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        fill="#0dcaf0"
        fillOpacity="1"
        d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,186.7C672,213,768,235,864,218.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        fill="#00b5d7"
        fillOpacity="0.7"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        fill="#a9e5ff"
        fillOpacity="0.5"
        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,250.7C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      />
    </svg>
  </div>
);

const slidesData = [
  {
    imageSrc: PresentationImg,
    alt: "ارائه - Presentation Illustration",
    title: "ریاست تضمین کیفیت و اعتباردهی",
    slogans: [
      "تضمین کیفیت؛ مسیر آموزش بهتر",
      "ارتقاء ستندرد های آموزشی",
      "نظارت مستمر و علمی",
    ],
    description:
      "مأموریت ما بهبود کیفیت آموزش‌های تخنیکی و مسلکی از طریق ارزیابی، نظارت و همکاری مستمر با مؤسسات آموزشی است.",
  },
  {
    imageSrc: OfficeWorkImg,
    alt: "دفتر کار - Office Work Illustration",
    title: "آموزش، توسعه و پیشرفت",
    slogans: [
      "توسعه مهارت‌های کارآفرینی",
      "تقویت نیروی کار ماهر",
      "حمایت از نوآوری آموزشی",
    ],
    description:
      "با تمرکز بر مهارت‌ها و نوآوری، آینده‌ای روشن برای نیروی کار کشور می‌سازیم.",
  },
  {
    imageSrc: TeamPresentationImg,
    alt: "ارائه تیمی - Team Presentation Illustration",
    title: "علوم و تکنالوژی",
    slogans: ["پیشرفت علمی و تکنالوژی", "نوآوری در آموزش", "تحقیق و توسعه"],
    description: "ما به توسعه علوم و فناوری و ترویج نوآوری در آموزش متعهدیم.",
  },
];

const stats = [
  { icon: <FaUsers />, label: "مؤسسات تحت نظارت", value: "۳۶۰+" },
  { icon: <FaClipboardCheck />, label: "ارزیابی‌های انجام‌شده", value: "۰+" },
  { icon: <FaGraduationCap />, label: "فارغ‌التحصیلان موفق", value: "۰+" },
  { icon: <FaCheckCircle />, label: "رضایت آموزشی", value: "۶۵٪" },
];

const SLIDE_DURATION = 7000;

export default function Banner() {
  const { theme } = useTheme();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const typedRef = useRef(null);
  const typedEl = useRef(null);
  const intervalRef = useRef(null); // Changed to intervalRef for clarity
  const imageRef = useRef(null);

  // 1. Initialize Typed.js
  useEffect(() => {
    let mounted = true;

    if (typedRef.current) {
      typedRef.current.destroy();
      typedRef.current = null;
    }

    import("typed.js")
      .then((module) => {
        if (!mounted || !typedEl.current) return;
        const Typed = module.default;
        typedRef.current = new Typed(typedEl.current, {
          strings: slidesData[current].slogans,
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
          smartBackspace: true,
        });
      })
      .catch((err) => console.error("Typed.js failed to load", err));

    return () => {
      mounted = false;
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    };
  }, [current]);

  // 2. Handle Slide Timer (With Visibility Logic)
  useEffect(() => {
    const startTimer = () => {
      // Clear any existing timer first to be safe
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        // Only slide if not hovered and tab is visible
        if (!isHovered && document.visibilityState === "visible") {
          setCurrent((prev) => (prev + 1) % slidesData.length);
        }
      }, SLIDE_DURATION);
    };

    // Start timer if not hovered
    if (!isHovered) {
      startTimer();
    }

    // Handle Tab Switching (Hibernation Fix)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isHovered) {
        startTimer(); // Restart timer immediately when user returns
      } else {
        clearInterval(intervalRef.current); // Pause when user leaves
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isHovered]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // 3. 3D Tilt Effect
  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
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
      imageRef.current.style.transform = "translate(-50%, -50%) scale(1.05)";
    }
  };

  return (
    <section
      className="banner"
      dir="rtl"
      aria-label="بنر ریاست تضمین کیفیت"
      data-theme={theme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="banner__content">
        <div className="banner__text">
          <small className="banner__subtitle">
            اداره تعلیمات تخنیکی و مسلکی
          </small>

          <h1 className="banner__title">{slidesData[current].title}</h1>

          <h3
            className="banner__typed"
            aria-live="polite"
            aria-atomic="true"
            ref={typedEl}
          />

          <p className="banner__description">
            {slidesData[current].description}
          </p>

          <ul className="banner__list">
            {[
              "حمایت از آموزش معیاری",
              "ارتقاء مهارت‌های نیروی کار ",
              "ارزیابی‌های دوره‌ای و تخصصی",
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
          {slidesData.map((slide, index) => (
            <div key={index} className="banner__image-container">
              <div className="banner__image-overlay" />
              <div
                ref={index === current ? imageRef : null}
                className={`banner__image ${
                  index === current ? "banner__image--active" : ""
                }`}
              >
                <img
                  src={slide.imageSrc}
                  alt={slide.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>
          ))}

          <div className="banner__progress">
            {slidesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`banner__progress-dot ${
                  index === current ? "banner__progress-dot--active" : ""
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
            <span className="banner__stat-label">{label}:</span>{" "}
            <strong className="banner__stat-value">{value}</strong>
          </div>
        ))}
      </div>

      <WaveDivider />
    </section>
  );
}