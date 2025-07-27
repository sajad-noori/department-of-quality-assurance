import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Goal5.css";
const Goal5 = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 900 });
  }, []);
  return (
    <>
      <div className="goal5-container">
        <div className="goal5-bg-animations">
          <div className="goal5-bg-circle circle1"></div>
          <div className="goal5-bg-circle circle2"></div>
          <div className="goal5-bg-circle circle3"></div>
        </div>
        <div className="glowing-border" data-aos="fade-right">
          <h1>رتبه بندی</h1>
          <p>
            ریاست تضمین کیفیت و اعتبار دهی بر اساس شاخص ها و چک لیست های معیاری
            عملکرد مراکز آموزشی را در قبال رعایت ستندرد ها و بهبود کیفیت ارزیابی
            می نماید.{" "}
          </p>
        </div>

        <div className="glowing-border right" data-aos="fade-left">
          <h1>برنامه های آموزشی</h1>
          <p>
            این هدف شامل بازنگری و به‌روزرسانی برنامه‌های درسی مطابق با نیازهای
            روز بازار کار و معیارهای ملی و بین‌المللی می‌باشد. ریاست تضمین کیفیت
            تلاش می‌کند تا محتوای آموزشی در مراکز TVET به‌گونه‌ای طراحی شود که
            مهارت‌های عملی، دانش فنی، و شایستگی‌های مورد نیاز کارفرمایان را در
            بر گیرد.
          </p>
        </div>
      </div>
    </>
  );
};

export default Goal5;
