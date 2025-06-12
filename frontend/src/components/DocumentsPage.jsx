import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DocumentsPage = () => {
  const { type } = useParams();
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryTranslations = {
    guidelines: "رهنمودها",
    forms: "فرم‌ها",
    "legal-docs": "اسناد حقوقی",
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`/api/documents?type=${type}`);
        setDocuments(res.data);
        setFilteredDocs(res.data);
      } catch (err) {
        console.error("خطا در دریافت اسناد:", err);
        setError("دریافت اسناد با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [type]);

  useEffect(() => {
    const results = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDocs(results);
  }, [searchTerm, documents]);

  return (
    <div className="container mt-4" dir="rtl">
      <h2 className="mb-4">اسناد مربوط به: {categoryTranslations[type] || type}</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="جستجو براساس نام، توضیحات یا دسته‌بندی..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && filteredDocs.length === 0 && (
        <p>هیچ سندی مطابق با جستجوی شما یافت نشد.</p>
      )}

      {!loading && !error && filteredDocs.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>نام سند</th>
                <th>توضیحات</th>
                <th>فایل</th>
                <th>تاریخ آپلود</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.description}</td>
                  <td>
                    <a
                      href={`http://localhost:5000/uploads/files/${doc.fileName}`}
                      className="btn btn-sm btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      مشاهده / دانلود
                    </a>
                  </td>
                  <td>{new Date(doc.uploadDate).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
