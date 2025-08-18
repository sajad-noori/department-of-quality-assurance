import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { questionnairesAPI } from "../api/questionnaires";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function NotificationsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    totalUncheckedFilledCount: 0,
    unansweredNewsComments: 0,
    unansweredQuestionsCount: 0,
  });
  const [unansweredComments, setUnansweredComments] = useState([]);
  const [uncheckedFilleds, setUncheckedFilleds] = useState([]); // [{ questionnaire, filleds: [] }]
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  // New state for user/institute notifications
  const [questionReplies, setQuestionReplies] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchNotifications() {
      setLoading(true);
      let totalUncheckedFilledCount = 0;
      let unansweredNewsComments = 0;
      let unansweredQuestionsCount = 0;
      let unansweredCommentsList = [];
      let uncheckedFilledsList = [];
      let unansweredQuestionsList = [];
      try {
        // 1. Unchecked filled questionnaires (detailed)
        try {
          const qRes = await questionnairesAPI.getAllQuestionnaires();
          if (qRes.success && Array.isArray(qRes.data)) {
            for (const q of qRes.data) {
              const filledRes = await fetch(
                `http://localhost:5000/api/questionnaires/${q.id}/filled`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                }
              );
              if (filledRes.ok) {
                const filledData = await filledRes.json();
                if (filledData.success && Array.isArray(filledData.data)) {
                  const unchecked = filledData.data.filter((f) => !f.checked);
                  if (unchecked.length > 0) {
                    uncheckedFilledsList.push({
                      questionnaire: q,
                      filleds: unchecked,
                    });
                  }
                  totalUncheckedFilledCount += unchecked.length;
                }
              }
            }
          }
        } catch {}
        // 2. Unanswered news comments (detailed)
        try {
          const res = await axios.get("/api/comments/all-news-comments", {
            withCredentials: true,
          });
          const allComments = res.data;
          unansweredCommentsList = allComments.filter(
            (c) => !c.reply_count || c.reply_count === 0
          );
          unansweredNewsComments = unansweredCommentsList.length;
        } catch {}
        // 3. Unanswered questions (detailed)
        try {
          const res = await axios.get("/api/questions/admin/all", {
            withCredentials: true,
          });
          if (res.data.success && Array.isArray(res.data.data.questions)) {
            unansweredQuestionsList = res.data.data.questions.filter(
              (q) => !q.is_replied
            );
            unansweredQuestionsCount = unansweredQuestionsList.length;
          }
        } catch {}
      } finally {
        if (isMounted) {
          setNotifications({
            totalUncheckedFilledCount,
            unansweredNewsComments,
            unansweredQuestionsCount,
          });
          setUnansweredComments(unansweredCommentsList);
          setUncheckedFilleds(uncheckedFilledsList);
          setUnansweredQuestions(unansweredQuestionsList);
          setLoading(false);
        }
      }
    }

    async function fetchUserNotifications() {
      setLoading(true);
      try {
        // Fetch replied questions (unseen answers)
        const qRes = await axios.get("/api/questions/user/unseen-answers", {
          withCredentials: true,
        });
        if (qRes.data.success && Array.isArray(qRes.data)) {
          setQuestionReplies(qRes.data.data);
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data)
        ) {
          setQuestionReplies(qRes.data.data);
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data.questions)
        ) {
          setQuestionReplies(qRes.data.data.questions);
        } else if (
          qRes.data.success &&
          qRes.data.data &&
          Array.isArray(qRes.data.data)
        ) {
          setQuestionReplies(qRes.data.data);
        } else if (qRes.data.success && qRes.data.data) {
          setQuestionReplies(qRes.data.data);
        }
        // Fetch replied comments
        const cRes = await axios.get("/api/comments/my/replied", {
          withCredentials: true,
        });
        if (
          cRes.data.success &&
          cRes.data.data &&
          Array.isArray(cRes.data.data.comments)
        ) {
          setCommentReplies(cRes.data.data.comments);
        } else if (cRes.data.success && Array.isArray(cRes.data.data)) {
          setCommentReplies(cRes.data.data);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }

    if (user && (user.role === "user" || user.role === "institute")) {
      fetchUserNotifications();
    } else {
      fetchNotifications();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Helper to check if a date is within the last 2 months
  function isWithinLast2Months(dateString) {
    if (!dateString) return false;
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    return diff <= 1000 * 60 * 60 * 24 * 60; // 60 days
  }

  // Sort and filter notifications by date (newest to oldest, only last 2 months)
  const sortedUncheckedFilleds = uncheckedFilleds
    .map(({ questionnaire, filleds }) => ({
      questionnaire,
      filleds: filleds
        .filter((f) => isWithinLast2Months(f.filled_at))
        .sort((a, b) => new Date(b.filled_at) - new Date(a.filled_at)),
    }))
    .filter((q) => q.filleds.length > 0);

  const sortedUnansweredComments = unansweredComments
    .filter((c) => isWithinLast2Months(c.created_at))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const sortedUnansweredQuestions = unansweredQuestions
    .filter((q) => isWithinLast2Months(q.submitted_at))
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const actions = [
    {
      label: "پرسش‌نامه‌های بررسی نشده",
      count: notifications.totalUncheckedFilledCount,
      to: "/checking-questionnaires",
      description: "پرسش‌نامه‌هایی که نیاز به بررسی دارند.",
    },
    {
      label: "نظرات اخبار بدون پاسخ",
      count: notifications.unansweredNewsComments,
      to: "/news-comments",
      description: "نظراتی که هنوز پاسخی دریافت نکرده‌اند.",
    },
    {
      label: "سوالات بدون پاسخ",
      count: notifications.unansweredQuestionsCount,
      to: "/answer-to-questions",
      description: "سوالاتی که نیاز به پاسخ دارند.",
    },
  ];

  // Merge all notifications into a single flat list, sorted by date (newest to oldest)
  const mergedNotifications = [
    // Unchecked filled questionnaires
    ...sortedUncheckedFilleds.flatMap(({ questionnaire, filleds }) =>
      filleds.map((f) => ({
        type: "سند بررسی نشده",
        date: f.filled_at,
        content: questionnaire.title,
        file_name: f.file_name,
        questionnaireId: questionnaire.id,
        filledId: f.id,
        action: () =>
          navigate(`/filled-questionnaires/${questionnaire.id}`, {
            state: { highlightFilledId: f.id },
          }),
        actionLabel: "بررسی",
      }))
    ),
    // Unanswered news comments
    ...sortedUnansweredComments.map((c) => ({
      type: "نظر بدون پاسخ",
      date: c.created_at,
      content: c.news_title ? `خبر: ${c.news_title}` : "",
      comment: c.comment,
      commentId: c.id,
      action: () =>
        navigate("/news-comments", { state: { scrollToCommentId: c.id } }),
      actionLabel: "پاسخ دهید",
    })),
    // Unanswered questions
    ...sortedUnansweredQuestions.map((q) => ({
      type: "سوال بدون پاسخ",
      date: q.submitted_at,
      content: q.question,
      questionId: q.id,
      action: () =>
        navigate("/answer-to-questions", {
          state: { scrollToQuestionId: q.id },
        }),
      actionLabel: "پاسخ دهید",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // For user/institute, build notifications
  let userNotifications = [];
  if (user && (user.role === "user" || user.role === "institute")) {
    userNotifications = [
      ...questionReplies.map((q) => ({
        type: "پاسخ به سوال شما",
        date: q.replied_at,
        content: q.question,
        id: q.id,
        isRead: q.answer_seen === 1 || q.answer_seen === true,
        action: () => {
          markQuestionAsSeen(q.id, () =>
            navigate("/", { state: { scrollToQuestionId: q.id } })
          );
        },
        actionLabel: "مشاهده پاسخ",
      })),
      ...commentReplies.map((c) => ({
        type: "پاسخ به نظر شما",
        date: c.last_reply_at,
        content: c.news_title ? `خبر: ${c.news_title}` : c.comment,
        comment: c.comment,
        id: c.id,
        isRead: c.reply_seen === 1 || c.reply_seen === true,
        action: () => {
          markCommentAsSeen(c.id, () =>
            navigate(`/news/${c.news_id}`, {
              state: { scrollToCommentId: c.id },
            })
          );
        },
        actionLabel: "مشاهده پاسخ",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Instead of mergedNotifications, use userNotifications for user/institute
  const notificationsToShow =
    user && (user.role === "user" || user.role === "institute")
      ? userNotifications
      : mergedNotifications;

  // Add mark-as-seen logic
  const markQuestionAsSeen = async (questionId, cb) => {
    try {
      await axios.post(
        "/api/questions/user/mark-answer-seen",
        { questionId },
        { withCredentials: true }
      );
      if (typeof cb === "function") cb();
    } catch (err) {
      if (typeof cb === "function") cb();
    }
  };
  const markCommentAsSeen = async (commentId, cb) => {
    try {
      await axios.post(
        "/api/comments/my/mark-replies-seen",
        { commentId },
        { withCredentials: true }
      );
      if (typeof cb === "function") cb();
    } catch (err) {
      if (typeof cb === "function") cb();
    }
  };

  return (
    <div
      className={`notifications-container${theme === "dark" ? " dark" : ""}`}
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme === "dark" ? "#121212" : "#f7fcfd",
        color: theme === "dark" ? "#fff" : "#23283a",
        padding: 0,
        margin: 0,
      }}
    >
      <style>{`
        .notifications-container {
          background: #f7fcfd;
          color: #23283a;
          min-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
        }
        .notifications-container.dark {
          background: #121212;
          color: #fff;
        }
        .notifications-card {
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(13,202,240,0.08);
          padding: 24px;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .notifications-container.dark .notifications-card {
          background: #1e1e1e;
          border: 1px solid #333;
          color: #fff;
        }
        .notifications-card.unanswered {
          border: 2px solid #0dcaf0 !important;
          background: #e0f7fa;
        }
        .notifications-container.dark .notifications-card.unanswered {
          border: 2px solid #0dcaf0 !important;
          background: #1a2633;
        }
        .notifications-title {
          font-size: 1.1em;
          font-weight: bold;
          color: #0dcaf0;
          margin-bottom: 8px;
        }
        .notifications-container.dark .notifications-title {
          color: #00b5d7;
        }
        .unanswered-badge {
          color: #fff;
          background: #0dcaf0;
          display: inline-block;
          padding: 2px 10px;
          border-radius: 8px;
          font-size: 0.85em;
          margin-bottom: 8px;
          margin-left: 8px;
        }
        .read-notification {
          background: #f0f7ff !important;
          border: 2px solid #90caf9 !important;
          color: #274472 !important;
        }
        .notifications-container.dark .read-notification {
          background: #22303a !important;
          border: 2px solid #80cbc4 !important;
          color: #f0f7ff !important;
        }
      `}</style>
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          اعلان‌ها
        </h2>
        {loading ? (
          <div style={{ fontSize: "1.1rem" }}>در حال بارگذاری...</div>
        ) : (
          <>
            {notificationsToShow.length === 0 ? (
              <div
                style={{
                  fontSize: "1.1rem",
                  color: theme === "dark" ? "#b2ebf2" : "#666",
                }}
              >
                هیچ اعلانی وجود ندارد.
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                {notificationsToShow.map((item, idx) => {
                  const isUnanswered =
                    item.type === "نظر بدون پاسخ" ||
                    item.type === "سوال بدون پاسخ" ||
                    item.type === "سند بررسی نشده" ||
                    item.type === "پاسخ به سوال شما" ||
                    item.type === "پاسخ به نظر شما";
                  const isRead = item.isRead;
                  const isNotificationsPage =
                    location.pathname === "/notifications";
                  return (
                    <li
                      key={
                        item.filledId ||
                        item.commentId ||
                        item.questionId ||
                        item.id ||
                        idx
                      }
                      className={`notifications-card${
                        isUnanswered ? " unanswered" : ""
                      }${
                        isRead && isNotificationsPage
                          ? " read-notification"
                          : ""
                      }`}
                      style={
                        isRead && isNotificationsPage
                          ? theme === "dark"
                            ? {
                                background: "#4d3f00",
                                border: "2px solid #ffe066",
                                color: "#fffbe6",
                              }
                            : {
                                background: "#fffbe6",
                                border: "2px solid #ffe066",
                                color: "#23283a",
                              }
                          : {}
                      }
                    >
                      <div className="notifications-title">{item.type}</div>
                      {item.content && <div>{item.content}</div>}
                      {item.file_name && (
                        <div>
                          <a
                            href={`http://localhost:5000/uploads/questionnaires/${item.file_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: theme === "dark" ? "#0dcaf0" : "#007bff",
                            }}
                          >
                            {item.file_name}
                          </a>
                        </div>
                      )}
                      {item.comment && (
                        <div style={{ margin: "6px 0" }}>
                          <strong>نظر:</strong>{" "}
                          {item.comment
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")}
                        </div>
                      )}
                      {item.date && (
                        <div
                          style={{
                            color: theme === "dark" ? "#b2ebf2" : "#666",
                            fontSize: "0.95rem",
                          }}
                        >
                          <strong>تاریخ:</strong>{" "}
                          {item.date
                            ? new Date(item.date).toLocaleDateString("fa-IR")
                            : "---"}
                        </div>
                      )}
                      <button
                        style={{
                          alignSelf: "flex-end",
                          background: theme === "dark" ? "#00b5d7" : "#0dcaf0",
                          color: theme === "dark" ? "#121212" : "#fff",
                          border:
                            theme === "dark" ? "1px solid #00b5d7" : "none",
                          borderRadius: 8,
                          padding: "6px 18px",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                          marginTop: 6,
                          boxShadow:
                            theme === "dark"
                              ? "0 2px 8px rgba(0,181,215,0.08)"
                              : "0 2px 8px rgba(13,202,240,0.08)",
                          transition:
                            "background 0.2s, color 0.2s, box-shadow 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            theme === "dark" ? "#09e2ff" : "#0097a7";
                          e.currentTarget.style.color =
                            theme === "dark" ? "#23283a" : "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            theme === "dark" ? "#00b5d7" : "#0dcaf0";
                          e.currentTarget.style.color =
                            theme === "dark" ? "#121212" : "#fff";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background =
                            theme === "dark" ? "#09e2ff" : "#0097a7";
                          e.currentTarget.style.color =
                            theme === "dark" ? "#23283a" : "#fff";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background =
                            theme === "dark" ? "#00b5d7" : "#0dcaf0";
                          e.currentTarget.style.color =
                            theme === "dark" ? "#121212" : "#fff";
                        }}
                        onClick={item.action}
                      >
                        {item.actionLabel}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
