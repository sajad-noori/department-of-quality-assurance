import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Menu.module.css";
import {
  FaWhatsapp,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { useState as useReactState } from "react";
import { FaBell } from "react-icons/fa";
import { questionnairesAPI } from "../api/questionnaires";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  // {
  //   label: "معیار ها و رهنمود ها",
  //   submenu: [
  //     "رهنمود ارزیابی موؤسسات TVET",
  //     "رهنمود ارزیابی برنامههای آموزشی",
  //     "رهنمود ارزیابی استادان و مربیان",
  //     "رهنمود گزارش خودارزیابی",
  //     "رهنمود کارآموزی و آموزش عملی",
  //     "رهنمود اعتباردهی موؤسسات",
  //     "پلان استراتیژیک کیفیت",
  //     "فورمها و چکلیستها",
  //     "مفاهیم اساسی تضمین کیفیت",
  //     "معیارهای ملی تضمین کیفیت",
  //   ],
  // },
  // {
  //   label: "گزارش ها و نشرات",
  //   submenu: [
  //     "گزارشهای سالانه کیفیت",
  //     "گزارشهای ارزیابی موؤسسات",
  //     "گزارشهای خودارزیابی (Self-Assessment)",
  //     "نشرات علمی و تخنیکی",
  //     "بولتنها و خبرنامها",
  //     "راپورهای بازدید و نظارت",
  //     "تحلیلها و یافتههای آماری",
  //     "کتبچهها و بروشورهای آموزشی",
  //   ],
  // },
  {
    label: "آموزش",
    submenu: [
      "برنامه های آموزشی استادان و کارمندان",
      "ورکشاپ ها",
      "سیمینارها",
      "برنامه های آنلاین آموزشی",
    ],
  },
  {
    label: "مرکز اسناد",
    submenu: [
      "ستندرد ها",
      "رهنمود ها",
      "اسناد تقنینی",
      "فورم ها",
      "چک لیست ها",
      "پرسش نامه ها",
    ],
  },

  {
    label: "زون",
    submenu: [],
  },

  { label: "اخبار و اطلاعات", submenu: [] },
  { label: "تماس با ما", submenu: [] },
  { label: "درباره ما", submenu: ["چارت تشکیلاتی", "درباره ما"] },
];

export default function MenuWithUtilityBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const translateInitialized = useRef(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();
  const [animating, setAnimating] = useReactState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only initialize once
    if (translateInitialized.current) {
      return;
    }

    console.log("Setting up Google Translate...");

    // Clear the container element gently
    const existingElement = document.getElementById("google_translate_element");
    if (existingElement) {
      existingElement.innerHTML = "";
    }

    // Define the initialization function
    window.googleTranslateElementInit = function () {
      console.log("Google Translate callback executed");
      try {
        if (window.google && window.google.translate) {
          console.log(
            "Creating TranslateElement with languages: ar,ar-SA,fa,ps"
          );
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "fa",
              includedLanguages: "ar,ar-SA,fa,ps",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
          console.log("TranslateElement created successfully");
          translateInitialized.current = true;

          // Debug: Check what languages are available after a short delay
          setTimeout(() => {
            const selectElement = document.querySelector(".goog-te-combo");
            if (selectElement) {
              console.log(
                "Available languages in dropdown:",
                selectElement.innerHTML
              );
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Error creating TranslateElement:", error);
      }
    };

    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      console.log("Google Translate already available, calling init directly");
      window.googleTranslateElementInit();
      return;
    }

    // Only add script if it doesn't exist
    const existingScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
      console.log("Google Translate script added");
    } else {
      console.log("Google Translate script already exists");
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        if (res.data?.user) {
          setIsLoggedIn(true);
          setUserName(res.data.user.name);
          // Set profile image if available
          if (res.data.user.profileImage) {
            setProfileImage(res.data.user.profileImage);
          } else {
            setProfileImage(null);
          }
        } else {
          setIsLoggedIn(false);
          setProfileImage(null);
          setUserName("");
        }
      } catch (err) {
        setIsLoggedIn(false);
        setProfileImage(null);
        setUserName("");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    let isMounted = true;
    async function fetchNotifications() {
      try {
        // 1. Unchecked filled questionnaires
        let totalUncheckedFilledCount = 0;
        try {
          const res = await questionnairesAPI.getTotalUncheckedFilledCount();
          if (res.success) totalUncheckedFilledCount = res.data.count || 0;
        } catch {}
        // 2. Unanswered news comments (only count recent ones from last 2 months)
        let unansweredNewsComments = 0;
        try {
          const res = await axios.get("/api/comments/all-news-comments", {
            withCredentials: true,
          });
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

          const recentUnanswered = res.data.filter((comment) => {
            const commentDate = new Date(comment.created_at);
            return (
              (!comment.reply_count || comment.reply_count === 0) &&
              commentDate >= twoMonthsAgo
            );
          });

          unansweredNewsComments = recentUnanswered.length;
        } catch (error) {
          console.error("Error fetching news comments:", error);
        }
        // 3. Unanswered questions (only count recent ones from last 2 months)
        let unansweredQuestionsCount = 0;
        try {
          const res = await axios.get("/api/questions/admin/all", {
            withCredentials: true,
          });
          if (res.data.success && Array.isArray(res.data.data.questions)) {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

            unansweredQuestionsCount = res.data.data.questions.filter(
              (question) => {
                const questionDate = new Date(
                  question.submitted_at || question.created_at
                );
                return !question.is_replied && questionDate >= twoMonthsAgo;
              }
            ).length;
          }
        } catch (error) {
          console.error("Error fetching unanswered questions:", error);
        }
        const sum =
          totalUncheckedFilledCount +
          unansweredNewsComments +
          unansweredQuestionsCount;
        if (isMounted) setNotificationCount(sum);
      } catch {}
    }
    async function fetchUserNotifications() {
      try {
        // Fetch replied questions (unseen answers)
        const qRes = await axios.get("/api/questions/user/unseen-answers", {
          withCredentials: true,
        });
        let questionReplies = [];
        if (qRes.data.success && Array.isArray(qRes.data)) {
          questionReplies = qRes.data.data;
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data)
        ) {
          questionReplies = qRes.data.data;
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data.questions)
        ) {
          questionReplies = qRes.data.data.questions;
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data)
        ) {
          questionReplies = qRes.data.data;
        } else if (qRes.data.success && qRes.data.data) {
          questionReplies = qRes.data.data;
        }
        // Fetch replied comments
        const cRes = await axios.get("/api/comments/my/replied", {
          withCredentials: true,
        });
        let commentReplies = [];
        if (
          cRes.data.success &&
          cRes.data.data &&
          Array.isArray(cRes.data.data.comments)
        ) {
          commentReplies = cRes.data.data.comments;
        } else if (cRes.data.success && Array.isArray(cRes.data.data)) {
          commentReplies = cRes.data.data;
        }
        // Count unseen
        const unseenQuestions = questionReplies.filter(
          (q) => !q.answer_seen
        ).length;
        const unseenComments = commentReplies.filter(
          (c) => !c.reply_seen
        ).length;
        if (isMounted) setNotificationCount(unseenQuestions + unseenComments);
      } catch {}
    }
    if (user && (user.role === "user" || user.role === "institute")) {
      fetchUserNotifications();
    } else {
      fetchNotifications();
    }
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(null);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewsClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const section = document.getElementById("news-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const section = document.getElementById("news-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  const handleFeedBackClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const section = document.getElementById("feedback-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const section = document.getElementById("feedback-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  const handleSubmenuClick = (label) => {
    switch (label) {
      case "رهنمود ها":
        navigate("/documents/guideline");
        break;
      case "فورم ها":
        navigate("/questionnaires?category=form");
        break;
      case "اسناد تقنینی":
        navigate("/documents/legal-doc");
        break;
      case "ستندرد ها":
        navigate("/documents/standards");
        break;
      case "چک لیست ها":
        navigate("/questionnaires?category=check-list");
        break;
      case "پرسش نامه ها":
        navigate("/questionnaires?category=questionnaire");
        break;
      case "برنامه های آموزشی استادان و کارمندان":
        navigate("/training/teacher-staff-programs");
        break;
      case "ورکشاپ ها":
        navigate("/training/workshops");
        break;
      case "سیمینارها":
        navigate("/training/seminars");
        break;
      case "برنامه های آنلاین آموزشی":
        navigate("/training/online-programs");
        break;
      case "زون":
        navigate("/map");
        break;
      case "چارت تشکیلاتی":
        navigate("/organizational-chart");
        break;
      case "درباره ما":
        navigate("/about");
        break;
      default:
        console.log("Clicked submenu:", label);
        break;
    }
  };

  const handleThemeToggle = () => {
    setAnimating(true);
    toggleTheme();
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <>
      <div className={styles.utilityBar} dir="rtl">
        <div className={styles.socialIcons}>
          <a
            href="https://wa.me/+93778558968"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.youtube.com/@TVETA-t9q"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="https://x.com/DQATVETA">
            <FaXTwitter />
          </a>
        </div>
        <div className={styles.languageOptions}>
          <div id="google_translate_element"></div>
        </div>
        {/* Modern bell/notification icon - moved to the right of theme toggle */}
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            fontSize: 0,
            position: "relative",
          }}
          aria-label="Notifications"
          title="اعلان‌ها"
          onClick={() => navigate("/notifications")}
        >
          <FaBell size={28} color={theme === "dark" ? "#0dcaf0" : "#23283a"} />
          {notificationCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                minWidth: 14,
                height: 14,
                background: "#dc3545",
                color: "#fff",
                borderRadius: "50%",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                boxShadow: "0 0 0 2px #fff",
                zIndex: 10,
                padding: "0 3px",
                lineHeight: 1,
              }}
            >
              {notificationCount}
            </span>
          )}
        </button>
        <button
          className={`${styles.themeToggleBtn} ${
            animating ? styles.themeToggleBtnAnimating : ""
          }`}
          onClick={handleThemeToggle}
          aria-label={
            theme === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"
          }
          title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
          style={{ margin: "0 1rem", cursor: "pointer", position: "relative" }}
        >
          {/* Animated SVG icons for sun/moon with logical colors */}
          {theme === "dark" ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0dcaf0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 0.4s",
                transform: animating ? "rotate(-180deg) scale(1.2)" : "none",
              }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffd700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 0.4s",
                transform: animating ? "rotate(180deg) scale(1.2)" : "none",
              }}
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
        <div className={styles.rightOptions}>
          {isLoggedIn ? (
            <button
              className={styles.loginBtn}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "18px",
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "inherit",
                padding: 0,
              }}
              onClick={() => navigate("/profile")}
              title={`مشاهده پروفایل ${userName}`}
            >
              {profileImage ? (
                <img
                  src={`http://localhost:3000${profileImage}`}
                  alt={`پروفایل ${userName}`}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <FaUserCircle
                size={32}
                style={{
                  display: profileImage ? "none" : "block",
                }}
              />
            </button>
          ) : (
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              ورود
            </button>
          )}

          <div className={styles.email}>
            <a
              href="mailto:quality.assurance@tveta.gov.af"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope />
            </a>
            <a
              href="mailto:quality.assurance@tveta.gov.af"
              target="_blank"
              rel="noopener noreferrer"
            >
              quality.assurance@tveta.gov.af
            </a>
          </div>
        </div>
      </div>

      <nav className={styles.navbar} ref={menuRef} dir="rtl">
        <img
          src={require("../assets/Emblem_of_the_Islamic_Emirate_of_Afghanistan.png")}
          alt="لوگو"
          className={styles.logo + " " + styles.leftLogo}
        />
        <button
          className={styles.toggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        </button>

        <ul className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}>
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className={`${styles.menuItem} ${
                item.label === "زون" ? styles.hideOnMobile : ""
              }`}
              data-open={dropdownOpen === idx ? "true" : "false"}
            >
              {item.label === "اخبار و اطلاعات" ? (
                <a
                  href="#news-section"
                  className={styles.menuLink}
                  onClick={handleNewsClick}
                >
                  {item.label}
                </a>
              ) : item.label === "تماس با ما" ? (
                <a
                  href="#feedback-section"
                  className={styles.menuLink}
                  onClick={handleFeedBackClick}
                >
                  {item.label}
                </a>
              ) : item.label === "زون" ? (
                <a href="/map" className={styles.menuLink}>
                  {item.label}
                </a>
              ) : (
                <a
                  href="#"
                  className={styles.menuLink}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.submenu.length > 0) toggleDropdown(idx);
                    else setMenuOpen(false);
                  }}
                >
                  {item.label}
                  {item.submenu.length > 0 && (
                    <span className={styles.caret}>▼</span>
                  )}
                </a>
              )}

              {item.submenu.length > 0 && (
                <ul
                  className={`${styles.submenu} ${
                    dropdownOpen === idx ? styles.submenuOpen : ""
                  }`}
                >
                  {item.submenu.map((subitem, sidx) => (
                    <li key={sidx} className={styles.submenuItem}>
                      <a
                        href="#"
                        className={styles.submenuLink}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmenuClick(subitem);
                          setMenuOpen(false);
                        }}
                      >
                        {subitem}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <img
          src={require("../assets/tveta-logo-new.png")}
          alt="لوگو"
          className={styles.logo + " " + styles.rightLogo}
        />
      </nav>
    </>
  );
}
