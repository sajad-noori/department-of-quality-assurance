import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaHeadset, FaInfoCircle, FaChalkboardTeacher, FaUserTie, FaTools, FaUserShield, FaUserGraduate, FaFilePdf, FaUniversity, FaChalkboard, FaFlask } from 'react-icons/fa';
import axios from 'axios';

const ReviewAndSubmit = ({ formData }) => {
  const [personnelData, setPersonnelData] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [layliaData, setLayliaData] = useState([]);
  const [visionMissionData, setVisionMissionData] = useState({
    vision: '',
    mission: '',
    strategicGoals: ''
  });
  const [standardsData, setStandardsData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [academyFacilities, setAcademyFacilities] = useState([]);
  const [classFacilities, setClassFacilities] = useState([]);
  const [practicalFacilities, setPracticalFacilities] = useState([]);
  const [stakeholderInvolvement, setStakeholderInvolvement] = useState('');
  const [loadingStakeholder, setLoadingStakeholder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingLaylia, setLoadingLaylia] = useState(true);
  const [loadingVisionMission, setLoadingVisionMission] = useState(true);
  const [loadingStandards, setLoadingStandards] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingAcademyFacilities, setLoadingAcademyFacilities] = useState(true);
  const [loadingClassFacilities, setLoadingClassFacilities] = useState(true);
  const [loadingPracticalFacilities, setLoadingPracticalFacilities] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonnelData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/personnel', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data) {
          setPersonnelData(response.data);
        }
      } catch (err) {
        console.error('Error fetching personnel data:', err);
        setError('Failed to load personnel data');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelData();

    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success) {
          setStudentData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudentData();

    const fetchLayliaData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/laylia', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success) {
          setLayliaData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching laylia data:', err);
        setError('Failed to load laylia data');
      } finally {
        setLoadingLaylia(false);
      }
    };

    fetchLayliaData();

    const fetchVisionMissionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vision-mission', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data) {
          setVisionMissionData({
            vision: response.data.vision || '',
            mission: response.data.mission || '',
            strategicGoals: response.data.strategic_goals || ''
          });
        }
      } catch (err) {
        console.error('Error fetching vision and mission data:', err);
        setError('Failed to load vision and mission data');
      } finally {
        setLoadingVisionMission(false);
      }
    };

    fetchVisionMissionData();

    const fetchStandardsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/standards', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data) {
          setStandardsData(response.data);
        }
      } catch (err) {
        console.error('Error fetching standards data:', err);
        setError('Failed to load standards data');
      } finally {
        setLoadingStandards(false);
      }
    };

    fetchStandardsData();

    const fetchDepartmentsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data && response.data.success) {
          setDepartmentsData(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching departments data:', err);
        setError('Failed to load departments data');
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartmentsData();

    // Fetch Academy Facilities
    const fetchAcademyFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/academy-facilities', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data && response.data.success) {
          setAcademyFacilities(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching academy facilities:', err);
        setError('Failed to load academy facilities');
      } finally {
        setLoadingAcademyFacilities(false);
      }
    };

    // Fetch Class Facilities
    const fetchClassFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/class-facilities', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data && response.data.success) {
          setClassFacilities(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching class facilities:', err);
        setError('Failed to load class facilities');
      } finally {
        setLoadingClassFacilities(false);
      }
    };

    // Fetch Practical Facilities
    const fetchPracticalFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/practical-facilities', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data && response.data.success) {
          setPracticalFacilities(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching practical facilities:', err);
        setError('Failed to load practical facilities');
      } finally {
        setLoadingPracticalFacilities(false);
      }
    };

    // Fetch stakeholder involvement data
    const fetchStakeholderInvolvement = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stakeholder-involvement', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data && response.data.success && response.data.data) {
          setStakeholderInvolvement(response.data.data.description || '');
        }
      } catch (err) {
        console.error('Error fetching stakeholder involvement:', err);
        setError('Failed to load stakeholder involvement data');
      } finally {
        setLoadingStakeholder(false);
      }
    };

    // Fetch all data in parallel
    Promise.all([
      fetchAcademyFacilities(),
      fetchClassFacilities(),
      fetchPracticalFacilities(),
      fetchStakeholderInvolvement()
    ]);
  }, []);

  const educationLevels = [
    { key: 'phd', label: 'دوکتور' },
    { key: 'master', label: 'ماستر' },
    { key: 'bachelor', label: 'لیسانس' },
    { key: 'above_baccalaureate', label: 'فوق بکلوریا' },
    { key: 'baccalaureate', label: 'بکلوریا' },
    { key: 'elementary', label: 'صنف دوازدهم' },
  ];

  const personnelSections = [
    { key: 'teachers', label: 'معلمین', icon: <FaChalkboardTeacher /> },
    { key: 'technical', label: 'کارکنان تخنیکی', icon: <FaTools /> },
    { key: 'admin', label: 'کارکنان اداری', icon: <FaUserTie /> },
    { key: 'service', label: 'کارکنان خدماتی', icon: <FaUserShield /> },
  ];

  const getPersonnelCount = (section, level) => {
    const key = `${section}_${level}`;
    return personnelData && personnelData[key] !== undefined ? personnelData[key] : '0';
  };
  return (
    <>
      <div className="review-submit-container" dir="rtl">
        <motion.div
          className="review-card"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 20 }}
          >
            <FaCheckCircle className="icon" />
          </motion.div>
          
          <h2 className="title">درخواست شما با موفقیت ثبت شد</h2>
          
          <p className="description">
            از شما سپاسگزاریم. درخواست اعتباردهی شما برای بررسی ارسال شده است. نتیجه از طریق ایمیل به شما اطلاع داده خواهد شد.
          </p>

          {formData && (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaInfoCircle className="info-icon" />
                <h3>مشخصات مرکز آموزشی</h3>
              </div>
              <div className="table-responsive">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <th>نام مرکز</th>
                      <td>{formData.centerName || 'ثبت نشده'}</td>
                      <th>ولایت</th>
                      <td>{formData.province || 'ثبت نشده'}</td>
                    </tr>
                    <tr>
                      <th>ولسوالی</th>
                      <td>{formData.district || 'ثبت نشده'}</td>
                      <th>قریه/گذر</th>
                      <td>{formData.village || 'ثبت نشده'}</td>
                    </tr>
                    <tr>
                      <th>نوع مرکز</th>
                      <td>{formData.centerType || 'ثبت نشده'}</td>
                      <th>نوع برنامه</th>
                      <td>{formData.programType || 'ثبت نشده'}</td>
                    </tr>
                    <tr>
                      <th>سال تاسیس</th>
                      <td>{formData.foundingYear || 'ثبت نشده'}</td>
                      <th>نام مسئول</th>
                      <td>{formData.contactName || 'ثبت نشده'}</td>
                    </tr>
                    <tr>
                      <th>شماره تماس</th>
                      <td>{formData.phoneNumber || 'ثبت نشده'}</td>
                      <th>ایمیل</th>
                      <td>{formData.email || 'ثبت نشده'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Personnel Data Section */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات پرسونل...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaUserTie className="info-icon" />
                <h3>اطلاعات پرسونل</h3>
              </div>
              <div className="table-responsive">
                <table className="info-table">
                  <thead>
                    <tr>
                      <th>نوع پرسونل</th>
                      {educationLevels.map(level => (
                        <th key={level.key}>{level.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {personnelSections.map(section => (
                      <tr key={section.key}>
                        <td className="personnel-type">
                          <span className="personnel-icon">{section.icon}</span>
                          {section.label}
                        </td>
                        {educationLevels.map(level => (
                          <td key={`${section.key}-${level.key}`}>
                            {getPersonnelCount(section.key, level.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Student Data Section */}
          {loadingStudents ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات شاگردان...</p>
            </div>
          ) : studentData.length > 0 && (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaUserGraduate className="info-icon" />
                <h3>اطلاعات شاگردان</h3>
              </div>
              <div className="table-responsive">
                <table className="info-table">
                  <thead>
                    <tr>
                      <th>نام رشته</th>
                      <th>شمولات جدید</th>
                      <th>مجموع شاگردان</th>
                      <th>دوران فارغ‌تحصیلی</th>
                      <th>سال تأسیس</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((student, index) => (
                      <tr key={index}>
                        <td className="text-right">{student.name || '-'}</td>
                        <td>{student.newEnrollments || '0'}</td>
                        <td>{student.totalStudents || '0'}</td>
                        <td>{student.graduationCycles || '-'}</td>
                        <td>{student.establishmentYear || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Laylia Data Section */}
          {loadingLaylia ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات لیلیه...</p>
            </div>
          ) : layliaData.length > 0 && (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaUserGraduate className="info-icon" />
                <h3>اطلاعات لیلیه</h3>
              </div>
              <div className="table-responsive">
                <table className="info-table">
                  <thead>
                    <tr>
                      <th>نام رشته</th>
                      <th>شمولات جدید</th>
                      <th>مجموع شاگردان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layliaData.map((item, index) => (
                      <tr key={index}>
                        <td className="text-right">{item.name || '-'}</td>
                        <td>{item.newEnrollments || '0'}</td>
                        <td>{item.totalStudents || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Vision & Mission Section */}
          {loadingVisionMission ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات دیدگاه و ماموریت...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaInfoCircle className="info-icon" />
                <h3>دیدگاه، ماموریت و اهداف استراتیژیک</h3>
              </div>
              <div className="vision-mission-section">
                <div className="vision-mission-item">
                  <h4>دیدگاه:</h4>
                  <div className="vision-mission-content">
                    {visionMissionData.vision || 'ثبت نشده'}
                  </div>
                </div>
                <div className="vision-mission-item">
                  <h4>ماموریت:</h4>
                  <div className="vision-mission-content">
                    {visionMissionData.mission || 'ثبت نشده'}
                  </div>
                </div>
                <div className="vision-mission-item">
                  <h4>اهداف استراتیژیک:</h4>
                  <div className="vision-mission-content">
                    {visionMissionData.strategicGoals || 'ثبت نشده'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Standards Data Section */}
          {loadingStandards ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات معیارها و استانداردها...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaCheckCircle className="info-icon" />
                <h3> استانداردها</h3>
              </div>
              <div className="standards-section">
                {standardsData.length > 0 ? (
                  <div className="standards-list">
                    {standardsData.map((standard, index) => (
                      <div key={standard.id} className="standard-item">
                        <div className="standard-header">
                          <span className="standard-number">{index + 1}.</span>
                          <h4 className="standard-title">{standard.standard_title || 'بدون عنوان'}</h4>
                        </div>
                        {standard.description && (
                          <div className="standard-description">
                            {standard.description}
                          </div>
                        )}
                        <div className="standard-file">
                          <a 
                            href={`http://localhost:5000${standard.file_path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            <FaFilePdf className="file-icon" />
                            {standard.original_file_name || 'فایل پیوستی'}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-standards">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ معیار و استانداردی ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Departments Data Section */}
          {loadingDepartments ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات رشته‌ها...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaChalkboardTeacher className="info-icon" />
                <h3>رشته‌های آموزشی</h3>
              </div>
              <div className="departments-section">
                {departmentsData.length > 0 ? (
                  <div className="departments-table-container">
                    <table className="departments-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام رشته</th>
                          <th>سال تأسیس</th>
                          <th>تعداد محصلین جدید</th>
                          <th>مجموع محصلین</th>
                          <th>دوره‌های فارغ‌التحصیلی</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentsData.map((dept, index) => {
                          // Map the API response fields to the expected field names
                          const department = {
                            id: dept.id,
                            name: dept.department_name || dept.name || 'ثبت نشده',
                            establishmentYear: dept.establishment_year || dept.establishmentYear || 'ثبت نشده',
                            newEnrollments: dept.new_enrollments || dept.newEnrollments || '0',
                            totalStudents: dept.total_students || dept.totalStudents || '0',
                            graduationCycles: dept.graduation_cycles || dept.graduationCycles || 'ثبت نشده'
                          };
                          
                          return (
                            <tr key={department.id}>
                              <td>{index + 1}</td>
                              <td>{department.name}</td>
                              <td>{department.establishmentYear}</td>
                              <td>{department.newEnrollments}</td>
                              <td>{department.totalStudents}</td>
                              <td>{department.graduationCycles}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-departments">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ رشته‌ای ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Academy Facilities Section */}
          {loadingAcademyFacilities ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات امکانات آکادمیک...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaUniversity className="info-icon" />
                <h3>امکانات آکادمیک</h3>
              </div>
              <div className="facilities-section">
                {academyFacilities.length > 0 ? (
                  <div className="facilities-table-container">
                    <table className="facilities-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام امکانات</th>
                          <th>تجهیزات پایه</th>
                          <th>تعداد تجهیزات</th>
                          <th>وضعیت تجهیزات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academyFacilities.map((facility, index) => (
                          <tr key={facility.id}>
                            <td>{index + 1}</td>
                            <td>{facility.name || 'ثبت نشده'}</td>
                            <td>{facility.basic_facilities || 'ثبت نشده'}</td>
                            <td>{facility.equipment_count || '0'}</td>
                            <td>{facility.equipment_status || 'ثبت نشده'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-facilities">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ اطلاعاتی ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Class Facilities Section */}
          {loadingClassFacilities ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات امکانات صنفی...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaChalkboard className="info-icon" />
                <h3>امکانات صنفی</h3>
              </div>
              <div className="facilities-section">
                {classFacilities.length > 0 ? (
                  <div className="facilities-table-container">
                    <table className="facilities-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام صنف</th>
                          <th>نام تجهیزات</th>
                          <th>تعداد</th>
                          <th>وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classFacilities.map((facility, index) => (
                          <tr key={facility.id}>
                            <td>{index + 1}</td>
                            <td>{facility.name || 'ثبت نشده'}</td>
                            <td>{facility.equipment_name || 'ثبت نشده'}</td>
                            <td>{facility.equipment_count || '0'}</td>
                            <td>{facility.equipment_status || 'ثبت نشده'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-facilities">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ اطلاعاتی ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Practical Facilities Section */}
          {loadingPracticalFacilities ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات امکانات عملی...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaFlask className="info-icon" />
                <h3>امکانات عملی</h3>
              </div>
              <div className="facilities-section">
                {practicalFacilities.length > 0 ? (
                  <div className="facilities-table-container">
                    <table className="facilities-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام بخش</th>
                          <th>نام تجهیزات</th>
                          <th>تعداد</th>
                          <th>وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {practicalFacilities.map((facility, index) => (
                          <tr key={facility.id}>
                            <td>{index + 1}</td>
                            <td>{facility.name || 'ثبت نشده'}</td>
                            <td>{facility.equipment_name || 'ثبت نشده'}</td>
                            <td>{facility.equipment_count || '0'}</td>
                            <td>{facility.equipment_status || 'ثبت نشده'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-facilities">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ اطلاعاتی ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Stakeholder Involvement Section */}
          {loadingStakeholder ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>در حال بارگیری اطلاعات مشارکت ذینفعان...</p>
            </div>
          ) : (
            <motion.div 
              className="review-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="review-info-header">
                <FaUserTie className="info-icon" />
                <h3>مشارکت ذینفعان</h3>
              </div>
              <div className="stakeholder-section">
                {stakeholderInvolvement ? (
                  <div className="stakeholder-content">
                    <div className="stakeholder-description">
                      {stakeholderInvolvement}
                    </div>
                  </div>
                ) : (
                  <div className="no-stakeholder">
                    <FaInfoCircle className="info-icon" />
                    <p>هیچ اطلاعاتی در مورد مشارکت ذینفعان ثبت نشده است</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="alert-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FaEnvelope className="alert-icon" />
            <div>
              لطفاً منتظر بمانید. بررسی درخواست شما ممکن است چند روز کاری طول بکشد.
            </div>
          </motion.div>

          <motion.div
            className="support-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="support-header">
              <FaHeadset className="support-icon" />
              <h5 className="support-title">نیاز به پشتیبانی دارید؟</h5>
            </div>
            <p className="support-text">
              برای هرگونه سوال می‌توانید با ما در تماس باشید.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .review-submit-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #121212;
          min-height: 60vh;
          font-family: sans-serif;
        }

        .review-card {
          background: #1d1d1d;
          border: 1px solid rgba(13, 202, 240, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          color: #eee;
        }

        .icon-wrapper {
          margin: 0 auto 1.5rem;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(13, 202, 240, 0.05));
          border: 2px solid rgba(13, 202, 240, 0.3);
        }

        .icon {
          font-size: 3rem;
          color: #0dcaf0;
          text-shadow: 0 0 15px rgba(13, 202, 240, 0.5);
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #00b5d7;
          margin-bottom: 2rem;
        }

        .review-info-card {
          background: rgba(13, 202, 240, 0.05);
          border: 1px solid rgba(13, 202, 240, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          text-align: right;
          direction: rtl;
        }

        .review-info-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          color: #0dcaf0;
          gap: 0.5rem;
        }

        .review-info-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .table-responsive {
          overflow-x: auto;
          margin: 1.5rem 0;
          border-radius: 12px;
          border: 1px solid rgba(13, 202, 240, 0.2);
          background: rgba(13, 202, 240, 0.05);
          padding: 1rem;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          direction: rtl;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .info-table th, 
        .info-table td {
          padding: 12px 8px;
          border: 1px solid rgba(13, 202, 240, 0.1);
          font-size: 0.9rem;
        }

        .personnel-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          text-align: right;
          padding-right: 12px;
        }

        .personnel-icon {
          color: #0dcaf0;
          display: flex;
          align-items: center;
        }

        .info-table th {
          background-color: rgba(13, 202, 240, 0.1);
          color: #0dcaf0;
          font-weight: 600;
          white-space: nowrap;
          padding: 12px 8px;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .info-table th:first-child {
          border-top-right-radius: 8px;
        }

        .info-table th:last-child {
          border-top-left-radius: 8px;
        }

        .info-table td {
          color: #f0f0f0;
          background-color: rgba(255, 255, 255, 0.02);
          min-width: 60px;
        }

        .info-table tbody tr:nth-child(odd) {
          background-color: rgba(255, 255, 255, 0.02);
        }
        
        .info-table tbody tr:nth-child(even) {
          background-color: rgba(13, 202, 240, 0.02);
        }

        .info-table tbody tr:hover td {
          background-color: rgba(13, 202, 240, 0.08);
        }
        
        .info-table tbody tr:hover td:first-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        
        .info-table tbody tr:hover td:last-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        .text-right {
          text-align: right;
          padding-right: 16px !important;
        }

        .vision-mission-section {
          text-align: right;
          direction: rtl;
        }

        .vision-mission-item {
          margin-bottom: 1.5rem;
        }

        .vision-mission-item h4 {
          color: #0dcaf0;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .vision-mission-content {
          background: rgba(13, 202, 240, 0.05);
          border: 1px solid rgba(13, 202, 240, 0.1);
          border-radius: 8px;
          padding: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .vision-mission-content:empty::before {
          content: 'ثبت نشده';
          color: #6c757d;
          font-style: italic;
        }

        .standards-section {
          text-align: right;
          direction: rtl;
          margin-top: 1.5rem;
        }

        .standards-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .standard-item {
          background: rgba(13, 202, 240, 0.03);
          border: 1px solid rgba(13, 202, 240, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.3s ease;
        }

        .standard-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .standard-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .standard-number {
          background: #0dcaf0;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 12px;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .standard-title {
          margin: 0;
          color: #0dcaf0;
          font-size: 1.1rem;
        }

        .standard-description {
          color: #ffffff;
          line-height: 1.7;
          margin-bottom: 1rem;
          white-space: pre-line;
        }

        .standard-file {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed #dee2e6;
        }

        .file-link {
          display: inline-flex;
          align-items: center;
          color: #0d6efd;
          text-decoration: none;
          transition: color 0.2s;
        }

        .file-link:hover {
          color: #0a58ca;
          text-decoration: underline;
        }

        .file-icon {
          margin-left: 6px;
          font-size: 1.2rem;
        }

        .no-standards {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6c757d;
          text-align: center;
        }

        .no-standards .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #0dcaf0;
          opacity: 0.7;
        }

        .no-standards p,
        .no-departments p,
        .no-facilities p {
          margin: 0;
          font-size: 1.05rem;
        }

        .departments-section,
        .facilities-section {
          margin-top: 2rem;
          direction: rtl;
          text-align: right;
        }

        .departments-table-container,
        .facilities-table-container {
          overflow-x: auto;
          margin-top: 1rem;
        }

        .departments-table,
        .facilities-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          background: rgba(13, 202, 240, 0.03);
          border-radius: 12px;
          overflow: hidden;
        }

        .departments-table th,
        .departments-table td,
        .facilities-table th,
        .facilities-table td {
          padding: 1rem;
          text-align: right;
          border-bottom: 1px solid rgba(13, 202, 240, 0.1);
        }

        .departments-table th,
        .facilities-table th {
          background: rgba(13, 202, 240, 0.1);
          color: #0dcaf0;
          font-weight: 600;
          white-space: nowrap;
        }

        .departments-table tbody tr:hover,
        .facilities-table tbody tr:hover {
          background: rgba(13, 202, 240, 0.05);
        }

        .departments-table tbody tr:last-child td,
        .facilities-table tbody tr:last-child td {
          border-bottom: none;
        }

        .no-departments,
        .no-facilities,
        .no-stakeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6c757d;
          text-align: center;
        }

        .no-departments .info-icon,
        .no-facilities .info-icon,
        .no-stakeholder .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #0dcaf0;
          opacity: 0.7;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #0dcaf0;
        }

        .spinner {
          border: 4px solid rgba(13, 202, 240, 0.2);
          border-radius: 50%;
          border-top: 4px solid #0dcaf0;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: center;
        }

        .alert-info {
          display: flex;
          align-items: center;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          background: rgba(13, 202, 240, 0.08);
          border: 1px solid rgba(13, 202, 240, 0.15);
          color: #a9e5ff;
          text-align: right;
        }

        .alert-icon {
          font-size: 1.5rem;
          margin-left: 1rem;
          flex-shrink: 0;
          color: #0dcaf0;
        }

        .support-section {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .support-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .support-icon {
          font-size: 1.2rem;
          color: #0dcaf0;
        }

        .support-title {
          margin-bottom: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #eee;
        }

        .support-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </>
  );
};

ReviewAndSubmit.propTypes = {
  formData: PropTypes.shape({
    centerName: PropTypes.string,
    province: PropTypes.string,
    district: PropTypes.string,
    village: PropTypes.string,
    centerType: PropTypes.string,
    programType: PropTypes.string,
    foundingYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contactName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
  }),
};

ReviewAndSubmit.defaultProps = {
  formData: {},
};

export default ReviewAndSubmit;
