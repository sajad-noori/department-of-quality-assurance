import React, { useState, useEffect } from 'react';
import AnnouncementsAPI from '../api/announcements';

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

const filtersContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1.5rem',
  border: '1px solid #333333',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const selectStyle = {
  padding: '0.5rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '150px',
};

const searchInputStyle = {
  padding: '0.5rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  outline: 'none',
  minWidth: '200px',
};

const announcementCardStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '1rem',
  border: '1px solid #333333',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

const announcementCardHoverStyle = {
  border: '1px solid #00d4ff',
  boxShadow: '0 4px 20px rgba(0, 212, 255, 0.1)',
  transform: 'translateY(-2px)',
};

const announcementTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '0.5rem',
};

const announcementContentStyle = {
  fontSize: '0.875rem',
  color: '#cccccc',
  lineHeight: '1.6',
  marginBottom: '1rem',
  whiteSpace: 'pre-wrap',
};

const announcementMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: '#888888',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const badgeStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const targetAudienceBadgeStyle = {
  ...badgeStyle,
  backgroundColor: '#00d4ff',
  color: '#000000',
};

const emailSentBadgeStyle = {
  ...badgeStyle,
  backgroundColor: '#28a745',
  color: '#ffffff',
};

const emailNotSentBadgeStyle = {
  ...badgeStyle,
  backgroundColor: '#dc3545',
  color: '#ffffff',
};

const paginationContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '2rem',
  flexWrap: 'wrap',
};

const paginationButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '40px',
};

const paginationButtonActiveStyle = {
  ...paginationButtonStyle,
  backgroundColor: '#00d4ff',
  color: '#000000',
  border: '1px solid #00d4ff',
};

const paginationButtonDisabledStyle = {
  ...paginationButtonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};

const deleteButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.75rem',
  border: '1px solid #dc3545',
  borderRadius: '6px',
  backgroundColor: '#dc3545',
  color: '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginTop: '0.5rem',
};

const deleteButtonHoverStyle = {
  ...deleteButtonStyle,
  backgroundColor: '#c82333',
  border: '1px solid #c82333',
  transform: 'translateY(-1px)',
  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#cccccc',
};

const errorStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#dc3545',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  border: '1px solid #dc3545',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#888888',
};

const SeeAllAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetAudienceFilter, setTargetAudienceFilter] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AnnouncementsAPI.getAllAnnouncements();
      
      if (response.success) {
        setAnnouncements(response.data);
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Error loading announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTargetAudienceLabel = (audience) => {
    const labels = {
      'all': 'همه کاربران',
      'institute': 'انستیتوت',
      'user': 'کاربران',
      'employee': 'کارمندان'
    };
    return labels[audience] || audience;
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.creator_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTargetAudience = !targetAudienceFilter || 
      announcement.target_audience === targetAudienceFilter;
    
    return matchesSearch && matchesTargetAudience;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTargetAudienceChange = (e) => {
    setTargetAudienceFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این اعلان را حذف کنید؟')) {
      try {
        const response = await AnnouncementsAPI.deleteAnnouncement(announcementId);
        if (response.success) {
          // Remove the deleted announcement from the state
          setAnnouncements(prevAnnouncements => 
            prevAnnouncements.filter(announcement => announcement.id !== announcementId)
          );
          alert('اعلان با موفقیت حذف شد.');
        } else {
          alert('خطا در حذف اعلان.');
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('خطا در حذف اعلان. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>تمام اعلانات</h1>
          <p style={subtitleStyle}>در حال بارگذاری اعلانات...</p>
        </div>
        <div style={loadingStyle}>در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>تمام اعلانات</h1>
          <p style={subtitleStyle}>خطا در بارگذاری اعلانات</p>
        </div>
        <div style={errorStyle}>
          <p>{error}</p>
          <button 
            onClick={fetchAnnouncements}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              border: '1px solid #333333',
              borderRadius: '6px',
              backgroundColor: '#00d4ff',
              color: '#000000',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '1rem'
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>تمام اعلانات</h1>
        <p style={subtitleStyle}>
          تعداد کل اعلانات: {announcements.length} | نمایش: {currentAnnouncements.length} از {filteredAnnouncements.length}
        </p>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <input
          type="text"
          placeholder="جستجو در اعلانات..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
        
        <select
          value={targetAudienceFilter}
          onChange={handleTargetAudienceChange}
          style={selectStyle}
        >
          <option value="all">همه کاربران</option>
          <option value="institute">انستیتوت ها</option>
          <option value="user">کاربران</option>
          <option value="employee">کارمندان</option>
        </select>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>هیچ اعلانی یافت نشد.</p>
        </div>
      ) : (
        <>
          {currentAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              style={{
                ...announcementCardStyle,
                ...(hoveredCard === index && announcementCardHoverStyle)
              }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
            >
              <h3 style={announcementTitleStyle}>
                {announcement.title}
              </h3>
              
              <p style={announcementContentStyle}>
                {announcement.content}
              </p>

              <div style={announcementMetaStyle}>
                <div>
                  <span style={{ marginLeft: '1rem' }}>
                    <strong>ایجاد شده توسط:</strong> {announcement.creator_name || 'نامشخص'}
                  </span>
                  <span style={{ marginLeft: '1rem' }}>
                    <strong>تاریخ ایجاد:</strong> {formatDate(announcement.created_at)}
                  </span>
                  {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                    <span style={{ marginLeft: '1rem' }}>
                      <strong>آخرین بروزرسانی:</strong> {formatDate(announcement.updated_at)}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={targetAudienceBadgeStyle}>
                    {getTargetAudienceLabel(announcement.target_audience)}
                  </span>
                  
                  {announcement.email_sent ? (
                    <span style={emailSentBadgeStyle}>
                      ایمیل ارسال شده
                    </span>
                  ) : (
                    <span style={emailNotSentBadgeStyle}>
                      ایمیل ارسال نشده
                    </span>
                  )}
                  
                  {announcement.attachment_path && (
                    <span style={{ ...badgeStyle, backgroundColor: '#ffc107', color: '#000000' }}>
                      فایل پیوست
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAnnouncement(announcement.id);
                  }}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = deleteButtonHoverStyle.backgroundColor;
                    e.target.style.border = deleteButtonHoverStyle.border;
                    e.target.style.transform = deleteButtonHoverStyle.transform;
                    e.target.style.boxShadow = deleteButtonHoverStyle.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = deleteButtonStyle.backgroundColor;
                    e.target.style.border = deleteButtonStyle.border;
                    e.target.style.transform = deleteButtonStyle.transform;
                    e.target.style.boxShadow = deleteButtonStyle.boxShadow;
                  }}
                >
                  حذف اعلان
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={paginationContainerStyle}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
              >
                قبلی
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={pageNum === currentPage ? paginationButtonActiveStyle : paginationButtonStyle}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeeAllAnnouncements;
