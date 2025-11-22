import React, { useState, useEffect } from "react";
import axios from "axios";

const containerStyle = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  minHeight: "100vh",
  padding: "1rem",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  direction: "rtl",
};

const headerStyle = {
  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  color: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "1.5rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  border: "1px solid #333333",
};

const titleStyle = {
  margin: "0 0 0.5rem 0",
  fontSize: "2rem",
  fontWeight: "700",
  color: "#ffffff",
  textAlign: "center",
};

const subtitleStyle = {
  margin: 0,
  fontSize: "0.9rem",
  color: "#cccccc",
  textAlign: "center",
};

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "1rem",
  marginTop: "1rem",
};

const statItemStyle = {
  textAlign: "center",
  padding: "0.75rem",
  borderRadius: "8px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #333333",
};

const statValueStyle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#00d4ff",
  marginBottom: "0.25rem",
};

const statLabelStyle = {
  fontSize: "0.75rem",
  color: "#999999",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const formContainerStyle = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "1.5rem",
  border: "1px solid #333333",
  marginBottom: "2rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
};

const formGroupStyle = {
  marginBottom: "1.5rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#ffffff",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "0.875rem",
  border: "1px solid #333333",
  borderRadius: "6px",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const inputFocusStyle = {
  borderColor: "#00d4ff",
  boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "100px",
};

const fileInputStyle = {
  ...inputStyle,
  padding: "0.5rem",
  cursor: "pointer",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: "#00d4ff",
  border: "none",
  color: "#000000",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginRight: "0.75rem",
};

const buttonHoverStyle = {
  backgroundColor: "#00b8e6",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(0, 212, 255, 0.3)",
};

const buttonSecondaryStyle = {
  ...buttonStyle,
  backgroundColor: "#666666",
  color: "#ffffff",
};

const buttonSecondaryHoverStyle = {
  backgroundColor: "#555555",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(102, 102, 102, 0.3)",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const tableContainerStyle = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "1.5rem",
  border: "1px solid #333333",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
};

const filesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "1rem",
};

const fileCardStyle = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "1rem",
  border: "1px solid #333333",
  transition: "all 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "200px",
};

const fileCardHoverStyle = {
  borderColor: "#00d4ff",
  transform: "translateY(-2px)",
  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
};

const fileNameStyle = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "0.5rem",
  lineHeight: "1.4",
};

const fileDescriptionStyle = {
  fontSize: "0.875rem",
  color: "#cccccc",
  marginBottom: "0.75rem",
  lineHeight: "1.5",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  flex: 1,
};

const fileMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const fileCategoryStyle = {
  fontSize: "0.75rem",
  color: "#00d4ff",
  backgroundColor: "rgba(0, 212, 255, 0.1)",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
};

const fileDateStyle = {
  fontSize: "0.75rem",
  color: "#666666",
};

const cardActionsStyle = {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "flex-end",
  marginTop: "auto",
  paddingTop: "0.75rem",
  borderTop: "1px solid #333333",
};

const buttonDangerStyle = {
  ...buttonStyle,
  backgroundColor: "#dc3545",
  color: "#ffffff",
};

const buttonDangerHoverStyle = {
  backgroundColor: "#c82333",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
};

const messageStyle = {
  padding: "1rem",
  borderRadius: "6px",
  marginBottom: "1rem",
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const successMessageStyle = {
  ...messageStyle,
  backgroundColor: "rgba(40, 167, 69, 0.2)",
  color: "#28a745",
  border: "1px solid rgba(40, 167, 69, 0.3)",
};

const errorMessageStyle = {
  ...messageStyle,
  backgroundColor: "rgba(220, 53, 69, 0.2)",
  color: "#dc3545",
  border: "1px solid rgba(220, 53, 69, 0.3)",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  color: "inherit",
  fontSize: "1.2rem",
  cursor: "pointer",
  marginRight: "auto",
  padding: "0",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "3rem 1rem",
  color: "#999999",
};

const emptyStateIconStyle = {
  fontSize: "3rem",
  marginBottom: "1rem",
  opacity: 0.5,
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  color: "#999999",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #333333",
  borderTop: "3px solid #00d4ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "1rem",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "1.5rem",
  padding: "1rem",
};

const pageButtonStyle = {
  padding: "0.5rem 0.75rem",
  border: "1px solid #333333",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
};


const disabledPageButtonStyle = {
  ...pageButtonStyle,
  opacity: 0.5,
  cursor: "not-allowed",
};

const pageInfoStyle = {
  color: "#999999",
  fontSize: "0.875rem",
  margin: "0 1rem",
};

const progressContainerStyle = {
  marginTop: "1rem",
  backgroundColor: "#1a1a1a",
  borderRadius: "6px",
  padding: "0.75rem",
  border: "1px solid #333333",
};

const progressBarStyle = {
  width: "100%",
  height: "8px",
  backgroundColor: "#333333",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressFillStyle = (percent) => ({
  width: `${percent}%`,
  height: "100%",
  backgroundColor: "#00d4ff",
  transition: "width 0.3s ease",
});

const progressTextStyle = {
  marginTop: "0.5rem",
  fontSize: "0.75rem",
  color: "#cccccc",
  textAlign: "center",
};

export default function GuidelinesDashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "guideline",
    description: "",
    file: null,
    video_link: "",
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setFetching(true);
      const res = await axios.get("/api/docs-center-and-uploads");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت فایل‌ها");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file && !formData.id) {
      setError("لطفاً یک فایل را انتخاب کنید.");
      return;
    }
    setError("");
    setSuccessMsg("");
    setLoading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("video_link", formData.video_link);
      if (formData.file) data.append("file", formData.file);

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: formData.file
          ? (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          : undefined,
      };

      if (formData.id) {
        await axios.put(`/api/docs-center-and-uploads/${formData.id}`, data, config);
        setSuccessMsg("فایل با موفقیت بروزرسانی شد!");
      } else {
        await axios.post("/api/docs-center-and-uploads", data, config);
        setSuccessMsg("فایل با موفقیت ارسال شد!");
      }

      setFormData({
        id: null,
        name: "",
        category: "guideline",
        description: "",
        file: null,
        video_link: "",
      });
      setUploadProgress(0);
      await fetchFiles();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "خطا در ارسال/بروزرسانی فایل، دوباره تلاش کنید.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (file) => {
    setFormData({
      id: file.id,
      name: file.name,
      category: file.category,
      description: file.description,
      file: null,
      video_link: file.video_link,
    });
    setSuccessMsg("");
    setError("");
    // Scroll to form
    document
      .getElementById("upload-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید که می خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`/api/docs-center-and-uploads/${id}`);
      setSuccessMsg("فایل با موفقیت حذف شد");
      await fetchFiles();
    } catch (err) {
      setError("خطا در حذف فایل");
      console.error(err);
    }
  };

  const handleButtonHover = (e, isSecondary = false, isDanger = false) => {
    let style;
    if (isDanger) {
      style = buttonDangerHoverStyle;
    } else if (isSecondary) {
      style = buttonSecondaryHoverStyle;
    } else {
      style = buttonHoverStyle;
    }
    Object.assign(e.currentTarget.style, style);
  };

  const handleButtonLeave = (e, isSecondary = false, isDanger = false) => {
    let style;
    if (isDanger) {
      style = buttonDangerStyle;
    } else if (isSecondary) {
      style = buttonSecondaryStyle;
    } else {
      style = buttonStyle;
    }
    Object.assign(e.currentTarget.style, style);
  };

  const handleCardHover = (e) => {
    Object.assign(e.currentTarget.style, fileCardHoverStyle);
  };

  const handleCardLeave = (e) => {
    Object.assign(e.currentTarget.style, fileCardStyle);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "guideline":
        return "رهنمود ها";
      case "form":
        return "فورم ها";
      case "legal":
        return "اسناد تقنینی";
      default:
        return category;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic (from NewsForm.jsx)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const stats = {
    total: files.length,
    guidelines: files.filter((file) => file.category === "guideline").length,
    forms: files.filter((file) => file.category === "form").length,
    legal: files.filter((file) => file.category === "legal").length,
    standards: files.filter((file) => file.category === "standards").length,
    check_list: files.filter((file) => file.category === "check-list").length,
  };

  if (fetching) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>مرکز اسناد و دانلودها</h1>
        <p style={subtitleStyle}>
          مدیریت رهنمودها، فورم‌ها، اسناد تقنینی، ستندرد ها و چک لیست ها
        </p>

        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.total}</div>
            <div style={statLabelStyle}>کل فایل‌ها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.guidelines}</div>
            <div style={statLabelStyle}>رهنمودها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.forms}</div>
            <div style={statLabelStyle}>فورم‌ها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.legal}</div>
            <div style={statLabelStyle}>اسناد تقنینی</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.standards}</div>
            <div style={statLabelStyle}>ستندرد ها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.check_list}</div>
            <div style={statLabelStyle}>چک لیست ها</div>
          </div>
        </div>
      </div>

      <div id="upload-form" style={formContainerStyle}>
        <h3 style={{ marginBottom: "1.5rem", color: "#ffffff" }}>
          {formData.id ? "ویرایش فایل" : "آپلود فایل جدید"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              نام فایل
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="نام فایل را وارد کنید"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="file" style={labelStyle}>
              انتخاب فایل (Word, Excel, PDF) — تا ۱۰۰ مگابایت
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              required={!formData.id}
              style={fileInputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="category" style={labelStyle}>
              دسته بندی
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={selectStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, selectStyle)}
            >
              <option value="guideline">رهنمود ها</option>
              <option value="form">فورم ها</option>
              <option value="legal">اسناد تقنینی</option>
              <option value="standards">ستندرد ها</option>
              <option value="check-list">چک لیست ها</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="description" style={labelStyle}>
              توضیحات کوتاه
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیح کوتاه در مورد فایل"
              style={textareaStyle}
              onFocus={(e) =>
                Object.assign(e.target.style, {
                  ...textareaStyle,
                  ...inputFocusStyle,
                })
              }
              onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="video_link" style={labelStyle}>
              لینک ویدیو آموزشی
            </label>
            <input
              type="text"
              id="video_link"
              name="video_link"
              value={formData.video_link}
              onChange={handleChange}
              placeholder="اگر آموزشی ویدیویی در مورد سند وجود دارد لینک آنرا قرار دهید."
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => handleButtonHover(e)}
              onMouseLeave={(e) => handleButtonLeave(e)}
            >
              <span>{loading ? "⏳" : formData.id ? "✏️" : "📤"}</span>
              <span>
                {loading
                  ? formData.id
                    ? "در حال بروزرسانی..."
                    : "در حال ارسال..."
                  : formData.id
                  ? "بروزرسانی فایل"
                  : "ارسال فایل"}
              </span>
            </button>

            {formData.id && (
              <button
                type="button"
                style={buttonSecondaryStyle}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonLeave(e, true)}
                onClick={() =>
                  setFormData({
                    id: null,
                    name: "",
                    category: "guideline",
                    description: "",
                    file: null,
                    video_link: "",
                  })
                }
              >
                <span>❌</span>
                <span>لغو</span>
              </button>
            )}
          </div>

          {loading && uploadProgress > 0 && (
            <div style={progressContainerStyle}>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(uploadProgress)}></div>
              </div>
              <div style={progressTextStyle}>
                در حال ارسال: {uploadProgress}%
              </div>
            </div>
          )}
        </form>
      </div>

      {error && (
        <div style={errorMessageStyle}>
          <button onClick={() => setError("")} style={closeButtonStyle}>
            ✕
          </button>
          <span>❌ {error}</span>
        </div>
      )}

      {successMsg && (
        <div style={successMessageStyle}>
          <button onClick={() => setSuccessMsg("")} style={closeButtonStyle}>
            ✕
          </button>
          <span>✅ {successMsg}</span>
        </div>
      )}

      <div style={tableContainerStyle}>
        <h3 style={{ marginBottom: "1.5rem", color: "#ffffff" }}>
          فایل‌های آپلود شده
        </h3>

        {files.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📁</div>
            <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
              هیچ فایلی وجود ندارد
            </h4>
            <p style={{ color: "#999999" }}>
              هنوز هیچ فایلی در سیستم آپلود نشده است
            </p>
          </div>
        ) : (
          <>
            <div style={filesGridStyle}>
              {currentFiles.map((file) => (
                <div
                  key={file.id}
                  style={fileCardStyle}
                  onMouseEnter={handleCardHover}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={fileNameStyle}>{file.name}</h3>
                  {file.description && (
                    <p style={fileDescriptionStyle}>{file.description}</p>
                  )}
                  {file.video_link && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <a
                        href={file.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#00d4ff",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        <span>🎥</span>
                        <span>ویدیو آموزشی</span>
                      </a>
                    </div>
                  )}

                  <div style={fileMetaStyle}>
                    <span style={fileCategoryStyle}>
                      {getCategoryLabel(file.category)}
                    </span>
                    <span style={fileDateStyle}>
                      {formatDate(file.created_at || file.updated_at)}
                    </span>
                  </div>

                  <div style={cardActionsStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(file);
                      }}
                      style={buttonStyle}
                      onMouseEnter={(e) => handleButtonHover(e)}
                      onMouseLeave={(e) => handleButtonLeave(e)}
                    >
                      <span>✏️</span>
                      <span>ویرایش</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      style={buttonDangerStyle}
                      onMouseEnter={(e) => handleButtonHover(e, false, true)}
                      onMouseLeave={(e) => handleButtonLeave(e, false, true)}
                    >
                      <span>🗑️</span>
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={
                    currentPage === 1
                      ? disabledPageButtonStyle
                      : pageButtonStyle
                  }
                >
                  قبلی
                </button>
                <span style={pageInfoStyle}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={
                    currentPage === totalPages
                      ? disabledPageButtonStyle
                      : pageButtonStyle
                  }
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
