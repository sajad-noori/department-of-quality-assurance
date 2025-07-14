import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

const DocumentsPage = () => {
  const { type } = useParams();
  const { theme } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isMobile, setIsMobile] = useState(false);

  const categoryTranslations = {
    guideline: "رهنمودها",
    form: "فرم‌ها",
    "legal-doc": "اسناد تقنینی",
  };

  // Map URL parameters to database category values
  const categoryMapping = {
    guideline: "guideline",
    form: "form", 
    "legal-doc": "legal"
  };

  // Category colors for badges (dark theme)
  const categoryColors = {
    guideline: "info",
    form: "success", 
    legal: "warning"
  };

  // File type icons
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📎';
    }
  };

  // Format file size (mock function - you can implement real file size)
  const formatFileSize = () => {
    return "~2MB"; // This would be calculated from actual file size
  };

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError("");
      try {
        console.log('Current type:', type);
        console.log('Category mapping:', categoryMapping[type]);
        console.log('Category translation:', categoryTranslations[type]);
        const res = await axios.get(`/api/docs-center-and-uploads/documents?type=${categoryMapping[type] || type}`);
        setDocuments(res.data);
        setFilteredDocs(res.data);
      } catch (err) {
        console.error("خطا در دریافت اسناد:", err);
        setError("دریافت اسناد با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [type]);

  useEffect(() => {
    let results = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort results
    results.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "uploadDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDocs(results);
  }, [searchTerm, documents, sortBy, sortOrder]);

  const LoadingSkeleton = () => (
    <div className="row g-3 justify-content-center">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card h-100 dark-card skeleton-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="skeleton-icon me-3"></div>
                <div className="flex-grow-1">
                  <div className="skeleton-title mb-2"></div>
                  <div className="skeleton-badge"></div>
                </div>
              </div>
              <div className="skeleton-text mb-3"></div>
              <div className="skeleton-text-short mb-3"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleDownload = async (doc) => {
    try {
      // Track download with logging
      console.log(`Downloading: ${doc.name}`);
      
      // Use the new download endpoint that includes logging
      const response = await axios.get(`http://localhost:5000/api/docs-center-and-uploads/download/${doc.fileName}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name || doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('خطا در دانلود فایل');
    }
  };

  return (
    <div className={theme === "light" ? "light-container" : "dark-container"} dir="rtl">
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Header Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center mb-4">
              <h2 className={`mb-2 responsive-title ${theme === "light" ? "light-text" : "dark-text"}`}>
                <i className="fas fa-folder-open me-2 text-info"></i>
                {categoryTranslations[type] || type}
              </h2>
              <p className={`mb-0 responsive-subtitle ${theme === "light" ? "light-text" : "text-light"}`}>
                {filteredDocs.length} سند یافت شد
              </p>
            </div>
            
            {/* Sort Controls - Centered */}
            <div className="d-flex justify-content-center mb-3">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-light btn-sm ${sortBy === "uploadDate" ? "active" : ""}`}
                  onClick={() => handleSort("uploadDate")}
                >
                  <i className="fas fa-calendar me-1"></i>
                  <span className="d-none d-sm-inline">تاریخ</span>
                  {sortBy === "uploadDate" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ms-1`}></i>
                  )}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-light btn-sm ${sortBy === "name" ? "active" : ""}`}
                  onClick={() => handleSort("name")}
                >
                  <i className="fas fa-sort-alpha-down me-1"></i>
                  <span className="d-none d-sm-inline">نام</span>
                  {sortBy === "name" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ms-1`}></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div className={`card ${theme === "light" ? "light-card" : "dark-card"}`}>
              <div className="card-body">
                <div className="input-group">
                  <span className={`input-group-text ${theme === "light" ? "light-input-group" : "dark-input-group"}`}>
                    <i className={`fas fa-search ${theme === "light" ? "text-dark" : "text-light"}`}></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${theme === "light" ? "light-input" : "dark-input"}`}
                    placeholder={isMobile ? "جستجو..." : "جستجو براساس نام، توضیحات یا دسته‌بندی..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-light"
                      onClick={() => setSearchTerm("")}
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
              <LoadingSkeleton />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className={`alert alert-danger d-flex align-items-center text-center ${theme === "light" ? "light-alert" : "dark-alert"}`} role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div className="responsive-text">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredDocs.length === 0 && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center py-5">
              <i className={`fas fa-search fa-2x fa-md-3x mb-3 ${theme === "light" ? "text-secondary" : "text-muted"}`}></i>
              <h4 className={`responsive-title ${theme === "light" ? "light-text" : "text-light"}`}>هیچ سندی یافت نشد</h4>
              <p className={`responsive-text ${theme === "light" ? "text-secondary" : "text-muted"}`}>
                {searchTerm ? "لطفاً کلمات کلیدی دیگری را امتحان کنید." : "در حال حاضر هیچ سندی در این دسته موجود نیست."}
              </p>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        {!loading && !error && filteredDocs.length > 0 && (
          <div className="row g-3">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className={`card h-100 hover-shadow ${theme === "light" ? "light-card" : "dark-card"}`}>
                  <div className="card-body d-flex flex-column text-center">
                    <div className="d-flex align-items-start mb-3">
                      <div className="me-3 fs-2 flex-shrink-0">{getFileIcon(doc.fileName)}</div>
                      <div className="flex-grow-1 min-width-0">
                        <h6 className={`card-title mb-1 text-truncate document-title ${theme === "light" ? "light-text" : "dark-text"}`} title={doc.name}>
                          {doc.name}
                        </h6>
                        <span className={`badge bg-${categoryColors[doc.category] || 'secondary'} badge-sm`}>
                          {(() => {
                            console.log('Rendering badge for type:', type, 'translation:', categoryTranslations[type]);
                            return categoryTranslations[type];
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    {doc.description && (
                      <p className={`card-text small mb-3 flex-grow-1 ${theme === "light" ? "text-secondary" : "text-muted"}`} style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {doc.description}
                      </p>
                    )}
                    
                    <div className="d-flex justify-content-center align-items-center mb-3">
                      <small className={theme === "light" ? "text-secondary" : "text-muted"}>
                        <i className="fas fa-calendar me-1"></i>
                        <span className="d-none d-md-inline">{new Date(doc.uploadDate).toLocaleDateString("fa-IR")}</span>
                        <span className="d-inline d-md-none">{new Date(doc.uploadDate).toLocaleDateString("fa-IR", { month: 'short', day: 'numeric' })}</span>
                      </small>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-transparent border-top-0 mt-auto">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="btn btn-info btn-sm w-100 touch-target"
                    >
                      <i className="fas fa-download me-1"></i>
                      دانلود
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          color: #ffffff;
          height: 100%;
        }
        .light-card {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(2px);
          color: #333333;
          height: 100%;
        }
        .dark-text {
          color: #ffffff !important;
        }
        .light-text {
          color: #0dcaf0 !important;
        }
        .dark-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
        }
        .light-input {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
          color: #333333 !important;
        }
        .dark-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #17a2b8 !important;
          box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25) !important;
          color: #ffffff !important;
        }
        .light-input:focus {
          background: rgba(0, 0, 0, 0.06) !important;
          border-color: #0dcaf0 !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.15) !important;
          color: #333333 !important;
        }
        .dark-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .light-input::placeholder {
          color: rgba(0, 0, 0, 0.4) !important;
        }
        .dark-input-group {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-right: none !important;
        }
        .light-input-group {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
          border-right: none !important;
        }
        .dark-alert {
          background: rgba(220, 53, 69, 0.2) !important;
          border: 1px solid rgba(220, 53, 69, 0.3) !important;
          color: #ff6b6b !important;
        }
        .light-alert {
          background: rgba(13, 202, 240, 0.08) !important;
          border: 1px solid #0dcaf0 !important;
          color: #0dcaf0 !important;
        }
        .btn-outline-light {
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .btn-outline-light:hover,
        .btn-outline-light.active {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          color: #ffffff !important;
        }
        /* Light mode override for sort buttons */
        .light-container .btn-outline-light {
          color: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
          background: #fff !important;
        }
        .light-container .btn-outline-light.active,
        .light-container .btn-outline-light:hover {
          color: #fff !important;
          background: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
        }
        .skeleton-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }
        .skeleton-title {
          height: 16px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-badge {
          width: 60px;
          height: 20px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 10px;
        }
        .skeleton-text {
          height: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-text-short {
          width: 70%;
          height: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-button {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease;
        }
        .card {
          transition: all 0.3s ease;
        }
        .text-muted {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .text-secondary {
          color: #0dcaf0 !important;
        }
        .btn-info {
          background: linear-gradient(45deg, #17a2b8, #20c997) !important;
          border: none !important;
          color: #ffffff !important;
        }
        .btn-info:hover {
          background: linear-gradient(45deg, #138496, #1ea085) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
        }
        /* Responsive Design */
        .responsive-title {
          font-size: 1.5rem;
        }
        .responsive-subtitle {
          font-size: 0.9rem;
        }
        .responsive-text {
          font-size: 0.875rem;
        }
        .min-width-0 {
          min-width: 0;
        }
        .touch-target {
          min-height: 44px;
          padding: 0.5rem 1rem;
        }
        /* Mobile Optimizations */
        @media (max-width: 575.98px) {
          .dark-container, .light-container {
            padding: 0.5rem 0;
          }
          .responsive-title {
            font-size: 1.25rem;
          }
          .responsive-subtitle {
            font-size: 0.8rem;
          }
          .card-body {
            padding: 1rem;
          }
          .btn-group {
            width: 100%;
          }
          .btn-group .btn {
            flex: 1;
          }
          .document-title {
            font-size: 0.95rem;
          }
        }
        /* Tablet Optimizations */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .responsive-title {
            font-size: 1.35rem;
          }
        }
        /* Desktop Optimizations */
        @media (min-width: 992px) {
          .responsive-title {
            font-size: 1.75rem;
          }
          .responsive-subtitle {
            font-size: 1rem;
          }
          .responsive-text {
            font-size: 0.9rem;
          }
          .document-title {
            font-size: 1.05rem;
          }
        }
        /* Large Desktop Optimizations */
        @media (min-width: 1200px) {
          .responsive-title {
            font-size: 2rem;
          }
        }
        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-shadow:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
          }
          .btn-info:hover {
            transform: none;
          }
          .card {
            cursor: pointer;
          }
        }
        /* High DPI Display Optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dark-card, .light-card {
            border-width: 0.5px;
          }
        }
        /* Add this for document title size and style */
        .document-title {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default DocumentsPage;
