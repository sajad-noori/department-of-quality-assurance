import React, { useState } from "react";
import "../styles/FeedbackSection.css";

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const { firstName, lastName, email, message } = formData;

    if (firstName.trim().length < 2) {
      alert("اسم باید حداقل ۲ حرف داشته باشد.");
      return false;
    }

    if (lastName.trim().length < 2) {
      alert("تخلص باید حداقل ۲ حرف داشته باشد.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("لطفاً یک ایمیل معتبر وارد کنید.");
      return false;
    }

    if (message.trim().length === 0) {
      alert("پیام نمی‌تواند خالی باشد.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert("پیام شما با موفقیت ارسال شد. تشکر!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        alert("خطا در ارسال پیام. لطفاً دوباره کوشش کنید.");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("خطا در اتصال به سرور.");
    }

    setSubmitting(false);
  };

  return (
    <section className="feedback-section" id="feedback-section">
      <h2 className="feedback-heading">ارسال باز خورد</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>اسم</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label>تخلص</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label>ایمل آدرس</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label>پیام شما</label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={submitting}
          ></textarea>
        </div>
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "در حال ارسال..." : "ارسال پیام"}
        </button>
      </form>
    </section>
  );
};

export default FeedbackSection;
