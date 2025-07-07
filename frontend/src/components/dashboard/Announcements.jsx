import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AnnouncementsAPI from '../../api/announcements';

const containerStyle = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '1rem',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  border: '1px solid #333333',
};

const titleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center',
};

const subtitleStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#cccccc',
  textAlign: 'center',
};

const formContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  marginBottom: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formGroupStyle = {
  marginBottom: '1.5rem',
  position: 'relative',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#ffffff',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'all 0.2s ease',
};

const inputFocusStyle = {
  border: '1px solid #00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '120px',
  fontFamily: 'inherit',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
  padding: '0.75rem',
  backgroundColor: '#2a2a2a',
  borderRadius: '6px',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
};

const checkboxContainerHoverStyle = {
  backgroundColor: '#3a3a3a',
  border: '1px solid #444444',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  accentColor: '#00d4ff',
  cursor: 'pointer',
};

const checkboxLabelStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  cursor: 'pointer',
  flex: 1,
  userSelect: 'none',
};

const buttonStyle = {
  backgroundColor: '#00d4ff',
  border: 'none',
  color: '#000000',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginRight: '0.75rem',
  position: 'relative',
  overflow: 'hidden',
};

const buttonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const buttonSecondaryStyle = {
  ...buttonStyle,
  backgroundColor: '#666666',
  color: '#ffffff',
};

const buttonSecondaryHoverStyle = {
  backgroundColor: '#555555',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(102, 102, 102, 0.3)',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginTop: '1.5rem',
};

const searchContainerStyle = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
};

const searchContainerFocusStyle = {
  border: '1px solid #00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
};

const searchInputStyle = {
  ...inputStyle,
  marginBottom: '1rem',
  paddingLeft: '2.5rem',
};

const searchIconStyle = {
  position: 'absolute',
  left: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#888888',
  fontSize: '1rem',
};

const recipientItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: '#1a1a1a',
  borderRadius: '4px',
  marginBottom: '0.5rem',
  border: '1px solid #333333',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
};

const recipientItemHoverStyle = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #444444',
  transform: 'translateY(-1px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const recipientNameStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  flex: 1,
  fontWeight: '500',
  userSelect: 'none',
};

const recipientEmailStyle = {
  fontSize: '0.75rem',
  color: '#888888',
  fontStyle: 'italic',
  userSelect: 'none',
};

const recipientTypeStyle = {
  fontSize: '0.7rem',
  color: '#00d4ff',
  backgroundColor: '#1a3a1a',
  padding: '0.2rem 0.5rem',
  borderRadius: '3px',
  border: '1px solid #00d4ff',
  userSelect: 'none',
};

const selectedRecipientStyle = {
  backgroundColor: '#00d4ff',
  border: '1px solid #00d4ff',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const selectedRecipientTextStyle = {
  color: '#000000',
  fontWeight: '600',
};

const summaryContainerStyle = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '1rem',
  marginTop: '1.5rem',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
};

const summaryContainerHoverStyle = {
  border: '1px solid #444444',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const summaryTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const summaryItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 0',
  borderBottom: '1px solid #333333',
  transition: 'all 0.2s ease',
};

const summaryItemHoverStyle = {
  backgroundColor: '#3a3a3a',
  borderRadius: '4px',
  padding: '0.5rem',
  margin: '0 -0.5rem',
};

const summaryLabelStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
};

const summaryValueStyle = {
  fontSize: '0.875rem',
  color: '#ffffff',
  fontWeight: '500',
};

const alertStyle = {
  padding: '1rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  animation: 'slideIn 0.3s ease-out',
};

const alertSuccessStyle = {
  ...alertStyle,
  backgroundColor: '#1a3a1a',
  border: '1px solid #00ff00',
  color: '#00ff00',
};

const alertErrorStyle = {
  ...alertStyle,
  backgroundColor: '#3a1a1a',
  border: '1px solid #ff0000',
  color: '#ff0000',
};

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  color: '#cccccc',
  gap: '0.5rem',
};

const loadingSpinnerStyle = {
  width: '20px',
  height: '20px',
  border: '2px solid #333333',
  borderTop: '2px solid #00d4ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const paginationContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  padding: '1rem',
  flexWrap: 'wrap',
};

const paginationButtonStyle = {
  ...buttonSecondaryStyle,
  padding: '0.5rem 1rem',
  fontSize: '0.8rem',
  minWidth: '40px',
};

const paginationInfoStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  margin: '0 1rem',
  textAlign: 'center',
};

const noResultsStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#888888',
  fontSize: '0.875rem',
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  border: '1px solid #333333',
};

const tooltipStyle = {
  position: 'absolute',
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  zIndex: 1000,
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  whiteSpace: 'nowrap',
};

const progressBarStyle = {
  width: '100%',
  height: '4px',
  backgroundColor: '#333333',
  borderRadius: '2px',
  overflow: 'hidden',
  marginTop: '0.5rem',
};

const progressFillStyle = {
  height: '100%',
  backgroundColor: '#00d4ff',
  borderRadius: '2px',
  transition: 'width 0.3s ease',
  animation: 'pulse 2s ease-in-out infinite',
};

const dropzoneStyle = {
  border: '2px dashed #00d4ff',
  borderRadius: '8px',
  padding: '1.5rem',
  textAlign: 'center',
  backgroundColor: '#181a1b',
  color: '#00d4ff',
  cursor: 'pointer',
  marginBottom: '1rem',
  transition: 'background 0.2s, border-color 0.2s',
};

const dropzoneActiveStyle = {
  backgroundColor: '#222c2f',
  border: '2px dashed #00b8e6',
};

const fileInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: '#222c2f',
  color: '#00d4ff',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
};

const removeFileBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ff4d4f',
  fontSize: '1.2rem',
  cursor: 'pointer',
  marginLeft: '0.5rem',
};

const fileErrorStyle = {
  color: '#ff4d4f',
  background: '#3a1a1a',
  border: '1px solid #ff4d4f',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
};

const Announcements = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipientType: 'all',
    includeAttachment: false,
    attachment: null,
  });

  // Combined list of all recipients
  const [allRecipients, setAllRecipients] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipientsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [progress, setProgress] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Load recipients and available roles on component mount
  useEffect(() => {
    const loadRecipientsAndRoles = async () => {
      try {
        setRecipientsLoading(true);
        
        // Load available roles
        const rolesResponse = await AnnouncementsAPI.getAvailableRoles();
        if (rolesResponse.success) {
          setAvailableRoles(rolesResponse.data);
        }
        
        // Load recipients for 'all' type
        const recipientsResponse = await AnnouncementsAPI.getRecipients('all');
        if (recipientsResponse.success) {
          const recipientsWithSelection = recipientsResponse.data.map(recipient => ({
            ...recipient,
            selected: true,
            type: recipient.role // Map role to type for compatibility
          }));
          setAllRecipients(recipientsWithSelection);
        }
      } catch (error) {
        console.error('Error loading recipients:', error);
        if (error.message.includes('401')) {
          showErrorAlert('لطفاً ابتدا وارد شوید');
        } else {
          showErrorAlert('خطا در بارگذاری گیرندگان');
        }
      } finally {
        setRecipientsLoading(false);
      }
    };

    loadRecipientsAndRoles();
  }, []);

  // Filter recipients based on search term and recipient type
  const filteredRecipients = allRecipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = formData.recipientType === 'all' || recipient.type === formData.recipientType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const indexOfLastRecipient = currentPage * recipientsPerPage;
  const indexOfFirstRecipient = indexOfLastRecipient - recipientsPerPage;
  const currentRecipients = filteredRecipients.slice(indexOfFirstRecipient, indexOfLastRecipient);
  const totalPages = Math.ceil(filteredRecipients.length / recipientsPerPage);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
    
    // Auto-select recipients based on recipient type
    if (name === 'recipientType') {
      setCurrentPage(1);
      
      // Load recipients for the selected type
      const loadRecipientsForType = async () => {
        try {
          setRecipientsLoading(true);
          const recipientsResponse = await AnnouncementsAPI.getRecipients(value);
          
          if (recipientsResponse.success) {
            const recipientsWithSelection = recipientsResponse.data.map(recipient => ({
              ...recipient,
              selected: true,
              type: recipient.role // Map role to type for compatibility
            }));
            setAllRecipients(recipientsWithSelection);
            
            if (value === 'all') {
              showSuccessAlert('همه گیرندگان انتخاب شدند');
            } else if (value === 'institute') {
              showSuccessAlert('همه موسسات انتخاب شدند');
            } else if (value === 'user') {
              showSuccessAlert('همه کاربران انتخاب شدند');
            } else if (value === 'employee') {
              showSuccessAlert('همه کارمندان انتخاب شدند');
            }
          }
        } catch (error) {
          console.error('Error loading recipients for type:', error);
          if (error.message.includes('401')) {
            showErrorAlert('لطفاً ابتدا وارد شوید');
          } else {
            showErrorAlert('خطا در بارگذاری گیرندگان');
          }
        } finally {
          setRecipientsLoading(false);
        }
      };
      
      loadRecipientsForType();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRecipientToggle = (id) => {
    setAllRecipients(prev => 
      prev.map(recipient =>
        recipient.id === id
          ? { ...recipient, selected: !recipient.selected }
          : recipient
      )
    );
  };

  const handleSelectAll = () => {
    setAllRecipients(prev => 
      prev.map(recipient => ({ ...recipient, selected: true }))
    );
    showSuccessAlert('همه گیرندگان انتخاب شدند');
  };

  const handleDeselectAll = () => {
    setAllRecipients(prev => 
      prev.map(recipient => ({ ...recipient, selected: false }))
    );
    showSuccessAlert('همه انتخاب‌ها حذف شدند');
  };

  const getSelectedRecipients = () => {
    return allRecipients.filter(r => r.selected);
  };

  const getTotalRecipients = () => {
    return getSelectedRecipients().length;
  };

  const showSuccessAlert = (message) => {
    setAlert({ type: 'success', message });
    setTimeout(() => setAlert(null), 3000);
  };

  const showErrorAlert = (message) => {
    setAlert({ type: 'error', message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      showErrorAlert('لطفاً موضوع و پیام را وارد کنید');
      return;
    }

    const totalRecipients = getTotalRecipients();
    if (totalRecipients === 0) {
      showErrorAlert('لطفاً حداقل یک گیرنده انتخاب کنید');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setAlert(null);

    try {
      setProgress(30);
      const selectedRecipients = getSelectedRecipients();
      const response = await AnnouncementsAPI.createAnnouncement({
        subject: formData.subject,
        message: formData.message,
        recipientType: formData.recipientType,
        attachment: formData.includeAttachment ? formData.attachment : null,
        recipients: selectedRecipients.map(r => r.email)
      });
      setProgress(80);
      if (response.success) {
        setProgress(100);
        showSuccessAlert(`ایمیل با موفقیت به ${totalRecipients} گیرنده ارسال شد`);
        // Reset form
        setFormData({
          subject: '',
          message: '',
          recipientType: 'all',
          includeAttachment: false,
          attachment: null,
        });
        setAllRecipients(prev => prev.map(recipient => ({ ...recipient, selected: false })));
        setProgress(0);
        setIsLoading(false);
      } else {
        showErrorAlert('خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید');
        setProgress(0);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorAlert('خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید');
      setProgress(0);
      setIsLoading(false);
    }
  };


  const getTypeLabel = (type) => {
    switch (type) {
      case 'institute': return 'موسسه';
      case 'user': return 'کاربر';
      case 'employee': return 'کارمند';
      default: return type;
    }
  };

  const handleMouseEnter = (recipient) => {
    setHoveredItem(recipient.id);
    setTooltipContent(`${recipient.name} - ${recipient.email}`);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      setFileError('فرمت فایل مجاز نیست. فقط PDF, DOC, DOCX, TXT, JPG, PNG');
      setFormData((prev) => ({ ...prev, attachment: null }));
      return;
    }
    if (file.size > maxSize) {
      setFileError('حجم فایل نباید بیشتر از ۵ مگابایت باشد.');
      setFormData((prev) => ({ ...prev, attachment: null }));
      return;
    }
    setFileError('');
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    setFileError('');
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={paginationContainerStyle}>
        <button
          style={paginationButtonStyle}
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          title="صفحه اول"
        >
          اول
        </button>
        
        <button
          style={paginationButtonStyle}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          title="صفحه قبلی"
        >
          قبلی
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            style={{
              ...paginationButtonStyle,
              backgroundColor: currentPage === number ? '#00d4ff' : '#666666',
              color: currentPage === number ? '#000000' : '#ffffff',
            }}
            onClick={() => setCurrentPage(number)}
            title={`صفحه ${number}`}
          >
            {number}
          </button>
        ))}

        <button
          style={paginationButtonStyle}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="صفحه بعدی"
        >
          بعدی
        </button>
        
        <button
          style={paginationButtonStyle}
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          title="صفحه آخر"
        >
          آخر
        </button>

        <span style={paginationInfoStyle}>
          صفحه {currentPage} از {totalPages} ({filteredRecipients.length} نتیجه)
        </span>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      <div style={headerStyle}>
        <h1 style={titleStyle}>ارسال اعلانات و ایمیل</h1>
        <p style={subtitleStyle}>ارسال ایمیل به گروه‌های مختلف کاربران، موسسات و کارمندان</p>
      </div>

      {alert && (
        <div style={alert.type === 'success' ? alertSuccessStyle : alertErrorStyle}>
          <span>{alert.type === 'success' ? '✓' : '✗'}</span>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formContainerStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>موضوع ایمیل *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="موضوع ایمیل را وارد کنید..."
            required
            maxLength={100}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>پیام *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            style={textareaStyle}
            placeholder="متن پیام را وارد کنید..."
            required
            maxLength={2000}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>نوع گیرندگان</label>
          <select
            name="recipientType"
            value={formData.recipientType}
            onChange={handleInputChange}
            style={selectStyle}
          >
            <option value="all">همه گیرندگان</option>
            <option value="institute">فقط موسسات</option>
            <option value="user">فقط کاربران</option>
            <option value="employee">فقط کارمندان</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>انتخاب گیرندگان</label>
          
          <div 
            style={{
              ...searchContainerStyle,
              ...(document.activeElement?.name === 'search' ? searchContainerFocusStyle : {})
            }}
          >
            <div style={{ position: 'relative' }}>
              <span style={searchIconStyle}>🔍</span>
              <input
                type="text"
                name="search"
                placeholder="جستجو بر اساس نام یا ایمیل..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={searchInputStyle}
              />
            </div>
            
            <div style={buttonContainerStyle}>
              <button
                type="button"
                style={buttonSecondaryStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, buttonSecondaryHoverStyle)}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = buttonSecondaryStyle.backgroundColor;
                  e.target.style.transform = '';
                  e.target.style.boxShadow = '';
                }}
                onClick={handleSelectAll}
                title="انتخاب همه گیرندگان"
              >
                انتخاب همه
              </button>
              <button
                type="button"
                style={buttonSecondaryStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, buttonSecondaryHoverStyle)}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = buttonSecondaryStyle.backgroundColor;
                  e.target.style.transform = '';
                  e.target.style.boxShadow = '';
                }}
                onClick={handleDeselectAll}
                title="حذف همه انتخاب‌ها"
              >
                حذف همه
              </button>
            </div>
          </div>

          {recipientsLoading ? (
            <div style={loadingStyle}>
              <div style={loadingSpinnerStyle} />
              در حال بارگذاری گیرندگان...
            </div>
          ) : currentRecipients.length > 0 ? (
            <>
              {currentRecipients.map(recipient => (
                <div
                  key={recipient.id}
                  style={{
                    ...recipientItemStyle,
                    ...(recipient.selected ? selectedRecipientStyle : {}),
                    ...(hoveredItem === recipient.id ? recipientItemHoverStyle : {}),
                  }}
                  onClick={() => handleRecipientToggle(recipient.id)}
                  onMouseEnter={() => handleMouseEnter(recipient)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  title={`${recipient.name} - ${recipient.email}`}
                >
                  <input
                    type="checkbox"
                    checked={recipient.selected}
                    onChange={() => handleRecipientToggle(recipient.id)}
                    style={checkboxStyle}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      ...recipientNameStyle,
                      ...(recipient.selected ? selectedRecipientTextStyle : {}),
                    }}>
                      {recipient.name}
                    </div>
                    <div style={recipientEmailStyle}>
                      {recipient.email}
                      {recipient.role && ` - ${recipient.role}`}
                      {recipient.department && ` - ${recipient.department}`}
                    </div>
                  </div>
                  <div style={recipientTypeStyle}>
                    {getTypeLabel(recipient.type)}
                  </div>
                </div>
              ))}
              
              {renderPagination()}
            </>
          ) : (
            <div style={noResultsStyle}>
              {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هیچ گیرنده‌ای برای این نوع انتخاب نشده'}
            </div>
          )}
        </div>

        <div 
          style={{
            ...checkboxContainerStyle,
            ...(hoveredItem === 'attachment' ? checkboxContainerHoverStyle : {})
          }}
          onMouseEnter={() => setHoveredItem('attachment')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <input
            type="checkbox"
            name="includeAttachment"
            checked={formData.includeAttachment}
            onChange={handleInputChange}
            style={checkboxStyle}
          />
          <label style={checkboxLabelStyle}>
            پیوست فایل
          </label>
        </div>

        {formData.includeAttachment && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>فایل پیوست</label>
            {fileError && <div style={fileErrorStyle}>{fileError}</div>}
            {formData.attachment ? (
              <div style={fileInfoStyle}>
                <span>📎 {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(1)} KB)</span>
                <button type="button" style={removeFileBtnStyle} onClick={handleRemoveFile} title="حذف فایل">×</button>
              </div>
            ) : (
              <div
                style={dragActive ? { ...dropzoneStyle, ...dropzoneActiveStyle } : dropzoneStyle}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragLeave}
                onClick={handleDropzoneClick}
              >
                فایل را اینجا بکشید و رها کنید یا کلیک کنید برای انتخاب فایل
                <input
                  type="file"
                  name="attachment"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ color: '#00d4ff', cursor: 'pointer', marginLeft: '0.5rem' }}>
                  انتخاب فایل
                </label>
              </div>
            )}
          </div>
        )}

        <div 
          style={{
            ...summaryContainerStyle,
            ...(hoveredItem === 'summary' ? summaryContainerHoverStyle : {})
          }}
          onMouseEnter={() => setHoveredItem('summary')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={summaryTitleStyle}>
            📊 خلاصه ارسال
          </div>
          <div style={{
            ...summaryItemStyle,
            ...(hoveredItem === 'summary' ? summaryItemHoverStyle : {})
          }}>
            <span style={summaryLabelStyle}>تعداد گیرندگان:</span>
            <span style={summaryValueStyle}>{getTotalRecipients()} نفر</span>
          </div>
          <div style={{
            ...summaryItemStyle,
            ...(hoveredItem === 'summary' ? summaryItemHoverStyle : {})
          }}>
            <span style={summaryLabelStyle}>موسسات:</span>
            <span style={summaryValueStyle}>
              {allRecipients.filter(r => r.selected && r.type === 'institute').length} موسسه
            </span>
          </div>
          <div style={{
            ...summaryItemStyle,
            ...(hoveredItem === 'summary' ? summaryItemHoverStyle : {})
          }}>
            <span style={summaryLabelStyle}>کاربران:</span>
            <span style={summaryValueStyle}>
              {allRecipients.filter(r => r.selected && r.type === 'user').length} کاربر
            </span>
          </div>
          <div style={{
            ...summaryItemStyle,
            ...(hoveredItem === 'summary' ? summaryItemHoverStyle : {})
          }}>
            <span style={summaryLabelStyle}>کارمندان:</span>
            <span style={summaryValueStyle}>
              {allRecipients.filter(r => r.selected && r.type === 'employee').length} کارمند
            </span>
          </div>
          <div style={{
            ...summaryItemStyle,
            ...(hoveredItem === 'summary' ? summaryItemHoverStyle : {})
          }}>
            <span style={summaryLabelStyle}>پیوست:</span>
            <span style={summaryValueStyle}>
              {formData.includeAttachment && formData.attachment ? formData.attachment.name : 'بدون پیوست'}
            </span>
          </div>
        </div>

        {isLoading && (
          <div style={progressBarStyle}>
            <div style={{ ...progressFillStyle, width: `${progress}%` }} />
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonStyle.backgroundColor;
              e.target.style.transform = '';
              e.target.style.boxShadow = '';
            }}
            disabled={isLoading}
            title="ارسال ایمیل"
          >
            {isLoading ? (
              <>
                <div style={loadingSpinnerStyle} />
                در حال ارسال...
              </>
            ) : (
              'ارسال ایمیل'
            )}
          </button>
          

          
          <button
            type="button"
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonSecondaryHoverStyle)}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonSecondaryStyle.backgroundColor;
              e.target.style.transform = '';
              e.target.style.boxShadow = '';
            }}
            onClick={() => {
              setFormData({
                subject: '',
                message: '',
                recipientType: 'all',
                includeAttachment: false,
                attachment: null,
              });
              setAllRecipients(prev => 
                prev.map(recipient => ({ ...recipient, selected: false }))
              );
              setSearchTerm('');
              setCurrentPage(1);
              setAlert(null);
              showSuccessAlert('فرم پاک شد');
            }}
            disabled={isLoading}
            title="پاک کردن فرم"
          >
            پاک کردن فرم
          </button>
        </div>
      </form>

      {showTooltip && (
        <div 
          style={{
            ...tooltipStyle,
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            opacity: 1,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default Announcements;
