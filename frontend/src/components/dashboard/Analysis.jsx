import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

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
    return actionColors[actionKey] || actionColors.default;
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
  const [customDates, setCustomDates] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [visitsByUser, setVisitsByUser] = useState({});

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

  // Filter logs based on current time frame
  const filteredLogs = useMemo(() => {
    return filterLogsByTimeFrame(logs);
  }, [filterLogsByTimeFrame, logs]);

  // Filter downloads based on selected time frame
  const filteredDownloads = useMemo(() => {
    if (!logs || !logs.length) return [];
    
    // First filter by action
    const downloadLogs = logs.filter(l => l && l.action === 'download');
    
    // Then apply time frame filter
    const filtered = filterLogsByTimeFrame(downloadLogs, downloadsTimeFrame, customDates);
    
    // Debug logs (can be removed in production)
    console.log(`Filtered ${filtered.length} downloads out of ${downloadLogs.length} total downloads`);
    console.log('Time frame:', downloadsTimeFrame, 'Custom dates:', customDates);
    
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

  // Group visits by user
  useEffect(() => {
    const visitLogs = logs.filter(l => l.action === 'visit' && l.user_id);
    const filteredVisitLogs = filterLogsByTimeFrame(visitLogs, visitorTimeFrame, customDates);
    
    const userMap = {};
    filteredVisitLogs.forEach(log => {
      const userId = log.user_id;
      if (!userMap[userId]) {
        const user = users.find(u => u.id === userId) || { id: userId, name: 'کاربر ناشناس' };
        userMap[userId] = { ...user, count: 0 };
      }
      userMap[userId].count += 1;
    });
    
    setVisitsByUser(userMap);
  }, [logs, users, visitorTimeFrame, customDates, filterLogsByTimeFrame]);

  // Data computations (always operate on arrays)
  const logsList = ensureArray(logs);
  const topVisitor = Object.entries(visitsByUser).sort(
    (a, b) => b[1].count - a[1].count
  )[0] || ["-", { count: 0 }];

  const downloads = filteredDownloads;

  const uploads = filteredLogs.filter(
    (l) => l && (l.action === "upload" || l.action === "document_upload")
  );
  
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
  const usersList = [...new Set(filteredLogs.map(l => l.user_id).filter(Boolean))];
  const uploadsByFile = uploads.reduce((acc, l) => {
    const file = l.details || l.file_name || "unknown-file";
    acc[file] = (acc[file] || 0) + 1;
    return acc;
  }, {});
  const topUploadedFile = Object.entries(uploadsByFile).sort(
    (a, b) => b[1] - a[1]
  )[0] || ["-", 0];

  const roleCounts = usersList.reduce((acc, u) => {
    const r = (u && u.role) || "user";
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  // Summary numbers
  const summary = {
    totalLogs: logsList.length,
    totalUsers: usersList.length,
    totalDownloads: downloads.length,
    totalUploads: uploads.length,
    mostCommonAction: topAction[0],
    mostCommonActionCount: topAction[1],
    topVisitorName: topVisitor[1].name || "-",
    topVisitorCount: topVisitor[1].count || 0,
    topUploadedFile: topUploadedFile[0],
    topUploadedFileCount: topUploadedFile[1],
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
                      ':hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(40, 40, 40, 0.9)'
                      },
                      ':focus': {
                        borderColor: 'rgba(65, 153, 255, 0.5)',
                        boxShadow: '0 0 0 2px rgba(65, 153, 255, 0.2)'
                      }
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
                      ':hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(40, 40, 40, 0.9)'
                      },
                      ':focus': {
                        borderColor: 'rgba(65, 153, 255, 0.5)',
                        boxShadow: '0 0 0 2px rgba(65, 153, 255, 0.2)'
                      }
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
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                height: '100%',
                padding: '4px 4px 12px 0',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                '::-webkit-scrollbar': {
                  width: '4px'
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }
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
                            {user.name.charAt(0).toUpperCase()}
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
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                height: '100%',
                padding: '4px 4px 12px 0',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                '::-webkit-scrollbar': {
                  width: '4px'
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }
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
          <h4>آپلودها</h4>
          <div style={{ marginTop: 8 }}>کل آپلودها: {summary.totalUploads}</div>
          <div style={{ marginTop: 8 }}>
            پر آپلودترین فایل: {summary.topUploadedFile} (
            {summary.topUploadedFileCount})
          </div>
          <div style={{ marginTop: 12 }}>
            {simpleBarChart({
              data: uploadsByFile,
              width: 320,
              height: 80,
              color: "#d63384",
            })}
          </div>
        </div>

        <div style={card}>
          <h4>نوع کاربران</h4>
          <div style={{ marginTop: 8 }}>
            {Object.entries(roleCounts).map(([r, c]) => (
              <div
                key={r}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ color: "#ccc" }}>{r}</div>
                <div style={{ color: "#00d4ff" }}>{c}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h4>جدول نمونه: فعالیت‌های اخیر</h4>
          <div style={{ marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#aaa" }}>
                  <th>تاریخ</th>
                  <th>کاربر</th>
                  <th>عملیات</th>
                  <th>جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 8).map((l) => (
                  <tr key={l.id} style={{ borderTop: "1px solid #222" }}>
                    <td style={{ padding: "6px 4px", color: "#bbb" }}>
                      {new Date(l.created_at).toLocaleString("fa-IR")}
                    </td>
                    <td style={{ padding: "6px 4px", color: "#fff" }}>
                      {l.user_name || l.user_email || "ناشناس"}
                    </td>
                    <td style={{ padding: "6px 4px", color: "#fff" }}>
                      {l.action}
                    </td>
                    <td style={{ padding: "6px 4px", color: "#ccc" }}>
                      {l.details || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
