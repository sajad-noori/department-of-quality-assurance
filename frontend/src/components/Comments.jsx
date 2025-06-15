import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Comments = ({ newsId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/news/${newsId}/comments`)
      .then((res) => setComments(res.data))
      .catch(() => setError("خطا در بارگذاری نظرات"))
      .finally(() => setLoading(false));
  }, [newsId]);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    if (!user || !user.id) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setLoading(true);
    axios
      .post(
        `/api/news/${newsId}/comments`,
        { comment: newComment },
        { withCredentials: true } // ✅ send cookie with JWT
      )
      .then((res) => {
        setComments((prev) => [...prev, res.data]);
        setNewComment("");
      })
      .catch(() => alert("خطا در ارسال نظر"))
      .finally(() => setLoading(false));
  };

  return (
    <section className="comments-section" style={{ marginTop: "50px" }}>
      <h3>نظرات</h3>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {comments.length === 0 && !loading && <p>هنوز نظری ثبت نشده است.</p>}

      <ul style={{ listStyle: "none", paddingRight: 0 }}>
        {comments.map((c) => (
          <li
            key={c.id}
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "12px",
              paddingBottom: "12px",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            <p>
              <strong>{c.author || "کاربر ناشناس"}</strong>{" "}
              <small style={{ color: "#666" }}>
                {new Date(c.created_at).toLocaleString()}
              </small>
            </p>
            <p>{c.comment}</p>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px", direction: "rtl" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="نظر خود را اینجا بنویسید..."
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
          disabled={loading}
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          style={{
            marginTop: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ارسال نظر
        </button>
      </div>
    </section>
  );
};

Comments.propTypes = {
  newsId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Comments;
