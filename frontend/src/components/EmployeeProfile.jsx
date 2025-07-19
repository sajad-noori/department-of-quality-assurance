import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash/debounce";
import { useTheme } from "../contexts/ThemeContext";
import { questionnairesAPI } from "../api/questionnaires";
import { countUnansweredComments } from "../pages/NewsCommentsPage";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educationalCenters, setEducationalCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(false);
  const [centersError, setCentersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCenters, setTotalCenters] = useState(0);
  const [stageCounts, setStageCounts] = useState({
    stage1: 0,
    stage2: 0,
    stage3: 0,
    total: 0,
  });
  const [unansweredQuestionsCount, setUnansweredQuestionsCount] = useState(0);
  const [totalUncheckedFilledCount, setTotalUncheckedFilledCount] = useState(0);
  const [updatingStage, setUpdatingStage] = useState(null);
  const usersPerPage = 15;
  const [unansweredNewsComments, setUnansweredNewsComments] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileSectionRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data.user);
        if (response.data.user.profileImage) {
          setProfileImage(response.data.user.profileImage);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("خطا در دریافت اطلاعات کاربر");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) setEditName(user.name);
  }, [user]);

  const fetchEducationalCenters = async (retryCount = 0) => {
    try {
      setIsSearching(true);
      const response = await axios.get(
        `http://localhost:5000/api/educational-centers?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`,
        {
          withCredentials: true,
        }
      );

      setEducationalCenters(response.data.centers);
      setTotalPages(response.data.totalPages);
      setTotalCenters(response.data.total);
      setCentersError(null);
    } catch (err) {
      console.error("Error fetching educational centers:", err);
      if (retryCount < 3) {
        setTimeout(() => {
          fetchEducationalCenters(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setCentersError(
          "خطا در دریافت اطلاعات مراکز آموزشی. لطفا دوباره تلاش کنید."
        );
      }
    } finally {
      setCentersLoading(false);
      setIsSearching(false);
    }
  };

  const fetchStageCounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/educational-centers/stats/stages",
        {
          withCredentials: true,
        }
      );
      setStageCounts(response.data);
    } catch (err) {
      console.error("Error fetching stage counts:", err);
    }
  };

  const fetchUnansweredQuestionsCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/questions/admin/unanswered-count",
        {
          withCredentials: true,
        }
      );
      setUnansweredQuestionsCount(response.data.count || 0);
    } catch (err) {
      console.error("Error fetching unanswered questions count:", err);
      setUnansweredQuestionsCount(0);
    }
  };

  const fetchTotalUncheckedFilledCount = async () => {
    try {
      const response = await questionnairesAPI.getTotalUncheckedFilledCount();
      if (response.success) {
        setTotalUncheckedFilledCount(response.data.count || 0);
      } else {
        setTotalUncheckedFilledCount(0);
      }
    } catch (err) {
      console.error("Error fetching total unchecked filled count:", err);
      setTotalUncheckedFilledCount(0);
    }
  };

  // Debounced search function
  const debouncedFetchEducationalCenters = useCallback(
    debounce(() => {
      fetchEducationalCenters();
    }, 500),
    [currentPage, searchQuery]
  );

  useEffect(() => {
    debouncedFetchEducationalCenters();
    fetchStageCounts();
    fetchUnansweredQuestionsCount();
    fetchTotalUncheckedFilledCount();
    // Fetch unanswered news comments count
    axios
      .get("/api/comments/all-news-comments", { withCredentials: true })
      .then((res) => {
        setUnansweredNewsComments(countUnansweredComments(res.data));
      })
      .catch(() => setUnansweredNewsComments(0));
    return () => {
      debouncedFetchEducationalCenters.cancel();
    };
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStageChange = async (centerId, stage, checked) => {
    try {
      setUpdatingStage(centerId);

      // Find the current center data
      const center = educationalCenters.find((c) => c.id === centerId);
      if (!center) return;

      // Prepare stage data
      const stageData = {
        stage1: center.stage1 === 1,
        stage2: center.stage2 === 1,
        stage3: center.stage3 === 1,
      };

      // Update the specific stage
      stageData[stage] = checked;

      await axios.put(
        `http://localhost:5000/api/educational-centers/${centerId}/stage`,
        stageData,
        {
          withCredentials: true,
        }
      );

      // Update local state
      setEducationalCenters((prev) =>
        prev.map((c) =>
          c.id === centerId ? { ...c, [stage]: checked ? 1 : 0 } : c
        )
      );

      // Refresh stage counts
      fetchStageCounts();
    } catch (err) {
      console.error("Error updating stage:", err);
      alert("خطا در بروزرسانی مرحله");
    } finally {
      setUpdatingStage(null);
    }
  };

  const handleViewCenter = (userId) => {
    navigate(`/institute/${userId}`);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    setEditError("");
    setEditSuccess("");
    setEditName(user.name);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditError("");
    setEditSuccess("");
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    if (newPassword && newPassword !== confirmPassword) {
      setEditError("رمزهای عبور مطابقت ندارند.");
      setEditLoading(false);
      return;
    }
    try {
      // Update name
      if (editName !== user.name) {
        await axios.put(
          "http://localhost:5000/api/users/me",
          { name: editName },
          { withCredentials: true }
        );
      }
      // Update password
      if (currentPassword && newPassword) {
        await axios.put(
          "http://localhost:5000/api/users/me/password",
          {
            currentPassword,
            newPassword,
          },
          { withCredentials: true }
        );
      }
      setEditSuccess("پروفایل با موفقیت به‌روزرسانی شد.");
      setUser((prev) => ({ ...prev, name: editName }));
      setTimeout(() => setEditOpen(false), 1200);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "خطا در به‌روزرسانی پروفایل."
      );
    } finally {
      setEditLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      window.location.href = "/login";
    } catch (error) {
      setLoggingOut(false);
      alert("Error logging out. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/upload-profile-image",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfileImage(response.data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleProfileToggle = () => {
    if (!showProfile && profileSectionRef.current) {
      const top =
        profileSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        32;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => setShowProfile(true), 350);
    } else {
      setShowProfile((prev) => !prev);
    }
  };

  if (loading) {
    return (
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="alert alert-danger m-4" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="alert alert-warning m-4" role="alert">
          کاربر یافت نشد
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "light" ? "light-container" : "dark-container"
      } px-4 py-8`}
      style={{ width: "100%", maxWidth: "100%", minHeight: "100vh" }}
    >
      {/* Profile ribbon toggle (floating) */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 2000,
          boxShadow: "0 4px 16px rgba(13,202,240,0.10)",
          borderRadius: "32px 0 0 32px",
          background: "transparent",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleProfileToggle}
          sx={{
            borderRadius: "32px 0 0 32px",
            px: 3,
            py: 1,
            fontWeight: 700,
            color: "#030305",
            background: "#0dcaf0",
            borderColor: "#0dcaf0",
            boxShadow: "0 4px 15px rgba(13,202,240,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "background 0.2s, color 0.2s",
            "&:hover": {
              background: "#00b5d7",
              borderColor: "#00b5d7",
              color: "#030305",
            },
          }}
        >
          {showProfile ? "مخفی کردن پروفایل" : "نمایش پروفایل"}
          {showProfile ? (
            <ExpandLessIcon sx={{ ml: 1 }} />
          ) : (
            <ExpandMoreIcon sx={{ ml: 1 }} />
          )}
        </Button>
      </div>
      {/* Collapsible profile section */}
      <div
        ref={profileSectionRef}
        style={{
          maxHeight: showProfile ? 500 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
          opacity: showProfile ? 1 : 0,
          pointerEvents: showProfile ? "auto" : "none",
          marginBottom: showProfile ? 24 : 0,
        }}
      >
        {/* Profile image and upload */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              marginBottom: 16,
              background: "linear-gradient(145deg, #0dcaf0, #00b5d7)",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(13, 202, 240, 0.3)",
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    theme === "light" ? "3px solid #fff" : "3px solid #1a1a1a",
                  background: theme === "light" ? "#fff" : "#1a1a1a",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #0dcaf0, #00b5d7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 40,
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  border:
                    theme === "light" ? "3px solid #fff" : "3px solid #1a1a1a",
                  boxShadow: "0 4px 12px rgba(13, 202, 240, 0.3)",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            {uploading ? (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "rgba(13,202,240,0.9)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    theme === "light" ? "2px solid #fff" : "2px solid #1a1a1a",
                }}
              >
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              </div>
            ) : (
              <label
                htmlFor="profile-image-upload"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "#0dcaf0",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  border:
                    theme === "light" ? "2px solid #fff" : "2px solid #1a1a1a",
                  opacity: 1,
                  transform: "scale(1)",
                  transition: "all 0.3s",
                }}
              >
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <i
                  className="fas fa-camera"
                  style={{ color: "#fff", fontSize: 18 }}
                ></i>
              </label>
            )}
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: theme === "light" ? "#0dcaf0" : "#a9e5ff",
              marginBottom: 4,
            }}
          >
            {user?.name}
          </div>
          <div
            style={{
              color: theme === "light" ? "#00b5d7" : "#7b8bbf",
              fontSize: 14,
            }}
          >
            {user?.email}
          </div>
        </div>
        {/* Profile actions */}
        <div
          className="d-flex align-items-center mb-4"
          style={{ gap: 8, justifyContent: "center", display: "flex" }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: theme === "light" ? "#0dcaf0" : "#90caf9",
              borderColor: theme === "light" ? "#0dcaf0" : "#90caf9",
              fontWeight: 600,
            }}
            onClick={handleEditOpen}
          >
            ویرایش پروفایل
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: theme === "light" ? "#ef4444" : "#b71c1c",
              color: "#fff",
              fontWeight: 600,
            }}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : (
              "خروج"
            )}
          </Button>
        </div>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle sx={{ textAlign: "right", fontWeight: 700 }}>
            ویرایش پروفایل
          </DialogTitle>
          <DialogContent>
            {editError && (
              <Alert
                severity="error"
                sx={{ mb: 2, direction: "rtl", textAlign: "right" }}
              >
                {editError}
              </Alert>
            )}
            {editSuccess && (
              <Alert
                severity="success"
                sx={{ mb: 2, direction: "rtl", textAlign: "right" }}
              >
                {editSuccess}
              </Alert>
            )}
            <form
              onSubmit={handleEditSubmit}
              id="edit-profile-form"
              style={{ direction: "rtl", textAlign: "right" }}
              dir="rtl"
            >
              <TextField
                label="نام"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
                margin="normal"
                required
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
              />
              <TextField
                label="رمز عبور فعلی"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="current-password"
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowCurrentPassword((show) => !show)}
                        edge="start"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="رمز عبور جدید"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="new-password"
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword((show) => !show)}
                        edge="start"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="تأیید رمز عبور جدید"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="new-password"
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="start"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "flex-start",
              flexDirection: "row-reverse",
              px: 3,
            }}
          >
            <Button onClick={handleEditClose} disabled={editLoading}>
              انصراف
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
              variant="contained"
              sx={{ background: "#0dcaf0" }}
              disabled={editLoading}
            >
              {editLoading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "ذخیره"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Success/Error Alert styles for modal */}
      <style>{`
        .dark-container {
          background: #121212;
          color: #ffffff;
        }
        .light-container {
          background: #fff;
          color: #23283a;
        }
        .light-container .card {
          background: #f8fafd !important;
          border: 1px solid #b6eaff !important;
          color: #23283a !important;
        }
        .dark-container .card {
          background: #1e1e1e !important;
          border: 1px solid #333 !important;
          color: #ffffff !important;
        }
        .light-container .card-title {
          color: #0dcaf0 !important;
        }
        .dark-container .card-title {
          color: #007bff !important;
        }
        .light-container .card-text {
          color: #20c997 !important;
        }
        .dark-container .card-text {
          color: #cccccc !important;
        }
        .light-container .alert-danger {
          background: #fff0f0 !important;
          border: 1px solid #ff6b6b !important;
          color: #ff6b6b !important;
        }
        .dark-container .alert-danger {
          background: #1e1e1e !important;
          border: 1px solid #dc3545 !important;
          color: #ff6b6b !important;
        }
        .light-container .alert-warning {
          background: #fffbe6 !important;
          border: 1px solid #ffd54f !important;
          color: #ffc107 !important;
        }
        .dark-container .alert-warning {
          background: #1e1e1e !important;
          border: 1px solid #ffc107 !important;
          color: #ffd54f !important;
        }
        /* --- TABLE LIGHT MODE --- */
        .light-container .table {
          background: #fff !important;
          color: #23283a !important;
        }
        .light-container thead {
          background: #e0f7fa !important;
        }
        .light-container th, .light-container td {
          background: #fff !important;
          color: #23283a !important;
          border-color: #b6eaff !important;
        }
        .light-container tr {
          background: #fff !important;
        }
        .light-container tr:nth-child(even) {
          background: #f8fafd !important;
        }
        /* --- END TABLE LIGHT MODE --- */
        .dark-container .table {
          background: #121212 !important;
          color: #ffffff !important;
        }
        .dark-container thead {
          background: #1e1e1e !important;
        }
        .dark-container th, .dark-container td {
          border-color: #333 !important;
        }
        .dark-container tr {
          background: #121212 !important;
        }
        .dark-container tr:nth-child(even) {
          background: #1a1a1a !important;
        }
        .light-container .form-check-label {
          color: #20c997 !important;
        }
        .dark-container .form-check-label {
          color: #ffffff !important;
        }
        .light-container .form-check-input:checked {
          background-color: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
        }
        .dark-container .form-check-input:checked {
          background-color: #007bff !important;
          border-color: #007bff !important;
        }
        .light-container .form-check-input {
          background-color: #fff !important;
          border-color: #b6eaff !important;
        }
        .dark-container .form-check-input {
          background-color: #1e1e1e !important;
          border-color: #333 !important;
        }
        .light-container .page-link {
          background: #fff !important;
          border-color: #0dcaf0 !important;
          color: #0dcaf0 !important;
        }
        .dark-container .page-link {
          background: #1e1e1e !important;
          border-color: #333 !important;
          color: #ffffff !important;
        }
        .light-container .page-item.active .page-link {
          background: #0dcaf0 !important;
          color: #fff !important;
          border-color: #20c997 !important;
        }
        .dark-container .page-item.active .page-link {
          background: #007bff !important;
          color: #fff !important;
          border-color: #007bff !important;
        }
        .light-container .rounded-lg {
          background: #fff !important;
          color: #23283a !important;
          border: 1px solid #b6eaff !important;
        }
        .dark-container .rounded-lg {
          background: #1e1e1e !important;
          color: #ffffff !important;
          border: 1px solid #333 !important;
        }
        .light-container .fw-bold {
          color: #23283a !important;
        }
        .dark-container .fw-bold {
          color: #ffffff !important;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }
        .MuiDialog-root .MuiAlert-root.MuiAlert-standardSuccess {
          background-color: #204d2a !important;
          color: #d1ffd6 !important;
        }
        .MuiDialog-root .MuiAlert-root.MuiAlert-standardError {
          background-color: #4d2020 !important;
          color: #ffd1d1 !important;
        }
        .MuiDialog-root .MuiAlert-message {
          color: inherit !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-root.MuiAlert-standardSuccess {
          background-color: #e6f4ea !important;
          color: #1a3d1a !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-root.MuiAlert-standardError {
          background-color: #fbeaea !important;
          color: #3d1a1a !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-message {
          color: inherit !important;
        }
        /* Dark mode input fields */
        .MuiDialog-root .MuiOutlinedInput-root {
          background: #232837 !important;
        }
        .MuiDialog-root .MuiOutlinedInput-input {
          color: #e0e6f0 !important;
        }
        .MuiDialog-root .MuiInputLabel-root {
          color: #bfc8e6 !important;
        }
        .MuiDialog-root .MuiOutlinedInput-notchedOutline {
          border-color: #3b82f6 !important;
        }
        /* Light mode input fields */
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-root {
          background: #fff !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-input {
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiInputLabel-root {
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-notchedOutline {
          border-color: #0dcaf0 !important;
        }
      `}</style>
      {/* Modal theme styles for dark/light mode and input/alert */}
      <style>{`
        /* Modal dark mode */
        .MuiDialog-paper {
          background: #181c24 !important;
          color: #e0e6f0 !important;
        }
        .MuiDialogContent-root {
          background: #181c24 !important;
          color: #e0e6f0 !important;
        }
        .MuiDialogTitle-root, .MuiDialogActions-root, .MuiAlert-message {
          color: #e0e6f0 !important;
        }
        /* Modal light mode */
        [data-theme="light"] .MuiDialog-paper {
          background: #fff !important;
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialogContent-root {
          background: #fff !important;
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialogTitle-root, [data-theme="light"] .MuiDialogActions-root, [data-theme="light"] .MuiAlert-message {
          color: #222 !important;
        }
        /* Success/Error Alert styles for modal */
        .MuiDialog-root .MuiAlert-root.MuiAlert-standardSuccess {
          background-color: #204d2a !important;
          color: #d1ffd6 !important;
        }
        .MuiDialog-root .MuiAlert-root.MuiAlert-standardError {
          background-color: #4d2020 !important;
          color: #ffd1d1 !important;
        }
        .MuiDialog-root .MuiAlert-message {
          color: inherit !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-root.MuiAlert-standardSuccess {
          background-color: #e6f4ea !important;
          color: #1a3d1a !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-root.MuiAlert-standardError {
          background-color: #fbeaea !important;
          color: #3d1a1a !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiAlert-message {
          color: inherit !important;
        }
        /* Dark mode input fields */
        .MuiDialog-root .MuiOutlinedInput-root {
          background: #232837 !important;
        }
        .MuiDialog-root .MuiOutlinedInput-input {
          color: #e0e6f0 !important;
        }
        .MuiDialog-root .MuiInputLabel-root {
          color: #bfc8e6 !important;
        }
        .MuiDialog-root .MuiOutlinedInput-notchedOutline {
          border-color: #3b82f6 !important;
        }
        /* Light mode input fields */
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-root {
          background: #fff !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-input {
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiInputLabel-root {
          color: #222 !important;
        }
        [data-theme="light"] .MuiDialog-root .MuiOutlinedInput-notchedOutline {
          border-color: #0dcaf0 !important;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-6 text-center">
        مدیریت مراکز آموزشی
      </h1>
      <br />
      {/* Statistics Cards */}
      <div className="row mb-6 d-flex justify-content-center">
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.total}</h5>
              <p className="card-text">کل مراکز</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.stage3}</h5>
              <p className="card-text">تایید شده</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.stage2}</h5>
              <p className="card-text">در حال بررسی</p>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-2">
          <div
            className="card text-center position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/checking-questionnaires")}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <div className="card-body">
              <h5 className="card-title">پرسش نامه </h5>
              <p className="card-text">تحلیل پرسش نامه ها!</p>
            </div>
            {totalUncheckedFilledCount > 0 && (
              <div
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  animation: "pulse 2s infinite",
                }}
              >
                {totalUncheckedFilledCount}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-2 mb-2">
          <div
            className="card text-center position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/news-comments")}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <div className="card-body">
              <h5 className="card-title">اخبار </h5>
              <p className="card-text">به کمنت ها جواب دهید!</p>
            </div>
            {unansweredNewsComments > 0 && (
              <div
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  animation: "pulse 2s infinite",
                }}
              >
                {unansweredNewsComments}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div
            className="card text-center position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/answer-to-questions")}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <div className="card-body">
              <h5 className="card-title">سوالات </h5>
              <p className="card-text">به سوالات پاسخ دهید!</p>
            </div>
            {unansweredQuestionsCount > 0 && (
              <div
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  animation: "pulse 2s infinite",
                }}
              >
                {unansweredQuestionsCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ width: "100%", maxWidth: "100%" }} className="mb-6">
        <div className="position-relative">
          <input
            type="text"
            placeholder="جستجو در مراکز آموزشی..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: "100%",
              background: "#1e1e1e",
              border: "1px solid #333",
              color: "#ffffff",
              padding: "8px 12px",
            }}
            className="rounded-lg text-right"
          />
          {isSearching && (
            <div
              className="position-absolute"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">در حال جستجو...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {centersError && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {centersError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setCentersError(null)}
            style={{ filter: "invert(1)" }}
          ></button>
        </div>
      )}

      {/* Educational Centers Table */}
      <div
        style={{ width: "100%", maxWidth: "100%" }}
        className="overflow-x-auto"
      >
        <table
          style={{ width: "100%", background: "#121212" }}
          className="table"
        >
          <thead style={{ background: "#1e1e1e" }}>
            <tr>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                نام مرکز
              </th>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                نام شخص رابط
              </th>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                شماره تماس
              </th>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                ایمیل
              </th>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                مرحله
              </th>
              <th
                style={{
                  color: "#ffffff",
                  borderColor: "#333",
                  background: "#1e1e1e",
                }}
              >
                مشاهده
              </th>
            </tr>
          </thead>
          <tbody style={{ background: "#121212" }}>
            {educationalCenters.map((center, index) => (
              <tr
                key={center.id}
                style={{
                  borderColor: "#333",
                  background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                }}
              >
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: "#ffffff" }}>
                        {center.centerName || "نامشخص"}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  {center.contactName || "نامشخص"}
                </td>
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  {center.phoneNumber || "نامشخص"}
                </td>
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  {center.email}
                </td>
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  <div className="d-flex flex-column gap-1">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage1 === 1}
                        onChange={(e) =>
                          handleStageChange(
                            center.id,
                            "stage1",
                            e.target.checked
                          )
                        }
                        disabled={updatingStage === center.id}
                        style={{
                          backgroundColor:
                            center.stage1 === 1 ? "#007bff" : "#1e1e1e",
                          borderColor: "#333",
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{ color: "#ffffff", fontSize: "12px" }}
                      >
                        مرحله اول
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage2 === 1}
                        onChange={(e) =>
                          handleStageChange(
                            center.id,
                            "stage2",
                            e.target.checked
                          )
                        }
                        disabled={updatingStage === center.id}
                        style={{
                          backgroundColor:
                            center.stage2 === 1 ? "#007bff" : "#1e1e1e",
                          borderColor: "#333",
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{ color: "#ffffff", fontSize: "12px" }}
                      >
                        مرحله دوم
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage3 === 1}
                        onChange={(e) =>
                          handleStageChange(
                            center.id,
                            "stage3",
                            e.target.checked
                          )
                        }
                        disabled={updatingStage === center.id}
                        style={{
                          backgroundColor:
                            center.stage3 === 1 ? "#007bff" : "#1e1e1e",
                          borderColor: "#333",
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{ color: "#ffffff", fontSize: "12px" }}
                      >
                        مرحله سوم
                      </label>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    color: "#ffffff",
                    borderColor: "#333",
                    background: index % 2 === 0 ? "#121212" : "#1a1a1a",
                  }}
                >
                  <button
                    className="btn btn-outline-primary btn-sm"
                    style={{ borderColor: "#007bff" }}
                    onClick={() => handleViewCenter(center.user_id)}
                  >
                    بررسی
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {educationalCenters.length === 0 && !centersLoading && !centersError && (
        <div className="text-center py-5">
          <div style={{ color: "#888888" }}>
            {searchQuery
              ? "هیچ مرکز آموزشی با این جستجو یافت نشد"
              : "هیچ مرکز آموزشی ثبت نشده است"}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  background: "#1e1e1e",
                  borderColor: "#333",
                  color: "#ffffff",
                }}
              >
                قبلی
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    background:
                      currentPage === index + 1 ? "#007bff" : "#1e1e1e",
                    borderColor: "#333",
                    color: currentPage === index + 1 ? "#ffffff" : "#ffffff",
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  background: "#1e1e1e",
                  borderColor: "#333",
                  color: "#ffffff",
                }}
              >
                بعدی
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default EmployeeProfile;
