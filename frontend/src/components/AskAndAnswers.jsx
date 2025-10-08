import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestion,
  FaTimes,
  FaSearch,
  FaPaperPlane,
  FaSpinner,
  FaKeyboard,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { containsBadWords } from "../utils/badWordsFilter";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AskAndAnswers = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [userQuestions, setUserQuestions] = useState([]);
  const [faqQuestions, setFaqQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("faq");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [questionFocused, setQuestionFocused] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [autoCollapse, setAutoCollapse] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const questionTextareaRef = useRef(null);
  const widgetRef = useRef(null);
  const location = useLocation();
  const questionRefs = useRef({});
  const [highlightedQuestionId, setHighlightedQuestionId] = useState(null);

  // Auto-collapse widget after 5 minutes of inactivity
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        const timeSinceActivity = Date.now() - lastActivity;
        if (timeSinceActivity > 5 * 60 * 1000) {
          // 5 minutes
          setIsExpanded(false);
          setAutoCollapse(true);
          setTimeout(() => setAutoCollapse(false), 1000);
        }
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [isExpanded, lastActivity]);

  // Update activity timestamp
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isExpanded) return;

      // Escape to close widget
      if (e.key === "Escape") {
        setIsExpanded(false);
        return;
      }

      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Ctrl/Cmd + Enter to submit question
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && questionFocused) {
        e.preventDefault();
        handleSubmitQuestion(e);
        return;
      }

      // Tab navigation
      if (e.key === "Tab") {
        updateActivity();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isExpanded, questionFocused]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/questions/auth/check`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch FAQ questions
  useEffect(() => {
    const fetchFAQQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/questions/faq`,
          {
            withCredentials: true,
          }
        );
        setFaqQuestions(response.data.data || []);
      } catch (err) {
        console.error("Error fetching FAQ questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQQuestions();
  }, []);

  // Fetch user questions when authenticated
  useEffect(() => {
    const fetchUserQuestions = async () => {
      if (!isAuthenticated) {
        setUserQuestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/questions/user/questions`,
          {
            withCredentials: true,
          }
        );
        setUserQuestions(response.data.data || []);
      } catch (err) {
        console.error("Error fetching user questions:", err);
        setUserQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuestions();
  }, [isAuthenticated]);

  // Scroll to and highlight specific question if requested
  useEffect(() => {
    if (location.state && location.state.scrollToQuestionId) {
      setIsExpanded(true);
      setActiveTab("my-questions");
      setHighlightedQuestionId(location.state.scrollToQuestionId);
      setTimeout(() => {
        const ref = questionRefs.current[location.state.scrollToQuestionId];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
      // Remove highlight after 3 seconds
      setTimeout(() => setHighlightedQuestionId(null), 3400);
    }
  }, [userQuestions, location.state]);

  const handleLoginRedirect = () => {
    navigate("/login");
    setIsExpanded(false);
  };

  // Filter FAQ data for search
  const filteredFaqData = faqQuestions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.answer &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter user questions for search
  const filteredUserQuestions = userQuestions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.answer &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    updateActivity();

    if (!isAuthenticated) {
      alert("برای ارسال سوال، لطفاً ابتدا وارد حساب کاربری خود شوید.");
      handleLoginRedirect();
      return;
    }

    if (userQuestion.trim()) {
      if (containsBadWords(userQuestion)) {
        alert(
          "سوال شما حاوی کلمات نامناسب است. لطفاً سوال خود را بدون توهین ارسال کنید."
        );
        return;
      }
      try {
        setSubmitting(true);
        const response = await axios.post(
          `${API_BASE_URL}/api/questions/submit`,
          {
            question: userQuestion.trim(),
            category: "general",
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // Show success animation
          const textarea = questionTextareaRef.current;
          if (textarea) {
            textarea.style.transform = "scale(1.02)";
            textarea.style.transition = "transform 0.2s ease";
            setTimeout(() => {
              textarea.style.transform = "scale(1)";
            }, 200);
          }

          alert(response.data.message);
          setUserQuestion("");

          // Refresh user questions
          const userQuestionsResponse = await axios.get(
            `${API_BASE_URL}/api/questions/user/questions`,
            {
              withCredentials: true,
            }
          );
          setUserQuestions(userQuestionsResponse.data.data || []);
          setActiveTab("my-questions");
        }
      } catch (err) {
        console.error("Error submitting question:", err);
        if (err.response?.data?.message) {
          alert(err.response.data.message);
        } else {
          alert("خطا در ارسال سوال. لطفاً دوباره تلاش کنید.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditQuestion = async (questionId) => {
    if (!editText.trim()) {
      alert("لطفاً متن سوال را وارد کنید");
      return;
    }

    try {
      setSubmittingEdit(true);
      const response = await axios.put(
        `${API_BASE_URL}/api/questions/user/${questionId}/edit`,
        {
          question: editText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("سوال با موفقیت ویرایش شد");
        setEditingQuestion(null);
        setEditText("");

        // Refresh user questions
        const userQuestionsResponse = await axios.get(
          `${API_BASE_URL}/api/questions/user/questions`,
          {
            withCredentials: true,
          }
        );
        setUserQuestions(userQuestionsResponse.data.data || []);
      }
    } catch (err) {
      console.error("Error editing question:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("خطا در ویرایش سوال");
      }
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این سوال را حذف کنید؟")) {
      return;
    }

    try {
      setDeletingQuestion(questionId);
      const response = await axios.delete(
        `${API_BASE_URL}/api/questions/user/${questionId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("سوال با موفقیت حذف شد");

        // Refresh user questions
        const userQuestionsResponse = await axios.get(
          `${API_BASE_URL}/api/questions/user/questions`,
          {
            withCredentials: true,
          }
        );
        setUserQuestions(userQuestionsResponse.data.data || []);
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("خطا در حذف سوال");
      }
    } finally {
      setDeletingQuestion(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fa-IR");
  };

  const handleExpand = () => {
    setIsExpanded(true);
    updateActivity();
    // Focus search after a short delay
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchQuery("");
    setUserQuestion("");
  };

  return (
    <>
      {/* Floating FAQ Widget */}
      <div
        ref={widgetRef}
        className={`faq-widget ${isExpanded ? "expanded" : ""} ${
          autoCollapse ? "auto-collapse" : ""
        }`}
        data-theme={theme}
        onClick={updateActivity}
      >
        {!isExpanded ? (
          // Collapsed state - small floating button
          <button
            className="faq-widget-toggle"
            onClick={handleExpand}
            title="سوالات متداول (Ctrl+K)"
          >
            <FaQuestion />
            <span>سوال دارید؟</span>
          </button>
        ) : (
          // Expanded state - full FAQ interface
          <div className="faq-widget-content">
            <div className="faq-widget-header">
              <h3>سوالات متداول</h3>
              <div className="header-actions">
                <button
                  className="keyboard-shortcuts-btn"
                  onClick={() =>
                    setShowKeyboardShortcuts(!showKeyboardShortcuts)
                  }
                  title="کلیدهای میانبر"
                >
                  <FaKeyboard />
                </button>
                <button
                  className="faq-widget-close"
                  onClick={handleClose}
                  title="بستن (Esc)"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Help */}
            {showKeyboardShortcuts && (
              <div className="keyboard-shortcuts">
                <h4>کلیدهای میانبر</h4>
                <div className="shortcuts-list">
                  <div>
                    <kbd>Esc</kbd> بستن ویجت
                  </div>
                  <div>
                    <kbd>Ctrl+K</kbd> تمرکز روی جستجو
                  </div>
                  <div>
                    <kbd>Ctrl+Enter</kbd> ارسال سوال
                  </div>
                  <div>
                    <kbd>Tab</kbd> حرکت بین بخش‌ها
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="faq-search">
              <div
                className={`search-input-wrapper ${
                  searchFocused ? "focused" : ""
                }`}
              >
                <FaSearch className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="جستجو در سوالات... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateActivity();
                  }}
                  onFocus={() => {
                    setSearchFocused(true);
                    updateActivity();
                  }}
                  onBlur={() => setSearchFocused(false)}
                  className="faq-search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                    title="پاک کردن جستجو"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="faq-tabs">
              <button
                className={`faq-tab ${activeTab === "faq" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("faq");
                  updateActivity();
                }}
              >
                سوالات متداول
                {faqQuestions.length > 0 && (
                  <span className="tab-count">{faqQuestions.length}</span>
                )}
              </button>
              <button
                className={`faq-tab ${
                  activeTab === "my-questions" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("my-questions");
                  updateActivity();
                }}
              >
                سوالات من
                {userQuestions.length > 0 && (
                  <span className="tab-count">{userQuestions.length}</span>
                )}
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="faq-loading">
                <FaSpinner className="spinner" />
                <span>در حال بارگذاری...</span>
              </div>
            )}

            {/* FAQ List */}
            {!loading && activeTab === "faq" && (
              <div className="faq-list">
                {filteredFaqData.length > 0 ? (
                  filteredFaqData.map((item, index) => (
                    <div
                      key={item.id}
                      className="faq-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="faq-question">
                        <span className="faq-question-text">
                          {item.question}
                        </span>
                      </div>
                      <div className="faq-answer">
                        <p className="faq-answer-text">{item.answer}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    {searchQuery ? (
                      <div>
                        <FaSearch className="no-results-icon" />
                        <p>نتیجه‌ای برای &quot;{searchQuery}&quot; یافت نشد</p>
                        <button
                          className="clear-search-link"
                          onClick={() => setSearchQuery("")}
                        >
                          پاک کردن جستجو
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaQuestion className="no-results-icon" />
                        <p>هیچ سوالی موجود نیست</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Questions List */}
            {!loading && activeTab === "my-questions" && (
              <div className="faq-list">
                {filteredUserQuestions.length > 0 ? (
                  filteredUserQuestions.map((item, index) => (
                    <div
                      key={item.id}
                      ref={(el) => (questionRefs.current[item.id] = el)}
                      className={`faq-item user-question${
                        highlightedQuestionId === item.id
                          ? " highlighted-question"
                          : ""
                      }`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        ...(highlightedQuestionId === item.id
                          ? {
                              border: "2.5px solid #ffe066",
                              boxShadow: "0 0 0 4px #ffe066",
                              background: "#333300",
                            }
                          : {}),
                      }}
                    >
                      <div className="faq-question">
                        <div className="faq-question-header">
                          <div className="faq-question-content">
                            {editingQuestion === item.id ? (
                              <div className="edit-question-form">
                                <textarea
                                  className="edit-question-textarea"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  disabled={submittingEdit}
                                  rows="2"
                                />
                                <div className="edit-actions">
                                  <button
                                    className="save-edit-btn"
                                    onClick={() => handleEditQuestion(item.id)}
                                    disabled={submittingEdit}
                                  >
                                    {submittingEdit ? (
                                      <FaSpinner className="spinner" />
                                    ) : (
                                      <FaEdit />
                                    )}
                                  </button>
                                  <button
                                    className="cancel-edit-btn"
                                    onClick={() => {
                                      setEditingQuestion(null);
                                      setEditText("");
                                    }}
                                    disabled={submittingEdit}
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="faq-question-text">
                                {item.question}
                              </span>
                            )}
                          </div>
                          <div className="faq-status">
                            <div className="status-actions">
                              <span
                                className={`status-badge ${
                                  item.is_replied ? "replied" : "pending"
                                }`}
                              >
                                {item.status_text ||
                                  (item.is_replied
                                    ? "پاسخ داده شده"
                                    : "در انتظار پاسخ")}
                              </span>
                              {!item.is_replied && (
                                <div className="question-actions">
                                  <button
                                    className="edit-question-btn"
                                    onClick={() => {
                                      setEditingQuestion(item.id);
                                      setEditText(item.question);
                                    }}
                                    title="ویرایش سوال"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="delete-question-btn"
                                    onClick={() =>
                                      handleDeleteQuestion(item.id)
                                    }
                                    disabled={deletingQuestion === item.id}
                                    title="حذف سوال"
                                  >
                                    {deletingQuestion === item.id ? (
                                      <FaSpinner className="spinner" />
                                    ) : (
                                      <FaTrash />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                            <span className="faq-timestamp">
                              {formatDate(item.submitted_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="faq-answer">
                        <p className="faq-answer-text">
                          {item.answer ||
                            "سوال شما دریافت شد و در حال بررسی است. به زودی پاسخ خواهید گرفت."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    {searchQuery ? (
                      <div>
                        <FaSearch className="no-results-icon" />
                        <p>نتیجه‌ای برای &quot;{searchQuery}&quot; یافت نشد</p>
                        <button
                          className="clear-search-link"
                          onClick={() => setSearchQuery("")}
                        >
                          پاک کردن جستجو
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaQuestion className="no-results-icon" />
                        <p>هیچ سوالی ارسال نکرده‌اید</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ask Your Question Section */}
            <div className="ask-question-section">
              <h4>سوال خود را بپرسید</h4>
              {isCheckingAuth ? (
                <div className="auth-checking">
                  <FaSpinner className="spinner" />
                  <span>در حال بررسی وضعیت ورود...</span>
                </div>
              ) : isAuthenticated ? (
                <form
                  onSubmit={handleSubmitQuestion}
                  className="ask-question-form"
                >
                  <div
                    className={`question-input-wrapper ${
                      questionFocused ? "focused" : ""
                    }`}
                  >
                    <textarea
                      ref={questionTextareaRef}
                      value={userQuestion}
                      onChange={(e) => {
                        setUserQuestion(e.target.value);
                        updateActivity();
                      }}
                      onFocus={() => {
                        setQuestionFocused(true);
                        updateActivity();
                      }}
                      onBlur={() => setQuestionFocused(false)}
                      placeholder="سوال خود را اینجا بنویسید... (Ctrl+Enter برای ارسال)"
                      className="question-textarea"
                      rows="3"
                      disabled={submitting}
                    />
                    <div className="question-actions">
                      <span className="char-count">
                        {userQuestion.length}/500
                      </span>
                      <button
                        type="submit"
                        className="submit-question-btn"
                        disabled={submitting || !userQuestion.trim()}
                      >
                        {submitting ? (
                          <>
                            <FaSpinner className="spinner" />
                            در حال ارسال...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            ارسال سوال
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="login-required">
                  <p>برای ارسال سوال، لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
                  <button onClick={handleLoginRedirect} className="login-btn">
                    ورود به حساب کاربری
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .faq-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: calc(100vw - 40px);
          max-height: calc(100vh - 40px);
        }

        .faq-widget-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0dcaf0 0%, #00b5d7 100%);
          color: #030305;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(13, 202, 240, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }

        .faq-widget-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(13, 202, 240, 0.5);
          background: linear-gradient(135deg, #00b5d7 0%, #0dcaf0 100%);
        }

        .faq-widget-toggle:active {
          transform: translateY(0);
        }


        .faq-widget.expanded {
          bottom: 20px;
          right: 20px;
          width: min(400px, calc(100vw - 40px));
          max-height: min(600px, calc(100vh - 40px));
          animation: expandWidget 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-widget.auto-collapse {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes expandWidget {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .faq-widget-content {
          background: #121212;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          max-height: min(600px, calc(100vh - 40px));
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(13, 202, 240, 0.2);
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Light mode styles */
        [data-theme="light"] .faq-widget-content {
          background: #ffffff;
          border: 1px solid rgba(13, 202, 240, 0.3);
        }

        .faq-widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #0dcaf0 0%, #00b5d7 100%);
          color: #030305;
          flex-shrink: 0;
        }

        .faq-widget-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .keyboard-shortcuts-btn {
          background: none;
          border: none;
          color: #030305;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .keyboard-shortcuts-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .faq-widget-close {
          background: none;
          border: none;
          color: #030305;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .faq-widget-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .keyboard-shortcuts {
          padding: 15px 20px;
          background: rgba(13, 202, 240, 0.1);
          border-bottom: 1px solid rgba(13, 202, 240, 0.2);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .keyboard-shortcuts h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #0dcaf0;
        }

        .shortcuts-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
        }

        .shortcuts-list div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        kbd {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 10px;
          font-family: monospace;
        }

        .faq-search {
          padding: 16px 20px;
          border-bottom: 1px solid #333;
          background: #1a1a1a;
          flex-shrink: 0;
        }

        /* Light mode search */
        [data-theme="light"] .faq-search {
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .search-input-wrapper.focused {
          transform: scale(1.02);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          color: #0dcaf0;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .faq-search-input {
          width: 100%;
          padding: 10px 40px 10px 12px;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          background: #2a2a2a;
          color: #eee;
        }

        /* Light mode input */
        [data-theme="light"] .faq-search-input {
          border: 1px solid #ddd;
          background: #ffffff;
          color: #333;
        }

        .faq-search-input:focus {
          border-color: #0dcaf0;
          box-shadow: 0 0 0 2px rgba(13, 202, 240, 0.2);
        }

        .clear-search-btn {
          position: absolute;
          left: 12px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }

        .faq-tabs {
          display: flex;
          justify-content: center;
          padding: 16px 20px;
          border-bottom: 1px solid #333;
          background: #1a1a1a;
          flex-shrink: 0;
        }

        /* Light mode tabs */
        [data-theme="light"] .faq-tabs {
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .faq-tab {
          background: none;
          border: none;
          color: #0dcaf0;
          cursor: pointer;
          font-size: 14px;
          padding: 8px 16px;
          margin: 0 8px;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .faq-tab:hover {
          color: #00b5d7;
        }

        .faq-tab.active {
          border-bottom-color: #0dcaf0;
          color: #00b5d7;
        }

        .tab-count {
          background: rgba(13, 202, 240, 0.2);
          color: #0dcaf0;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
        }

        .faq-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          color: #0dcaf0;
          font-size: 14px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .faq-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 20px;
          max-height: min(300px, calc(50vh - 50px));
          background: #121212;
          min-height: 0;
        }

        /* Light mode list */
        [data-theme="light"] .faq-list {
          background: #ffffff;
        }

        .faq-item {
          margin: 12px 0;
          border: 1px solid #333;
          border-radius: 8px;
          overflow: hidden;
          background: #1a1a1a;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .faq-item:nth-child(1) { animation-delay: 0.1s; }
        .faq-item:nth-child(2) { animation-delay: 0.2s; }
        .faq-item:nth-child(3) { animation-delay: 0.3s; }
        .faq-item:nth-child(4) { animation-delay: 0.4s; }
        .faq-item:nth-child(5) { animation-delay: 0.5s; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Light mode item */
        [data-theme="light"] .faq-item {
          border: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .faq-question {
          padding: 12px 16px;
          background: #2a2a2a;
          border-bottom: 1px solid #333;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .faq-question:hover {
          background: #333;
        }

        /* Light mode question */
        [data-theme="light"] .faq-question {
          background: #ffffff;
          border-bottom: 1px solid #e0e0e0;
        }

        [data-theme="light"] .faq-question:hover {
          background: #f8f9fa;
        }

        .faq-question-text {
          font-weight: 600;
          color: #0dcaf0;
          font-size: 14px;
        }

        .faq-question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .faq-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .status-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #ffc107;
          color: #000;
        }

        .status-badge.replied {
          background: #28a745;
          color: #fff;
        }

        .faq-timestamp {
          font-size: 11px;
          color: #666;
          opacity: 0.7;
        }

        /* Light mode timestamp */
        [data-theme="light"] .faq-timestamp {
          color: #999;
        }

        .user-question {
          border-left: 3px solid #0dcaf0;
        }

        .user-question .faq-question {
          background: #2a2a2a;
          border-bottom: 1px solid #333;
        }

        /* Light mode user question */
        [data-theme="light"] .user-question .faq-question {
          background: #ffffff;
          border-bottom: 1px solid #e0e0e0;
        }

        .user-question .faq-question-text {
          color: #00b5d7;
          flex: 1;
          margin-left: 8px;
        }

        .faq-answer {
          padding: 12px 16px;
          background: #1a1a1a;
        }

        /* Light mode answer */
        [data-theme="light"] .faq-answer {
          background: #ffffff;
        }

        .faq-answer-text {
          margin: 0;
          color: #a9e5ff;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Light mode answer text */
        [data-theme="light"] .faq-answer-text {
          color: #333;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #a9e5ff;
          font-style: italic;
        }

        /* Light mode no results */
        [data-theme="light"] .no-results {
          color: #666;
        }

        .no-results-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .clear-search-link {
          background: none;
          border: none;
          color: #0dcaf0;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 8px;
          font-size: 12px;
        }

        .clear-search-link:hover {
          color: #00b5d7;
        }

        .ask-question-section {
          padding: 16px 20px;
          border-top: 1px solid #333;
          background: #1a1a1a;
          flex-shrink: 0;
        }

        /* Light mode ask section */
        [data-theme="light"] .ask-question-section {
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .ask-question-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #0dcaf0;
        }

        .ask-question-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .question-input-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }

        .question-input-wrapper.focused {
          transform: scale(1.01);
        }

        .question-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #333;
          border-radius: 8px;
          resize: vertical;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          background: #2a2a2a;
          color: #eee;
          min-height: 80px;
        }

        .question-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Light mode textarea */
        [data-theme="light"] .question-textarea {
          border: 1px solid #ddd;
          background: #ffffff;
          color: #333;
        }

        .question-textarea:focus {
          border-color: #0dcaf0;
          box-shadow: 0 0 0 2px rgba(13, 202, 240, 0.2);
        }

        .question-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .char-count {
          font-size: 12px;
          color: #666;
        }

        [data-theme="light"] .char-count {
          color: #999;
        }

        .submit-question-btn {
          background: linear-gradient(135deg, #0dcaf0 0%, #00b5d7 100%);
          color: #030305;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .submit-question-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .submit-question-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
          background: linear-gradient(135deg, #00b5d7 0%, #0dcaf0 100%);
        }

        .submit-question-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-checking {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0dcaf0;
          font-size: 14px;
        }

        .login-required {
          text-align: center;
          padding: 16px;
        }

        .login-required p {
          margin-bottom: 12px;
          color: #a9e5ff;
          font-size: 14px;
        }

        /* Light mode login required text */
        [data-theme="light"] .login-required p {
          color: #666;
        }

        .login-btn {
          background: linear-gradient(135deg, #0dcaf0 0%, #00b5d7 100%);
          color: #030305;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
          background: linear-gradient(135deg, #00b5d7 0%, #0dcaf0 100%);
        }

        /* Scrollbar styling */
        .faq-list::-webkit-scrollbar {
          width: 6px;
        }

        .faq-list::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }

        /* Light mode scrollbar track */
        [data-theme="light"] .faq-list::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .faq-list::-webkit-scrollbar-thumb {
          background: #0dcaf0;
          border-radius: 3px;
        }

        .faq-list::-webkit-scrollbar-thumb:hover {
          background: #00b5d7;
        }

        /* Edit and Delete functionality styles */
        .faq-question-content {
          flex: 1;
          margin-left: 8px;
        }

        .edit-question-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .edit-question-textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #333;
          border-radius: 6px;
          resize: vertical;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: all 0.3s ease;
          background: #2a2a2a;
          color: #eee;
          min-height: 60px;
        }

        /* Light mode textarea */
        [data-theme="light"] .edit-question-textarea {
          border: 1px solid #ddd;
          background: #ffffff;
          color: #333;
        }

        .edit-question-textarea:focus {
          border-color: #0dcaf0;
          box-shadow: 0 0 0 2px rgba(13, 202, 240, 0.2);
        }

        .edit-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .save-edit-btn, .cancel-edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .save-edit-btn {
          color: #28a745;
        }

        .save-edit-btn:hover {
          background: rgba(40, 167, 69, 0.1);
        }

        .cancel-edit-btn {
          color: #dc3545;
        }

        .cancel-edit-btn:hover {
          background: rgba(220, 53, 69, 0.1);
        }

        .status-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .question-actions {
          display: flex;
          gap: 4px;
        }

        .edit-question-btn, .delete-question-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .edit-question-btn {
          color: #ffc107;
        }

        .edit-question-btn:hover {
          background: rgba(255, 193, 7, 0.1);
        }

        .delete-question-btn {
          color: #dc3545;
        }

        .delete-question-btn:hover {
          background: rgba(220, 53, 69, 0.1);
        }

        .edit-question-btn:disabled, .delete-question-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .faq-widget.expanded {
            width: calc(100vw - 32px);
            right: 16px;
            bottom: 16px;
            max-height: calc(100vh - 32px);
          }
        }

        @media (max-width: 768px) {
          .faq-widget {
            bottom: 16px;
            right: 16px;
          }

          .faq-widget-toggle {
            padding: 10px 16px;
            font-size: 13px;
          }

          .faq-widget.expanded {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 12px;
            max-height: calc(100vh - 24px);
          }

          .faq-widget-content {
            max-height: calc(100vh - 24px);
          }

          .faq-widget-header {
            padding: 16px;
          }

          .faq-widget-header h3 {
            font-size: 16px;
          }

          .faq-search {
            padding: 12px 16px;
          }

          .faq-tabs {
            padding: 12px 16px;
          }

          .faq-tab {
            padding: 6px 12px;
            margin: 0 4px;
            font-size: 13px;
          }

          .faq-list {
            padding: 0 16px;
            max-height: calc(50vh - 40px);
          }

          .ask-question-section {
            padding: 12px 16px;
          }

          .ask-question-section h4 {
            font-size: 14px;
          }

          .shortcuts-list {
            grid-template-columns: 1fr;
          }

          .status-actions {
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }

          .question-actions {
            gap: 2px;
          }
        }

        @media (max-width: 480px) {
          .faq-widget {
            bottom: 12px;
            right: 12px;
          }

          .faq-widget-toggle {
            padding: 8px 12px;
            font-size: 12px;
            gap: 6px;
          }

          .faq-widget.expanded {
            width: calc(100vw - 16px);
            right: 8px;
            bottom: 8px;
            max-height: calc(100vh - 16px);
          }

          .faq-widget-content {
            max-height: calc(100vh - 16px);
            border-radius: 12px;
          }

          .faq-widget-header {
            padding: 12px;
          }

          .faq-widget-header h3 {
            font-size: 14px;
          }

          .faq-search {
            padding: 8px 12px;
          }

          .faq-search-input {
            padding: 8px 32px 8px 10px;
            font-size: 13px;
          }

          .faq-tabs {
            padding: 8px 12px;
          }

          .faq-tab {
            padding: 4px 8px;
            margin: 0 2px;
            font-size: 12px;
          }

          .tab-count {
            font-size: 9px;
            padding: 1px 4px;
          }

          .faq-list {
            padding: 0 12px;
            max-height: calc(40vh - 30px);
          }

          .faq-item {
            margin: 8px 0;
            border-radius: 6px;
          }

          .faq-question {
            padding: 10px 12px;
          }

          .faq-question-text {
            font-size: 13px;
          }

          .faq-answer {
            padding: 10px 12px;
          }

          .faq-answer-text {
            font-size: 12px;
          }

          .ask-question-section {
            padding: 8px 12px;
          }

          .ask-question-section h4 {
            font-size: 13px;
            margin-bottom: 8px;
          }

          .question-textarea {
            padding: 8px;
            font-size: 13px;
            min-height: 60px;
          }

          .submit-question-btn {
            padding: 8px 12px;
            font-size: 12px;
          }

          .status-badge {
            font-size: 9px;
            padding: 1px 4px;
          }

          .faq-timestamp {
            font-size: 10px;
          }

          .keyboard-shortcuts {
            padding: 10px 12px;
          }

          .keyboard-shortcuts h4 {
            font-size: 12px;
          }

          .shortcuts-list {
            font-size: 11px;
            gap: 6px;
          }

          kbd {
            padding: 1px 4px;
            font-size: 9px;
          }
        }

        @media (max-width: 320px) {
          .faq-widget {
            bottom: 8px;
            right: 8px;
          }

          .faq-widget-toggle {
            padding: 6px 10px;
            font-size: 11px;
            gap: 4px;
          }

          .faq-widget.expanded {
            width: calc(100vw - 12px);
            right: 6px;
            bottom: 6px;
            max-height: calc(100vh - 12px);
          }

          .faq-widget-content {
            max-height: calc(100vh - 12px);
            border-radius: 8px;
          }

          .faq-widget-header {
            padding: 8px;
          }

          .faq-widget-header h3 {
            font-size: 12px;
          }

          .faq-search {
            padding: 6px 8px;
          }

          .faq-search-input {
            padding: 6px 28px 6px 8px;
            font-size: 12px;
          }

          .faq-tabs {
            padding: 6px 8px;
          }

          .faq-tab {
            padding: 3px 6px;
            margin: 0 1px;
            font-size: 11px;
          }

          .faq-list {
            padding: 0 8px;
            max-height: calc(35vh - 25px);
          }

          .faq-item {
            margin: 6px 0;
          }

          .faq-question {
            padding: 8px 10px;
          }

          .faq-question-text {
            font-size: 12px;
          }

          .faq-answer {
            padding: 8px 10px;
          }

          .faq-answer-text {
            font-size: 11px;
          }

          .ask-question-section {
            padding: 6px 8px;
          }

          .ask-question-section h4 {
            font-size: 12px;
            margin-bottom: 6px;
          }

          .question-textarea {
            padding: 6px;
            font-size: 12px;
            min-height: 50px;
          }

          .submit-question-btn {
            padding: 6px 10px;
            font-size: 11px;
          }

          .char-count {
            font-size: 10px;
          }

          .no-results {
            padding: 20px 10px;
          }

          .no-results-icon {
            font-size: 32px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default AskAndAnswers;
