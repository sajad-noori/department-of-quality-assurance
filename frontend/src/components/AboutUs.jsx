import React, { useEffect } from 'react';
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

export default function AboutUs() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.fadeIn}`);

    const onScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          section.classList.add(styles.visible);
        }
      });
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>درباره ما</h1>

      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div>
          <h2 className={styles.heading}>
            <FaShieldAlt className={styles.icon} />
            ریاست تضمین کیفیت
          </h2>
          <p className={styles.paragraph}>
            ریاست تضمین کیفیت به عنوان یک بخش حیاتی در اداره تعلیمات تخنیکی و مسلکی فعالیت می‌کند. 
            وظیفه این ریاست تضمین و ارتقاء سطح کیفیت آموزش‌ها، برنامه‌ها و خدمات ارائه شده در مؤسسات TVET می‌باشد.
            هدف اصلی ما تضمین تطابق آموزش‌ها با معیارهای ملی و بین‌المللی کیفیت است.
          </p>
        </div>
        <div>
          <img
            src="/images/quality-assurance.svg"
            alt="نماد تضمین کیفیت"
            className={styles.image}
            loading="lazy"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div>
          <h2 className={styles.heading}>
            <FaBullseye className={styles.icon} />
            ماموریت
          </h2>
          <p className={styles.paragraph}>
            ماموریت ریاست تضمین کیفیت عبارت است از ایجاد سیستم‌های پایدار برای نظارت، ارزیابی و بهبود مستمر کیفیت 
            در مؤسسات تعلیمات تخنیکی و مسلکی در سراسر کشور.
            این ریاست با استفاده از معیارها و رهنمودهای استاندارد، نقش مهمی در ارتقای ظرفیت آموزشی و اطمینان از برابری فرصت‌ها ایفا می‌کند.
          </p>
        </div>
        <div>
          <img
            src="/images/mission.svg"
            alt="نماد ماموریت"
            className={styles.image}
            loading="lazy"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div>
          <h2 className={styles.heading}>
            <FaStar className={styles.icon} />
            اهداف کلان
          </h2>
          <ul className={styles.list}>
            <li><FaCheckCircle className={styles.listIcon} /> توسعه و بهبود مستمر سیستم‌های تضمین کیفیت در مؤسسات TVET</li>
            <li><FaCheckCircle className={styles.listIcon} /> اجرای ارزیابی‌های دقیق و علمی بر برنامه‌های آموزشی و استادان</li>
            <li><FaCheckCircle className={styles.listIcon} /> حمایت از برنامه‌های ارتقای ظرفیت برای کارکنان آموزشی و مدیریتی</li>
            <li><FaCheckCircle className={styles.listIcon} /> ایجاد شفافیت و اعتماد در ارائه خدمات آموزشی</li>
            <li><FaCheckCircle className={styles.listIcon} /> تشویق نوآوری و استفاده از فناوری‌های نوین در آموزش</li>
          </ul>
        </div>
        <div>
          <img
            src="/images/goals.svg"
            alt="نماد اهداف کلان"
            className={styles.image}
            loading="lazy"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div>
          <h2 className={styles.heading}>
            <FaUsers className={styles.icon} />
            ارزش‌ها
          </h2>
          <p className={styles.paragraph}>ما به ارزش‌های زیر پایبندیم:</p>
          <ul className={styles.list}>
            <li><FaHandshake className={styles.listIcon} /> شفافیت و پاسخگویی</li>
            <li><FaShieldAlt className={styles.listIcon} /> تعهد به کیفیت و استانداردها</li>
            <li><FaUsers className={styles.listIcon} /> کار تیمی و همکاری موثر</li>
            <li><FaGlobeAmericas className={styles.listIcon} /> احترام به تنوع فرهنگی و نیازهای محلی</li>
            <li><FaBookOpen className={styles.listIcon} /> پیشرفت و یادگیری مداوم</li>
          </ul>
        </div>
        <div>
          <img
            src="/images/values.svg"
            alt="نماد ارزش‌ها"
            className={styles.image}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
