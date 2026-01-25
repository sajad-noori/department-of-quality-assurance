import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { questionnairesAPI } from "../api/questionnaires";
import { useNavigate } from "react-router-dom";


function getFileIcon(fileName) {
  if (!fileName) return "📄";
  const ext = fileName.split(".").pop().toLowerCase();
  if (ext === "pdf") return "📄";
  if (ext === "doc" || ext === "docx") return "📝";
  return "📎";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const CheckingQuestionnaires = () => {
  const { theme } = useTheme();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [uncheckedCounts, setUncheckedCounts] = useState({});
  const navigate = useNavigate();

  // Fetch unchecked counts for all questionnaires
  const fetchUncheckedCounts = async (questionnairesList) => {
    const counts = {};
    for (const questionnaire of questionnairesList) {
      try {
        const response = await questionnairesAPI.getUncheckedFilledCount(
          questionnaire.id
        );
        if (response.success) {
          counts[questionnaire.id] = response.data.count || 0;
        } else {
          counts[questionnaire.id] = 0;
        }
      } catch (err) {
        console.error(
          `Error fetching unchecked count for questionnaire ${questionnaire.id}:`,
          err
        );
        counts[questionnaire.id] = 0;
      }
    }
    setUncheckedCounts(counts);
  };

  // Fetch questionnaires on component mount
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await questionnairesAPI.getAllQuestionnaires();

        if (response.success) {
          console.log("Questionnaires data:", response.data); // Debug log
          const questionnairesData = response.data || [];
          setQuestionnaires(questionnairesData);

          // Fetch unchecked counts for all questionnaires
          await fetchUncheckedCounts(questionnairesData);
        } else {
          setError(response.message || "خطا در دریافت پرسشنامه‌ها");
        }
      } catch (err) {
        setError("خطا در ارتباط با سرور");
        console.error("Error fetching questionnaires:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  // Filter questionnaires based on search
  const filteredQuestionnaires = questionnaires.filter(
    (q) =>
      (q.title && q.title.includes(search)) ||
      (q.description && q.description.includes(search))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestionnaires.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestionnaires = filteredQuestionnaires.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Get file URL for download
  const getFileUrl = (file_url) =>
    file_url ? `${process.env.REACT_APP_DOWNLOAD_APP_API_URL}/uploads/${file_url}` : "#";

  return (
    <div
      className={theme === "light" ? "light-container" : "dark-container"}
      dir="rtl"
    >
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Header Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center mb-4">
              <h2
                className={`mb-2 responsive-title ${
                  theme === "light" ? "light-text" : "dark-text"
                }`}
              >
                <i className="fas fa-list-alt me-2 text-info"></i>
                بررسی پرسش نامه های، فورم ها و چک لیست ها
              </h2>
              <p
                className={`mb-0 responsive-subtitle ${
                  theme === "light" ? "light-text" : "text-light"
                }`}
              >
                {filteredQuestionnaires.length} سند یافت شد
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div
              className={`card ${
                theme === "light" ? "light-card" : "dark-card"
              }`}
            >
              <div className="card-body">
                <div className="input-group">
                  <span
                    className={`input-group-text ${
                      theme === "light"
                        ? "light-input-group"
                        : "dark-input-group"
                    }`}
                  >
                    <i
                      className={`fas fa-search ${
                        theme === "light" ? "text-dark" : "text-light"
                      }`}
                    ></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${
                      theme === "light" ? "light-input" : "dark-input"
                    }`}
                    placeholder="جستجو براساس عنوان یا توضیحات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="btn btn-outline-light"
                      onClick={() => setSearch("")}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row justify-content-center">
            <div className="col-12">
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div
                className={`alert alert-danger d-flex align-items-center text-center ${
                  theme === "light" ? "light-alert" : "dark-alert"
                }`}
                role="alert"
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div className="responsive-text">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredQuestionnaires.length === 0 && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center py-5">
              <i
                className={`fas fa-search fa-2x fa-md-3x mb-3 ${
                  theme === "light" ? "text-secondary" : "text-muted"
                }`}
              ></i>
              <h4
                className={`responsive-title ${
                  theme === "light" ? "light-text" : "text-light"
                }`}
              >
                هیچ پرسشنامه‌ای یافت نشد
              </h4>
              <p
                className={`responsive-text ${
                  theme === "light" ? "text-secondary" : "text-muted"
                }`}
              >
                {search
                  ? "لطفاً کلمات کلیدی دیگری را امتحان کنید."
                  : "در حال حاضر هیچ پرسشنامه‌ای موجود نیست."}
              </p>
            </div>
          </div>
        )}

        {/* Questionnaires Grid */}
        {!loading && !error && filteredQuestionnaires.length > 0 && (
          <div className="row g-3">
            {paginatedQuestionnaires.map((q) => {
              console.log("Rendering questionnaire:", q); // Debug log
              const uncheckedCount = uncheckedCounts[q.id] || 0;
              return (
                <div key={q.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div
                    className={`card h-100 hover-shadow ${
                      theme === "light" ? "light-card" : "dark-card"
                    }`}
                    style={{ position: "relative" }}
                  >
                    {/* Notification Badge */}
                    {uncheckedCount > 0 && (
                      <div
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          transform: "translate(-50%, -50%)",
                          zIndex: 1000,
                          animation: "pulse 2s infinite",
                        }}
                      >
                        {uncheckedCount}
                      </div>
                    )}
                    <div className="card-body d-flex flex-column text-center">
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3 fs-2 flex-shrink-0">
                          <span style={{ fontSize: "2rem" }}>
                            {getFileIcon(q.file_name || "")}
                          </span>
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <h6
                            className={`card-title mb-1 text-truncate document-title ${
                              theme === "light" ? "light-text" : "dark-text"
                            }`}
                            title={q.title}
                          >
                            <i className="fas fa-file-alt me-2"></i>
                            {q.title}
                          </h6>
                          {q.category && (
                            <small
                              className="badge bg-secondary mt-1"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {q.category}
                            </small>
                          )}
                        </div>
                      </div>
                      {q.description && (
                        <div className="mb-3 flex-grow-1">
                          <div
                            className={`d-flex align-items-start ${
                              theme === "light"
                                ? "text-secondary"
                                : "text-muted"
                            }`}
                          >
                            <i className="fas fa-info-circle me-2 mt-1"></i>
                            <p
                              className={`card-text small mb-0 ${
                                theme === "light"
                                  ? "text-secondary"
                                  : "text-muted"
                              }`}
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textAlign: "right",
                              }}
                            >
                              {q.description}
                            </p>
                          </div>
                        </div>
                      )}
                      {q.created_at && (
                        <div className="mb-2">
                          <small
                            className={`text-muted ${
                              theme === "light"
                                ? "text-secondary"
                                : "text-muted"
                            }`}
                          >
                            <i className="fas fa-calendar-alt me-1"></i>
                            {formatDate(q.created_at)}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="card-footer bg-transparent border-top-0 mt-auto">
                      <a
                        href={getFileUrl(q.file_url)}
                        className="btn btn-info btn-sm w-100 touch-target"
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!q.file_url}
                        title="دانلود پرسشنامه"
                      >
                        <i className="fas fa-download me-1"></i>
                        دانلود
                      </a>
                      <button
                        className="btn btn-outline-info btn-sm w-100 touch-target mt-2"
                        type="button"
                        onClick={() =>
                          navigate(`/filled-questionnaires/${q.id}`, {
                            state: { title: q.title },
                          })
                        }
                      >
                        <i className="fas fa-list me-1"></i>
                        مشاهده پرسشنامه‌های پرشده
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-8">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(i + 1)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
                      title="صفحه بعدی"
                    >
                      بعدی
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* CSS for dark and light theme, responsive design and skeleton loading */}
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
        .dark-card {
          background: #1e1e1e;
          border: 1px solid #333;
          color: #ffffff;
        }
        .light-card {
          background: #ffffff;
          border: 1px solid #dee2e6;
          color: #333333;
        }
        .dark-text {
          color: #ffffff !important;
        }
        .light-text {
          color: #333333 !important;
        }
        .dark-input {
          background: #2d2d2d;
          border: 1px solid #444;
          color: #ffffff;
        }
        .dark-input::placeholder {
          color: #cccccc !important;
        }
        .light-input {
          background: #ffffff;
          border: 1px solid #ced4da;
          color: #333333;
        }
        .light-input::placeholder {
          color: #6c757d !important;
        }
        .dark-input-group {
          background: #2d2d2d;
          border: 1px solid #444;
          color: #ffffff;
        }
        .light-input-group {
          background: #f8f9fa;
          border: 1px solid #ced4da;
          color: #333333;
        }
        .dark-alert {
          background: #1e1e1e;
          border: 1px solid #333;
          color: #ffffff;
        }
        .light-alert {
          background: #ffffff;
          border: 1px solid #dee2e6;
          color: #333333;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        .responsive-title {
          font-size: 1.5rem;
        }
        .responsive-subtitle {
          font-size: 1rem;
        }
        .responsive-text {
          font-size: 0.9rem;
        }
        .document-title {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .min-width-0 {
          min-width: 0;
        }
        .skeleton-card {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .skeleton-icon {
          width: 40px;
          height: 40px;
          background: #e0e0e0;
          border-radius: 50%;
        }
        .skeleton-title {
          height: 20px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .skeleton-badge {
          height: 16px;
          width: 60px;
          background: #e0e0e0;
          border-radius: 4px;
        }
        .skeleton-text {
          height: 16px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .skeleton-text-short {
          height: 16px;
          width: 80%;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .skeleton-button {
          height: 36px;
          background: #e0e0e0;
          border-radius: 4px;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .responsive-title {
            font-size: 1.25rem;
          }
          .responsive-subtitle {
            font-size: 0.9rem;
          }
          .responsive-text {
            font-size: 0.8rem;
          }
        }
        @media (max-width: 576px) {
          .responsive-title {
            font-size: 1.1rem;
          }
          .responsive-subtitle {
            font-size: 0.85rem;
          }
          .responsive-text {
            font-size: 0.75rem;
          }
        }
        .dark-container .text-muted,
        .dark-container .text-secondary {
          color: #b0b0b0 !important;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default CheckingQuestionnaires;
