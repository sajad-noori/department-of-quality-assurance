import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "../../styles/Analysis.module.css";

// Lightweight analysis dashboard that doesn't add charting dependencies.
// It fetches logs and users and computes a set of statistics and small SVG charts.

const container = {
  padding: "1rem",
  color: "#fff",
  background: "linear-gradient(135deg,#0a0a0a,#121212)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const card = {
  background: "#0f0f0f",
  padding: "1rem",
  borderRadius: 8,
  border: "1px solid #222",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "1rem",
};




// Ensure the provided value is an array. Accepts paginated objects like { data: [...] }
const ensureArray = (v) => {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    // sometimes API returns { rows: [...] }
    if (Array.isArray(v.rows)) return v.rows;
  }
  // Scan object values for the first array we can find
  if (v && typeof v === "object") {
    for (const key of Object.keys(v)) {
      if (Array.isArray(v[key])) return v[key];
    }
  }
  return [];
};

// Color palette for different actions
const actionColors = {
  download: '#4CAF50',  // Green
  system_cleanup: '#FFC107', // Amber
  visit: '#9C27B0',     // Purple
  default: '#00d4ff'    // Default cyan
};

const simpleBarChart = ({
  data = {},
  width = 300,
  height = 200,  // Increased height to accommodate numbers at the top
  showLabels = true,
  color,
}) => {
  const keys = Object.keys(data).sort();
  if (keys.length === 0) {
    return (
      <div style={{ color: "#999", fontSize: 12, height }}>
        هیچ داده‌ای برای نمایش موجود نیست
      </div>
    );
  }
  
  const values = keys.map((k) => data[k]);
  const max = Math.max(...values, 1);
  const barWidth = width / Math.max(keys.length, 1);
  const chartHeight = showLabels ? height - 70 : height - 10;  // Adjust for labels and legend
  const barMaxHeight = chartHeight - 10;
  const getBarColor = (action) => {
    const actionKey = action.toLowerCase();
    // If a static color is provided, prefer it; otherwise map by action name
    return color || actionColors[actionKey] || actionColors.default;
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg 
        width={Math.max(width, keys.length * 60)}  // Ensure minimum width for each bar
        height={height - 30} // Leave space for legend below
        viewBox={`0 0 ${Math.max(width, keys.length * 60)} ${height - 30}`}
        style={{ display: 'block' }}
      >
        {keys.map((k, i) => {
          const h = (values[i] / max) * barMaxHeight;
          const x = i * barWidth + 2;
          const y = chartHeight - h;
          const barColor = getBarColor(k);
          
          return (
            <g key={k}>
              <rect
                x={x}
                y={y}
                width={Math.max(1, barWidth - 4)}
                height={h}
                fill={barColor}
              />
              {/* Accessible tooltip */}
              <title>{`${k}: ${values[i]}`}</title>
              {showLabels && (
                <>
                  <text
                    x={x + (barWidth / 2)}
                    y={Math.max(20, y - 8)}  // Ensure text is never too close to the top
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#fff"
                    style={{ 
                      userSelect: 'none',
                      textShadow: '0 0 4px rgba(0,0,0,0.8)'  // Add shadow for better visibility
                    }}
                  >
                    {values[i]}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginTop: '10px',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        {keys.map((k, i) => (
          <div key={`legend-${k}`} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: getBarColor(k),
              marginLeft: '4px',
              borderRadius: '2px'
            }} />
            <span style={{ color: '#aaa' }}>{k}: </span>
            <span style={{ color: '#fff', marginRight: '8px' }}>{values[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analysis = ({
  logsEndpoint = "/api/logs",
  usersEndpoint = "/api/users",
}) => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('day');
  const [visitorTimeFrame, setVisitorTimeFrame] = useState('week');
  const [downloadsTimeFrame, setDownloadsTimeFrame] = useState('week');
  const [uploadsTimeFrame, setUploadsTimeFrame] = useState('week');
  const [activityHourTimeFrame, setActivityHourTimeFrame] = useState('week');
  const [customDates, setCustomDates] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  // visitsByUser is derived from logs + timeframe; no need to store separately

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use axios and accept multiple possible payload shapes (data.logs, data.users, data)
        const [logsRes, usersRes] = await Promise.all([
          axios.get(logsEndpoint, { withCredentials: true }),
          axios.get(usersEndpoint, { withCredentials: true }),
        ]);
        const logsPayload = logsRes?.data || {};
        const usersPayload = usersRes?.data || {};
        // Common shapes in this project: { data: { logs: [...] , pagination: ... } } or { data: [...] } or { logs: [...] }
        const extractedLogs =
          logsPayload?.data?.logs ||
          logsPayload?.data ||
          logsPayload?.logs ||
          logsPayload;
        const extractedUsers =
          usersPayload?.users ||
          usersPayload?.data ||
          usersPayload?.data?.users ||
          usersPayload;
        if (!mounted) return;
        const normalizedLogs = ensureArray(extractedLogs);
        const normalizedUsers = ensureArray(extractedUsers);
        // debug shapes (remove in production)
        // console.debug('Analysis logs shape', logsPayload, 'extracted ->', normalizedLogs.length);
        // console.debug('Analysis users shape', usersPayload, 'extracted ->', normalizedUsers.length);
        setLogs(normalizedLogs);
        setUsers(normalizedUsers);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetchAll();
    return () => (mounted = false);
  }, [logsEndpoint, usersEndpoint]);

  // Filter logs based on selected time frame
  const filterLogsByTimeFrame = useCallback((logs, frame = 'day', custom = {}) => {
    if (!logs || !logs.length) return [];
    
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of the current day
    
    // Helper function to parse and validate date
    const parseDate = (dateStr) => {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };
    
    // Filter function to check if log is within date range
    const filterByDateRange = (log, start, end) => {
      if (!log || !log.created_at) return false;
      const logDate = parseDate(log.created_at);
      if (!logDate) return false;
      
      if (start && logDate < start) return false;
      if (end && logDate > end) return false;
      return true;
    };
    
    // Apply time frame filter
    if (frame === 'day') {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      return logs.filter(log => filterByDateRange(log, startDate, now));
    } 
    else if (frame === 'week') {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      return logs.filter(log => filterByDateRange(log, startDate, now));
    } 
    else if (frame === 'month') {
      const startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      return logs.filter(log => filterByDateRange(log, startDate, now));
    } 
    else if (frame === 'year') {
      const startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      return logs.filter(log => filterByDateRange(log, startDate, now));
    } 
    else if (frame === 'custom' && custom.start && custom.end) {
      const startDate = parseDate(custom.start);
      const endDate = parseDate(custom.end);
      if (startDate && endDate) {
        endDate.setHours(23, 59, 59, 999); // End of the day
        return logs.filter(log => filterByDateRange(log, startDate, endDate));
      }
    }
    
    // Default: return all logs if no valid frame is provided
    return [...logs];
  }, []); // Using parameters directly, no dependencies needed

  // Filter logs based on current time frame (wire to selector)
  const filteredLogs = useMemo(() => {
    return filterLogsByTimeFrame(logs, timeFrame, customDates);
  }, [filterLogsByTimeFrame, logs, timeFrame, customDates]);

  // Filter downloads based on selected time frame
  const filteredDownloads = useMemo(() => {
    if (!logs || !logs.length) return [];
    
    // First filter by action
    const downloadLogs = logs.filter(l => l && l.action === 'download');
    
    // Then apply time frame filter
    const filtered = filterLogsByTimeFrame(downloadLogs, downloadsTimeFrame, customDates);
    
    return filtered;
  }, [logs, downloadsTimeFrame, customDates, filterLogsByTimeFrame]);

  // Group downloads by file name for the downloads card
  const downloadsByFile = useMemo(() => {
    return filteredDownloads.reduce((acc, dl) => {
      let fileName = dl.details || dl.file_name || 'فایل ناشناس';
      // Clean up the file name
      fileName = fileName
        .replace(/^Downloaded file: /, '')
        .replace(/\s*\([^)]*\)/g, '')
        .trim();
      if (fileName) {
        acc[fileName] = (acc[fileName] || 0) + 1;
      }
      return acc;
    }, {});
  }, [filteredDownloads]);

  // Group visits by user (derived)
  const visitsByUser = useMemo(() => {
    const visitLogs = logs.filter(l => l && l.action === 'visit' && l.user_id);
    const filteredVisitLogs = filterLogsByTimeFrame(visitLogs, visitorTimeFrame, customDates);
    const userMap = {};
    filteredVisitLogs.forEach(log => {
      const userId = log.user_id;
      const user = users.find(u => u && (u.id === userId)) || { id: userId, name: 'کاربر ناشناس' };
      if (!userMap[userId]) {
        userMap[userId] = { ...user, count: 0 };
      }
      userMap[userId].count += 1;
    });
    return userMap;
  }, [logs, users, visitorTimeFrame, customDates, filterLogsByTimeFrame]);

  // Data computations (always operate on arrays)
  const logsList = ensureArray(logs);
  const topVisitor = Object.entries(visitsByUser).sort(
    (a, b) => b[1].count - a[1].count
  )[0] || ["-", { count: 0 }];

  const downloads = filteredDownloads;

  // Filter uploads based on selected time frame
  const filteredUploads = useMemo(() => {
    if (!logs || !logs.length) return [];
    
    // First filter by action
    const uploadLogs = logs.filter(l => l && (l.action === 'upload' || l.action === 'document_upload'));
    
    // Then apply time frame filter
    const filtered = filterLogsByTimeFrame(uploadLogs, uploadsTimeFrame, customDates);
    
    return filtered;
  }, [logs, uploadsTimeFrame, customDates, filterLogsByTimeFrame]);

  const uploads = filteredUploads;
  
  // Calculate action counts
  const actionCounts = useMemo(() => {
    return filteredLogs.reduce((acc, log) => {
      if (log && log.action) {
        acc[log.action] = (acc[log.action] || 0) + 1;
      }
      return acc;
    }, {});
  }, [filteredLogs]);
  
  const topAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0] || ['هیچ', 0];
  const usersList = [...new Set(filteredLogs.map(l => l && l.user_id).filter(Boolean))];
  
  // Extract file/questionnaire names from upload logs
  const uploadsByFile = uploads.reduce((acc, l) => {
    let fileName = "فایل ناشناس";
    
    if (l.details) {
      // Parse details to extract file/questionnaire name
      // Format: "Uploaded questionnaire template: Title (category)" or "Uploaded filled questionnaire: Title (filename)"
      const templateMatch = l.details.match(/Uploaded questionnaire template:\s*([^(]+)/);
      const filledMatch = l.details.match(/Uploaded filled questionnaire:\s*([^(]+)/);
      
      if (templateMatch && templateMatch[1]) {
        fileName = templateMatch[1].trim();
      } else if (filledMatch && filledMatch[1]) {
        fileName = filledMatch[1].trim();
      } else {
        // Fallback: use the whole details if pattern doesn't match
        fileName = l.details;
      }
    } else if (l.file_name) {
      fileName = l.file_name;
    }
    
    acc[fileName] = (acc[fileName] || 0) + 1;
    return acc;
  }, {});
  const topUploadedFile = Object.entries(uploadsByFile).sort(
    (a, b) => b[1] - a[1]
  )[0] || ["-", 0];

  // Build a map of users by id for role lookup
  const usersById = useMemo(() => {
    const map = {};
    ensureArray(users).forEach(u => {
      if (u && (u.id !== undefined && u.id !== null)) map[u.id] = u;
    });
    return map;
  }, [users]);

  const roleCounts = usersList.reduce((acc, userId) => {
    const role = usersById[userId]?.role || "user";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Helper: robustly extract hour (0-23) from various timestamp formats without timezone conversion
  // Supports: "YYYY-MM-DD HH:MM:SS", "YYYY-MM-DDTHH:MM:SSZ", ISO strings, Date objects
  const extractHourFromCreatedAt = (created_at) => {
    if (!created_at) return null;
    try {
      const s = String(created_at);
      // Prefer splitting by 'T' (ISO) otherwise by space
      let timePart = '';
      if (s.includes('T')) {
        timePart = s.split('T')[1] || '';
      } else if (s.includes(' ')) {
        timePart = s.split(' ')[1] || '';
      } else {
        // As a last resort, try to match HH:MM:SS anywhere
        const m = s.match(/(\d{2}):(\d{2}):(\d{2})/);
        timePart = m ? m[0] : '';
      }
      const hh = parseInt(timePart.slice(0, 2), 10);
      if (Number.isNaN(hh)) return null;
      return Math.max(0, Math.min(23, hh));
    } catch {
      return null;
    }
  };

  // Filter logs for activity by hour based on selected time frame and user actions only
  const filteredActivityLogs = useMemo(() => {
    if (!logs || !logs.length) return [];
    const timeFramed = filterLogsByTimeFrame(logs, activityHourTimeFrame, customDates);
    const userActions = new Set([
      'login', 'visit', 'download', 'upload', 'document_upload',
      'comment', 'question', 'logout', 'view'
    ]);
    return timeFramed.filter(l => l && userActions.has(l.action));
  }, [logs, activityHourTimeFrame, customDates, filterLogsByTimeFrame]);

  // Activity by hour analysis (12-hour format, combining AM/PM, properly handling 12 AM/PM)
  const activityByHour = useMemo(() => {
    const hourCounts = {};
    // Initialize all 12-hour slots (1-12)
    for (let i = 1; i <= 12; i++) {
      hourCounts[i] = 0;
    }
    
    filteredActivityLogs.forEach(log => {
      const h = extractHourFromCreatedAt(log?.created_at);
      if (h !== null) {
        // Convert 24h to 12h format (1-12)
        const hour12 = h % 12 || 12; // 0 becomes 12 (midnight), 12 remains 12 (noon)
        hourCounts[hour12] = (hourCounts[hour12] || 0) + 1;
      }
    });
    
    return hourCounts;
  }, [filteredActivityLogs]);

  // Questions and Comments analysis
  const questionsAndComments = useMemo(() => {
    const questions = filteredLogs.filter(l => l && l.action === 'question').length;
    const comments = filteredLogs.filter(l => l && l.action === 'comment').length;
    return { questions, comments, total: questions + comments };
  }, [filteredLogs]);

  // Uploads summary
  const uploadsSummary = {
    totalUploads: uploads.length,
    topUploadedFileCount: topUploadedFile?.[1] || 0,
  };

  if (loading)
    return (
      <div style={container}>
        <h3 style={{ margin: 0 }}>بارگذاری آنالیز...</h3>
      </div>
    );
  if (error)
    return (
      <div style={container}>
        <h3 style={{ margin: 0 }}>خطا: {error}</h3>
      </div>
    );

  return (
    <div style={container}>
      <div style={header}>
        <h2 style={{ margin: 0 }}>آنالیز فعالیت‌ها</h2>

      </div>

      <div style={grid}>

        <div style={card}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              عملیات شایع
            </h4>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <select 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className={styles.select}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '90px',
                  height: '28px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2FhYSIgZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  paddingRight: '28px',
                }}
              >
                <option value="day" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امروز</option>
                <option value="week" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>هفته گذشته</option>
                <option value="month" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>ماه گذشته</option>
                <option value="custom" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>انتخاب تاریخ</option>
              </select>
              
              {timeFrame === 'custom' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="date"
                    value={customDates.start}
                    onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(30, 30, 30, 0.9)',
                      color: '#f0f0f0',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      direction: 'ltr',
                      height: '28px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <span style={{ 
                    color: '#aaa',
                    fontSize: '12px',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    تا
                  </span>
                  <input
                    type="date"
                    value={customDates.end}
                    onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(30, 30, 30, 0.9)',
                      color: '#f0f0f0',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      direction: 'ltr',
                      height: '28px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '12px', height: 'auto' }}>
            {Object.keys(actionCounts).length > 0 ? (
              simpleBarChart({ 
                data: actionCounts, 
                width: 280, 
                height: 200
              })
            ) : (
              <div style={{ 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#888',
                fontSize: '14px'
              }}>
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </div>
        </div>

        <div style={card}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              بازدیدکنندگان برتر
            </h4>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <select
                value={visitorTimeFrame}
                onChange={(e) => setVisitorTimeFrame(e.target.value)}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '90px',
                  height: '28px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2FhYSIgZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  paddingRight: '28px',
                  ':hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(40, 40, 40, 0.9)'
                  },
                  ':focus': {
                    borderColor: 'rgba(65, 153, 255, 0.5)',
                    boxShadow: '0 0 0 2px rgba(65, 153, 255, 0.2)'
                  }
                }}
              >
                <option value="day" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امروز</option>
                <option value="week" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>هفته جاری</option>
                <option value="month" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>ماه جاری</option>
                <option value="year" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امسال</option>
              </select>
              <div style={{
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                color: '#28a745',
                padding: '0 10px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '28px',
                whiteSpace: 'nowrap'
              }}>
                <span>👥</span>
                <span>{Object.keys(visitsByUser).length} کاربر</span>
              </div>
            </div>
          </div>
          
          <div style={{ 
            height: '240px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {Object.keys(visitsByUser).length > 0 ? (
              <div className={styles.scrollArea} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                height: '100%',
                padding: '4px 4px 12px 0',
                overflowY: 'auto',
                scrollbarWidth: 'thin'
              }}>
                {Object.entries(visitsByUser)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 6)
                  .map(([id, user]) => {
                    const maxVisits = Math.max(...Object.values(visitsByUser).map(u => u.count), 1);
                    const barWidth = (visitsByUser[id].count / maxVisits) * 100;
                    // Generate a unique but consistent color for each user
                    const hue = (id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 137.5) % 360; // Golden angle for better distribution
                    const saturation = 75 + Math.sin(id.length * 10) * 10; // Vary saturation between 65-85%
                    const lightness = 45 + Math.cos(id.length * 5) * 5; // Vary lightness between 40-50%
                    
                    return (
                      <div 
                        key={id} 
                        style={{ 
                          position: 'relative',
                          padding: '4px 0'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '6px'
                        }}>
                          <div style={{ 
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, 
                              hsl(${hue}, ${saturation}%, ${lightness}%), 
                              hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 10}%))`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            flexShrink: 0,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                            {((user && user.name) ? user.name : 'کاربر').trim().charAt(0).toUpperCase()}
                          </div>
                          <div style={{ 
                            color: '#f0f0f0',
                            fontWeight: 500,
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '120px'
                          }}>
                            {user.name}
                          </div>
                          <div style={{ 
                            marginRight: 'auto',
                            color: '#aaa',
                            fontSize: '12px',
                            direction: 'ltr',
                            minWidth: '50px',
                            textAlign: 'right',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}>
                            {visitsByUser[id].count.toLocaleString()}
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginLeft: '40px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <div 
                            style={{
                              height: '100%',
                              width: `${barWidth}%`,
                              background: `linear-gradient(90deg, 
                                hsla(${hue}, ${saturation}%, ${lightness}%, 1), 
                                hsla(${(hue + 20) % 360}, ${Math.min(100, saturation + 5)}%, ${Math.min(90, lightness + 10)}%, 1))`,
                              borderRadius: '3px',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              boxShadow: `0 0 12px hsla(${hue}, ${saturation}%, 50%, 0.4)`
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              right: '6px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'white',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              opacity: barWidth > 30 ? 1 : 0,
                              transition: 'opacity 0.2s ease'
                            }}>
                              {visitsByUser[id].count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px',
                gap: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.05)'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  👤
                </div>
                <div>
                  هیچ بازدیدی در این بازه زمانی ثبت نشده است
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#555',
                  marginTop: '4px'
                }}>
                  بازه زمانی را تغییر دهید یا بعداً مراجعه کنید
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={card}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              دانلودها
            </h4>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <select
                value={downloadsTimeFrame}
                onChange={(e) => setDownloadsTimeFrame(e.target.value)}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '90px',
                  height: '28px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2FhYSIgZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  paddingRight: '28px',
                  ':hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(40, 40, 40, 0.9)'
                  },
                  ':focus': {
                    borderColor: 'rgba(65, 153, 255, 0.5)',
                    boxShadow: '0 0 0 2px rgba(65, 153, 255, 0.2)'
                  }
                }}
              >
                <option value="day" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امروز</option>
                <option value="week" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>هفته جاری</option>
                <option value="month" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>ماه جاری</option>
                <option value="year" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امسال</option>
              </select>
            </div>
          </div>
          
          <div style={{ 
            height: '240px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {downloads.length > 0 ? (
              <div className={styles.scrollArea} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                height: '100%',
                padding: '4px 4px 12px 0',
                overflowY: 'auto',
                scrollbarWidth: 'thin'
              }}>
                {Object.entries(downloadsByFile)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([fileName, count], index) => {
                    const maxDownloads = Math.max(
                      ...Object.values(downloadsByFile),
                      1
                    );
                    const barWidth = (count / maxDownloads) * 100;
                    const hue = (index * 60) % 360; // Different color for each file
                    
                    return (
                      <div key={fileName} style={{ position: 'relative' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '4px'
                        }}>
                          <div style={{ 
                            color: '#f0f0f0',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px'
                          }}>
                            {fileName}
                          </div>
                          <div style={{ 
                            marginRight: 'auto',
                            color: '#aaa',
                            fontSize: '12px',
                            direction: 'ltr',
                            minWidth: '30px',
                            textAlign: 'right',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}>
                            {count}
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <div 
                            style={{
                              height: '100%',
                              width: `${barWidth}%`,
                              background: `linear-gradient(90deg, 
                                hsla(${hue}, 80%, 50%, 1), 
                                hsla(${(hue + 20) % 360}, 80%, 60%, 1))`,
                              borderRadius: '3px',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              boxShadow: `0 0 12px hsla(${hue}, 80%, 50%, 0.3)`
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              right: '6px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'white',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              opacity: barWidth > 30 ? 1 : 0,
                              transition: 'opacity 0.2s ease'
                            }}>
                              {count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px',
                gap: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.05)'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  📥
                </div>
                <div>
                  هیچ دانلودی در این بازه زمانی ثبت نشده است
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#555',
                  marginTop: '4px'
                }}>
                  بازه زمانی را تغییر دهید یا بعداً مراجعه کنید
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={card}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              آپلودها
            </h4>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <select
                value={uploadsTimeFrame}
                onChange={(e) => setUploadsTimeFrame(e.target.value)}
                className={styles.select}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '90px',
                  height: '28px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2FhYSIgZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  paddingRight: '28px',
                }}
              >
                <option value="day" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امروز</option>
                <option value="week" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>هفته جاری</option>
                <option value="month" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>ماه جاری</option>
                <option value="year" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امسال</option>
              </select>
             
            </div>
          </div>
          
          <div style={{ 
            height: '240px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {uploads.length > 0 ? (
              <div className={styles.scrollArea} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                height: '100%',
                padding: '4px 4px 12px 0',
                overflowY: 'auto',
                scrollbarWidth: 'thin'
              }}>
                {Object.entries(uploadsByFile)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([fileName, count], index) => {
                    const maxUploads = Math.max(
                      ...Object.values(uploadsByFile),
                      1
                    );
                    const barWidth = (count / maxUploads) * 100;
                    const hue = 330 + (index * 15); // Pink/purple gradient
                    
                    return (
                      <div key={fileName} style={{ position: 'relative' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '4px'
                        }}>
                          <div style={{ 
                            color: '#f0f0f0',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px'
                          }}>
                            {fileName}
                          </div>
                          <div style={{ 
                            marginRight: 'auto',
                            color: '#aaa',
                            fontSize: '12px',
                            direction: 'ltr',
                            minWidth: '30px',
                            textAlign: 'right',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}>
                            {count}
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <div 
                            style={{
                              height: '100%',
                              width: `${barWidth}%`,
                              background: `linear-gradient(90deg, 
                                hsla(${hue}, 75%, 55%, 1), 
                                hsla(${(hue + 20) % 360}, 75%, 65%, 1))`,
                              borderRadius: '3px',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              boxShadow: `0 0 12px hsla(${hue}, 75%, 55%, 0.3)`
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              right: '6px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'white',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              opacity: barWidth > 30 ? 1 : 0,
                              transition: 'opacity 0.2s ease'
                            }}>
                              {count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px',
                gap: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.05)'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  📤
                </div>
                <div>
                  هیچ آپلودی در این بازه زمانی ثبت نشده است
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#555',
                  marginTop: '4px'
                }}>
                  بازه زمانی را تغییر دهید یا بعداً مراجعه کنید
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity by Hour Card - Full Width */}
        <div style={{ ...card, gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              فعالیت بر اساس ساعت
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <select
                value={activityHourTimeFrame}
                onChange={(e) => setActivityHourTimeFrame(e.target.value)}
                className={styles.select}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '90px',
                  height: '28px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2FhYSIgZD0iTTcgMTBsNSA1IDUtNXoiLz48L3N2Zz4=")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  paddingRight: '28px',
                }}
              >
                <option value="day" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امروز</option>
                <option value="week" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>هفته جاری</option>
                <option value="month" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>ماه جاری</option>
                <option value="year" style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0' }}>امسال</option>
              </select>
              <div style={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                padding: '0 10px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '28px',
                whiteSpace: 'nowrap'
              }}>
                <span>🕐</span>
                <span>12 ساعت</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '12px', height: 'auto' }}>
            {Object.keys(activityByHour).length > 0 ? (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg 
                  width="100%"
                  height="200"
                  viewBox="0 0 900 200"
                  style={{ display: 'block' }}
                >
                  {Object.entries(activityByHour).map(([hour, count], i) => {
                    const maxCount = Math.max(...Object.values(activityByHour), 1);
                    const barHeight = (count / maxCount) * 140;
                    const barWidth = 65;
                    const spacing = 75;
                    const x = i * spacing + 20;
                    const y = 160 - barHeight;
                    
                    // Format hour for display (12 AM, 1, 2, ... 11)
                    const hourLabel = hour === '0' ? '12 AM' : `${hour}`;
                    
                    return (
                      <g key={hour}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={`hsl(${120 + (i * 10)}, 70%, 50%)`}
                          rx="4"
                        />
                        <title>{`ساعت ${hourLabel}: ${count} فعالیت`}</title>
                        {count > 0 && barHeight > 20 && (
                          <text
                            x={x + barWidth / 2}
                            y={y + 18}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="bold"
                            fill="#fff"
                            style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                          >
                            {count}
                          </text>
                        )}
                        <text
                          x={x + barWidth / 2}
                          y="180"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#aaa"
                          fontWeight="500"
                        >
                          {hourLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div style={{ 
                  textAlign: 'center', 
                  color: '#888', 
                  fontSize: '12px',
                  marginTop: '8px'
                }}>
                  ساعت (12 AM - 11 PM)
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#888',
                fontSize: '14px'
              }}>
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </div>
        </div>

        {/* Questions & Comments Activity Card */}
        <div style={card}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '15px',
              fontWeight: 600,
              color: '#f0f0f0'
            }}>
              سوالات و نظرات
            </h4>
            <div style={{
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              color: '#9C27B0',
              padding: '0 10px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '28px',
              whiteSpace: 'nowrap'
            }}>
              <span>💬</span>
              <span>{questionsAndComments.total} تعامل</span>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            marginTop: '20px' 
          }}>
            {/* Questions */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '24px' }}>❓</span>
                  <span style={{ 
                    color: '#f0f0f0', 
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    سوالات
                  </span>
                </div>
                <span style={{ 
                  color: '#FFC107', 
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}>
                  {questionsAndComments.questions}
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: questionsAndComments.total > 0 
                    ? `${(questionsAndComments.questions / questionsAndComments.total) * 100}%` 
                    : '0%',
                  background: 'linear-gradient(90deg, #FFC107, #FFD54F)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 12px rgba(255, 193, 7, 0.3)'
                }} />
              </div>
            </div>

            {/* Comments */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '24px' }}>💭</span>
                  <span style={{ 
                    color: '#f0f0f0', 
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    نظرات
                  </span>
                </div>
                <span style={{ 
                  color: '#9C27B0', 
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}>
                  {questionsAndComments.comments}
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: questionsAndComments.total > 0 
                    ? `${(questionsAndComments.comments / questionsAndComments.total) * 100}%` 
                    : '0%',
                  background: 'linear-gradient(90deg, #9C27B0, #BA68C8)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 12px rgba(156, 39, 176, 0.3)'
                }} />
              </div>
            </div>

            {/* Engagement Summary */}
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: 'rgba(156, 39, 176, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  color: '#aaa', 
                  fontSize: '13px'
                }}>
                  میزان تعامل کاربران
                </span>
                <span style={{ 
                  color: '#9C27B0', 
                  fontSize: '16px',
                  fontWeight: 700
                }}>
                  {questionsAndComments.total > 0 
                    ? `${((questionsAndComments.total / filteredLogs.length) * 100).toFixed(1)}%` 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>نوع کاربران</h4>
            <div style={{
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              color: '#00d4ff',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>👥</span>
              <span>{Object.values(roleCounts).reduce((a, b) => a + b, 0)} کاربر</span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(roleCounts).map(([role, count]) => {
              // Map roles to icons and colors
              const roleConfig = {
                admin: { icon: '👑', color: '#ff6b6b' },
                user: { icon: '👤', color: '#4dabf7' },
                editor: { icon: '✏️', color: '#69db7c' },
                guest: { icon: '👋', color: '#ffd43b' },
                default: { icon: '👥', color: '#adb5bd' }
              };
              
              const config = roleConfig[role.toLowerCase()] || roleConfig.default;
              const percentage = Math.round((count / Object.values(roleCounts).reduce((a, b) => a + b, 0)) * 100);
              
              return (
                <div 
                  key={role}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{config.icon}</span>
                      <span style={{ 
                        color: '#fff', 
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {role}
                      </span>
                    </div>
                    <span style={{ 
                      color: config.color,
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {count}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: config.color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '4px',
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {percentage}% از کل کاربران
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

Analysis.propTypes = {
  logsEndpoint: PropTypes.string,
  usersEndpoint: PropTypes.string,
};

export default Analysis;
