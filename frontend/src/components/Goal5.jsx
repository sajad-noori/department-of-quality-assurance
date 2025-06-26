import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/Goal5.css"
const Goal5 = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 900 });
  }, []);
  return (
    <>
      <div className='goal5-container'>
        <div className="goal5-bg-animations">
          <div className="goal5-bg-circle circle1"></div>
          <div className="goal5-bg-circle circle2"></div>
          <div className="goal5-bg-circle circle3"></div>
        </div>
        <div className="glowing-border" data-aos="fade-right">
          <h1>اعتبارسنجی و درجه‌بندی مراکز آموزشی</h1>
          <p>با استفاده از شاخص‌ها و چک‌لیست‌های معیاری، ریاست تضمین کیفیت مراکز را ارزیابی نموده و براساس عملکرد آن‌ها درجه‌بندی می‌نماید. این روند باعث رقابت سالم، انگیزش مراکز، و ارتقاء مستمر کیفیت می‌گردد.</p>
        </div>

        <div className="glowing-border right" data-aos="fade-left">
          <h1>ارتقاء کیفیت برنامه‌های آموزشی</h1>
          <p>این هدف شامل بازنگری و به‌روزرسانی برنامه‌های درسی مطابق با نیازهای روز بازار کار و معیارهای ملی و بین‌المللی می‌باشد. ریاست تضمین کیفیت تلاش می‌کند تا محتوای آموزشی در مراکز TVET به‌گونه‌ای طراحی شود که مهارت‌های عملی، دانش فنی، و شایستگی‌های مورد نیاز کارفرمایان را در بر گیرد.</p>
        </div>
      </div>
    </>
  );
};

export default Goal5;