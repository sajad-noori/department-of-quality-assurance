import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/media";
const VIDEOS_PER_PAGE = 5;

function VideoUploadDashboard() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [videoError, setVideoError] = useState("");

  const [videos, setVideos] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    fetch(`${API_BASE}/videos`)
      .then((res) => {
        if (!res.ok) throw new Error("خطا در بارگذاری لیست ویدیوها");
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => alert(err.message));
  };

  const handleFileChange = (file) => {
    setVideoError("");
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
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

    if (!editingVideoId && !videoFile) {
      setVideoError("لطفاً ابتدا یک ویدیو انتخاب کنید.");
      valid = false;
    } else {
      setVideoError("");
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
          alert(editingVideoId ? "ویرایش با موفقیت انجام شد!" : "آپلود با موفقیت انجام شد!");
          setTitle("");
          setDescription("");
          setCategory("");
          setVideoFile(null);
          setVideoURL("");
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

    xhr.open(editingVideoId ? "PUT" : "POST", `${API_BASE}/video${editingVideoId ? `/${editingVideoId}` : ""}`);
    xhr.send(formData);
  };

  const deleteVideo = (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این ویدیو را حذف کنید؟")) return;

    fetch(`${API_BASE}/video/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در حذف ویدیو");
        alert("حذف با موفقیت انجام شد!");
        fetchVideos();
      })
      .catch((err) => alert(err.message));
  };

  const editVideo = (video) => {
    setEditingVideoId(video.id);
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    setVideoURL(video.videoUrl);
    setVideoFile(null);
  };

  const cancelEdit = () => {
    setEditingVideoId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setVideoFile(null);
    setVideoURL("");
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

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <div className="container mt-5 mb-5" style={{ direction: "rtl", textAlign: "right", maxWidth: 800 }}>
      <h2 className="mb-4">داشبورد آپلود ویدیو</h2>

      {/* Upload Form */}
      <div className="mb-3">
        <label className="form-label">عنوان ویدیو:</label>
        <input
          type="text"
          className={`form-control ${titleError ? "is-invalid" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {titleError && <div className="invalid-feedback d-block">{titleError}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">توضیحات ویدیو:</label>
        <textarea
          className={`form-control ${descriptionError ? "is-invalid" : ""}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
        {descriptionError && <div className="invalid-feedback d-block">{descriptionError}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">دسته‌بندی:</label>
        <select
          className={`form-select ${categoryError ? "is-invalid" : ""}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">انتخاب کنید</option>
          <option value="teacher-staff-programs">برنامه های آموزشی استادان و کارمندان</option>
          <option value="workshops-seminars">ورکشاپ ها و سیمینار ها</option>
          <option value="technical-capacity-courses">دوره های ارتقا ظرفیت تخنیکی و مسلکی</option>
          <option value="online-programs">برنامه های آنلاین آموزشی</option>
        </select>
        {categoryError && <div className="invalid-feedback d-block">{categoryError}</div>}
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-3 p-4 border rounded ${isDragOver ? "bg-light border-primary" : "bg-white"}`}
        style={{ textAlign: "center", cursor: "pointer" }}
      >
        <p className="mb-2">یا فایل را اینجا بکشید و رها کنید</p>
        <input
          type="file"
          className="form-control"
          accept="video/*"
          onChange={onFileInputChange}
        />
        {videoError && <div className="text-danger mt-2">{videoError}</div>}
      </div>

      {videoURL && (
        <div className="mb-3">
          <video src={videoURL} controls className="w-100 rounded" style={{ maxHeight: 300 }} />
        </div>
      )}

      <button onClick={uploadVideo} disabled={uploading} className="btn btn-primary w-100">
        {uploading ? `در حال ${editingVideoId ? "ویرایش" : "آپلود"}... ${progress}%` : editingVideoId ? "ویرایش ویدیو" : "آپلود ویدیو"}
      </button>

      {editingVideoId && (
        <button onClick={cancelEdit} className="btn btn-secondary mt-2 w-100">لغو ویرایش</button>
      )}

      {uploading && (
        <div className="progress mt-3" style={{ height: "10px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
            style={{ width: `${progress}%` }}
            role="progressbar"
          />
        </div>
      )}

      <hr className="my-5" />

      {/* Video List */}
      <h3>ویدیوهای آپلود شده</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="جستجوی عنوان ویدیو..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {currentVideos.length === 0 ? (
        <p>هیچ ویدیویی یافت نشد.</p>
      ) : (
        <div className="row">
          {currentVideos.map((video) => (
            <div key={video.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <video
                  src={video.videoUrl}
                  controls
                  className="card-img-top"
                  style={{ maxHeight: 200, objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{video.title}</h5>
                  <p className="card-text text-muted">{video.category}</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-info" onClick={() => editVideo(video)}>ویرایش</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteVideo(video.id)}>حذف</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>قبلی</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 && "active"}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>بعدی</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default VideoUploadDashboard;
