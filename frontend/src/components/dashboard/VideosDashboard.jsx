import React, { useState, useEffect } from "react";


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = `${API_BASE_URL}/api/media`;
const VIDEOS_PER_PAGE = 6;

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

const inputErrorStyle = {
  borderColor: "#dc3545",
  boxShadow: "0 0 0 2px rgba(220, 53, 69, 0.1)",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "100px",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const dragDropAreaStyle = {
  border: "2px dashed #333333",
  borderRadius: "8px",
  padding: "2rem",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: "#1a1a1a",
  marginBottom: "1.5rem",
};

const dragDropAreaHoverStyle = {
  borderColor: "#00d4ff",
  backgroundColor: "rgba(0, 212, 255, 0.05)",
};

const dragDropAreaActiveStyle = {
  borderColor: "#00d4ff",
  backgroundColor: "rgba(0, 212, 255, 0.1)",
};

const fileInputStyle = {
  display: "none",
};

const dragDropTextStyle = {
  fontSize: "1rem",
  color: "#cccccc",
  marginBottom: "0.5rem",
};

const dragDropSubtextStyle = {
  fontSize: "0.875rem",
  color: "#666666",
};

const videoPreviewStyle = {
  width: "100%",
  maxHeight: "300px",
  borderRadius: "8px",
  border: "1px solid #333333",
  marginBottom: "1.5rem",
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

const progressContainerStyle = {
  marginTop: "1rem",
  marginBottom: "1rem",
};

const progressBarStyle = {
  width: "100%",
  height: "8px",
  backgroundColor: "#333333",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressFillStyle = {
  height: "100%",
  backgroundColor: "#00d4ff",
  borderRadius: "4px",
  transition: "width 0.3s ease",
};

const progressTextStyle = {
  fontSize: "0.875rem",
  color: "#cccccc",
  marginTop: "0.5rem",
  textAlign: "center",
};

const errorMessageStyle = {
  color: "#dc3545",
  fontSize: "0.875rem",
  marginTop: "0.5rem",
};

const controlsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  gap: "1rem",
  flexWrap: "wrap",
};

const searchInputStyle = {
  flex: 1,
  minWidth: "250px",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  border: "1px solid #333333",
  borderRadius: "6px",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const searchInputFocusStyle = {
  borderColor: "#00d4ff",
  boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
};

const videosGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "1rem",
};

const videoCardStyle = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  border: "1px solid #333333",
  overflow: "hidden",
  transition: "all 0.2s ease",
};

const videoCardHoverStyle = {
  borderColor: "#00d4ff",
  transform: "translateY(-2px)",
  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
};

const videoElementStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  backgroundColor: "#000000",
};

const videoCardBodyStyle = {
  padding: "1rem",
};

const videoTitleStyle = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "0.5rem",
  lineHeight: "1.4",
};

const videoCategoryStyle = {
  fontSize: "0.75rem",
  color: "#00d4ff",
  backgroundColor: "rgba(0, 212, 255, 0.1)",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  display: "inline-block",
  marginBottom: "0.75rem",
};

const videoDescriptionStyle = {
  fontSize: "0.875rem",
  color: "#cccccc",
  marginBottom: "1rem",
  lineHeight: "1.5",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const cardActionsStyle = {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "flex-end",
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

const activePageButtonStyle = {
  ...pageButtonStyle,
  backgroundColor: "#00d4ff",
  color: "#000000",
  borderColor: "#00d4ff",
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

function VideoUploadDashboard() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [isObjectURL, setIsObjectURL] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");

  const [videos, setVideos] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (isObjectURL && videoURL) {
        try {
          URL.revokeObjectURL(videoURL);
        } catch (e) {}
      }
    };
  }, [isObjectURL, videoURL]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/videos`);
      if (!res.ok) throw new Error("خطا در بارگذاری لیست ویدیوها");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file) => {
    setVideoError("");
    setYoutubeLinkError("");
    if (file && file.type.startsWith("video/")) {
      // revoke previous object URL if present
      if (isObjectURL && videoURL) {
        try {
          URL.revokeObjectURL(videoURL);
        } catch (e) {}
      }
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
      setIsObjectURL(true);
      // clear youtube link when a file is chosen
      setYoutubeLink("");
    } else {
      setVideoFile(null);
      setVideoURL("");
      setVideoError("لطفاً یک فایل ویدیویی معتبر انتخاب کنید.");
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const validateFields = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError("عنوان ویدیو را وارد کنید.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!description.trim()) {
      setDescriptionError("توضیحات ویدیو را وارد کنید.");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (!category) {
      setCategoryError("دسته‌بندی را انتخاب کنید.");
      valid = false;
    } else {
      setCategoryError("");
    }

    // Require a source: either an uploaded file, a YouTube link, or when editing an existing video keep its current URL
    if (!videoFile && !youtubeLink.trim() && !(editingVideoId && videoURL)) {
      setVideoError(
        "لطفاً ابتدا یک ویدیو آپلود کنید یا لینک یوتیوب وارد کنید."
      );
      valid = false;
    } else {
      setVideoError("");
    }

    // If a youtube link is provided, do a basic validation
    if (youtubeLink && youtubeLink.trim()) {
      const yt = youtubeLink.trim();
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;
      if (!ytRegex.test(yt)) {
        setYoutubeLinkError("لطفاً یک لینک یوتیوب معتبر وارد کنید.");
        valid = false;
      } else {
        setYoutubeLinkError("");
      }
    } else {
      setYoutubeLinkError("");
    }

    return valid;
  };

  const uploadVideo = () => {
    if (!validateFields()) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (youtubeLink && youtubeLink.trim()) {
      formData.append("youtubeLink", youtubeLink.trim());
    }
    if (videoFile) formData.append("video", videoFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(100);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          JSON.parse(xhr.responseText);
          alert(
            editingVideoId
              ? "ویرایش با موفقیت انجام شد!"
              : "آپلود با موفقیت انجام شد!"
          );
          setTitle("");
          setDescription("");
          setCategory("");
          setVideoFile(null);
          // revoke object URL if we created one
          if (isObjectURL && videoURL) {
            try {
              URL.revokeObjectURL(videoURL);
            } catch (e) {}
          }
          setVideoURL("");
          setIsObjectURL(false);
          setYoutubeLink("");
          setEditingVideoId(null);
          fetchVideos();
        } catch {
          alert("پاسخ سرور معتبر نیست.");
        }
      } else {
        let message = "خطا در آپلود فایل";
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.message) message = data.message;
        } catch {}
        alert(message);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      alert("مشکلی در آپلود ویدیو پیش آمد.");
    };

    xhr.open(
      editingVideoId ? "PUT" : "POST",
      `${API_BASE}/video${editingVideoId ? `/${editingVideoId}` : ""}`
    );
    xhr.withCredentials = true;
    const token = localStorage.getItem("token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این ویدیو را حذف کنید؟"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/video/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("خطا در حذف ویدیو");
      alert("حذف با موفقیت انجام شد!");
      await fetchVideos();
    } catch (err) {
      alert(err.message);
    }
  };

  const editVideo = (video) => {
    setEditingVideoId(video.id);
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    // If the existing video object has a youtubeLink use it, otherwise set videoURL to the video URL
    setVideoFile(null);
    setIsObjectURL(false);
    if (isYouTubeUrl(video.videoUrl)) {
      setYoutubeLink(video.videoUrl);
      setVideoURL("");
    } else {
      setYoutubeLink("");
      setVideoURL(video.videoUrl);
    }
    // Scroll to form
    document
      .getElementById("upload-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingVideoId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setVideoFile(null);
    if (isObjectURL && videoURL) {
      try {
        URL.revokeObjectURL(videoURL);
      } catch (e) {}
    }
    setVideoURL("");
    setIsObjectURL(false);
    setYoutubeLink("");
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
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
    Object.assign(e.currentTarget.style, videoCardHoverStyle);
  };

  const handleCardLeave = (e) => {
    Object.assign(e.currentTarget.style, videoCardStyle);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "teacher-staff-programs":
        return "برنامه های آموزشی استادان و کارمندان";
      case "workshops":
        return "ورکشاپ ها";
      case "seminars":
        return "سیمینار ها";
      case "online-programs":
        return "برنامه های آنلاین آموزشی";
      default:
        return category;
    }
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return /youtube\.com|youtu\.be/i.test(url);
  };

  const toYouTubeEmbed = (url) => {
    if (!url) return url;
    // try to extract video id
    const idMatch = url.match(/(?:v=|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const id = idMatch ? idMatch[1] : null;
    if (id) return `https://www.youtube.com/embed/${id}`;
    // fallback conversions
    if (url.includes("watch")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(
    startIndex,
    startIndex + VIDEOS_PER_PAGE
  );

  const stats = {
    total: videos.length,
    teacherStaff: videos.filter((v) => v.category === "teacher-staff-programs")
      .length,
    workshops: videos.filter((v) => v.category === "workshops-seminars").length,
    technical: videos.filter((v) => v.category === "technical-capacity-courses")
      .length,
    online: videos.filter((v) => v.category === "online-programs").length,
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
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
        <h1 style={titleStyle}>مدیریت ویدیوها</h1>
        <p style={subtitleStyle}>آپلود و مدیریت ویدیوهای آموزشی</p>

        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.total}</div>
            <div style={statLabelStyle}>کل ویدیوها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.teacherStaff}</div>
            <div style={statLabelStyle}>استادان و کارمندان</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.workshops}</div>
            <div style={statLabelStyle}>ورکشاپ ها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.technical}</div>
            <div style={statLabelStyle}>ظرفیت تخنیکی</div>
          </div>
        </div>
      </div>

      <div id="upload-form" style={formContainerStyle}>
        <h3 style={{ marginBottom: "1.5rem", color: "#ffffff" }}>
          {editingVideoId ? "ویرایش ویدیو" : "آپلود ویدیو جدید"}
        </h3>

        <div style={formGroupStyle}>
          <label style={labelStyle}>عنوان ویدیو:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان ویدیو را وارد کنید"
            style={{
              ...inputStyle,
              ...(titleError ? inputErrorStyle : {}),
            }}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          {titleError && <div style={errorMessageStyle}>{titleError}</div>}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>توضیحات ویدیو:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات ویدیو را وارد کنید"
            rows="3"
            style={{
              ...textareaStyle,
              ...(descriptionError ? inputErrorStyle : {}),
            }}
            onFocus={(e) =>
              Object.assign(e.target.style, {
                ...textareaStyle,
                ...inputFocusStyle,
              })
            }
            onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
          />
          {descriptionError && (
            <div style={errorMessageStyle}>{descriptionError}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>دسته‌بندی:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              ...selectStyle,
              ...(categoryError ? inputErrorStyle : {}),
            }}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, selectStyle)}
          >
            <option value="">انتخاب کنید</option>
            <option value="teacher-staff-programs">
              برنامه های آموزشی استادان و کارمندان
            </option>
            <option value="seminars">سیمینار ها</option>
            <option value="workshops">ورکشاپ ها</option>
            <option value="online-programs">برنامه های آنلاین آموزشی</option>
          </select>
          {categoryError && (
            <div style={errorMessageStyle}>{categoryError}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>لینک یوتیوب (اختیاری):</label>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => {
              setYoutubeLink(e.target.value);
              // if user types a link, clear selected file
              if (e.target.value) {
                if (isObjectURL && videoURL) {
                  try {
                    URL.revokeObjectURL(videoURL);
                  } catch (err) {}
                }
                setVideoFile(null);
                setVideoURL("");
                setIsObjectURL(false);
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{
              ...inputStyle,
              ...(youtubeLinkError ? inputErrorStyle : {}),
            }}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          {youtubeLinkError && (
            <div style={errorMessageStyle}>{youtubeLinkError}</div>
          )}
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            ...dragDropAreaStyle,
            ...(isDragOver ? dragDropAreaActiveStyle : {}),
          }}
          onClick={() => document.getElementById("video-file-input").click()}
        >
          <div style={dragDropTextStyle}>
            {isDragOver
              ? "فایل را اینجا رها کنید"
              : "فایل ویدیو را انتخاب کنید"}
          </div>
          <div style={dragDropSubtextStyle}>
            یا فایل را اینجا بکشید و رها کنید
          </div>
          <input
            id="video-file-input"
            type="file"
            style={fileInputStyle}
            accept="video/*"
            onChange={onFileInputChange}
          />
          {videoError && <div style={errorMessageStyle}>{videoError}</div>}
        </div>

        {/* Preview for uploaded video */}
        {videoURL && (
          <div>
            <video src={videoURL} controls style={videoPreviewStyle} />
          </div>
        )}

        {/* Preview for YouTube link if no uploaded video is shown */}
        {!videoURL && youtubeLink && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ marginBottom: "0.5rem", color: "#ffffff" }}>
              پیش‌نمایش یوتیوب:
            </div>
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
              }}
            >
              <iframe
                title="youtube-preview"
                src={
                  youtubeLink.includes("embed")
                    ? youtubeLink
                    : youtubeLink.includes("watch")
                    ? youtubeLink.replace("watch?v=", "embed/")
                    : youtubeLink.includes("youtu.be")
                    ? youtubeLink.replace("youtu.be/", "www.youtube.com/embed/")
                    : youtubeLink
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "8px",
                }}
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button
            onClick={uploadVideo}
            disabled={uploading}
            style={buttonStyle}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e)}
          >
            <span>{uploading ? "⏳" : editingVideoId ? "✏️" : "📤"}</span>
            <span>
              {uploading
                ? `${
                    editingVideoId ? "در حال ویرایش" : "در حال آپلود"
                  }... ${progress}%`
                : editingVideoId
                ? "ویرایش ویدیو"
                : "آپلود ویدیو"}
            </span>
          </button>

          {editingVideoId && (
            <button
              onClick={cancelEdit}
              style={buttonSecondaryStyle}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonLeave(e, true)}
            >
              <span>❌</span>
              <span>لغو ویرایش</span>
            </button>
          )}
        </div>

        {uploading && (
          <div style={progressContainerStyle}>
            <div style={progressBarStyle}>
              <div style={{ ...progressFillStyle, width: `${progress}%` }} />
            </div>
            <div style={progressTextStyle}>{progress}% تکمیل شده</div>
          </div>
        )}
      </div>

      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="جستجوی عنوان ویدیو..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            ...searchInputStyle,
            ...(searchFocused ? searchInputFocusStyle : {}),
          }}
        />
      </div>

      {currentVideos.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyStateIconStyle}>🎥</div>
          <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
            {searchTerm ? "هیچ ویدیویی یافت نشد" : "هیچ ویدیویی وجود ندارد"}
          </h3>
          <p style={{ marginBottom: "1.5rem", color: "#999999" }}>
            {searchTerm
              ? `هیچ ویدیویی با عبارت "${searchTerm}" یافت نشد`
              : "هنوز هیچ ویدیویی در سیستم آپلود نشده است"}
          </p>
        </div>
      ) : (
        <>
          <div style={videosGridStyle}>
            {currentVideos.map((video) => (
              <div
                key={video.id}
                style={videoCardStyle}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                {isYouTubeUrl(video.videoUrl) ? (
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                    }}
                  >
                    <iframe
                      title={`yt-${video.id}`}
                      src={toYouTubeEmbed(video.videoUrl)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={video.videoUrl}
                    controls
                    style={videoElementStyle}
                  />
                )}
                <div style={videoCardBodyStyle}>
                  <h3 style={videoTitleStyle}>{video.title}</h3>
                  <span style={videoCategoryStyle}>
                    {getCategoryLabel(video.category)}
                  </span>
                  {video.description && (
                    <p style={videoDescriptionStyle}>{video.description}</p>
                  )}

                  <div style={cardActionsStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editVideo(video);
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
                        deleteVideo(video.id);
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
                  currentPage === 1 ? disabledPageButtonStyle : pageButtonStyle
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VideoUploadDashboard;
