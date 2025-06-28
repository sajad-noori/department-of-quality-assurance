import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Menu.module.css";
import { FaWhatsapp, FaFacebookF, FaYoutube, FaXTwitter, FaEnvelope } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
    label: "آموزش و ارتقای ظرفیت",
    submenu: [
      "برنامههای آموزشی استادان و کارمندان",
      "ورکشاپها و سیمینارها",
      "دورههای ارتقای ظرفیت تخنیکی و مسلکی",
      "برنامههای آنلاین آموزشی",
      "اسناد و منابع آموزشی قابل دانلود",
      "تقویم آموزشها",
      "فرصتهای آموزشی ملی و بینالمللی",
      "گزارش فعالیتهای آموزشی گذشته",
    ],
  },
  {
    label: "مرکز اسناد و دانلود ها",
    submenu: [
      "رهنمود ها",
      "فورم ها",
      "اسناد تقنینی"
    ],
  },
  { label: "اخبار و رویداد های", submenu: [] },
  { label: "تماس با ما", submenu: [] },
  { label: "درباره ما", submenu: [] },
];

export default function MenuWithUtilityBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const translateInitialized = useRef(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only initialize once
    if (translateInitialized.current) {
      return;
    }

    console.log('Setting up Google Translate...');

    // Clear the container element gently
    const existingElement = document.getElementById('google_translate_element');
    if (existingElement) {
      existingElement.innerHTML = '';
    }

    // Define the initialization function
    window.googleTranslateElementInit = function() {
      console.log('Google Translate callback executed');
      try {
        if (window.google && window.google.translate) {
          console.log('Creating TranslateElement with languages: ar,ar-SA,fa,ps');
          new window.google.translate.TranslateElement({
            pageLanguage: 'fa',
            includedLanguages: 'ar,ar-SA,fa,ps',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          }, 'google_translate_element');
          console.log('TranslateElement created successfully');
          translateInitialized.current = true;
          
          // Debug: Check what languages are available after a short delay
          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
              console.log('Available languages in dropdown:', selectElement.innerHTML);
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error creating TranslateElement:', error);
      }
    };

    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      console.log('Google Translate already available, calling init directly');
      window.googleTranslateElementInit();
      return;
    }

    // Only add script if it doesn't exist
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
      console.log('Google Translate script added');
    } else {
      console.log('Google Translate script already exists');
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
          setUserName('');
        }
      } catch (err) {
        setIsLoggedIn(false);
        setProfileImage(null);
        setUserName('');
      }
    };
    checkAuth();
  }, []);

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
        navigate("/documents/form");
        break;
      case "اسناد تقنینی":
        navigate("/documents/legal-doc");
        break;
      case "برنامههای آموزشی استادان و کارمندان":
        navigate("/training/teacher-staff-programs");
        break;
      case "ورکشاپها و سیمینارها":
        navigate("/training/workshops-seminars");
        break;
      case "دورههای ارتقای ظرفیت تخنیکی و مسلکی":
        navigate("/training/technical-capacity-courses");
        break;
      case "برنامههای آنلاین آموزشی":
        navigate("/training/online-programs");
        break;
      case "اسناد و منابع آموزشی قابل دانلود":
        navigate("/training/downloadable-resources");
        break;
      case "تقویم آموزشها":
        navigate("/training/calendar");
        break;
      case "فرصتهای آموزشی ملی و بینالمللی":
        navigate("/training/national-international-opportunities");
        break;
      case "گزارش فعالیتهای آموزشی گذشته":
        navigate("/training/past-activities-report");
        break;
      default:
        console.log("Clicked submenu:", label);
        break;
    }
  };

  return (
    <>
      <div className={styles.utilityBar} dir="rtl">
        <div className={styles.socialIcons}>
          <a href="" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaXTwitter />
          </a>
        </div>
        <div className={styles.languageOptions}>
          <div id="google_translate_element"></div>
        </div>
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
                  src={`http://localhost:5000${profileImage}`}
                  alt={`پروفایل ${userName}`}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <FaUserCircle 
                size={32} 
                style={{ 
                  display: profileImage ? 'none' : 'block',
                }} 
              />
            </button>
          ) : (
            <button className={styles.loginBtn} onClick={() => navigate("/login")}>
              ورود
            </button>
          )}

          <div className={styles.email}>
            <a href="mailto:sajadnooribayany2@gmail.com" target="_blank" rel="noopener noreferrer">
              <FaEnvelope />
            </a>
            <a href="mailto:sajadnooribayany2@gmail.com" target="_blank" rel="noopener noreferrer">
              sajadnooribayany2@gmail.com
            </a>
          </div>
        </div>
      </div>

      <nav className={styles.navbar} ref={menuRef} dir="rtl">
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
          <li>
            <img
              src={require("../assets/Emblem_of_the_Islamic_Emirate_of_Afghanistan.png")}
              alt="لوگو"
              className={styles.logo}
            />
          </li>

          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className={styles.menuItem}
              data-open={dropdownOpen === idx ? "true" : "false"}
            >
              {item.label === "درباره ما" ? (
                <Link to="/about" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ) : item.label === "اخبار و رویداد های" ? (
                <a href="#news-section" className={styles.menuLink} onClick={handleNewsClick}>
                  {item.label}
                </a>
              ) : item.label === "تماس با ما" ? (
                <a href="#feedback-section" className={styles.menuLink} onClick={handleFeedBackClick}>
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
                  {item.submenu.length > 0 && <span className={styles.caret}>▼</span>}
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

          <li>
            <img
              src={require("../assets/tveta-logo-new.png")}
              alt="لوگو"
              className={styles.logo}
            />
          </li>
        </ul>
      </nav>
    </>
  );
}
