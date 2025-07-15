import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import {
  FaReply,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaFilter,
  FaSearch,
  FaTimes,
  FaCheck,
  FaClock,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const AnswerToQuestions = () => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userRole, setUserRole] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [submittingEditReply, setSubmittingEditReply] = useState(false);
  const [showReplied, setShowReplied] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date"); // 'date', 'status'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [lastActivity, setLastActivity] = useState(Date.now());
  const searchInputRef = useRef(null);
  const replyTextareaRef = useRef(null);
  const location = useLocation();
  const questionRefs = React.useRef({});
  const [highlightedId, setHighlightedId] = useState(null);

  // Auto-refresh questions every 30 seconds if user is active
  useEffect(() => {
    const timer = setTimeout(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity < 5 * 60 * 1000) {
        // 5 minutes
        fetchQuestions();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [lastActivity]);

  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Check user role and fetch questions
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/questions/auth/check",
          {
            withCredentials: true,
          }
        );
        if (response.data.authenticated) {
          setUserRole(response.data.user.role);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    checkUserRole();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/questions/admin/all?page=${currentPage}&limit=${itemsPerPage}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setQuestions(response.data.data.questions || []);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        setError("خطا در دریافت سوالات");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      if (err.response?.status === 403) {
        setError("شما دسترسی لازم برای مشاهده این صفحه را ندارید");
      } else {
        setError("خطا در دریافت سوالات");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, itemsPerPage]);

  // Scroll to and highlight specific question if requested
  useEffect(() => {
    if (location.state && location.state.scrollToQuestionId) {
      setHighlightedId(location.state.scrollToQuestionId);
      setTimeout(() => {
        const ref = questionRefs.current[location.state.scrollToQuestionId];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
    }
  }, [questions, location.state]);

  const handleReply = async (questionId) => {
    if (!replyText.trim()) {
      alert("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    try {
      setSubmittingReply(true);
      const response = await axios.put(
        `http://localhost:5000/api/questions/admin/${questionId}/reply`,
        {
          answer: replyText.trim(),
          is_faq: true, // Set to true so it appears in FAQ
          status: "replied",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Show success animation
        const textarea = replyTextareaRef.current;
        if (textarea) {
          textarea.style.transform = "scale(1.02)";
          textarea.style.transition = "transform 0.2s ease";
          setTimeout(() => {
            textarea.style.transform = "scale(1)";
          }, 200);
        }

        alert("پاسخ با موفقیت ثبت شد و به سوالات متداول اضافه شد");
        setReplyingTo(null);
        setReplyText("");

        // Refresh questions
        await fetchQuestions();
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("خطا در ثبت پاسخ");
      }
    } finally {
      setSubmittingReply(false);
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
        `http://localhost:5000/api/questions/admin/${questionId}/edit`,
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

        // Refresh questions
        await fetchQuestions();
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
        `http://localhost:5000/api/questions/admin/${questionId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("سوال با موفقیت حذف شد");

        // Refresh questions
        await fetchQuestions();
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

  const handleEditReply = async (questionId) => {
    if (!editReplyText.trim()) {
      alert("لطفاً متن پاسخ را وارد کنید");
      return;
    }

    try {
      setSubmittingEditReply(true);
      const response = await axios.put(
        `http://localhost:5000/api/questions/admin/${questionId}/edit-reply`,
        {
          answer: editReplyText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("پاسخ با موفقیت ویرایش شد");
        setEditingReply(null);
        setEditReplyText("");

        // Refresh questions
        await fetchQuestions();
      }
    } catch (err) {
      console.error("Error editing reply:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("خطا در ویرایش پاسخ");
      }
    } finally {
      setSubmittingEditReply(false);
    }
  };

  const getStatusBadge = (status, isReplied) => {
    if (isReplied) {
      return (
        <span className="badge bg-success d-flex align-items-center gap-1">
          <FaCheck />
          پاسخ داده شده
        </span>
      );
    }

    switch (status) {
      case "pending":
        return (
          <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
            <FaClock />
            در انتظار
          </span>
        );
      case "in_progress":
        return (
          <span className="badge bg-info d-flex align-items-center gap-1">
            <FaSpinner className="spinner" />
            در حال بررسی
          </span>
        );
      case "replied":
        return (
          <span className="badge bg-success d-flex align-items-center gap-1">
            <FaCheck />
            پاسخ داده شده
          </span>
        );
      case "closed":
        return (
          <span className="badge bg-secondary d-flex align-items-center gap-1">
            بسته شده
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary d-flex align-items-center gap-1">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fa-IR");
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "همین الان";
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
    return `${Math.floor(diffInMinutes / 1440)} روز پیش`;
  };

  const filteredAndSortedQuestions = questions
    .filter((question) => {
      // Filter by search query
      if (
        searchQuery &&
        !question.question.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (question.is_replied && !showReplied) return false;
      if (!question.is_replied && !showPending) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.submitted_at);
        const dateB = new Date(b.submitted_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "status") {
        const statusA = a.is_replied ? 1 : 0;
        const statusB = b.is_replied ? 1 : 0;
        return sortOrder === "desc" ? statusB - statusA : statusA - statusB;
      }
      return 0;
    });

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <FaSpinner
            className="spinner text-primary mb-3"
            style={{ fontSize: "2rem" }}
          />
          <p className="text-muted">در حال بارگذاری سوالات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alert alert-danger d-flex align-items-center gap-2"
        role="alert"
      >
        <FaTimes />
        {error}
      </div>
    );
  }

  return (
    <div
      className={`${theme === "dark" ? "dark-container" : "light-container"}`}
      style={{ minHeight: "100vh", padding: 0, margin: 0 }}
    >
      <style>{`
        .dark-container {
          background: #121212;
          color: #ffffff;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .light-container {
          background: #ffffff;
          color: #23283a;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .dark-container .card {
          background: #1e1e1e;
          border-color: #333;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .light-container .card {
          background: #ffffff;
          border-color: #dee2e6;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .dark-container .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .light-container .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .dark-container .card-body {
          color: #ffffff;
        }
        .light-container .card-body {
          color: #23283a;
        }
        .dark-container .form-control {
          background: #2a2a2a;
          border-color: #444;
          color: #ffffff;
        }
        .light-container .form-control {
          background: #ffffff;
          border-color: #ddd;
          color: #23283a;
        }
        .dark-container .btn-outline-primary {
          border-color: #0dcaf0;
          color: #0dcaf0;
        }
        .dark-container .btn-outline-primary:hover {
          background-color: #0dcaf0;
          color: #000;
        }
        .light-container .btn-outline-primary {
          border-color: #0d6efd;
          color: #0d6efd;
        }
        .light-container .btn-outline-primary:hover {
          background-color: #0d6efd;
          color: #ffffff;
        }
        .question-meta {
          font-size: 0.9em;
          color: #666;
          margin-bottom: 10px;
        }
        .dark-container .question-meta {
          color: #aaa;
        }
        .reply-form {
          margin-top: 15px;
          padding: 15px;
          background: rgba(13, 202, 240, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(13, 202, 240, 0.2);
          animation: slideDown 0.3s ease;
        }
        .dark-container .reply-form {
          background: rgba(13, 202, 240, 0.05);
          border-color: rgba(13, 202, 240, 0.3);
        }
        .filters {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(0,0,0,0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .dark-container .filters {
          background: rgba(255,255,255,0.05);
        }
        .filters.collapsed {
          max-height: 60px;
          overflow: hidden;
        }
        .filters.expanded {
          max-height: 200px;
        }
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }
        .pagination-info {
          margin: 0 15px;
          font-size: 0.9em;
        }
        .dark-container .pagination-info {
          color: #aaa;
        }
        .dark-container .alert-info {
          background-color: rgba(13, 202, 240, 0.1);
          border-color: rgba(13, 202, 240, 0.3);
          color: #0dcaf0;
        }
        .light-container .alert-info {
          background-color: #d1ecf1;
          border-color: #bee5eb;
          color: #0c5460;
        }
        .search-container {
          position: relative;
          margin-bottom: 20px;
        }
        .search-input {
          padding-right: 40px;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 0 2px rgba(13, 202, 240, 0.2);
        }
        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        .clear-search:hover {
          color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }
        .sort-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 15px;
        }
        .sort-select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background: #fff;
          color: #333;
        }
        .dark-container .sort-select {
          background: #2a2a2a;
          border-color: #444;
          color: #fff;
        }
        .stats {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .stat-item {
          background: rgba(13, 202, 240, 0.1);
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid rgba(13, 202, 240, 0.2);
          text-align: center;
          min-width: 100px;
        }
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0dcaf0;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #666;
          margin-top: 5px;
        }
        .dark-container .stat-label {
          color: #aaa;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .question-card {
          position: relative;
          overflow: hidden;
        }
        .question-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #0dcaf0 0%, #00b5d7 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .question-card:hover::before {
          opacity: 1;
        }
        .question-card.pending::before {
          background: #ffc107;
        }
        .question-card.replied::before {
          background: #28a745;
        }
        .time-ago {
          font-size: 0.8rem;
          color: #999;
          margin-top: 5px;
        }
        .dark-container .time-ago {
          color: #666;
        }
        .badge {
          font-size: 0.75rem;
          padding: 4px 8px;
        }
        .badge .spinner {
          font-size: 0.7rem;
        }
        .highlighted-question {
          box-shadow: 0 0 0 4px #0dcaf0, 0 0 0 2.5px #0dcaf0;
          border: 2.5px solid #0dcaf0;
          background: #e0f7fa;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div
            className="d-flex justify-content-center align-items-center mb-4"
            style={{ padding: "20px" }}
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-3">
                مدیریت سوالات و پاسخ‌ها
              </h1>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" />
                فیلترها
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div
            className="stats"
            style={{
              padding: "0 20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="stat-item">
              <div className="stat-number">{questions.length}</div>
              <div className="stat-label">کل سوالات</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {questions.filter((q) => !q.is_replied).length}
              </div>
              <div className="stat-label">در انتظار پاسخ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {questions.filter((q) => q.is_replied).length}
              </div>
              <div className="stat-label">پاسخ داده شده</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {questions.filter((q) => q.is_faq).length}
              </div>
              <div className="stat-label">سوالات FAQ</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div
            className={`filters ${showFilters ? "expanded" : "collapsed"}`}
            style={{ margin: "0 20px 20px 20px" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div className="search-container">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control search-input"
                    placeholder="جستجو در سوالات..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateActivity();
                    }}
                  />
                  {searchQuery && (
                    <button
                      className="clear-search"
                      onClick={() => setSearchQuery("")}
                      title="پاک کردن جستجو"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="sort-controls">
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      updateActivity();
                    }}
                  >
                    <option value="date">مرتب‌سازی بر اساس تاریخ</option>
                    <option value="status">مرتب‌سازی بر اساس وضعیت</option>
                  </select>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                      updateActivity();
                    }}
                  >
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </button>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showReplied"
                    checked={showReplied}
                    onChange={(e) => {
                      setShowReplied(e.target.checked);
                      updateActivity();
                    }}
                  />
                  <label className="form-check-label" htmlFor="showReplied">
                    نمایش سوالات پاسخ داده شده
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPending"
                    checked={showPending}
                    onChange={(e) => {
                      setShowPending(e.target.checked);
                      updateActivity();
                    }}
                  />
                  <label className="form-check-label" htmlFor="showPending">
                    نمایش سوالات در انتظار پاسخ
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {filteredAndSortedQuestions.length > 0 ? (
            filteredAndSortedQuestions.map((question, index) => (
              <div
                key={question.id}
                ref={(el) => (questionRefs.current[question.id] = el)}
                className={`card question-card ${
                  question.is_replied ? "replied" : "pending"
                }${
                  highlightedId === question.id ? " highlighted-question" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  margin: "0 20px 20px 20px",
                  ...(highlightedId === question.id
                    ? {
                        boxShadow: "0 0 0 4px #0dcaf0",
                        border: "2.5px solid #0dcaf0",
                        background: "#e0f7fa",
                      }
                    : {}),
                }}
                onClick={updateActivity}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">
                      {editingQuestion === question.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="form-control"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            disabled={submittingEdit}
                          />
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEditQuestion(question.id)}
                            disabled={submittingEdit}
                          >
                            {submittingEdit ? (
                              <FaSpinner className="spinner" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setEditingQuestion(null);
                              setEditText("");
                            }}
                            disabled={submittingEdit}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        question.question
                      )}
                    </h5>
                    <div className="d-flex gap-2">
                      {getStatusBadge(question.status, question.is_replied)}
                      {question.is_faq && (
                        <span className="badge bg-info">FAQ</span>
                      )}
                      {(userRole === "employee" || userRole === "admin") && (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setEditingQuestion(question.id);
                              setEditText(question.question);
                            }}
                            title="ویرایش سوال"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            disabled={deletingQuestion === question.id}
                            title="حذف سوال"
                          >
                            {deletingQuestion === question.id ? (
                              <FaSpinner className="spinner" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="question-meta">
                    <div>
                      <strong>ارسال شده توسط:</strong>{" "}
                      {question.user_name || "کاربر ناشناس"}
                    </div>
                    <div>
                      <strong>تاریخ ارسال:</strong>{" "}
                      {formatDate(question.submitted_at)}
                    </div>
                    <div className="time-ago">
                      {getTimeAgo(question.submitted_at)}
                    </div>
                  </div>

                  {question.answer && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>پاسخ:</strong>
                        {(userRole === "employee" || userRole === "admin") && (
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setEditingReply(question.id);
                              setEditReplyText(question.answer);
                            }}
                            title="ویرایش پاسخ"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
                      {editingReply === question.id ? (
                        <div className="mt-2">
                          <textarea
                            className="form-control mb-2"
                            rows="3"
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                            disabled={submittingEditReply}
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleEditReply(question.id)}
                              disabled={submittingEditReply}
                            >
                              {submittingEditReply ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => {
                                setEditingReply(null);
                                setEditReplyText("");
                              }}
                              disabled={submittingEditReply}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2">{question.answer}</p>
                      )}
                      {question.replied_at && (
                        <small className="text-muted">
                          پاسخ داده شده در: {formatDate(question.replied_at)}
                        </small>
                      )}
                    </div>
                  )}

                  {/* Reply Form for Employees */}
                  {(userRole === "employee" || userRole === "admin") &&
                    !question.is_replied && (
                      <div className="mt-3">
                        {replyingTo === question.id ? (
                          <div className="reply-form">
                            <div className="alert alert-info mb-3">
                              <small>
                                <strong>نکته:</strong> پاسخ شما به عنوان سوال
                                متداول در بخش FAQ نمایش داده خواهد شد.
                              </small>
                            </div>
                            <textarea
                              ref={replyTextareaRef}
                              className="form-control mb-3"
                              rows="4"
                              placeholder="پاسخ خود را اینجا بنویسید..."
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                updateActivity();
                              }}
                              disabled={submittingReply}
                            />
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleReply(question.id)}
                                disabled={submittingReply}
                              >
                                {submittingReply ? (
                                  <>
                                    <FaSpinner className="spinner me-2" />
                                    در حال ارسال...
                                  </>
                                ) : (
                                  <>
                                    <FaReply className="me-2" />
                                    ارسال پاسخ و اضافه به FAQ
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                disabled={submittingReply}
                              >
                                انصراف
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setReplyingTo(question.id);
                              updateActivity();
                            }}
                          >
                            <FaReply className="me-2" />
                            پاسخ به این سوال
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5" style={{ padding: "0 20px" }}>
              <div style={{ color: theme === "dark" ? "#888888" : "#6c757d" }}>
                {searchQuery ? "نتیجه‌ای یافت نشد" : "هیچ سوالی یافت نشد"}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container" style={{ padding: "0 20px" }}>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  updateActivity();
                }}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              <div className="pagination-info">
                صفحه {currentPage} از {totalPages}
              </div>

              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  updateActivity();
                }}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerToQuestions;
