import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaCheckCircle,
  FaUsers,
  FaClipboardCheck,
  FaGraduationCap,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Banner.css";

// ─── Pure Quranic Text Panels ─────────────────────────────────────────────────

const Slide1Panel = () => (
  <div className="quran-panel">
    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>

    <div className="quran-panel__verse quran-panel__verse--hero">
      <p className="quran-panel__arabic quran-panel__arabic--bismillah">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>

    <div className="quran-panel__ornament quran-panel__ornament--light" aria-hidden="true">
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">✦</span>
      <span className="quran-panel__rule" />
    </div>

    <div className="quran-panel__verse">
      <p className="quran-panel__arabic quran-panel__arabic--lg">
        ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ
      </p>
      <p className="quran-panel__arabic quran-panel__arabic--md quran-panel__arabic--dim">
        لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ
      </p>
      <p className="quran-panel__ref">﴿ آية الكرسي — البقرة: ٢٥٥ ﴾</p>
    </div>

    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>
  </div>
);

const Slide2Panel = () => (
  <div className="quran-panel">
    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>

    <div className="quran-panel__verse">
      <p className="quran-panel__arabic quran-panel__arabic--xl">
        ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ
      </p>
      <p className="quran-panel__arabic quran-panel__arabic--md quran-panel__arabic--dim">
        خَلَقَ ٱلْإِنسَٰنَ مِنْ عَلَقٍ
      </p>
      <p className="quran-panel__ref">﴿ سورة العلق: ١ — ٢ ﴾</p>
    </div>

    <div className="quran-panel__ornament quran-panel__ornament--light" aria-hidden="true">
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">✦</span>
      <span className="quran-panel__rule" />
    </div>

    <div className="quran-panel__verse quran-panel__verse--hero">
      <p className="quran-panel__arabic quran-panel__arabic--bismillah">
        رَّبِّ زِدْنِى عِلْمًا
      </p>
      <p className="quran-panel__ref">﴿ سورة طه: ١١٤ ﴾</p>
    </div>

    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>
  </div>
);

const Slide3Panel = () => (
  <div className="quran-panel">
    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>

    <div className="quran-panel__verse">
      <p className="quran-panel__arabic quran-panel__arabic--md quran-panel__arabic--dim">
        إِنَّمَا يَخْشَى ٱللَّهَ مِنْ عِبَادِهِ
      </p>
      <p className="quran-panel__arabic quran-panel__arabic--bismillah quran-panel__arabic--accent">
        ٱلْعُلَمَٰٓؤُاْ
      </p>
      <p className="quran-panel__ref">﴿ سورة فاطر: ٢٨ ﴾</p>
    </div>

    <div className="quran-panel__ornament quran-panel__ornament--light" aria-hidden="true">
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">✦</span>
      <span className="quran-panel__rule" />
    </div>

    <div className="quran-panel__verse quran-panel__verse--hero">
      <p className="quran-panel__arabic quran-panel__arabic--xl">
        الْعِلْمُ نُورٌ
      </p>
      <p className="quran-panel__arabic quran-panel__arabic--md quran-panel__arabic--dim">
        وَالْجَهْلُ ظُلْمَةٌ
      </p>
    </div>

    <div className="quran-panel__ornament" aria-hidden="true">
      <span className="quran-panel__diamond">◆</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__rosette">❈</span>
      <span className="quran-panel__rule" />
      <span className="quran-panel__diamond">◆</span>
    </div>
  </div>
);

// ─── Slide Data ───────────────────────────────────────────────────────────────

const slidesData = [
  {
    panel: Slide1Panel,
    label: "آیات قرآنی — بسم الله و آیة الکرسی",
    title: "ریاست تضمین کیفیت و اعتباردهی",
    slogans: [
      "تضمین کیفیت؛ مسیر آموزش بهتر",
      "ارتقاء ستندردهای آموزشی",
      "نظارت مستمر و علمی",
    ],
    description:
      "مأموریت ما بهبود کیفیت آموزش‌های تخنیکی و مسلکی از طریق ارزیابی، نظارت و همکاری مستمر با مؤسسات آموزشی است.",
  },
  {
    panel: Slide2Panel,
    label: "آیات قرآنی — سورة العلق و طه",
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
    panel: Slide3Panel,
    label: "آیات قرآنی — سورة فاطر و العلم نور",
    title: "علوم و تکنالوژی",
    slogans: [
      "پیشرفت علمی و تکنالوژی",
      "نوآوری در آموزش",
      "تحقیق و توسعه",
    ],
    description: "ما به توسعه علوم و فناوری و ترویج نوآوری در آموزش متعهدیم.",
  },
];

const stats = [
  { icon: FaUsers,          label: "مؤسسات تحت نظارت",     value: "۳۶۰+" },
  { icon: FaClipboardCheck, label: "ارزیابی‌های انجام‌شده",  value: "۰+"   },
  { icon: FaGraduationCap,  label: "فارغ‌التحصیلان موفق",   value: "۰+"   },
  { icon: FaCheckCircle,    label: "رضایت آموزشی",          value: "۶۵٪"  },
];

const SLIDE_DURATION = 7000;

// ─── Wave Divider ─────────────────────────────────────────────────────────────

const WaveDivider = () => (
  <div className="banner__wave" aria-hidden="true">
    <svg viewBox="0 0 1440 320" width="100%" height="110"
      preserveAspectRatio="none" style={{ display: "block" }}>
      <path fill="#0dcaf0" fillOpacity="1"
        d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,186.7C672,213,768,235,864,218.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      <path fill="#00b5d7" fillOpacity="0.7"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      <path fill="#a9e5ff" fillOpacity="0.5"
        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,250.7C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
    </svg>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Banner() {
  const { theme } = useTheme();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const typedRef    = useRef(null);
  const typedEl     = useRef(null);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slidesData.length);
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    if (!isHovered) startTimer();
    else if (intervalRef.current) clearInterval(intervalRef.current);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && !isHovered) startTimer();
      else if (intervalRef.current) clearInterval(intervalRef.current);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isHovered, startTimer]);

  useEffect(() => {
    let mounted = true;
    if (typedRef.current) { typedRef.current.destroy(); typedRef.current = null; }

    import("typed.js")
      .then((module) => {
        if (!mounted || !typedEl.current) return;
        typedRef.current = new module.default(typedEl.current, {
          strings:        slidesData[current].slogans,
          typeSpeed:      50,
          backSpeed:      30,
          backDelay:      2500,
          loop:           true,
          showCursor:     true,
          cursorChar:     "|",
          smartBackspace: true,
        });
      })
      .catch((err) => {
        if (mounted && typedEl.current)
          typedEl.current.textContent = slidesData[current].slogans[0];
        console.error("Typed.js failed:", err);
      });

    return () => {
      mounted = false;
      if (typedRef.current) { typedRef.current.destroy(); typedRef.current = null; }
    };
  }, [current]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
    if (!isHovered) startTimer();
  }, [isHovered, startTimer]);

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

        {/* Text column */}
        <div className="banner__text">
          <small className="banner__subtitle">اداره تعلیمات تخنیکی و مسلکی</small>
          <h1 className="banner__title">{slidesData[current].title}</h1>
          <p className="banner__typed" aria-live="polite" aria-atomic="true" ref={typedEl} />
          <p className="banner__description">{slidesData[current].description}</p>

          <ul className="banner__list">
            {[
              "حمایت از آموزش معیاری",
              "ارتقاء مهارت‌های نیروی کار",
              "ارزیابی‌های دوره‌ای و تخصصی",
            ].map((item) => (
              <li key={item} className="banner__list-item">
                <FaCheckCircle aria-hidden="true" className="banner__icon" />
                {item}
              </li>
            ))}
          </ul>

          <div className="banner__buttons">
            <a href="/profile"          className="btn btn--primary">پروسه تضمین کیفیت</a>
            <a href="#feedback-section" className="btn btn--outline">تماس با ما</a>
          </div>
        </div>

        {/* Quranic text panel column */}
        <div
          className="banner__panel-wrapper"
          role="region"
          aria-label={slidesData[current].label}
        >
          {slidesData.map((slide, index) => {
            const Panel    = slide.panel;
            const isActive = index === current;
            return (
              <div
                key={index}
                className={`banner__panel-slide ${isActive ? "banner__panel-slide--active" : ""}`}
                aria-hidden={!isActive}
              >
                <Panel />
              </div>
            );
          })}

          <div className="banner__progress">
            {slidesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`banner__progress-dot ${index === current ? "banner__progress-dot--active" : ""}`}
                aria-label={`اسلاید ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Stats bar */}
      <div className="banner__stats" aria-label="آمارها">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="banner__stat">
            <span className="banner__stat-icon" aria-hidden="true"><Icon /></span>
            <span className="banner__stat-label">{label}:</span>{" "}
            <strong className="banner__stat-value">{value}</strong>
          </div>
        ))}
      </div>

      <WaveDivider />
    </section>
  );
}
