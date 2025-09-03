import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const SpecificInstitute = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [center, setCenter] = useState(null);
  const [personnel, setPersonnel] = useState(null);
  const [students, setStudents] = useState([]);
  const [laylia, setLaylia] = useState([]);
  const [visionMission, setVisionMission] = useState(null);
  const [standards, setStandards] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academyFacilities, setAcademyFacilities] = useState([]);
  const [classFacilities, setClassFacilities] = useState([]);
  const [practicalFacilities, setPracticalFacilities] = useState([]);
  const [stakeholderInvolvement, setStakeholderInvolvement] = useState(null);
  const [profileDocuments, setProfileDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personnelLoading, setPersonnelLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [layliaLoading, setLayliaLoading] = useState(false);
  const [visionMissionLoading, setVisionMissionLoading] = useState(false);
  const [standardsLoading, setStandardsLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [academyFacilitiesLoading, setAcademyFacilitiesLoading] =
    useState(false);
  const [classFacilitiesLoading, setClassFacilitiesLoading] = useState(false);
  const [practicalFacilitiesLoading, setPracticalFacilitiesLoading] =
    useState(false);
  const [stakeholderInvolvementLoading, setStakeholderInvolvementLoading] =
    useState(false);
  const [profileDocumentsLoading, setProfileDocumentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personnelError, setPersonnelError] = useState(null);
  const [studentsError, setStudentsError] = useState(null);
  const [layliaError, setLayliaError] = useState(null);
  const [visionMissionError, setVisionMissionError] = useState(null);
  const [standardsError, setStandardsError] = useState(null);
  const [departmentsError, setDepartmentsError] = useState(null);
  const [academyFacilitiesError, setAcademyFacilitiesError] = useState(null);
  const [classFacilitiesError, setClassFacilitiesError] = useState(null);
  const [practicalFacilitiesError, setPracticalFacilitiesError] =
    useState(null);
  const [stakeholderInvolvementError, setStakeholderInvolvementError] =
    useState(null);
  const [profileDocumentsError, setProfileDocumentsError] = useState(null);

  // Add print styles
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-container, .print-container * {
          visibility: visible;
        }
        .print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
          background: white;
          color: black;
        }
        .no-print {
          display: none !important;
        }
        .print-section {
          page-break-inside: avoid;
          margin-bottom: 20px;
          padding: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #f2f2f2 !important;
          color: black !important;
        }
        h1, h2, h3, h4, h5, h6, p, div, span {
          color: black !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        // Validate that userId is a number
        if (!userId || isNaN(parseInt(userId))) {
          setError("شناسه کاربر نامعتبر است");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/educational-centers/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        setCenter(response.data.center);
      } catch (err) {
        console.error("Error fetching center:", err);
        if (err.response?.status === 404) {
          setError("مرکز آموزشی یافت نشد");
        } else if (err.response?.status === 401) {
          setError("دسترسی غیرمجاز");
        } else {
          setError("خطا در دریافت اطلاعات مرکز آموزشی");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [userId]);

  // Fetch personnel data
  useEffect(() => {
    const fetchPersonnel = async () => {
      if (!userId) return;

      setPersonnelLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/personnel/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        setPersonnel(response.data);
      } catch (err) {
        console.error("Error fetching personnel data:", err);
        setPersonnelError("خطا در دریافت اطلاعات کارکنان");
      } finally {
        setPersonnelLoading(false);
      }
    };

    fetchPersonnel();
  }, [userId]);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!userId) return;

      setStudentsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setStudents(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching students data:", err);
        setStudentsError("خطا در دریافت اطلاعات شاگردان");
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [userId]);

  // Fetch laylia data
  useEffect(() => {
    const fetchLaylia = async () => {
      if (!userId) return;

      setLayliaLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/laylia/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setLaylia(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching laylia data:", err);
        setLayliaError("خطا در دریافت اطلاعات لیلیه");
      } finally {
        setLayliaLoading(false);
      }
    };

    fetchLaylia();
  }, [userId]);

  // Fetch vision-mission data
  useEffect(() => {
    const fetchVisionMission = async () => {
      if (!userId) return;

      setVisionMissionLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vision-mission/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setVisionMission(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching vision-mission data:", err);
        setVisionMissionError("خطا در دریافت اطلاعات دیدگاه و ماموریت");
      } finally {
        setVisionMissionLoading(false);
      }
    };

    fetchVisionMission();
  }, [userId]);

  // Fetch standards data
  useEffect(() => {
    const fetchStandards = async () => {
      if (!userId) return;

      setStandardsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/standards/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setStandards(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching standards data:", err);
        setStandardsError("خطا در دریافت اطلاعات ستندردها");
      } finally {
        setStandardsLoading(false);
      }
    };

    fetchStandards();
  }, [userId]);

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userId) return;

      setDepartmentsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setDepartments(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching departments data:", err);
        setDepartmentsError("خطا در دریافت اطلاعات رشته‌ها");
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [userId]);

  // Fetch academy facilities data
  useEffect(() => {
    const fetchAcademyFacilities = async () => {
      if (!userId) return;

      setAcademyFacilitiesLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/academy-facilities/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setAcademyFacilities(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching academy facilities data:", err);
        setAcademyFacilitiesError("خطا در دریافت اطلاعات امکانات آکادمیک");
      } finally {
        setAcademyFacilitiesLoading(false);
      }
    };

    fetchAcademyFacilities();
  }, [userId]);

  // Fetch class facilities data
  useEffect(() => {
    const fetchClassFacilities = async () => {
      if (!userId) return;

      setClassFacilitiesLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/class-facilities/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setClassFacilities(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching class facilities data:", err);
        setClassFacilitiesError("خطا در دریافت اطلاعات امکانات صنوف");
      } finally {
        setClassFacilitiesLoading(false);
      }
    };

    fetchClassFacilities();
  }, [userId]);

  // Fetch practical facilities data
  useEffect(() => {
    const fetchPracticalFacilities = async () => {
      if (!userId) return;

      setPracticalFacilitiesLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/practical-facilities/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setPracticalFacilities(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching practical facilities data:", err);
        setPracticalFacilitiesError("خطا در دریافت اطلاعات امکانات عملی");
      } finally {
        setPracticalFacilitiesLoading(false);
      }
    };

    fetchPracticalFacilities();
  }, [userId]);

  // Fetch stakeholder involvement data
  useEffect(() => {
    const fetchStakeholderInvolvement = async () => {
      if (!userId) return;

      setStakeholderInvolvementLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stakeholder-involvement/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setStakeholderInvolvement(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching stakeholder involvement data:", err);
        setStakeholderInvolvementError(
          "خطا در دریافت اطلاعات دخیل سازی ذینفعان"
        );
      } finally {
        setStakeholderInvolvementLoading(false);
      }
    };

    fetchStakeholderInvolvement();
  }, [userId]);

  // Fetch profile documents data
  useEffect(() => {
    const fetchProfileDocuments = async () => {
      if (!userId) return;

      setProfileDocumentsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile-documents/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setProfileDocuments(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching profile documents data:", err);
        setProfileDocumentsError("خطا در دریافت اطلاعات سندهای پروفایل");
      } finally {
        setProfileDocumentsLoading(false);
      }
    };

    fetchProfileDocuments();
  }, [userId]);

  // Download standard file
  const handleDownloadFile = async (standardId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/standards/download/${standardId}`,
        {
          withCredentials: true,
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("خطا در دانلود فایل");
    }
  };

  // Download document
  const handleDownloadDocument = async (file_path, file_name) => {
    try {
      // Encode the file path to handle special characters
      const encodedPath = encodeURIComponent(file_path);

      // Open the download URL in a new window/tab
      // This will automatically include cookies for authentication
      window.open(
        `http://localhost:5000/api/profile-documents/download/${encodedPath}`,
        "_blank"
      );
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("خطا در دانلود سند");
    }
  };

  if (loading) {
    return (
      <div
        className="text-center p-4"
        style={{
          background: theme === "light" ? "#f8fafd" : "#121212",
          minHeight: "100vh",
        }}
      >
        <CircularProgress
          style={{ color: theme === "light" ? "#0dcaf0" : "#007bff" }}
        />
        <div
          className="mt-3 loading-text"
          style={{ color: theme === "light" ? "#23283a" : "#ffffff" }}
        >
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: theme === "light" ? "#f8fafd" : "#121212",
          minHeight: "100vh",
        }}
        className="px-4 py-8"
      >
        <div
          className="alert alert-danger error-container"
          role="alert"
          style={{
            background: theme === "light" ? "#fff0f0" : "#1e1e1e",
            border: "1px solid #dc3545",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Theme colors from Banner component with dark mode support
  const themeColors = {
    // Primary colors (cyan blue theme from Banner)
    primary: "#0dcaf0",
    primaryDark: "#00b5d7",
    primaryLight: "#a9e5ff",

    // Text and background
    text: theme === "light" ? "#2c3e50" : "#f8f9fa",
    background: theme === "light" ? "#f8f9fa" : "#121212",

    // UI elements
    border: theme === "light" ? "#dee2e6" : "#2d2d2d",
    cardBg: theme === "light" ? "#ffffff" : "#1e1e1e",

    // Status colors
    success: theme === "light" ? "#28a745" : "#34ce57",
    error: theme === "light" ? "#dc3545" : "#ff6b6b",

    // Interactive states
    hoverBg: theme === "light" ? "#f0f8ff" : "#2a2a2a",
    buttonHover: "#00b5d7",

    // Table styling
    tableHeaderBg: "linear-gradient(135deg, #00b5d7 0%, #0dcaf0 100%)",
    tableRowEven: theme === "light" ? "#f8f9fa" : "#252525",
    tableRowHover: theme === "light" ? "#e9f7fe" : "#2d2d2d",
  };

  return (
    <div
      className="specific-institute-container"
      style={{
        background: themeColors.background,
        minHeight: "100vh",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="no-print"
        style={{
          width: "100%",
          maxWidth: "1200px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          style={{
            marginBottom: "20px",
            backgroundColor: themeColors.primary,
            color: "#030305",
            fontWeight: "600",
            "&:hover": {
              backgroundColor: themeColors.buttonHover,
            },
          }}
        >
          چاپ اطلاعات
        </Button>
      </div>

      <div className="print-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <h1
            style={{
              color: themeColors.text,
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0",
              textAlign: "center",
            }}
          >
            مرکز آموزشی
          </h1>
        </div>

        {/* Three Stages */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "40px",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <div
            style={{
              background: themeColors.cardBg,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${themeColors.primary}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "150px",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background = themeColors.hoverBg;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.background = themeColors.cardBg;
            }}
          >
            <h2
              style={{
                color: themeColors.primary,
                margin: "0",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              مرحله اول
            </h2>
          </div>

          <div
            style={{
              background: theme === "light" ? "#ffffff" : "#1e1e1e",
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${themeColors.primary}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "150px",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background = themeColors.hoverBg;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.background = themeColors.cardBg;
            }}
          >
            <h2
              style={{
                color: themeColors.primary,
                margin: "0",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              مرحله دوم
            </h2>
          </div>

          <div
            style={{
              background: theme === "light" ? "#ffffff" : "#1e1e1e",
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${themeColors.primary}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "150px",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background = themeColors.hoverBg;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.background = themeColors.cardBg;
            }}
          >
            <h2
              style={{
                color: themeColors.primary,
                margin: "0",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              مرحله سوم
            </h2>
          </div>
        </div>

        {/* Educational Center Information and Personnel Data Container */}
        <div
          className="main-container"
          style={{
            borderRadius: "10px",
            padding: "25px",
            border: `1px solid ${themeColors.border}`,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            background: theme === "light" ? "#ffffff" : "#1a1a1a",
          }}
        >
          {/* Educational Center Information */}
          {center && (
            <div>
              <h3
                className="section-title"
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                معلومات عمومی مرکز آموزشی
              </h3>

              <div
                className="table-container"
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم مرکز
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        ولایت
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        ولسوالی
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        قریه
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نوع مرکز
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        برنامه
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        سال تاسیس
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        مسئول
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تماس
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        ایمیل
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        مرحله ۱
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        مرحله ۲
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        مرحله ۳
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        background: themeColors.tableRowEven,
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: themeColors.tableRowHover,
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.centerName || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.province || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.district || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.village || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.centerType || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.programType || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.foundingYear || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.contactName || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.phoneNumber || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {center.email || "نامشخص"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color:
                            center.stage1 === 1
                              ? themeColors.success
                              : themeColors.error,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                          background:
                            center.stage1 === 1
                              ? `${themeColors.success}20`
                              : `${themeColors.error}20`,
                        }}
                      >
                        {center.stage1 === 1 ? "✓" : "✗"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color:
                            center.stage2 === 1
                              ? themeColors.success
                              : themeColors.error,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                          background:
                            center.stage2 === 1
                              ? `${themeColors.success}20`
                              : `${themeColors.error}20`,
                        }}
                      >
                        {center.stage2 === 1 ? "✓" : "✗"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color:
                            center.stage3 === 1
                              ? themeColors.success
                              : themeColors.error,
                          fontSize: "0.8rem",
                          textAlign: "center",
                          fontWeight: "bold",
                          background:
                            center.stage3 === 1
                              ? `${themeColors.success}20`
                              : `${themeColors.error}20`,
                        }}
                      >
                        {center.stage3 === 1 ? "✓" : "✗"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Personnel Information */}
          {personnel && (
            <div style={{ marginTop: "40px" }}>
              <h3
                className="section-title"
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                معلومات کارکنان
              </h3>

              <div
                className="table-container"
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  className="personnel-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        دسته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        دوکتور
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        ماستر
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        لیسانس
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        فوق بکلوریا
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        بکلوریا
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        صنف دوازدهم
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        background: themeColors.tableRowEven,
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: themeColors.tableRowHover,
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        استادان
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.teachers_phd || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.teachers_master || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.teachers_bachelor || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        -
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        -
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        -
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: themeColors.tableRowEven,
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: themeColors.tableRowHover,
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        کارکن تخنیکی
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.technical_phd || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.technical_master || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.technical_bachelor || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.technical_above_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.technical_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        {personnel.technical_elementary || 0}
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: themeColors.tableRowEven,
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: themeColors.tableRowHover,
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        کارکن اداری
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.admin_phd || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.admin_master || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.admin_bachelor || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.admin_above_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.admin_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        {personnel.admin_elementary || 0}
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: themeColors.tableRowEven,
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: themeColors.tableRowHover,
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        کارکن خدماتی
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        -
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        -
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.service_bachelor || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.service_above_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          borderRight: `1px solid ${themeColors.border}`,
                          textAlign: "center",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {personnel.service_baccalaureate || 0}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: themeColors.text,
                          fontSize: "0.8rem",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        {personnel.service_elementary || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Students Information */}
          {students.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                تعداد شاگردان بر اساس رشته
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        جدید شمولان
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        مجموعی شاگرد
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        دوره فراغت
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        سال تاسیس
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {student.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {student.newEnrollments || 0}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {student.totalStudents || 0}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {student.graduationCycles || 0}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {student.establishmentYear || "نامشخص"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Laylia Information */}
          {laylia.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                تعداد شاگردان شامل لیلیه
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شاگردان شامل لیلیه
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شاگردان بدل عاشه
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laylia.map((entry, index) => (
                      <tr
                        key={entry.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {entry.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {entry.newEnrollments || 0}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {entry.totalStudents || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vision Mission Information */}
          {visionMission && (
            <div style={{ marginTop: "40px" }}>
              <h3
                className="section-title"
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                دیدگاه، ماموریت و اهداف استراتیژیک
              </h3>

              <div
                className="vision-mission-container"
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                  background: themeColors.cardBg,
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "25px" }}>
                  <h4
                    style={{
                      color: themeColors.primary,
                      marginBottom: "15px",
                      fontSize: "1.1rem",
                      borderBottom: `1px solid ${themeColors.border}`,
                      paddingBottom: "8px",
                    }}
                  >
                    دیدگاه مرکز آموزشی
                  </h4>
                  <div
                    className="vision-mission-content"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      padding: "15px",
                      borderRadius: "6px",
                      border: `1px solid ${
                        theme === "light" ? "#e0e0e0" : "#4a5568"
                      }`,
                      whiteSpace: "pre-wrap",
                      minHeight: "80px",
                    }}
                  >
                    {visionMission.vision || "هیچ دیدگاهی ثبت نشده است"}
                  </div>
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <h4
                    style={{
                      color: themeColors.primary,
                      marginBottom: "15px",
                      fontSize: "1.1rem",
                      borderBottom: "1px solid #333",
                      paddingBottom: "8px",
                    }}
                  >
                    ماموریت مرکز آموزشی
                  </h4>
                  <div
                    className="vision-mission-content"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      padding: "15px",
                      borderRadius: "6px",
                      border: `1px solid ${
                        theme === "light" ? "#e0e0e0" : "#4a5568"
                      }`,
                      whiteSpace: "pre-wrap",
                      minHeight: "80px",
                    }}
                  >
                    {visionMission.mission || "هیچ ماموریتی ثبت نشده است"}
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      color: themeColors.primary,
                      marginBottom: "15px",
                      fontSize: "1.1rem",
                      borderBottom: "1px solid #333",
                      paddingBottom: "8px",
                    }}
                  >
                    اهداف استراتیژیک مرکز آموزشی
                  </h4>
                  <div
                    className="vision-mission-content"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      padding: "15px",
                      borderRadius: "6px",
                      border: `1px solid ${
                        theme === "light" ? "#e0e0e0" : "#4a5568"
                      }`,
                      whiteSpace: "pre-wrap",
                      minHeight: "80px",
                    }}
                  >
                    {visionMission.strategic_goals ||
                      "هیچ هدف استراتیژیکی ثبت نشده است"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standards Information */}
          {standards.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                className="section-title"
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                ستندردها و معیارات
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        عنوان ستندرد
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نام فایل
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نوع فایل
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تاریخ ایجاد
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {standards.map((standard, index) => (
                      <tr
                        key={standard.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {standard.standard_title || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            onClick={() =>
                              handleDownloadFile(
                                standard.id,
                                standard.original_file_name
                              )
                            }
                            style={{
                              cursor: "pointer",
                              color: themeColors.primary,
                              textDecoration: "underline",
                              transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.color = themeColors.primaryDark)
                            }
                            onMouseOut={(e) =>
                              (e.target.style.color = themeColors.primary)
                            }
                            title="کلیک کنید تا دانلود کنید"
                          >
                            {standard.original_file_name || "نامشخص"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {standard.file_type || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(standard.created_at).toLocaleDateString(
                            "fa-IR"
                          ) || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          <button
                            className="download-button"
                            onClick={() =>
                              handleDownloadFile(
                                standard.id,
                                standard.original_file_name
                              )
                            }
                            style={{
                              background: themeColors.primary,
                              color: "#030305",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              transition: "background-color 0.2s ease",
                              fontWeight: "600",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.background =
                                themeColors.buttonHover)
                            }
                            onMouseOut={(e) =>
                              (e.target.style.background = themeColors.primary)
                            }
                          >
                            دانلود
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Departments Information */}
          {departments.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                رشته‌های موجود در مرکز آموزشی
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        سال ایجاد
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        دوره آموزشی
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وضعیت
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تعداد اساتید
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تعداد محصل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department, index) => (
                      <tr
                        key={department.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.new_enrollments || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.total_students || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.graduation_cycles || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.establishment_year || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {department.number_of_students || "نامشخص"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Academy Facilities Information */}
          {academyFacilities.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                امکانات آکادمیک مرکز آموزشی
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        امکانات اساسی
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تعداد وسیله
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وضعیت وسیله
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {academyFacilities.map((facility, index) => (
                      <tr
                        key={facility.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.basic_facilities || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_count || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_status || "نامشخص"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Class Facilities Information */}
          {classFacilities.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                تجهیزات درسی داخل صنوف
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وسیله درسی
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تعداد وسیله
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وضعیت وسیله
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classFacilities.map((facility, index) => (
                      <tr
                        key={facility.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_count || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_status === "excellent" && "عالی"}
                          {facility.equipment_status === "good" && "خوب"}
                          {facility.equipment_status === "average" && "متوسط"}
                          {facility.equipment_status === "poor" && "ضعیف"}
                          {!["excellent", "good", "average", "poor"].includes(
                            facility.equipment_status
                          ) && facility.equipment_status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Practical Facilities Information */}
          {practicalFacilities.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                تسهیلات و تجهیزات کار عملی
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        اسم رشته
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وسیله کار عملی
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        تعداد وسیله
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        وضعیت وسیله
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {practicalFacilities.map((facility, index) => (
                      <tr
                        key={facility.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? themeColors.tableRowEven
                              : themeColors.tableRowOdd,
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_name || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            borderRight: `1px solid ${themeColors.border}`,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_count || "نامشخص"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            color: themeColors.text,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {facility.equipment_status === "excellent" && "عالی"}
                          {facility.equipment_status === "good" && "خوب"}
                          {facility.equipment_status === "average" && "متوسط"}
                          {facility.equipment_status === "poor" && "ضعیف"}
                          {!["excellent", "good", "average", "poor"].includes(
                            facility.equipment_status
                          ) && facility.equipment_status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stakeholder Involvement Information */}
          {stakeholderInvolvement && stakeholderInvolvement.description && (
            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                دخیل سازی ذینفعان در پروسه آموزشی
              </h3>

              <div
                className="stakeholder-container"
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                  background: themeColors.cardBg,
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "25px" }}>
                  <h4
                    style={{
                      color: themeColors.primary,
                      marginBottom: "15px",
                      fontSize: "1.1rem",
                      borderBottom: `1px solid ${themeColors.border}`,
                      paddingBottom: "8px",
                    }}
                  >
                    شیوه های دخیل سازی و میزان مشارکت ذینفعان
                  </h4>
                  <div
                    className="stakeholder-content"
                    style={{
                      color: themeColors.text,
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      padding: "15px",
                      background: "#2d3748",
                      borderRadius: "6px",
                      border: "1px solid #4a5568",
                      whiteSpace: "pre-wrap",
                      minHeight: "120px",
                    }}
                  >
                    {stakeholderInvolvement.description ||
                      "هیچ اطلاعاتی ثبت نشده است"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Documents Information */}
          {profileDocuments.length > 0 && (
            <div className="no-print" style={{ marginTop: "40px" }}>
              <h3
                style={{
                  color: themeColors.primary,
                  marginBottom: "25px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                اسناد و مدارک ضمیموی
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  width: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: themeColors.cardBg,
                    fontSize: "0.85rem",
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                        borderBottom: `2px solid ${themeColors.primary}`,
                      }}
                    >
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        شماره
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نوع سند
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نام فایل
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        نوع فایل
                      </th>
                      <th
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                          color: themeColors.lightText,
                          padding: "14px 10px",
                          fontSize: "0.85rem",
                          border: "none",
                          textAlign: "center",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileDocuments.map((document, index) => {
                      // Get document label based on document type
                      const docIndex =
                        parseInt(
                          document.document_type
                            .replace("doc", "")
                            .replace("_path", "")
                        ) - 1;
                      const documentLabels = [
                        "مکتوب منظوری دیدگاه، ماموریت و اهداف مرکز آموزشی",
                        "مکتوب تائید پلان استراتیژیک",
                        "پلان استراتیژیک مرکز آموزشی",
                        "چارت تشکیلاتی و شهرت پرسونل مرکز آموزشی",
                        "مکاتیب و اسناد (تفاهمنامه ها) ارتباط با ذینفعان رشته های موجود",
                        "مکاتیب منظوری ایجاد رشته ها در مرکز",
                        "اسناد و مدارک به روز رسانی نصاب تعلیمی",
                        "اسناد و مدارک تطبیق استندرد ها و معیارات",
                        "اسناد و مدارک (تصاویر) ساختار های موجود (کتابخانه، ورکشاپ، فارم تحقیقاتی و لابراتوار)",
                        "اسناد و مدارک فعالیت کمیته های کاری (طرزالعمل کاری،کتب ثبت جلسات، فیصله ها و اجراات",
                        "اسناد و مدارک انجام کارات عملی",
                        "اسناد و مدارک ارزیابی کارمندان و اساتید",
                        "مکاتیب تدویر کورس های حمایوی آموزشی",
                        "مکاتیب ارسال شاگردان به دوره پرکتیک",
                        "اسناد و مدارک فعالیت شاگردان روی پروژی های کار عملی",
                      ];

                      return (
                        <tr
                          key={document.id}
                          style={{
                            background:
                              index % 2 === 0
                                ? themeColors.tableRowEven
                                : themeColors.tableRowOdd,
                            borderBottom: `1px solid ${themeColors.border}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 8px",
                              color: themeColors.text,
                              fontSize: "0.8rem",
                              borderRight: `1px solid ${themeColors.border}`,
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              color: themeColors.text,
                              fontSize: "0.8rem",
                              borderRight: `1px solid ${themeColors.border}`,
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {documentLabels[docIndex] || "نامشخص"}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              color: themeColors.text,
                              fontSize: "0.8rem",
                              borderRight: `1px solid ${themeColors.border}`,
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {document.file_name || "نامشخص"}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              color: themeColors.text,
                              fontSize: "0.8rem",
                              borderRight: `1px solid ${themeColors.border}`,
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {document.file_type || "نامشخص"}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              color: themeColors.text,
                              fontSize: "0.8rem",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            <button
                              className="download-button"
                              onClick={() =>
                                handleDownloadDocument(
                                  document.file_path,
                                  document.file_name
                                )
                              }
                              style={{
                                background: themeColors.primary,
                                color: "#030305",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                                fontWeight: "600",
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.background =
                                  themeColors.buttonHover)
                              }
                              onMouseOut={(e) =>
                                (e.target.style.background =
                                  themeColors.primary)
                              }
                            >
                              دانلود
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Show error for vision-mission data */}
          {visionMissionError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {visionMissionError}
              </div>
            </div>
          )}

          {/* Show loading for standards data */}
          {standardsLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات ستندردها...
              </div>
            </div>
          )}

          {/* Show error for standards data */}
          {standardsError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {standardsError}
              </div>
            </div>
          )}

          {/* Show loading for departments data */}
          {departmentsLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات رشته‌ها...
              </div>
            </div>
          )}

          {/* Show error for departments data */}
          {departmentsError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {departmentsError}
              </div>
            </div>
          )}

          {/* Show loading for personnel data */}
          {personnelLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات کارکنان...
              </div>
            </div>
          )}

          {/* Show error for personnel data */}
          {personnelError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {personnelError}
              </div>
            </div>
          )}

          {/* Show loading for students data */}
          {studentsLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات شاگردان...
              </div>
            </div>
          )}

          {/* Show error for students data */}
          {studentsError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {studentsError}
              </div>
            </div>
          )}

          {/* Show loading for laylia data */}
          {layliaLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات لیلیه...
              </div>
            </div>
          )}

          {/* Show error for laylia data */}
          {layliaError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {layliaError}
              </div>
            </div>
          )}

          {/* Show loading for vision-mission data */}
          {visionMissionLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات دیدگاه و ماموریت...
              </div>
            </div>
          )}

          {/* Show error for departments data */}
          {departmentsError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {departmentsError}
              </div>
            </div>
          )}

          {/* Show loading for academy facilities data */}
          {academyFacilitiesLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات امکانات آکادمیک...
              </div>
            </div>
          )}

          {/* Show error for academy facilities data */}
          {academyFacilitiesError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {academyFacilitiesError}
              </div>
            </div>
          )}

          {/* Show loading for class facilities data */}
          {classFacilitiesLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات تجهیزات صنوف...
              </div>
            </div>
          )}

          {/* Show error for class facilities data */}
          {classFacilitiesError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {classFacilitiesError}
              </div>
            </div>
          )}

          {/* Show loading for practical facilities data */}
          {practicalFacilitiesLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات تجهیزات عملی...
              </div>
            </div>
          )}

          {/* Show error for practical facilities data */}
          {practicalFacilitiesError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {practicalFacilitiesError}
              </div>
            </div>
          )}

          {/* Show loading for stakeholder involvement data */}
          {stakeholderInvolvementLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات دخیل سازی ذینفعان...
              </div>
            </div>
          )}

          {/* Show error for stakeholder involvement data */}
          {stakeholderInvolvementError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {stakeholderInvolvementError}
              </div>
            </div>
          )}

          {/* Show loading for profile documents data */}
          {profileDocumentsLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <CircularProgress style={{ color: "#007bff" }} />
              <div style={{ color: "#ffffff", marginTop: "10px" }}>
                در حال بارگذاری معلومات سندهای پروفایل...
              </div>
            </div>
          )}

          {/* Show error for profile documents data */}
          {profileDocumentsError && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: themeColors.cardBg,
                  border: "1px solid #dc3545",
                  color: "#ff6b6b",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {profileDocumentsError}
              </div>
            </div>
          )}
        </div>

        {/* Theme-aware styling */}
        <style>{`
        ${
          theme === "light"
            ? `
          /* Light theme styles */
          .specific-institute-container {
            background: #f8fafd !important;
            color: #23283a !important;
          }
          .specific-institute-container .table-container {
            border: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container table {
            background: #ffffff !important;
          }
          .specific-institute-container thead tr {
            background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%) !important;
            border-bottom: 2px solid #0dcaf0 !important;
          }
          .specific-institute-container th {
            color: #23283a !important;
            border-right: 1px solid #b6eaff !important;
          }
          .specific-institute-container tbody tr {
            background: #f8fafd !important;
            border-bottom: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container tbody tr:nth-child(even) {
            background: #ffffff !important;
          }
          .specific-institute-container td {
            color: #23283a !important;
            border-right: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container .section-title {
            color: #0dcaf0 !important;
          }
          .specific-institute-container .main-container {
            background: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container .vision-mission-container {
            background: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container .vision-mission-content {
            background: #f8fafd !important;
            border: 1px solid #e0e0e0 !important;
            color: #23283a !important;
          }
          .specific-institute-container .stakeholder-container {
            background: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
          }
          .specific-institute-container .stakeholder-content {
            background: #f8fafd !important;
            border: 1px solid #e0e0e0 !important;
            color: #23283a !important;
          }
          .specific-institute-container .download-button {
            background: #0dcaf0 !important;
            color: #030305 !important;
          }
          .specific-institute-container .download-button:hover {
            background: #00b5d7 !important;
          }
          .specific-institute-container .loading-text {
            color: #23283a !important;
          }
          .specific-institute-container .error-container {
            background: #fff0f0 !important;
            border: 1px solid #dc3545 !important;
            color: #ff6b6b !important;
          }
          /* Personnel table first column styling for light theme */
          .specific-institute-container .personnel-table td:first-child {
            color: #23283a !important;
            background: #f0f8ff !important;
            font-weight: bold !important;
          }
        `
            : `
          /* Dark theme styles */
          .specific-institute-container {
            background: #121212 !important;
            color: #ffffff !important;
          }
          .specific-institute-container .table-container {
            border: 1px solid #333 !important;
          }
          .specific-institute-container table {
            background: #1e1e1e !important;
          }
          .specific-institute-container thead tr {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
            border-bottom: 2px solid #007bff !important;
          }
          .specific-institute-container th {
            color: #ffffff !important;
            border-right: 1px solid #4a5568 !important;
          }
          .specific-institute-container tbody tr {
            background: #2d3748 !important;
            border-bottom: 1px solid #4a5568 !important;
          }
          .specific-institute-container tbody tr:nth-child(even) {
            background: #1a202c !important;
          }
          .specific-institute-container td {
            color: #e2e8f0 !important;
            border-right: 1px solid #4a5568 !important;
          }
          .specific-institute-container .section-title {
            color: #0dcaf0 !important;
          }
          .specific-institute-container .main-container {
            background: #1a1a1a !important;
            border: 1px solid #333 !important;
          }
          .specific-institute-container .vision-mission-container {
            background: #1e1e1e !important;
            border: 1px solid #333 !important;
          }
          .specific-institute-container .vision-mission-content {
            background: #2d3748 !important;
            border: 1px solid #4a5568 !important;
            color: #e2e8f0 !important;
          }
          .specific-institute-container .stakeholder-container {
            background: #1e1e1e !important;
            border: 1px solid #333 !important;
          }
          .specific-institute-container .stakeholder-content {
            background: #2d3748 !important;
            border: 1px solid #4a5568 !important;
            color: #e2e8f0 !important;
          }
          .specific-institute-container .download-button {
            background: #0dcaf0 !important;
            color: #030305 !important;
          }
          .specific-institute-container .download-button:hover {
            background: #00b5d7 !important;
          }
          .specific-institute-container .loading-text {
            color: #ffffff !important;
          }
          .specific-institute-container .error-container {
            background: #1e1e1e !important;
            border: 1px solid #dc3545 !important;
            color: #ff6b6b !important;
          }
          /* Personnel table first column styling for dark theme */
          .specific-institute-container .personnel-table td:first-child {
            color: #e2e8f0 !important;
            background: #1a202c !important;
            font-weight: bold !important;
          }
        `
        }
      `}</style>
      </div>
    </div>
  );
};

export default SpecificInstitute;
