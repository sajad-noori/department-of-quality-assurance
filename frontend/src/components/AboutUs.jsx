import React, { useEffect, useRef } from 'react';
import {
  FaCheckCircle,
  FaBullseye,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaStar,
  FaHandHoldingHeart,
  FaGlobeAmericas,
  FaBookOpen,
} from 'react-icons/fa';
import styles from '../styles/AboutUs.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const sectionsData = [
  {
    icon: <FaShieldAlt />, title: 'ریاست تضمین کیفیت',
    desc: 'ریاست تضمین کیفیت به عنوان یک بخش حیاتی در اداره تعلیمات تخنیکی و مسلکی فعالیت می‌کند. وظیفه این ریاست تضمین و ارتقاء سطح کیفیت آموزش‌ها، برنامه‌ها و خدمات ارائه شده در مؤسسات TVET می‌باشد. هدف اصلی ما تضمین تطابق آموزش‌ها با معیارهای ملی و بین‌المللی کیفیت است.',
    img: '/images/quality-assurance.svg', imgAlt: 'نماد تضمین کیفیت',
    aria: 'ریاست تضمین کیفیت',
  },
  {
    icon: <FaBullseye />, title: 'ماموریت',
    desc: 'ماموریت ریاست تضمین کیفیت عبارت است از ایجاد سیستم‌های پایدار برای نظارت، ارزیابی و بهبود مستمر کیفیت در مؤسسات تعلیمات تخنیکی و مسلکی در سراسر کشور. این ریاست با استفاده از معیارها و رهنمودهای استاندارد، نقش مهمی در ارتقای ظرفیت آموزشی و اطمینان از برابری فرصت‌ها ایفا می‌کند.',
    img: '/images/mission.svg', imgAlt: 'نماد ماموریت',
    aria: 'ماموریت',
  },
  {
    icon: <FaStar />, title: 'اهداف کلان',
    desc: null,
    list: [
      'توسعه و بهبود مستمر سیستم‌های تضمین کیفیت در مؤسسات TVET',
      'اجرای ارزیابی‌های دقیق و علمی بر برنامه‌های آموزشی و استادان',
      'حمایت از برنامه‌های ارتقای ظرفیت برای کارکنان آموزشی و مدیریتی',
      'ایجاد شفافیت و اعتماد در ارائه خدمات آموزشی',
      'تشویق نوآوری و استفاده از فناوری‌های نوین در آموزش',
    ],
    listIcon: <FaCheckCircle />,
    img: '/images/goals.svg', imgAlt: 'نماد اهداف کلان',
    aria: 'اهداف کلان',
  },
  {
    icon: <FaUsers />, title: 'ارزش‌ها',
    desc: 'ما به ارزش‌های زیر پایبندیم:',
    list: [
      ['شفافیت و پاسخگویی', <FaHandshake key="handshake" />],
      ['تعهد به کیفیت و استانداردها', <FaShieldAlt key="shield" />],
      ['کار تیمی و همکاری موثر', <FaUsers key="users" />],
      ['احترام به تنوع فرهنگی و نیازهای محلی', <FaGlobeAmericas key="globe" />],
      ['پیشرفت و یادگیری مداوم', <FaBookOpen key="book" />],
    ],
    img: '/images/values.svg', imgAlt: 'نماد ارزش‌ها',
    aria: 'ارزش‌ها',
  },
];

export default function AboutUs() {
  const bgRef = useRef(null);
  const [mouse, setMouse] = React.useState({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const navigate = useNavigate();
  const location = useLocation();

  // Always set dark mode
  useEffect(() => {
    document.body.dataset.theme = 'dark';
  }, []);

  // Animated background: parallax blobs + floating SVGs
  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let blobs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 90 + Math.random() * 70,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      color: `hsla(${200 + i * 20}, 70%, 30%, 0.22)`
    }));
    let animId;
    function animate() {
      // Smoothly interpolate mouse position
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * 0.07;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * 0.07;
      ctx.clearRect(0, 0, width, height);
      blobs.forEach(b => {
        // Parallax effect
        const px = b.x + (smoothMouse.current.x - 0.5) * 60;
        const py = b.y + (smoothMouse.current.y - 0.5) * 60;
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.shadowBlur = 0;
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = height + b.r;
        if (b.y > height + b.r) b.y = -b.r;
      });
      animId = requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Mouse move for parallax (update targetMouse only)
  useEffect(() => {
    const handleMouse = e => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Section reveal animation
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.reveal}`);
    const onScroll = () => {
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          section.classList.add(styles.visible);
          section.style.transitionDelay = `${idx * 0.15}s`;
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Floating SVG shapes
  const floatingSVGs = [
    <svg key="float1" className={styles.floatingSvg} style={{ top: '10%', left: '8%' }} width="60" height="60"><circle cx="30" cy="30" r="28" fill="#6ec1e4" opacity="0.18" /></svg>,
    <svg key="float2" className={styles.floatingSvg} style={{ top: '70%', left: '80%' }} width="80" height="80"><rect x="10" y="10" width="60" height="60" rx="18" fill="#f7b267" opacity="0.13" /></svg>,
    <svg key="float3" className={styles.floatingSvg} style={{ top: '50%', left: '20%' }} width="50" height="50"><polygon points="25,5 45,45 5,45" fill="#b388ff" opacity="0.15" /></svg>,
    <svg key="float4" className={styles.floatingSvg} style={{ top: '20%', left: '70%' }} width="70" height="70"><ellipse cx="35" cy="35" rx="30" ry="18" fill="#ff8a65" opacity="0.12" /></svg>,
  ];

  // SVG illustrations for each section
  const sectionSVGs = [
    // Quality Assurance (Shield/Medal)
    <svg key="svg-shield" className={styles.sectionSvg} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shieldBg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#6ec1e4" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#23283a" stopOpacity="0.2"/>
        </radialGradient>
      </defs>
      <path d="M40 10 L70 20 Q70 50 40 70 Q10 50 10 20 Z" fill="url(#shieldBg)" stroke="#3b82f6" strokeWidth="2.5"/>
      <circle cx="40" cy="35" r="10" fill="#b388ff" stroke="#fff" strokeWidth="2"/>
      <path d="M40 45 L40 62" stroke="#ff8a65" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="65" r="3" fill="#ff8a65"/>
    </svg>,
    // Mission (Target/Arrow)
    <svg key="svg-target" className={styles.sectionSvg} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#23283a" stroke="#6ec1e4" strokeWidth="3"/>
      <circle cx="40" cy="40" r="18" fill="#181c24" stroke="#b388ff" strokeWidth="2"/>
      <circle cx="40" cy="40" r="7" fill="#ff8a65"/>
      <path d="M60 20 L75 5" stroke="#ff8a65" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="75,5 70,18 62,10" fill="#ff8a65"/>
    </svg>,
    // Goals (Star/Trophy)
    <svg key="svg-star" className={styles.sectionSvg} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,15 47,35 68,35 51,48 58,68 40,56 22,68 29,48 12,35 33,35" fill="#b388ff" stroke="#fff" strokeWidth="2"/>
      <ellipse cx="40" cy="73" rx="18" ry="4" fill="#23283a" opacity="0.3"/>
    </svg>,
    // Values (Hands/Heart/Globe)
    <svg key="svg-values" className={styles.sectionSvg} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="30" ry="18" fill="#6ec1e4" opacity="0.18"/>
      <path d="M25 50 Q40 70 55 50" stroke="#b388ff" strokeWidth="3" fill="none"/>
      <path d="M32 45 Q40 60 48 45" stroke="#ff8a65" strokeWidth="2.5" fill="none"/>
      <circle cx="40" cy="38" r="7" fill="#ff8a65" stroke="#fff" strokeWidth="2"/>
      <path d="M40 31 Q38 35 40 38 Q42 35 40 31 Z" fill="#fff"/>
    </svg>
  ];

  // Handler for feedback CTA
  const handleFeedbackClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById("feedback-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      const el = document.getElementById("feedback-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.aboutUsRoot} dir="rtl" aria-label="درباره ما">
      {/* Animated background */}
      <canvas ref={bgRef} className={styles.aboutUsAnimatedBg} aria-hidden="true" />
      {floatingSVGs.map((svg) => svg)}
      <h1 className={styles.aboutUsTitle} tabIndex={0}>درباره ما</h1>
      {sectionsData.map((section, idx) => (
        <section
          key={section.title}
          className={`${styles.aboutUsSection} ${styles.aboutUsVisible} ${styles.aboutUsCard}`}
          tabIndex={0}
          aria-label={section.aria}
        >
          <div className={styles.aboutUsCardContent}>
            <h2 className={styles.aboutUsHeading}>
              <span
                className={styles.aboutUsIconWrapper}
                tabIndex={0}
                aria-label={`نماد ${section.title}`}
              >
                {/* Animated icon */}
                <span className={styles.aboutUsAnimatedIcon}>{section.icon}</span>
              </span>
              {section.title}
            </h2>
            {section.desc && <p className={styles.aboutUsParagraph}>{section.desc}</p>}
            {section.list && (
              <ul className={styles.aboutUsList}>
                {section.list.map((item, i) => (
                  <li key={Array.isArray(item) ? item[0] : item || i}>
                    <span className={styles.aboutUsIconWrapper}>
                      <span className={styles.aboutUsAnimatedIcon}>{Array.isArray(item) ? item[1] : section.listIcon}</span>
                    </span>
                    {Array.isArray(item) ? item[0] : item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.aboutUsCardImageWrap}>
            {sectionSVGs[idx]}
          </div>
        </section>
      ))}
      {/* Call to Action */}
      <div className={styles.aboutUsCtaSection}>
        <h3 className={styles.aboutUsCtaTitle}>آیا نظری یا پیشنهادی دارید؟</h3>
        <a
          href="#feedback-section"
          className={styles.aboutUsCtaButton}
          aria-label="ارسال بازخورد"
          onClick={handleFeedbackClick}
        >
          <span className={styles.aboutUsCtaButtonText}>ارسال بازخورد</span>
          <FaHandHoldingHeart className={styles.aboutUsCtaIcon} />
        </a>
      </div>
    </div>
  );
}
