import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    title: 'پرسشنامه ها', 
    description: 'اپلود پرسش نامه ها از این طریق میباشد.', 
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
        borderLeft: `4px solid ${color}`,
        ...(hovered ? cardHoverStyle : {}),
      }}
    >
      <div style={cardHeader}>
        <span style={{ ...cardIcon, backgroundColor: color }}>{icon}</span>
        <h3 style={cardTitle}>{title}</h3>
      </div>
      <p style={cardDescription}>{description}</p>
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

const UserInfo = ({ user, onLogout }) => (
  <div style={userInfoContainer}>
    <div style={userAvatar}>
      <span style={avatarText}>
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </span>
    </div>
    <div style={userDetails}>
      <h3 style={userName}>{user?.name || 'کاربر'}</h3>
      <p style={userRole}>{user?.role || 'مدیر'}</p>
    </div>
    <button onClick={onLogout} style={logoutButton}>
      <span>🚪</span>
      <span>خروج</span>
    </button>
  </div>
);

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
    <div style={dashboardContainer}>
      <div style={header}>
        <div style={headerContent}>
          <h1 style={dashboardTitle}>داشبورد مدیریت</h1>
          <p style={dashboardSubtitle}>به سیستم مدیریت تضمین کیفیت خوش آمدید</p>
        </div>
        <UserInfo user={user} onLogout={handleLogout} />
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
  backgroundColor: '#0a0a0a',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
  color: '#ffffff',
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
  backgroundColor: '#1a1a1a',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #333333',
};

const userAvatar = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#00d4ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #00d4ff',
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
  backgroundColor: '#dc3545',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  fontWeight: '500',
};

const searchContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
  padding: '1rem',
  borderBottom: '1px solid #333333',
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
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const searchFocusedStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
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

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  padding: '2rem',
  maxWidth: '1400px',
  margin: '0 auto',
};

const cardStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
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
  margin: 0,
  fontSize: '1.2rem',
  color: '#ffffff',
  fontWeight: '600',
  flex: 1,
};

const cardDescription = {
  fontSize: '0.875rem',
  color: '#cccccc',
  lineHeight: '1.5',
  margin: '0 0 1rem 0',
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
