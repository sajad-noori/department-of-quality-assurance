import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { questionnairesAPI } from "../api/questionnaires";
import { useTheme } from "../contexts/ThemeContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FilledQuestionnairesList = () => {
  const { id } = useParams();
  const location = useLocation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filled, setFilled] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const title =
    location.state && location.state.title
      ? "پرسش نامه های پر شده مربوط به " + location.state.title
      : "پرسشنامه‌های پرشده";
  const filledRefs = React.useRef({});
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    const fetchFilled = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await questionnairesAPI.getFilledQuestionnaires(id);
        if (res.success) {
          setFilled(res.data || []);
        } else {
          setError(res.message || "خطا در دریافت پرسشنامه‌های پرشده");
        }
      } catch (err) {
        setError("خطا در ارتباط با سرور");
      }
      setLoading(false);
    };
    fetchFilled();
  }, [id]);

  // Pagination logic
  const totalPages = Math.ceil(filled.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFilled = filled.slice(startIndex, endIndex);

  // Reset to first page when id changes
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  // Scroll to and highlight specific filled questionnaire if requested
  useEffect(() => {
    if (location.state && location.state.highlightFilledId) {
      setHighlightedId(location.state.highlightFilledId);
      setTimeout(() => {
        const ref = filledRefs.current[location.state.highlightFilledId];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
    }
  }, [filled, location.state]);

  return (
    <div
      className={theme === "light" ? "light-container" : "dark-container"}
      dir="rtl"
    >
      <div className="container py-4">
        <h2
          className={`mb-4 ${theme === "light" ? "light-text" : "dark-text"}`}
        >
          {title}
        </h2>
        {loading && <div>در حال بارگذاری...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filled.length === 0 && (
          <div>هیچ پرسشنامه پرشده‌ای یافت نشد.</div>
        )}
        {!loading && !error && filled.length > 0 && (
          <>
            <ul className="list-group">
              {paginatedFilled.map((f) => (
                <li
                  key={f.id}
                  ref={(el) => (filledRefs.current[f.id] = el)}
                  className={`list-group-item d-flex justify-content-between align-items-center${
                    highlightedId === f.id ? " highlighted-filled" : ""
                  }`}
                  style={
                    highlightedId === f.id
                      ? {
                          boxShadow: "0 0 0 4px #0dcaf0",
                          border: "2.5px solid #0dcaf0",
                          background: "#e0f7fa",
                        }
                      : {}
                  }
                >
                  <span>
                    {f.file_name}{" "}
                    <span className="text-muted">
                      (
                      {f.filled_at
                        ? new Date(f.filled_at).toLocaleString("fa-IR")
                        : ""}
                      )
                    </span>
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`${API_BASE_URL}/uploads/${f.file_url}`}
                      className="btn btn-info btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      دانلود
                    </a>
                    {f.checked ? (
                      <button
                        className="check-btn checked"
                        disabled
                        title="خوانده شده"
                      >
                        <span className="checkmark">✔</span>
                      </button>
                    ) : (
                      <button
                        className="check-btn"
                        title="علامت‌گذاری به عنوان خوانده شده"
                        onClick={async () => {
                          try {
                            await questionnairesAPI.checkFilledQuestionnaire(
                              f.id
                            );
                            setFilled((prev) =>
                              prev.map((item) =>
                                item.id === f.id
                                  ? { ...item, checked: true }
                                  : item
                              )
                            );
                          } catch {}
                        }}
                      >
                        <span className="checkmark"></span>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      title="صفحه قبلی"
                    >
                      قبلی
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                        title={`صفحه ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      title="صفحه بعدی"
                    >
                      بعدی
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
      <style>{`
        .dark-container {
          background: #121212;
          min-height: 100vh;
          padding: 1rem 0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .light-container {
          background: #ffffff;
          min-height: 100vh;
          padding: 1rem 0;
          color: #333333;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dark-text {
          color: #ffffff !important;
        }
        .light-text {
          color: #0dcaf0 !important;
        }
        .list-group-item {
          background: inherit;
          color: inherit;
          border: 1px solid #dee2e6;
        }
        .dark-container .list-group-item {
          background: #23272b;
          color: #fff;
          border: 1px solid #444;
        }
        .light-container .list-group-item {
          background: #fff;
          color: #333;
          border: 1px solid #dee2e6;
        }
        .btn-info {
          background: linear-gradient(45deg, #17a2b8, #20c997) !important;
          border: none !important;
          color: #ffffff !important;
        }
        .btn-info:hover {
          background: linear-gradient(45deg, #138496, #1ea085) !important;
        }
        .check-btn {
          width: 24px;
          height: 24px;
          border: 2px solid #20c997;
          background: transparent;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border 0.2s;
          padding: 0;
          margin-left: 0.5rem;
          font-size: 1rem;
          color: #20c997;
        }
        .check-btn:hover {
          background: #e6fcf5;
          border-color: #17a2b8;
        }
        .dark-container .check-btn {
          border-color: #0dcaf0;
          color: #0dcaf0;
        }
        .dark-container .check-btn:hover {
          background: #1e2a2f;
          border-color: #20c997;
        }
        .check-btn .checkmark {
          font-size: 1.1rem;
          color: #20c997;
          font-weight: bold;
          line-height: 1;
        }
        .check-btn.checked {
          background: #20c997;
          border-color: #20c997;
          color: #fff;
          cursor: default;
        }
        .check-btn.checked .checkmark {
          color: #fff;
        }
        .alert-danger {
          background: rgba(220, 53, 69, 0.1) !important;
          border: 1px solid #dc3545 !important;
          color: #dc3545 !important;
        }
        .dark-container .alert-danger {
          background: rgba(220, 53, 69, 0.2) !important;
          border: 1px solid #ff6b6b !important;
          color: #ff6b6b !important;
        }
        .dark-container .text-muted {
          color: #b0b0b0 !important;
        }
        .highlighted-filled {
           box-shadow: 0 0 0 4px #0dcaf0, 0 0 0 2.5px #0dcaf0;
           border: 2.5px solid #0dcaf0;
           background: #e0f7fa;
         }
         .dark-container .highlighted-filled {
           background: #15324a !important;
           border: 2.5px solid #00b5d7 !important;
           box-shadow: 0 0 0 4px #00b5d7, 0 0 0 2.5px #00b5d7 !important;
           color: #e0fbfc !important;
         }
      `}</style>
    </div>
  );
};

export default FilledQuestionnairesList;
