import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GuidelinesDashboard() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "guideline",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/docs-center-and-uploads");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
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

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      if (formData.file) data.append("file", formData.file);

      if (formData.id) {
        // Update existing
        await axios.put(`/api/docs-center-and-uploads/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("فایل با موفقیت بروزرسانی شد!");
      } else {
        // New upload
        await axios.post("/api/docs-center-and-uploads", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("فایل با موفقیت ارسال شد!");
      }

      setFormData({
        id: null,
        name: "",
        category: "guideline",
        description: "",
        file: null,
      });
      fetchFiles();
    } catch (err) {
      setError("خطا در ارسال/بروزرسانی فایل، دوباره تلاش کنید.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (file) => {
    setFormData({
      id: file.id,
      name: file.name,
      category: file.category,
      description: file.description,
      file: null,
    });
    setSuccessMsg("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید که می خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`/api/docs-center-and-uploads/${id}`);
      setSuccessMsg("فایل با موفقیت حذف شد");
      fetchFiles();
    } catch (err) {
      setError("خطا در حذف فایل");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>داشبورد رهنمودها، فورم‌ها و اسناد تقنینی</h2>

      <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">نام فایل</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="نام فایل را وارد کنید"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            انتخاب فایل (Word, Excel, PDF)
          </label>
          <input
            type="file"
            className="form-control"
            id="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            required={!formData.id} 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">دسته بندی</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="guideline">رهنمود ها</option>
            <option value="form">فورم ها</option>
            <option value="legal">اسناد تقنینی</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">توضیحات کوتاه</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیح کوتاه در مورد فایل"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (formData.id ? "در حال بروزرسانی..." : "در حال ارسال...") : formData.id ? "بروزرسانی فایل" : "ارسال فایل"}
        </button>

        {formData.id && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() =>
              setFormData({ id: null, name: "", category: "guideline", description: "", file: null })
            }
          >
            لغو
          </button>
        )}
      </form>

      <hr />

      <h3>فایل‌های آپلود شده</h3>
      <ul className="list-group">
        {files.length === 0 && <li className="list-group-item">هیچ فایلی وجود ندارد</li>}
        {files.map((file) => (
          <li
            key={file.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{file.name}</strong> ({file.category})<br />
              <small>{file.description}</small>
            </div>
            <div>
              <button
                onClick={() => handleEdit(file)}
                className="btn btn-outline-warning btn-sm me-2"
              >
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="btn btn-outline-danger btn-sm"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
