import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const SpecificInstitute = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
  const [academyFacilitiesLoading, setAcademyFacilitiesLoading] = useState(false);
  const [classFacilitiesLoading, setClassFacilitiesLoading] = useState(false);
  const [practicalFacilitiesLoading, setPracticalFacilitiesLoading] = useState(false);
  const [stakeholderInvolvementLoading, setStakeholderInvolvementLoading] = useState(false);
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
  const [practicalFacilitiesError, setPracticalFacilitiesError] = useState(null);
  const [stakeholderInvolvementError, setStakeholderInvolvementError] = useState(null);
  const [profileDocumentsError, setProfileDocumentsError] = useState(null);

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        // Validate that userId is a number
        if (!userId || isNaN(parseInt(userId))) {
          setError('شناسه کاربر نامعتبر است');
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
        console.error('Error fetching center:', err);
        if (err.response?.status === 404) {
          setError('مرکز آموزشی یافت نشد');
        } else if (err.response?.status === 401) {
          setError('دسترسی غیرمجاز');
        } else {
          setError('خطا در دریافت اطلاعات مرکز آموزشی');
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
        console.error('Error fetching personnel data:', err);
        setPersonnelError('خطا در دریافت اطلاعات کارکنان');
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
        console.error('Error fetching students data:', err);
        setStudentsError('خطا در دریافت اطلاعات شاگردان');
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
        console.error('Error fetching laylia data:', err);
        setLayliaError('خطا در دریافت اطلاعات لیلیه');
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
        console.error('Error fetching vision-mission data:', err);
        setVisionMissionError('خطا در دریافت اطلاعات دیدگاه و ماموریت');
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
        console.error('Error fetching standards data:', err);
        setStandardsError('خطا در دریافت اطلاعات ستندردها');
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
        console.error('Error fetching departments data:', err);
        setDepartmentsError('خطا در دریافت اطلاعات رشته‌ها');
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
        console.error('Error fetching academy facilities data:', err);
        setAcademyFacilitiesError('خطا در دریافت اطلاعات امکانات آکادمیک');
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
        console.error('Error fetching class facilities data:', err);
        setClassFacilitiesError('خطا در دریافت اطلاعات امکانات صنوف');
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
        console.error('Error fetching practical facilities data:', err);
        setPracticalFacilitiesError('خطا در دریافت اطلاعات امکانات عملی');
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
        console.error('Error fetching stakeholder involvement data:', err);
        setStakeholderInvolvementError('خطا در دریافت اطلاعات دخیل سازی ذینفعان');
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
        console.error('Error fetching profile documents data:', err);
        setProfileDocumentsError('خطا در دریافت اطلاعات سندهای پروفایل');
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
          responseType: 'blob', // Important for file downloads
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('خطا در دانلود فایل');
    }
  };

  // Download document
  const handleDownloadDocument = async (file_path, file_name) => {
    try {
      // Encode the file path to handle special characters
      const encodedPath = encodeURIComponent(file_path);
      
      // Open the download URL in a new window/tab
      // This will automatically include cookies for authentication
      window.open(`http://localhost:5000/api/profile-documents/download/${encodedPath}`, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('خطا در دانلود سند');
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4" style={{ background: '#121212', minHeight: '100vh' }}>
        <CircularProgress style={{ color: '#007bff' }} />
        <div className="mt-3" style={{ color: '#ffffff' }}>در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#121212', minHeight: '100vh' }} className="px-4 py-8">
        <div className="alert alert-danger" role="alert" style={{ background: '#1e1e1e', border: '1px solid #dc3545', color: '#ff6b6b' }}>
          {error}
        </div>

      </div>
    );
  }

  return (
    <div style={{ 
      background: '#121212', 
      minHeight: '100vh', 
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '30px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0',
          textAlign: 'center'
        }}>مرکز آموزشی</h1>
      </div>
      
      {/* Three Stages */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '40px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <div style={{ 
          background: '#1e1e1e', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #007bff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '150px',
          textAlign: 'center'
        }} 
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.background = '#2a2a2a';
        }} 
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.background = '#1e1e1e';
        }}>
          <h2 style={{ 
            color: '#007bff', 
            margin: '0', 
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>مرحله اول</h2>
        </div>
        
        <div style={{ 
          background: '#1e1e1e', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #28a745',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '150px',
          textAlign: 'center'
        }} 
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.background = '#2a2a2a';
        }} 
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.background = '#1e1e1e';
        }}>
          <h2 style={{ 
            color: '#28a745', 
            margin: '0', 
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>مرحله دوم</h2>
        </div>
        
        <div style={{ 
          background: '#1e1e1e', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #ffc107',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '150px',
          textAlign: 'center'
        }} 
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.background = '#2a2a2a';
        }} 
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.background = '#1e1e1e';
        }}>
          <h2 style={{ 
            color: '#ffc107', 
            margin: '0', 
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>مرحله سوم</h2>
        </div>
      </div>

      {/* Educational Center Information and Personnel Data Container */}
      <div style={{ 
        borderRadius: '10px', 
        padding: '25px',
        border: '1px solid #333',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#1a1a1a'
      }}>
        {/* Educational Center Information */}
        {center && (
          <div>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>معلومات عمومی مرکز آموزشی</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم مرکز</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ولایت</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ولسوالی</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>قریه</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نوع مرکز</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>برنامه</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>سال تاسیس</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>مسئول</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تماس</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ایمیل</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>مرحله ۱</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>مرحله ۲</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>مرحله ۳</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ 
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568'
                  }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.centerName || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.province || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.district || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.village || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.centerType || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.programType || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.foundingYear || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.contactName || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.phoneNumber || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{center.email || 'نامشخص'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: center.stage1 === 1 ? '#48bb78' : '#f56565',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: center.stage1 === 1 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)'
                    }}>{center.stage1 === 1 ? '✓' : '✗'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: center.stage2 === 1 ? '#48bb78' : '#f56565',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: center.stage2 === 1 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)'
                    }}>{center.stage2 === 1 ? '✓' : '✗'}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: center.stage3 === 1 ? '#48bb78' : '#f56565',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: center.stage3 === 1 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)'
                    }}>{center.stage3 === 1 ? '✓' : '✗'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Personnel Information */}
        {personnel && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>معلومات کارکنان</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>دسته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>دوکتور</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ماستر</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>لیسانس</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>فوق بکلوریا</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>بکلوریا</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>صنف دوازدهم</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ 
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568'
                  }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#1a202c'
                    }}>استادان</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.teachers_phd || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.teachers_master || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.teachers_bachelor || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>-</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>-</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>-</td>
                  </tr>
                  <tr style={{ 
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568'
                  }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#1a202c'
                    }}>کارکن تخنیکی</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_phd || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_master || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_bachelor || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_above_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.technical_elementary || 0}</td>
                  </tr>
                  <tr style={{ 
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568'
                  }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#1a202c'
                    }}>کارکن اداری</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_phd || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_master || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_bachelor || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_above_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.admin_elementary || 0}</td>
                  </tr>
                  <tr style={{ 
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568'
                  }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#1a202c'
                    }}>کارکن خدماتی</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>-</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>-</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.service_bachelor || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.service_above_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.service_baccalaureate || 0}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>{personnel.service_elementary || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Information */}
        {students.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>تعداد شاگردان بر اساس رشته</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>جدید شمولان</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>مجموعی شاگرد</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>دوره فراغت</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>سال تاسیس</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{student.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{student.newEnrollments || 0}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{student.totalStudents || 0}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{student.graduationCycles || 0}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{student.establishmentYear || 'نامشخص'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Laylia Information */}
        {laylia.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>تعداد شاگردان شامل لیلیه</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شاگردان شامل لیلیه</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شاگردان بدل عاشه</th>
                  </tr>
                </thead>
                <tbody>
                  {laylia.map((entry, index) => (
                    <tr key={entry.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{entry.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{entry.newEnrollments || 0}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{entry.totalStudents || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vision Mission Information */}
        {visionMission && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>دیدگاه، ماموریت و اهداف استراتیژیک</h3>
            
            <div style={{ 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%',
              background: '#1e1e1e',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ 
                  color: '#007bff', 
                  marginBottom: '15px',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid #333',
                  paddingBottom: '8px'
                }}>دیدگاه مرکز آموزشی</h4>
                <div style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: '#2d3748',
                  borderRadius: '6px',
                  border: '1px solid #4a5568',
                  whiteSpace: 'pre-wrap',
                  minHeight: '80px'
                }}>
                  {visionMission.vision || 'هیچ دیدگاهی ثبت نشده است'}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ 
                  color: '#007bff', 
                  marginBottom: '15px',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid #333',
                  paddingBottom: '8px'
                }}>ماموریت مرکز آموزشی</h4>
                <div style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: '#2d3748',
                  borderRadius: '6px',
                  border: '1px solid #4a5568',
                  whiteSpace: 'pre-wrap',
                  minHeight: '80px'
                }}>
                  {visionMission.mission || 'هیچ ماموریتی ثبت نشده است'}
                </div>
              </div>

              <div>
                <h4 style={{ 
                  color: '#007bff', 
                  marginBottom: '15px',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid #333',
                  paddingBottom: '8px'
                }}>اهداف استراتیژیک مرکز آموزشی</h4>
                <div style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: '#2d3748',
                  borderRadius: '6px',
                  border: '1px solid #4a5568',
                  whiteSpace: 'pre-wrap',
                  minHeight: '80px'
                }}>
                  {visionMission.strategic_goals || 'هیچ هدف استراتیژیکی ثبت نشده است'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standards Information */}
        {standards.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>ستندردها و معیارات</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>عنوان ستندرد</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نام فایل</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نوع فایل</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تاریخ ایجاد</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {standards.map((standard, index) => (
                    <tr key={standard.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{index + 1}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{standard.standard_title || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        <span 
                          onClick={() => handleDownloadFile(standard.id, standard.original_file_name)}
                          style={{
                            cursor: 'pointer',
                            color: '#007bff',
                            textDecoration: 'underline',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#0056b3'}
                          onMouseOut={(e) => e.target.style.color = '#007bff'}
                          title="کلیک کنید تا دانلود کنید"
                        >
                          {standard.original_file_name || 'نامشخص'}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{standard.file_type || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{new Date(standard.created_at).toLocaleDateString('fa-IR') || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        <button 
                          onClick={() => handleDownloadFile(standard.id, standard.original_file_name)}
                          style={{
                            background: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            fontWeight: '500'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#0056b3'}
                          onMouseOut={(e) => e.target.style.background = '#007bff'}
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
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>رشته‌های موجود در مرکز آموزشی</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>سال ایجاد</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>دوره آموزشی</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وضعیت</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تعداد اساتید</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تعداد محصل</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department, index) => (
                    <tr key={department.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{index + 1}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.new_enrollments || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.total_students || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.graduation_cycles || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.establishment_year || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{department.number_of_students || 'نامشخص'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Academy Facilities Information */}
        {academyFacilities.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>امکانات آکادمیک مرکز آموزشی</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>امکانات اساسی</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تعداد وسیله</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وضعیت وسیله</th>
                  </tr>
                </thead>
                <tbody>
                  {academyFacilities.map((facility, index) => (
                    <tr key={facility.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{index + 1}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.basic_facilities || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_count || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_status || 'نامشخص'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Class Facilities Information */}
        {classFacilities.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>تجهیزات درسی داخل صنوف</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وسیله درسی</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تعداد وسیله</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وضعیت وسیله</th>
                  </tr>
                </thead>
                <tbody>
                  {classFacilities.map((facility, index) => (
                    <tr key={facility.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{index + 1}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_count || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        {facility.equipment_status === 'excellent' && 'عالی'}
                        {facility.equipment_status === 'good' && 'خوب'}
                        {facility.equipment_status === 'average' && 'متوسط'}
                        {facility.equipment_status === 'poor' && 'ضعیف'}
                        {!['excellent', 'good', 'average', 'poor'].includes(facility.equipment_status) && facility.equipment_status}
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
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>تسهیلات و تجهیزات کار عملی</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>اسم رشته</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وسیله کار عملی</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>تعداد وسیله</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>وضعیت وسیله</th>
                  </tr>
                </thead>
                <tbody>
                  {practicalFacilities.map((facility, index) => (
                    <tr key={facility.id} style={{ 
                      background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                      borderBottom: '1px solid #4a5568'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{index + 1}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_name || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        borderRight: '1px solid #4a5568',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>{facility.equipment_count || 'نامشخص'}</td>
                      <td style={{ 
                        padding: '12px 8px', 
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        {facility.equipment_status === 'excellent' && 'عالی'}
                        {facility.equipment_status === 'good' && 'خوب'}
                        {facility.equipment_status === 'average' && 'متوسط'}
                        {facility.equipment_status === 'poor' && 'ضعیف'}
                        {!['excellent', 'good', 'average', 'poor'].includes(facility.equipment_status) && facility.equipment_status}
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
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>دخیل سازی ذینفعان در پروسه آموزشی</h3>
            
            <div style={{ 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%',
              background: '#1e1e1e',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ 
                  color: '#007bff', 
                  marginBottom: '15px',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid #333',
                  paddingBottom: '8px'
                }}>شیوه های دخیل سازی و میزان مشارکت ذینفعان</h4>
                <div style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: '#2d3748',
                  borderRadius: '6px',
                  border: '1px solid #4a5568',
                  whiteSpace: 'pre-wrap',
                  minHeight: '120px'
                }}>
                  {stakeholderInvolvement.description || 'هیچ اطلاعاتی ثبت نشده است'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Documents Information */}
        {profileDocuments.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              color: '#007bff', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>اسناد و مدارک ضمیموی</h3>
            
            <div style={{ 
              overflowX: 'auto', 
              borderRadius: '8px', 
              border: '1px solid #333',
              width: '100%'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: '#1e1e1e',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    borderBottom: '2px solid #007bff'
                  }}>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>شماره</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نوع سند</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نام فایل</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRight: '1px solid #4a5568',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>نوع فایل</th>
                    <th style={{ 
                      padding: '15px 8px', 
                      color: '#ffffff', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {profileDocuments.map((document, index) => {
                    // Get document label based on document type
                    const docIndex = parseInt(document.document_type.replace('doc', '').replace('_path', '')) - 1;
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
                      <tr key={document.id} style={{ 
                        background: index % 2 === 0 ? '#2d3748' : '#1a202c',
                        borderBottom: '1px solid #4a5568'
                      }}>
                        <td style={{ 
                          padding: '12px 8px', 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          borderRight: '1px solid #4a5568',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>{index + 1}</td>
                        <td style={{ 
                          padding: '12px 8px', 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          borderRight: '1px solid #4a5568',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>{documentLabels[docIndex] || 'نامشخص'}</td>
                        <td style={{ 
                          padding: '12px 8px', 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          borderRight: '1px solid #4a5568',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>{document.file_name || 'نامشخص'}</td>
                        <td style={{ 
                          padding: '12px 8px', 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          borderRight: '1px solid #4a5568',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>{document.file_type || 'نامشخص'}</td>
                        <td style={{ 
                          padding: '12px 8px', 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>
                          <button 
                            onClick={() => handleDownloadDocument(document.file_path, document.file_name)}
                            style={{
                              background: '#007bff',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                              fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#0056b3'}
                            onMouseOut={(e) => e.target.style.background = '#007bff'}
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
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {visionMissionError}
            </div>
          </div>
        )}

        {/* Show loading for standards data */}
        {standardsLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات ستندردها...</div>
          </div>
        )}

        {/* Show error for standards data */}
        {standardsError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {standardsError}
            </div>
          </div>
        )}

        {/* Show loading for departments data */}
        {departmentsLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات رشته‌ها...</div>
          </div>
        )}

        {/* Show error for departments data */}
        {departmentsError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {departmentsError}
            </div>
          </div>
        )}

        {/* Show loading for personnel data */}
        {personnelLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات کارکنان...</div>
          </div>
        )}

        {/* Show error for personnel data */}
        {personnelError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {personnelError}
            </div>
          </div>
        )}

        {/* Show loading for students data */}
        {studentsLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات شاگردان...</div>
          </div>
        )}

        {/* Show error for students data */}
        {studentsError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {studentsError}
            </div>
          </div>
        )}

        {/* Show loading for laylia data */}
        {layliaLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات لیلیه...</div>
          </div>
        )}

        {/* Show error for laylia data */}
        {layliaError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {layliaError}
            </div>
          </div>
        )}

        {/* Show loading for vision-mission data */}
        {visionMissionLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات دیدگاه و ماموریت...</div>
          </div>
        )}

        {/* Show error for departments data */}
        {departmentsError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {departmentsError}
            </div>
          </div>
        )}

        {/* Show loading for academy facilities data */}
        {academyFacilitiesLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات امکانات آکادمیک...</div>
          </div>
        )}

        {/* Show error for academy facilities data */}
        {academyFacilitiesError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {academyFacilitiesError}
            </div>
          </div>
        )}

        {/* Show loading for class facilities data */}
        {classFacilitiesLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات تجهیزات صنوف...</div>
          </div>
        )}

        {/* Show error for class facilities data */}
        {classFacilitiesError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {classFacilitiesError}
            </div>
          </div>
        )}

        {/* Show loading for practical facilities data */}
        {practicalFacilitiesLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات تجهیزات عملی...</div>
          </div>
        )}

        {/* Show error for practical facilities data */}
        {practicalFacilitiesError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {practicalFacilitiesError}
            </div>
          </div>
        )}

        {/* Show loading for stakeholder involvement data */}
        {stakeholderInvolvementLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات دخیل سازی ذینفعان...</div>
          </div>
        )}

        {/* Show error for stakeholder involvement data */}
        {stakeholderInvolvementError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {stakeholderInvolvementError}
            </div>
          </div>
        )}

        {/* Show loading for profile documents data */}
        {profileDocumentsLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <CircularProgress style={{ color: '#007bff' }} />
            <div style={{ color: '#ffffff', marginTop: '10px' }}>در حال بارگذاری معلومات سندهای پروفایل...</div>
          </div>
        )}

        {/* Show error for profile documents data */}
        {profileDocumentsError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            marginTop: '40px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              border: '1px solid #dc3545', 
              color: '#ff6b6b',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {profileDocumentsError}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificInstitute; 