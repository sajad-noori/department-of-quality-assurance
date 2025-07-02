import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';

const containerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  marginTop: '2rem',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '1.5rem',
  borderBottom: '2px solid #00d4ff',
  paddingBottom: '0.5rem',
};

const commentsListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginBottom: '2rem',
};

const commentItemStyle = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #333333',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  transition: 'all 0.2s ease',
};

const commentItemHoverStyle = {
  borderColor: '#00d4ff',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.1)',
};

const commentHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const authorStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#00d4ff',
  backgroundColor: 'rgba(0, 212, 255, 0.1)',
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
};

const dateStyle = {
  fontSize: '0.75rem',
  color: '#666666',
  backgroundColor: '#1a1a1a',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
};

const commentTextStyle = {
  fontSize: '0.95rem',
  color: '#ffffff',
  lineHeight: '1.6',
  margin: 0,
};

const formContainerStyle = {
  borderTop: '1px solid #333333',
  paddingTop: '1.5rem',
};

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  resize: 'vertical',
  minHeight: '100px',
  fontFamily: 'inherit',
};

const textareaFocusStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
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
  marginTop: '1rem',
};

const buttonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#666666',
  color: '#999999',
  cursor: 'not-allowed',
  transform: 'none',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  color: '#999999',
};

const spinnerStyle = {
  width: '20px',
  height: '20px',
  border: '2px solid #333333',
  borderTop: '2px solid #00d4ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginRight: '0.5rem',
};

const errorStyle = {
  color: '#dc3545',
  fontSize: '0.875rem',
  padding: '0.75rem',
  backgroundColor: 'rgba(220, 53, 69, 0.1)',
  border: '1px solid rgba(220, 53, 69, 0.2)',
  borderRadius: '6px',
  marginBottom: '1rem',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#999999',
};

const emptyStateIconStyle = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
  opacity: 0.5,
};

const loginPromptStyle = {
  backgroundColor: 'rgba(0, 212, 255, 0.1)',
  border: '1px solid rgba(0, 212, 255, 0.2)',
  borderRadius: '6px',
  padding: '1rem',
  marginBottom: '1rem',
  textAlign: 'center',
};

const loginPromptTextStyle = {
  color: '#00d4ff',
  fontSize: '0.875rem',
  margin: 0,
  marginBottom: '0.5rem',
};

const loginButtonStyle = {
  backgroundColor: '#00d4ff',
  border: 'none',
  color: '#000000',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

const loginButtonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
};

const paginationContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: '#2a2a2a',
  borderRadius: '6px',
  border: '1px solid #333333',
};

const paginationInfoStyle = {
  fontSize: '0.875rem',
  color: '#999999',
};

const paginationControlsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const pageButtonStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  color: '#ffffff',
  padding: '0.5rem 0.75rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  minWidth: '40px',
  textAlign: 'center',
};

const pageButtonHoverStyle = {
  backgroundColor: '#00d4ff',
  borderColor: '#00d4ff',
  color: '#000000',
};

const pageButtonActiveStyle = {
  backgroundColor: '#00d4ff',
  borderColor: '#00d4ff',
  color: '#000000',
  fontWeight: '600',
};

const pageButtonDisabledStyle = {
  ...pageButtonStyle,
  backgroundColor: '#333333',
  color: '#666666',
  cursor: 'not-allowed',
};

const itemsPerPageStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
  color: '#999999',
};

const selectStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  color: '#ffffff',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  outline: 'none',
};

const Comments = ({ newsId }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [textareaFocused, setTextareaFocused] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalComments, setTotalComments] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Calculate pagination
  const totalPages = Math.ceil(totalComments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComments = comments.slice(startIndex, endIndex);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/news/${newsId}/comments`)
      .then((res) => {
        setComments(res.data);
        setTotalComments(res.data.length);
        setCurrentPage(1); // Reset to first page when comments change
      })
      .catch(() => setError("خطا در بارگذاری نظرات"))
      .finally(() => setLoading(false));
  }, [newsId]);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    if (!user || !user.id) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setSubmitting(true);
    axios
      .post(
        `/api/news/${newsId}/comments`,
        { comment: newComment },
        { withCredentials: true }
      )
      .then((res) => {
        setComments((prev) => [res.data, ...prev]); // Add new comment at the beginning
        setTotalComments((prev) => prev + 1);
        setNewComment("");
        setCurrentPage(1); // Go to first page to see the new comment
      })
      .catch(() => alert("خطا در ارسال نظر"))
      .finally(() => setSubmitting(false));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleButtonHover = (e) => {
    if (!submitting) {
      Object.assign(e.currentTarget.style, buttonHoverStyle);
    }
  };

  const handleButtonLeave = (e) => {
    if (!submitting) {
      const style = submitting ? buttonDisabledStyle : buttonStyle;
      Object.assign(e.currentTarget.style, style);
    }
  };

  const handleCommentHover = (e) => {
    Object.assign(e.currentTarget.style, commentItemHoverStyle);
  };

  const handleCommentLeave = (e) => {
    Object.assign(e.currentTarget.style, commentItemStyle);
  };

  const handlePageButtonHover = (e) => {
    const isDisabled = e.currentTarget.disabled;
    const isActive = e.currentTarget.classList.contains('active');
    
    if (!isDisabled && !isActive) {
      Object.assign(e.currentTarget.style, pageButtonHoverStyle);
    }
  };

  const handlePageButtonLeave = (e) => {
    const isDisabled = e.currentTarget.disabled;
    const isActive = e.currentTarget.classList.contains('active');
    
    if (isDisabled) {
      Object.assign(e.currentTarget.style, pageButtonDisabledStyle);
    } else if (isActive) {
      Object.assign(e.currentTarget.style, pageButtonActiveStyle);
    } else {
      Object.assign(e.currentTarget.style, pageButtonStyle);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Light mode style overrides
  const containerStyleLight = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #e0f7fa',
    boxShadow: '0 4px 20px rgba(13,202,240,0.08)',
    marginTop: '2rem',
  };
  const titleStyleLight = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0dcaf0',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #0dcaf0',
    paddingBottom: '0.5rem',
  };
  const commentsListStyleLight = { ...commentsListStyle };
  const commentItemStyleLight = {
    backgroundColor: '#f7fcfd',
    border: '1px solid #e0f7fa',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
  };
  const commentItemHoverStyleLight = {
    borderColor: '#0dcaf0',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(13,202,240,0.10)',
  };
  const commentHeaderStyleLight = { ...commentHeaderStyle };
  const authorStyleLight = {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#00b5d7',
    backgroundColor: '#e0f7fa',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
  };
  const dateStyleLight = {
    fontSize: '0.75rem',
    color: '#666',
    backgroundColor: '#f7fcfd',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #e0f7fa',
  };
  const commentTextStyleLight = {
    fontSize: '0.95rem',
    color: '#222',
    lineHeight: '1.6',
    margin: 0,
  };
  const formContainerStyleLight = {
    borderTop: '1px solid #e0f7fa',
    paddingTop: '1.5rem',
  };
  const textareaStyleLight = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '1px solid #e0f7fa',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#222',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
  };
  const textareaFocusStyleLight = {
    borderColor: '#0dcaf0',
    boxShadow: '0 0 0 2px #b2ebf2',
  };
  const buttonStyleLight = {
    backgroundColor: '#0dcaf0',
    border: 'none',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
  };
  const buttonHoverStyleLight = {
    backgroundColor: '#00b5d7',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(13,202,240,0.10)',
  };
  const buttonDisabledStyleLight = {
    ...buttonStyleLight,
    backgroundColor: '#e0e0e0',
    color: '#aaa',
    cursor: 'not-allowed',
    transform: 'none',
  };
  const loadingStyleLight = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#0dcaf0',
  };
  const spinnerStyleLight = {
    width: '20px',
    height: '20px',
    border: '2px solid #e0f7fa',
    borderTop: '2px solid #0dcaf0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem',
  };
  const errorStyleLight = {
    color: '#ff6b6b',
    fontSize: '0.875rem',
    padding: '0.75rem',
    backgroundColor: '#fffbe6',
    border: '1px solid #ffe082',
    borderRadius: '6px',
    marginBottom: '1rem',
  };
  const emptyStateStyleLight = {
    textAlign: 'center',
    padding: '2rem',
    color: '#bbb',
  };
  const emptyStateIconStyleLight = {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    opacity: 0.5,
  };
  const loginPromptStyleLight = {
    backgroundColor: '#e0f7fa',
    border: '1px solid #b2ebf2',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
    textAlign: 'center',
  };
  const loginPromptTextStyleLight = {
    color: '#00b5d7',
    fontSize: '0.875rem',
    margin: 0,
    marginBottom: '0.5rem',
  };
  const loginButtonStyleLight = {
    backgroundColor: '#0dcaf0',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };
  const loginButtonHoverStyleLight = {
    backgroundColor: '#00b5d7',
    transform: 'translateY(-1px)',
  };
  const paginationContainerStyleLight = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f7fcfd',
    borderRadius: '6px',
    border: '1px solid #e0f7fa',
  };
  const paginationInfoStyleLight = {
    fontSize: '0.875rem',
    color: '#888',
  };
  const paginationControlsStyleLight = { ...paginationControlsStyle };
  const pageButtonStyleLight = {
    backgroundColor: '#fff',
    border: '1px solid #e0f7fa',
    color: '#00b5d7',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    minWidth: '40px',
    textAlign: 'center',
  };
  const pageButtonHoverStyleLight = {
    backgroundColor: '#e0f7fa',
    borderColor: '#0dcaf0',
    color: '#00b5d7',
  };
  const pageButtonActiveStyleLight = {
    backgroundColor: '#0dcaf0',
    borderColor: '#0dcaf0',
    color: '#fff',
    fontWeight: '600',
  };
  const pageButtonDisabledStyleLight = {
    ...pageButtonStyleLight,
    backgroundColor: '#e0e0e0',
    color: '#aaa',
    cursor: 'not-allowed',
  };
  const itemsPerPageStyleLight = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#888',
  };
  const selectStyleLight = {
    backgroundColor: '#fff',
    border: '1px solid #e0f7fa',
    color: '#00b5d7',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div style={isLight ? containerStyleLight : containerStyle}>
      <h3 style={isLight ? titleStyleLight : titleStyle}>💬 نظرات</h3>

      {loading && (
        <div style={isLight ? loadingStyleLight : loadingStyle}>
          <div style={isLight ? spinnerStyleLight : spinnerStyle}></div>
          <span>در حال بارگذاری نظرات...</span>
        </div>
      )}

      {error && <div style={isLight ? errorStyleLight : errorStyle}>❌ {error}</div>}

      {comments.length === 0 && !loading && (
        <div style={isLight ? emptyStateStyleLight : emptyStateStyle}>
          <div style={isLight ? emptyStateIconStyleLight : emptyStateIconStyle}>💭</div>
          <p>هنوز نظری ثبت نشده است.</p>
        </div>
      )}

      <ul style={isLight ? commentsListStyleLight : commentsListStyle}>
        {currentComments.map((c) => (
          <li
            key={c.id}
            style={isLight ? commentItemStyleLight : commentItemStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, isLight ? commentItemHoverStyleLight : commentItemHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, isLight ? commentItemStyleLight : commentItemStyle)}
          >
            <div style={isLight ? commentHeaderStyleLight : commentHeaderStyle}>
              <span style={isLight ? authorStyleLight : authorStyle}>
                👤 {c.author || "کاربر ناشناس"}
              </span>
              <span style={isLight ? dateStyleLight : dateStyle}>
                📅 {formatDate(c.created_at)}
              </span>
            </div>
            <p style={isLight ? commentTextStyleLight : commentTextStyle}>{c.comment}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalComments > 0 && (
        <div style={isLight ? paginationContainerStyleLight : paginationContainerStyle}>
          <div style={isLight ? paginationInfoStyleLight : paginationInfoStyle}>
            نمایش {startIndex + 1} تا {Math.min(endIndex, totalComments)} از {totalComments} نظر
          </div>
          
          <div style={isLight ? paginationControlsStyleLight : paginationControlsStyle}>
            <div style={isLight ? itemsPerPageStyleLight : itemsPerPageStyle}>
              <span>نمایش:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                style={isLight ? selectStyleLight : selectStyle}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span>نظر در هر صفحه</span>
            </div>
            
            <div style={isLight ? paginationControlsStyleLight : paginationControlsStyle}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={currentPage === 1 ? (isLight ? pageButtonDisabledStyleLight : pageButtonDisabledStyle) : (isLight ? pageButtonStyleLight : pageButtonStyle)}
                onMouseEnter={handlePageButtonHover}
                onMouseLeave={handlePageButtonLeave}
              >
                ‹
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={page === currentPage ? 'active' : ''}
                  style={
                    page === '...' 
                      ? (isLight ? pageButtonDisabledStyleLight : pageButtonDisabledStyle) 
                      : page === currentPage 
                        ? (isLight ? pageButtonActiveStyleLight : pageButtonActiveStyle) 
                        : (isLight ? pageButtonStyleLight : pageButtonStyle)
                  }
                  onMouseEnter={handlePageButtonHover}
                  onMouseLeave={handlePageButtonLeave}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={currentPage === totalPages ? (isLight ? pageButtonDisabledStyleLight : pageButtonDisabledStyle) : (isLight ? pageButtonStyleLight : pageButtonStyle)}
                onMouseEnter={handlePageButtonHover}
                onMouseLeave={handlePageButtonLeave}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={isLight ? formContainerStyleLight : formContainerStyle}>
        {!user && (
          <div style={isLight ? loginPromptStyleLight : loginPromptStyle}>
            <p style={isLight ? loginPromptTextStyleLight : loginPromptTextStyle}>
              برای ارسال نظر ابتدا وارد شوید
            </p>
            <button
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
              style={isLight ? loginButtonStyleLight : loginButtonStyle}
              onMouseEnter={e => Object.assign(e.currentTarget.style, isLight ? loginButtonHoverStyleLight : loginButtonHoverStyle)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, isLight ? loginButtonStyleLight : loginButtonStyle)}
            >
              ورود به سیستم
            </button>
          </div>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="نظر خود را اینجا بنویسید..."
          rows={4}
          style={{
            ...(isLight ? textareaStyleLight : textareaStyle),
            ...(textareaFocused ? (isLight ? textareaFocusStyleLight : textareaFocusStyle) : {})
          }}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          disabled={submitting || !user}
        />
        
        <button
          onClick={handleAddComment}
          disabled={submitting || !user || !newComment.trim()}
          style={submitting || !user || !newComment.trim() ? (isLight ? buttonDisabledStyleLight : buttonDisabledStyle) : (isLight ? buttonStyleLight : buttonStyle)}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          <span>{submitting ? '⏳' : '📤'}</span>
          <span>{submitting ? 'در حال ارسال...' : 'ارسال نظر'}</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

Comments.propTypes = {
  newsId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Comments;
