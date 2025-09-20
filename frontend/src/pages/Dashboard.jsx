import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const resources = [
  { 
    title: 'اخبار', 
    description: 'جدیدترین اخبار در مورد تضمین کیفیت و فعالیت‌ها.', 
    route: '/news',
    icon: '📰',
    color: '#4CAF50'
  },
  { 
    title: 'یوزر ها', 
    description: 'تمام یوزر ها را از این قسمت کنترول کنید', 
    route: '/dashboard/users',
    icon: '👥',
    color: '#2196F3'
  },
  { 
    title: 'رهنمود ها، فورم ها و اسناد تقنینی', 
    description: 'کنترول اپلود رهنمود ها، فورم ها و اسناد تقینی در بخش مرکز اسناد و دانلود ها', 
    route: '/dashboard/docs-center-and-uploads',
    icon: '📋',
    color: '#FF9800'
  },
  { 
    title: 'ویدیو های آموزشی', 
    description: 'کنترول ویدیو های آموزشی', 
    route: '/dashboard/videos',
    icon: '🎥',
    color: '#9C27B0'
  },
  { 
    title: 'اطلاع رسانی', 
    description: 'تمامی افراد، انستیتوت و کارمندان را اطلاع رسانی نمایید.', 
    route: '/dashboard/Announcements',
    icon: '📢',
    color: '#607D8B'
  },

  { 
    title: 'چک لیست، فورم و پرسش نامه ها', 
    description: 'مدیریت چک لیست، فورم و پرسش نامه ها', 
    route: '/dashboard/questionnaires',
    icon: '📝',
    color: '#607D8B'
  },
  // { title: 'رهنمود ارزیابی برنامه های آموزشی', description: 'ارزیابی محتوای آموزشی بر اساس معیارهای کیفیت.', route: '/guidelines/program-eval' },
  // { title: 'رهنمود ارزیابی استادان و مربیان', description: 'نحوه ارزیابی عملکرد استادان و مربیان.', route: '/guidelines/teachers-eval' },
  // { title: 'رهنمود گزارش خود ارزیابی', description: 'راهنمایی برای تهیه گزارش‌های خود ارزیابی.', route: '/guidelines/self-assessment' },
  // { title: 'رهنمود کار آموزی و آموزش عملی', description: 'رهنمودهای مربوط به آموزش عملی و کارآموزی.', route: '/guidelines/internship' },
  // { title: 'رهنمود اعتباردهی مؤسسات', description: 'فرآیند و معیارهای اعتباردهی به مؤسسات.', route: '/guidelines/accreditation' },
  // { title: 'پلان استراتیژیک کیفیت', description: 'طرح استراتژیک برای بهبود کیفیت.', route: '/plans/strategic-quality' },
  // { title: 'فورم ها و چک لیست ها', description: 'فورم‌ها و چک‌لیست‌های رسمی برای ارزیابی.', route: '/forms-checklists' },
  // { title: 'مفاهیم اساسی تضمین کیفیت', description: 'اصول و مفاهیم پایه‌ای در تضمین کیفیت.', route: '/concepts/quality-assurance' },
  // { title: 'معیار های ملی تضمین کیفیت', description: 'معیارهای ملی ارزیابی کیفیت.', route: '/standards/national' },
  // { title: 'گزارش های سالانه کیفیت', description: 'تحلیل کیفیت سالانه مراکز.', route: '/reports/annual-quality' },
  // { title: 'گزارش های ارزیابی مؤسسات', description: 'گزارش‌های مربوط به ارزیابی مؤسسات.', route: '/reports/institution-evaluation' },
  // { title: 'گزارشهای خود ارزیابی', description: 'گزارش‌های تهیه شده توسط مؤسسات در خصوص خود ارزیابی.', route: '/reports/self-evaluation' },
  // { title: 'نشرات علمی و تخنیکی', description: 'مطالب و مقالات علمی منتشر شده.', route: '/publications/scientific' },
  // { title: 'بولتنها و خبر نامه ها', description: 'نشریه‌ها و بولتن‌های دوره‌ای.', route: '/publications/bulletins' },
  // { title: 'راپور های بازدید و نظارت', description: 'گزارش‌های بازدید و نظارت.', route: '/reports/monitoring' },
  // { title: 'تحلیل ها و یافته های آماری', description: 'تحلیل‌های آماری و داده‌های آموزشی.', route: '/analytics/statistics' },
  // { title: 'کتابچه ها و بروشور های آموزشی', description: 'بروشورها و کتابچه‌های آموزشی.', route: '/documents/booklets' },
  // { title: 'برنامه های آموزشی استادان و کارمندان', description: 'دوره‌های آموزشی ویژه استادان و کارکنان.', route: '/programs/staff-training' },
  // { title: 'ورکشاپ ها و سیمینار ها', description: 'ورکشاپ‌ها و سمینارهای برگزار شده.', route: '/events/workshops' },
  // { title: 'دوره های ارتقای ظرفیت تخنیکی و مسلکی', description: 'برنامه‌های ارتقاء مهارت فنی.', route: '/programs/technical-training' },
  // { title: 'برنامه های آنلاین آموزشی', description: 'دوره‌های آموزش مجازی.', route: '/programs/online' },
  // { title: 'اسناد و منابع آموزشی قابل دانلود', description: 'منابع آموزشی برای دانلود.', route: '/resources/downloadable' },
  // { title: 'تقویم آموزش ها', description: 'زمان‌بندی برنامه‌های آموزشی.', route: '/calendar/trainings' },
  // { title: 'فرصتهای آموزشی ملی و بین المللی', description: 'فرصت‌های آموزشی داخلی و خارجی.', route: '/opportunities/training' },
  // { title: 'گزارش فعالیت های آموزشی گذشته', description: 'گزارش‌های دوره‌های گذشته.', route: '/reports/past-activities' },
  // { title: 'اسناد پالیسی و مقررات', description: 'پالیسی‌ها و مقررات مرتبط.', route: '/policies/regulations' },
  // { title: 'معیار ها و رهنمود ها', description: 'استانداردها و رهنمودهای کیفیت.', route: '/standards/guidelines' },
  // { title: 'گزارش ها و راپور ها', description: 'تمام گزارش‌ها و راپورهای مرتبط.', route: '/reports/all' },
  // { title: 'نشرات و بروشور ها', description: 'نشرات چاپی و بروشورهای آموزشی.', route: '/publications/brochures' },
  // { title: 'اسناد آموزشی و تربیتی', description: 'منابع آموزشی برای مؤسسات.', route: '/documents/educational' },
  // { title: 'فایل های ویدیویی و پرزنتیشن ها', description: 'ویدیوها و پرزنتیشن‌های آموزشی.', route: '/media/videos' },
  // { title: 'لوایح و طرز العمل ها', description: 'قوانین، لوایح و طرزالعمل‌ها.', route: '/regulations/manuals' },
];

const Card = ({ title, description, route, onClick, icon, color }) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardStyle,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderLeft: `4px solid ${color}`,
        boxShadow: theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...(hovered ? {
          transform: 'translateY(-5px)',
          boxShadow: theme === 'dark' 
            ? '0 10px 20px rgba(0, 0, 0, 0.7)' 
            : '0 10px 20px rgba(0, 0, 0, 0.2)'
        } : {}),
      }}
    >
      <div style={cardHeader}>
        <span style={{ ...cardIcon, backgroundColor: color }}>{icon}</span>
        <h3 style={{ ...cardTitle, color: theme === 'dark' ? '#ffffff' : '#333333' }}>{title}</h3>
      </div>
      <p style={{ ...cardDescription, color: theme === 'dark' ? '#cccccc' : '#666666' }}>{description}</p>
      <div style={cardArrow}>
        <span style={{ ...arrowStyle, ...(hovered ? arrowHoverStyle : {}) }}>→</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  route: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
};

const LoadingSpinner = () => (
  <div style={loadingContainer}>
    <div style={spinner}></div>
    <p style={loadingText}>در حال بارگذاری...</p>
  </div>
);

const UserInfo = ({ user, onLogout }) => {
  const { theme } = useTheme();
  
  return (
    <div style={{
      ...userInfoContainer,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      border: theme === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
    }}>
      <div style={{
        ...userAvatar,
        backgroundColor: theme === 'dark' ? '#00d4ff' : '#4a6cf7',
        border: theme === 'dark' ? '2px solid #00d4ff' : '2px solid #4a6cf7',
      }}>
        <span style={avatarText}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </span>
      </div>
      <div style={userDetails}>
        <h3 style={{...userName, color: theme === 'dark' ? '#ffffff' : '#333333'}}>
          {user?.name || 'کاربر'}
        </h3>
        <p style={{...userRole, color: theme === 'dark' ? '#cccccc' : '#666666'}}>
          {user?.role || 'مدیر'}
        </p>
      </div>
      <button 
        onClick={onLogout} 
        style={{
          ...logoutButton,
          backgroundColor: theme === 'dark' ? '#dc3545' : '#ff6b6b',
          color: '#ffffff',
        }}
      >
        <span>🚪</span>
        <span>خروج</span>
      </button>
    </div>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

UserInfo.defaultProps = {
  user: null,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('User not authenticated:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.warn('Logout failed:', e);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const filteredResources = resources.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{
      ...dashboardContainer,
      backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
      color: theme === 'dark' ? '#ffffff' : '#333333'
    }}>
      <div style={{
        ...header,
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        color: theme === 'dark' ? '#ffffff' : '#333333'
      }}>
        <div style={headerContent}>
          <div>
          <h1 style={{...dashboardTitle, color: theme === 'dark' ? '#ffffff' : '#333333'}}>داشبورد مدیریت</h1>
          <p style={{...dashboardSubtitle, color: theme === 'dark' ? '#cccccc' : '#666666'}}>به سیستم مدیریت تضمین کیفیت خوش آمدید</p>
        </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <UserInfo user={user} onLogout={handleLogout} />
        </div>
      </div>

      <div style={searchContainer}>
        <input
          type="text"
          placeholder="جستجو در بخش‌های مختلف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            ...searchStyle,
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#333333',
            ...(searchFocused ? searchFocusedStyle : {})
          }}
        />
        
        {search && (
          <button
            onClick={() => setSearch('')}
            style={clearAllButton}
          >
            پاک کردن جستجو
          </button>
        )}
      </div>
      
      {search && (
        <div style={{ textAlign: 'center', margin: '0 0 1rem 0', color: '#999999', fontSize: '0.9rem' }}>
          {filteredResources.length} نتیجه یافت شد
        </div>
      )}

      {filteredResources.length > 0 ? (
        <div style={gridContainer}>
          {filteredResources.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              description={item.description}
              route={item.route}
              icon={item.icon}
              color={item.color}
              onClick={() => navigate(item.route)}
            />
          ))}
        </div>
      ) : (
        <div style={noResultsContainer}>
          <div style={noResultsIcon}>🔍</div>
          <h3 style={noResultsTitle}>موردی یافت نشد</h3>
          <p style={noResultsText}>
            هیچ بخشی با عبارت &quot;{search}&quot; مطابقت ندارد
          </p>
          <button
            onClick={() => setSearch('')}
            style={clearAllButton}
          >
            پاک کردن جستجو
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Styles
const dashboardContainer = {
  minHeight: '100vh',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  padding: '1rem',
};

const header = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#ffffff',
  padding: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  borderBottom: '1px solid #333333',
};

const headerContent = {
  flex: 1,
};

const dashboardTitle = {
  margin: '0 0 0.5rem 0',
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#ffffff',
};

const dashboardSubtitle = {
  margin: 0,
  fontSize: '1.1rem',
  color: '#cccccc',
  opacity: 0.9,
};

const userInfoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

const userAvatar = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

const avatarText = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#000000',
};

const userDetails = {
  textAlign: 'right',
};

const userName = {
  margin: '0 0 0.25rem 0',
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#ffffff',
};

const userRole = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#999999',
  opacity: 0.8,
};

const logoutButton = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  fontWeight: '500',
};


const searchWrapper = {
  position: 'relative',
  maxWidth: '600px',
  margin: '0 auto',
  flex: 1,
  minWidth: '250px',
};

const searchIcon = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.2rem',
  color: '#00d4ff',
  zIndex: 1,
};

const searchStyle = {
  flex: 1,
  minWidth: '250px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  outline: 'none',
  transition: 'all 0.3s ease',
};

const searchFocusedStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.2)',
};

const clearSearchButton = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  color: '#00d4ff',
  cursor: 'pointer',
  padding: '5px',
  borderRadius: '50%',
  transition: 'all 0.2s ease',
};

const searchResults = {
  textAlign: 'center',
  margin: '1rem 0 0 0',
  color: '#999999',
  fontSize: '0.9rem',
};

const searchContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
  padding: '1rem',
  borderBottom: '1px solid',
};

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  padding: '2rem',
  maxWidth: '1400px',
  margin: '0 auto',
};

const cardStyle = {
  borderRadius: '8px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid #333333',
  position: 'relative',
  overflow: 'hidden',
};

const cardHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  borderColor: '#00d4ff',
};

const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
};

const cardIcon = {
  width: '50px',
  height: '50px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  color: 'white',
};

const cardTitle = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.25rem',
  fontWeight: '600',
};

const cardDescription = {
  margin: '0.5rem 0 0 0',
  fontSize: '0.95rem',
  lineHeight: '1.5',
};

const cardArrow = {
  textAlign: 'left',
};

const arrowStyle = {
  fontSize: '1.5rem',
  color: '#00d4ff',
  transition: 'all 0.3s ease',
};

const arrowHoverStyle = {
  transform: 'translateX(-5px)',
  color: '#00b8e6',
};

const noResultsContainer = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#999999',
};

const noResultsIcon = {
  fontSize: '4rem',
  marginBottom: '1rem',
  opacity: 0.5,
  color: '#00d4ff',
};

const noResultsTitle = {
  margin: '0 0 1rem 0',
  fontSize: '1.5rem',
  color: '#ffffff',
};

const noResultsText = {
  margin: '0 0 2rem 0',
  fontSize: '1rem',
  color: '#999999',
};

const clearAllButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#00d4ff',
  color: '#000000',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  fontWeight: '500',
};

const loadingContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#0a0a0a',
};

const spinner = {
  width: '50px',
  height: '50px',
  border: '3px solid #333333',
  borderTop: '3px solid #00d4ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const loadingText = {
  marginTop: '1rem',
  color: '#999999',
  fontSize: '1.1rem',
};

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default Dashboard;
