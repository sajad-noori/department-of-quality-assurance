import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const resources = [
  { title: 'اخبار', description: 'جدیدترین اخبار در مورد تضمین کیفیت و فعالیت‌ها.', route: '/news' },
  { title: 'نمای از فعالیت های کلی', description: '', route: '/activities' },
  { title: 'رهنمود ها، فورم ها و اسناد تقنینی', description: 'کنترول اپلود رهنمود ها، فورم ها و اسناد تقینی در بخش مرکز اسناد و دانلود ها', route: '/dashboard/docs-center-and-uploads' },
  { title: 'ویدیو های آموزشی', description: 'کنترول ویدیو های آموزشی', route: '/dashboard/videos' },




  { title: 'رهنمود ارزیابی مؤسستات', description: 'دستورالعمل‌های دقیق برای ارزیابی مؤسسات آموزشی.', route: '/guidelines/institution-eval' },
  { title: 'رهنمود ارزیابی برنامه های آموزشی', description: 'ارزیابی محتوای آموزشی بر اساس معیارهای کیفیت.', route: '/guidelines/program-eval' },
  { title: 'رهنمود ارزیابی استادان و مربیان', description: 'نحوه ارزیابی عملکرد استادان و مربیان.', route: '/guidelines/teachers-eval' },
  { title: 'رهنمود گزارش خود ارزیابی', description: 'راهنمایی برای تهیه گزارش‌های خود ارزیابی.', route: '/guidelines/self-assessment' },
  { title: 'رهنمود کار آموزی و آموزش عملی', description: 'رهنمودهای مربوط به آموزش عملی و کارآموزی.', route: '/guidelines/internship' },
  { title: 'رهنمود اعتباردهی مؤسسات', description: 'فرآیند و معیارهای اعتباردهی به مؤسسات.', route: '/guidelines/accreditation' },
  { title: 'پلان استراتیژیک کیفیت', description: 'طرح استراتژیک برای بهبود کیفیت.', route: '/plans/strategic-quality' },
  { title: 'فورم ها و چک لیست ها', description: 'فورم‌ها و چک‌لیست‌های رسمی برای ارزیابی.', route: '/forms-checklists' },
  { title: 'مفاهیم اساسی تضمین کیفیت', description: 'اصول و مفاهیم پایه‌ای در تضمین کیفیت.', route: '/concepts/quality-assurance' },
  { title: 'معیار های ملی تضمین کیفیت', description: 'معیارهای ملی ارزیابی کیفیت.', route: '/standards/national' },
  { title: 'گزارش های سالانه کیفیت', description: 'تحلیل کیفیت سالانه مراکز.', route: '/reports/annual-quality' },
  { title: 'گزارش های ارزیابی مؤسسات', description: 'گزارش‌های مربوط به ارزیابی مؤسسات.', route: '/reports/institution-evaluation' },
  { title: 'گزارشهای خود ارزیابی', description: 'گزارش‌های تهیه شده توسط مؤسسات در خصوص خود ارزیابی.', route: '/reports/self-evaluation' },
  { title: 'نشرات علمی و تخنیکی', description: 'مطالب و مقالات علمی منتشر شده.', route: '/publications/scientific' },
  { title: 'بولتنها و خبر نامه ها', description: 'نشریه‌ها و بولتن‌های دوره‌ای.', route: '/publications/bulletins' },
  { title: 'راپور های بازدید و نظارت', description: 'گزارش‌های بازدید و نظارت.', route: '/reports/monitoring' },
  { title: 'تحلیل ها و یافته های آماری', description: 'تحلیل‌های آماری و داده‌های آموزشی.', route: '/analytics/statistics' },
  { title: 'کتابچه ها و بروشور های آموزشی', description: 'بروشورها و کتابچه‌های آموزشی.', route: '/documents/booklets' },
  { title: 'برنامه های آموزشی استادان و کارمندان', description: 'دوره‌های آموزشی ویژه استادان و کارکنان.', route: '/programs/staff-training' },
  { title: 'ورکشاپ ها و سیمینار ها', description: 'ورکشاپ‌ها و سمینارهای برگزار شده.', route: '/events/workshops' },
  { title: 'دوره های ارتقای ظرفیت تخنیکی و مسلکی', description: 'برنامه‌های ارتقاء مهارت فنی.', route: '/programs/technical-training' },
  { title: 'برنامه های آنلاین آموزشی', description: 'دوره‌های آموزش مجازی.', route: '/programs/online' },
  { title: 'اسناد و منابع آموزشی قابل دانلود', description: 'منابع آموزشی برای دانلود.', route: '/resources/downloadable' },
  { title: 'تقویم آموزش ها', description: 'زمان‌بندی برنامه‌های آموزشی.', route: '/calendar/trainings' },
  { title: 'فرصتهای آموزشی ملی و بین المللی', description: 'فرصت‌های آموزشی داخلی و خارجی.', route: '/opportunities/training' },
  { title: 'گزارش فعالیت های آموزشی گذشته', description: 'گزارش‌های دوره‌های گذشته.', route: '/reports/past-activities' },
  { title: 'اسناد پالیسی و مقررات', description: 'پالیسی‌ها و مقررات مرتبط.', route: '/policies/regulations' },
  { title: 'معیار ها و رهنمود ها', description: 'استانداردها و رهنمودهای کیفیت.', route: '/standards/guidelines' },
  { title: 'گزارش ها و راپور ها', description: 'تمام گزارش‌ها و راپورهای مرتبط.', route: '/reports/all' },
  { title: 'نشرات و بروشور ها', description: 'نشرات چاپی و بروشورهای آموزشی.', route: '/publications/brochures' },
  { title: 'اسناد آموزشی و تربیتی', description: 'منابع آموزشی برای مؤسسات.', route: '/documents/educational' },
  { title: 'فایل های ویدیویی و پرزنتیشن ها', description: 'ویدیوها و پرزنتیشن‌های آموزشی.', route: '/media/videos' },
  { title: 'لوایح و طرز العمل ها', description: 'قوانین، لوایح و طرزالعمل‌ها.', route: '/regulations/manuals' },
];

const Card = ({ title, description, route, onClick }) => {
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
        ...(hovered ? cardHoverStyle : {}),
      }}
    >
      <h3 style={cardTitle}>{title}</h3>
      <p style={cardDescription}>{description}</p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  route: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Use cookie-based auth (no jwtDecode, no localStorage)
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
    localStorage.removeItem('token'); // ✅ Clear token
    navigate('/login');              // ✅ Redirect to login
  }
};


  const filteredResources = resources.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>داشبورد مدیریت</h1>

      <input
        type="text"
        placeholder="جستجو..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {filteredResources.length > 0 ? (
        <div style={gridContainer}>
          {filteredResources.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              description={item.description}
              route={item.route}
              onClick={() => navigate(item.route)}
            />
          ))}
        </div>
      ) : (
        <p style={{ marginTop: '2rem', color: '#999' }}>موردی یافت نشد.</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={handleLogout}
          style={{ ...buttonStyle, backgroundColor: '#d9534f' }}
        >
          🚪 خروج
        </button>
      </div>
    </div>
  );
};

// Styles (unchanged)
const searchStyle = {
  width: '100%',
  padding: '10px',
  margin: '1rem 0',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
};

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.5rem',
  marginTop: '1rem',
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const cardHoverStyle = {
  transform: 'scale(1.03)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const cardTitle = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.1rem',
  color: '#333',
};

const cardDescription = {
  fontSize: '0.95rem',
  color: '#555',
  lineHeight: '1.5',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0275d8',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default Dashboard;
