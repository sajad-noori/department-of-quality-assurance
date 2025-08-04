import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

// Helper to count unanswered comments
export function countUnansweredComments(comments) {
  return comments.filter((c) => !c.reply_count || c.reply_count === 0).length;
}

const NewsCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyForms, setReplyForms] = useState(new Set());
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingReplies, setSubmittingReplies] = useState(new Set());
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();
  const commentRefs = React.useRef({});
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/comments/all-news-comments", { withCredentials: true })
      .then((res) => {
        setComments(res.data);
        setError(null);
      })
      .catch(() => setError("خطا در دریافت نظرات"))
      .finally(() => setLoading(false));
  }, []);

  // Scroll to and highlight specific comment if requested
  useEffect(() => {
    if (location.state && location.state.scrollToCommentId) {
      setHighlightedId(location.state.scrollToCommentId);
      setTimeout(() => {
        const ref = commentRefs.current[location.state.scrollToCommentId];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
    }
  }, [comments, location.state]);

  const handleReplyClick = (commentId) => {
    setReplyForms((prev) => new Set([...prev, commentId]));
    setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleReplyCancel = (commentId) => {
    setReplyForms((prev) => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
    setReplyTexts((prev) => {
      const newTexts = { ...prev };
      delete newTexts[commentId];
      return newTexts;
    });
  };

  const handleReplySubmit = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText || !replyText.trim()) return;
    setSubmittingReplies((prev) => new Set([...prev, commentId]));
    try {
      const response = await axios.post(
        `/api/comments/${commentId}/replies`,
        { comment: replyText },
        { withCredentials: true }
      );
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), response.data],
      }));
      setReplyForms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setReplyTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[commentId];
        return newTexts;
      });
      // Update reply_count for the comment so highlight is removed
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, reply_count: (c.reply_count || 0) + 1 }
            : c
        )
      );
    } catch (error) {
      alert("خطا در ارسال پاسخ");
    } finally {
      setSubmittingReplies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleShowReplies = async (commentId) => {
    if (replies[commentId]) {
      setReplies((prev) => {
        const newReplies = { ...prev };
        delete newReplies[commentId];
        return newReplies;
      });
      return;
    }
    try {
      const response = await axios.get(`/api/comments/${commentId}/replies`);
      setReplies((prev) => ({ ...prev, [commentId]: response.data }));
    } catch (error) {
      alert("خطا در دریافت پاسخ‌ها");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`news-comments-container${isDark ? " dark" : ""}`}
      style={{
        minHeight: "100vh",
        background: isDark ? "#121212" : "#f7fcfd",
        padding: 0,
        margin: 0,
      }}
    >
      <style>{`
        .news-comments-container {
          background: #f7fcfd;
          color: #23283a;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .news-comments-container.dark {
          background: #121212;
          color: #fff;
        }
        .news-comments-card {
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(13,202,240,0.08);
          padding: 24px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .news-comments-container.dark .news-comments-card {
          background: #1e1e1e;
          border: 1px solid #333;
          color: #fff;
        }
        .news-comments-card:hover {
          box-shadow: 0 8px 32px rgba(13,202,240,0.12);
          transform: translateY(-2px);
        }
        .news-comments-meta {
          font-size: 0.95em;
          color: #666;
          margin-bottom: 10px;
        }
        .news-comments-container.dark .news-comments-meta {
          color: #aaa;
        }
        .news-comments-title {
          font-size: 1.1em;
          font-weight: bold;
          color: #0dcaf0;
          margin-bottom: 8px;
        }
        .news-comments-container.dark .news-comments-title {
          color: #00b5d7;
        }
        .news-comments-btn {
          background: #0dcaf0;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          margin-left: 8px;
          font-size: 0.95em;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .news-comments-btn:hover {
          background: #00b5d7;
          transform: translateY(-1px);
        }
        .news-comments-btn.secondary {
          background: #fff;
          color: #0dcaf0;
          border: 1px solid #0dcaf0;
        }
        .news-comments-btn.secondary:hover {
          background: #e0f7fa;
        }
        .news-comments-container.dark .news-comments-btn.secondary {
          background: #1e1e1e;
          color: #00b5d7;
          border: 1px solid #00b5d7;
        }
        .news-comments-container.dark .news-comments-btn.secondary:hover {
          background: #222e;
        }
        .news-comments-reply-form {
          margin-top: 12px;
          background: #e0f7fa;
          border-radius: 8px;
          padding: 12px;
        }
        .news-comments-container.dark .news-comments-reply-form {
          background: #23283a;
        }
        .news-comments-replies {
          margin-top: 12px;
          background: #f8fcfd;
          border-radius: 8px;
          padding: 12px;
        }
        .news-comments-container.dark .news-comments-replies {
          background: #23283a;
        }
        .news-comments-reply {
          border-bottom: 1px solid #bee5eb;
          margin-bottom: 8px;
          padding-bottom: 8px;
        }
        .news-comments-container.dark .news-comments-reply {
          border-bottom: 1px solid #333;
        }
        .news-comments-reply:last-child {
          border-bottom: none;
        }
        textarea {
          background: #fff;
          color: #23283a;
        }
        .news-comments-container.dark textarea {
          background: #23283a;
          color: #fff;
          border: 1px solid #333;
        }
        .news-comments-card.unanswered {
          border: 2px solid #0dcaf0 !important;
          box-shadow: 0 0 0 2px #0dcaf033;
          background: #e0f7fa;
        }
        .news-comments-container.dark .news-comments-card.unanswered {
          border: 2px solid #0dcaf0 !important;
          background: #1a2633;
        }
        .highlighted-comment {
          box-shadow: 0 0 0 4px #0dcaf0, 0 0 0 2.5px #0dcaf0;
          border: 2.5px solid #0dcaf0;
          background: #e0f7fa;
        }
        .news-comments-container.dark .highlighted-comment {
          background: #15324a !important;
          border: 2.5px solid #00b5d7 !important;
          box-shadow: 0 0 0 4px #00b5d7, 0 0 0 2.5px #00b5d7 !important;
          color: #e0fbfc !important;
        }
      `}</style>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          همه نظرات اخبار
        </h2>
        {loading && <div>در حال بارگذاری...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && comments.length === 0 && <div>هیچ نظری ثبت نشده است.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((c) => {
            const isUnanswered = !c.reply_count || c.reply_count === 0;
            const isHighlighted = highlightedId === c.id;
            return (
              <li
                key={c.id}
                ref={(el) => (commentRefs.current[c.id] = el)}
                className={`news-comments-card${
                  isUnanswered ? " unanswered" : ""
                }${isHighlighted ? " highlighted-comment" : ""}`}
                style={
                  isHighlighted
                    ? {
                        boxShadow: "0 0 0 4px #0dcaf0",
                        border: "2.5px solid #0dcaf0",
                        background: "#e0f7fa",
                      }
                    : {}
                }
              >
                {isUnanswered && (
                  <div
                    style={{
                      color: "#fff",
                      background: "#0dcaf0",
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: "8px",
                      fontSize: "0.85em",
                      marginBottom: 8,
                      marginLeft: 8,
                    }}
                  >
                    بدون پاسخ
                  </div>
                )}
                <div className="news-comments-title">
                  <span>خبر:</span> {c.news_title || "---"}
                </div>
                <div className="news-comments-meta">
                  <span>کاربر: {c.author || "کاربر ناشناس"}</span>
                  <span style={{ marginRight: 16 }}>
                    تاریخ: {formatDate(c.created_at)}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>نظر:</strong>{" "}
                  {c.comment.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <button
                    className="news-comments-btn"
                    onClick={() => handleReplyClick(c.id)}
                    style={{ marginRight: 8 }}
                  >
                    💬 پاسخ
                  </button>
                  <button
                    className="news-comments-btn secondary"
                    onClick={() => handleShowReplies(c.id)}
                  >
                    {replies[c.id] ? "مخفی کردن پاسخ‌ها" : "نمایش پاسخ‌ها"}
                  </button>
                </div>
                {replyForms.has(c.id) && (
                  <div className="news-comments-reply-form">
                    <textarea
                      value={replyTexts[c.id] || ""}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                      placeholder="پاسخ خود را بنویسید..."
                      rows={3}
                      style={{
                        width: "100%",
                        borderRadius: 4,
                        border: isDark ? "1px solid #333" : "1px solid #bee5eb",
                        padding: 8,
                      }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <button
                        className="news-comments-btn"
                        onClick={() => handleReplySubmit(c.id)}
                        disabled={
                          submittingReplies.has(c.id) ||
                          !replyTexts[c.id]?.trim()
                        }
                        style={{ marginRight: 8 }}
                      >
                        {submittingReplies.has(c.id)
                          ? "⏳ ارسال..."
                          : "ارسال پاسخ"}
                      </button>
                      <button
                        className="news-comments-btn secondary"
                        onClick={() => handleReplyCancel(c.id)}
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                )}
                {replies[c.id] && (
                  <div className="news-comments-replies">
                    <strong>پاسخ‌ها:</strong>
                    {replies[c.id].length === 0 && (
                      <div>هیچ پاسخی ثبت نشده است.</div>
                    )}
                    {replies[c.id].map((reply) => (
                      <div key={reply.id} className="news-comments-reply">
                        <div>
                          <strong>کاربر:</strong>{" "}
                          {reply.author || "کاربر ناشناس"}
                        </div>
                        <div>
                          <strong>تاریخ:</strong> {formatDate(reply.created_at)}
                        </div>
                        <div>
                          <strong>پاسخ:</strong>{" "}
                          {reply.reply_text
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default NewsCommentsPage;
