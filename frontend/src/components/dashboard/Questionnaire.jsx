import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const ACCENT = "#0dcaf0";
const DARK_BG = "#121212";
const BTN_TEXT = "#030305";

const Questionnaire = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("form");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = React.useRef();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  const CATEGORY_LABELS = {
    form: "فرم",
    "check-list": "چک لیست",
    questionnaire: "پرسشنامه",
  };

  const searchContainerStyle = {
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    border: `1px solid ${ACCENT}`,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 12,
  };
  const searchInputStyle = {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    background: "#222",
    color: "#fff",
    border: `1.5px solid ${ACCENT}`,
    outline: "none",
    borderRadius: "6px",
    width: 260,
    paddingLeft: "2.2rem",
  };
  const searchIconStyle = {
    position: "absolute",
    left: 18,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#888",
    fontSize: "1rem",
  };

  // Fetch all questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await fetch("/api/questionnaires", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setQuestionnaires(data.data || []);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchQuestionnaires();
  }, [success]); // refetch on successful upload

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (file) formData.append("file", file);

      // Use XMLHttpRequest for progress
      await new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.open("POST", "/api/questionnaires");
        xhr.withCredentials = true;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          let data;
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            setError("خطای سرور یا ارتباط با سرور.");
            setUploadProgress(0);
            reject();
            return;
          }
          if (xhr.status === 201 && data.success) {
            setSuccess("پرسش نامه با موفقیت ذخیره شد!");
            setTitle("");
            setDescription("");
            setCategory("form");
            setFile(null);
            setUploadProgress(0);
            resolve();
          } else {
            setError(data.message || "خطا در ذخیره پرسشنامه");
            setUploadProgress(0);
            reject();
          }
        };
        xhr.onerror = () => {
          setError("خطا در ارتباط با سرور");
          setUploadProgress(0);
          reject();
        };
        xhr.send(formData);
      });
    } catch (err) {
      // error already handled
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q) => {
    setTitle(q.title);
    setDescription(q.description || "");
    setCategory(q.category || "form");
    setFile(null); // Don't prefill file
    setEditingId(q.id);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (file) formData.append("file", file);
      await new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.open("PUT", `/api/questionnaires/${editingId}`);
        xhr.withCredentials = true;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = async () => {
          let data;
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            setError("خطای سرور یا ارتباط با سرور.");
            setUploadProgress(0);
            reject();
            return;
          }
          if (xhr.status === 200 && data.success) {
            setSuccess("پرسشنامه با موفقیت به‌روزرسانی شد!");
            setTitle("");
            setDescription("");
            setCategory("form");
            setFile(null);
            setEditingId(null);
            setUploadProgress(0);
            // Refresh list
            const refreshed = await fetch("/api/questionnaires", {
              credentials: "include",
            });
            const refreshedData = await refreshed.json();
            if (refreshed.ok && refreshedData.success)
              setQuestionnaires(refreshedData.data || []);
            resolve();
          } else {
            setError(data.message || "خطا در به‌روزرسانی پرسشنامه");
            setUploadProgress(0);
            reject();
          }
        };
        xhr.onerror = () => {
          setError("خطا در ارتباط با سرور");
          setUploadProgress(0);
          reject();
        };
        xhr.send(formData);
      });
    } catch (err) {
      // error already handled
    } finally {
      setLoading(false);
    }
  };

  // Delete questionnaire
  const handleDelete = async (id) => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این پرسشنامه را حذف کنید؟")
    )
      return;
    try {
      const response = await fetch(`/api/questionnaires/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setQuestionnaires((qs) => qs.filter((q) => q.id !== id));
      } else {
        setError(data.message || "خطا در حذف پرسشنامه");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  // Filtered and paginated questionnaires
  const filtered = questionnaires.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      (q.description &&
        q.description.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE
  );

  return (
    <div
      style={{
        background: DARK_BG,
        boxShadow: "0 4px 24px #0dcaf033",
        padding: "2.5rem 2rem",
        textAlign: "right",
        color: "#fff",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          marginBottom: 28,
          fontWeight: 900,
          color: ACCENT,
          letterSpacing: 0.5,
          textShadow: "0 2px 12px #0dcaf044",
        }}
      >
        افزودن پرسش نامه جدید
      </h2>
      <form onSubmit={editingId ? handleUpdate : handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600, color: "#fff" }}>
            عنوان پرسشنامه:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: `1.5px solid #333`,
              marginTop: 6,
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box",
              background: "#181818",
              color: "#fff",
            }}
            onFocus={(e) => (e.target.style.border = `1.5px solid ${ACCENT}`)}
            onBlur={(e) =>
              (e.target.style.border = title
                ? `1.5px solid ${ACCENT}`
                : "1.5px solid #333")
            }
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600, color: "#fff" }}>توضیحات:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: `1.5px solid #333`,
              marginTop: 6,
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box",
              background: "#181818",
              color: "#fff",
            }}
            onFocus={(e) => (e.target.style.border = `1.5px solid ${ACCENT}`)}
            onBlur={(e) =>
              (e.target.style.border = description
                ? `1.5px solid ${ACCENT}`
                : "1.5px solid #333")
            }
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontWeight: 600,
              color: "#fff",
              display: "block",
              marginBottom: 6,
            }}
          >
            نوع:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: `1.5px solid #333`,
              background: "#181818",
              color: "#fff",
              width: 260,
            }}
            onFocus={(e) => (e.target.style.border = `1.5px solid ${ACCENT}`)}
            onBlur={(e) =>
              (e.target.style.border = category
                ? `1.5px solid ${ACCENT}`
                : "1.5px solid #333")
            }
          >
            <option value="form">فرم</option>
            <option value="check-list">چک لیست</option>
            <option value="questionnaire">پرسشنامه</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontWeight: 600,
              color: "#fff",
              display: "block",
              marginBottom: 8,
            }}
          >
            فایل (PDF یا Word):
            <span style={{ color: "#aaa", fontSize: "0.9em", marginLeft: 8 }}>
              (حداکثر 10MB)
            </span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              style={{
                background: file ? "#198754" : ACCENT,
                color: BTN_TEXT,
                border: "none",
                padding: "0.6rem 1.5rem",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px #0dcaf044",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                outline: file ? "2px solid #198754" : "none",
              }}
            >
              {file ? "فایل انتخاب شد" : "انتخاب فایل"}
            </button>
            <span
              style={{
                color: file ? ACCENT : "#aaa",
                fontSize: "0.98rem",
                direction: "ltr",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: file ? 700 : 400,
              }}
            >
              {file
                ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                : "فایلی انتخاب نشده"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) {
                const allowedTypes = [
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
                if (
                  !allowedTypes.includes(selected.type) &&
                  !/\.docx?$|\.pdf$/i.test(selected.name)
                ) {
                  setError("فقط فایل PDF یا Word مجاز است");
                  setFile(null);
                  return;
                }
                if (selected.size > 10 * 1024 * 1024) {
                  setError("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد");
                  setFile(null);
                  return;
                }
                setFile(selected);
                setError("");
              } else {
                setFile(null);
              }
            }}
            style={{ display: "none" }}
          />
          {uploadProgress > 0 && (
            <div style={{ marginTop: 10, width: "100%" }}>
              <div
                style={{
                  height: 8,
                  background: "#222",
                  width: "100%",
                  position: "relative",
                  border: "1px solid #333",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: ACCENT,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.9em", color: ACCENT, marginTop: 2 }}>
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: ACCENT,
            color: BTN_TEXT,
            border: "none",
            borderRadius: 8,
            padding: "0.9rem 2.2rem",
            fontWeight: 800,
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px #0dcaf044",
            letterSpacing: 0.5,
            marginTop: 8,
            transition: "all 0.2s",
          }}
        >
          {loading
            ? "در حال ذخیره..."
            : editingId
            ? "به‌روزرسانی پرسشنامه"
            : "ذخیره پرسش نامه"}
        </button>
      </form>
      {success && (
        <div style={{ color: ACCENT, marginTop: 18, fontWeight: 600 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ color: "#ff6b6b", marginTop: 18, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* List of uploaded questionnaires as cards */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ color: ACCENT, fontWeight: 800, marginBottom: 16 }}>
          پرسشنامه‌های آپلود شده
        </h3>
        <div style={searchContainerStyle}>
          <div style={{ position: "relative", flex: 1 }}>
            <FaSearch style={searchIconStyle} />
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان یا توضیحات..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={searchInputStyle}
            />
          </div>
          <span style={{ color: "#aaa", fontSize: "0.98rem", marginRight: 12 }}>
            {filtered.length} نتیجه
          </span>
        </div>
        {paginated.length === 0 ? (
          <div style={{ color: "#aaa" }}>هیچ پرسشنامه‌ای وجود ندارد.</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              justifyContent: "flex-start",
            }}
          >
            {paginated.map((q) => (
              <div
                key={q.id}
                style={{
                  background: "#181818",
                  border: `1.5px solid ${ACCENT}`,
                  boxShadow: "0 6px 32px #0dcaf033",
                  padding: "2rem 1.5rem",
                  color: "#fff",
                  minWidth: 270,
                  flex: "1 1 320px",
                  maxWidth: 370,
                  marginBottom: 18,
                  borderLeft:
                    editingId === q.id ? `8px solid #198754` : undefined,
                  position: "relative",
                  transition: "box-shadow 0.2s, border 0.2s",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "1.15rem",
                    color: ACCENT,
                    marginBottom: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  {q.title}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      background: "#222",
                      color: "#aaa",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {CATEGORY_LABELS[q.category] || q.category}
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: 14,
                    color: "#ccc",
                    fontSize: "1.01rem",
                    minHeight: 32,
                  }}
                >
                  {q.description}
                </div>
                <div style={{ marginBottom: 14 }}>
                  {q.file_url ? (
                    <a
                      href={`http://localhost:5000/uploads/${q.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: ACCENT,
                        fontWeight: 700,
                        textDecoration: "underline",
                      }}
                    >
                      دانلود فایل
                    </a>
                  ) : (
                    <span style={{ color: "#aaa" }}>فایلی وجود ندارد</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button
                    onClick={() => handleEdit(q)}
                    style={{
                      background: ACCENT,
                      color: BTN_TEXT,
                      border: "none",
                      padding: "0.5rem 1.2rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontSize: "1rem",
                      boxShadow: "0 2px 8px #0dcaf044",
                      outline:
                        editingId === q.id ? "2px solid #198754" : "none",
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{
                      background: "#ff6b6b",
                      color: "#fff",
                      border: "none",
                      padding: "0.5rem 1.2rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontSize: "1rem",
                      boxShadow: "0 2px 8px #ff6b6b44",
                    }}
                  >
                    حذف
                  </button>
                </div>
                {editingId === q.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      color: "#198754",
                      fontWeight: 900,
                      fontSize: "0.95rem",
                    }}
                  >
                    در حال ویرایش
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              gap: 8,
            }}
          >
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                background: ACCENT,
                color: BTN_TEXT,
                border: "none",
                padding: "0.5rem 1.2rem",
                fontWeight: 700,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              قبلی
            </button>
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                margin: "0 12px",
              }}
            >
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{
                background: ACCENT,
                color: BTN_TEXT,
                border: "none",
                padding: "0.5rem 1.2rem",
                fontWeight: 700,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
