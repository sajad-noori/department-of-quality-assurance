import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  LinearProgress,
  Button,
  Stack,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PropTypes from 'prop-types';

const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    primary: {
      main: "#0dcaf0",
    },
    secondary: {
      main: "#a9e5ff",
    },
    info: {
      main: "#a9e5ff",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    }
  },
  typography: {
    fontFamily: "sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#030305',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#00b5d7',
          },
        },
      },
    },
  }
});

const uploadLabels = [
  "doc1_path",
  "doc2_path",
  "doc3_path",
  "doc4_path",
  "doc5_path",
  "doc6_path",
  "doc7_path",
  "doc8_path",
  "doc9_path",
  "doc10_path",
  "doc11_path",
  "doc12_path",
  "doc13_path",
  "doc14_path",
  "doc15_path"
];

const documentLabels = [
  "مکتوب منظوری دیدگاه، ماموریت و اهداف مرکز آموزشی",
  "مکتوب تائید پلان استراتیژیک",
  "پلان استراتیژیک مرکز آموزشی",
  "چارت تشکیلاتی و شهرت پرسونل مرکز آموزشی",
  "مکاتیب و اسناد (تفاهمنامه ها) ارتباط با ذینفعان رشته های موجود",
  "مکاتیب منظوری ایجاد رشته ها در مرکز",
  "اسناد و مدارک به روز رسانی نصاب تعلیمی",
  "اسناد و مدارک تطبیق استندرد ها و معیارات",
  "اسناد و مدارک (تصاویر) ساختار های موجود (کتابخانه، ورکشاپ، فارم تحقیقاتی و لابراتوار)",
  "اسناد و مدارک فعالیت کمیته های کاری (طرزالعمل کاری،کتب ثبت جلسات، فیصله ها و اجراات",
  "اسناد و مدارک انجام کارات عملی",
  "اسناد و مدارک ارزیابی کارمندان و اساتید",
  "مکاتیب تدویر کورس های حمایوی آموزشی",
  "مکاتیب ارسال شاگردان به دوره پرکتیک",
  "اسناد و مدارک فعالیت شاگردان روی پروژی های کار عملی",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper to get file icon by type
const getFileIcon = (fileType) => {
  if (!fileType) return <InsertDriveFileIcon color="disabled" />;
  if (fileType.startsWith('image/')) return <ImageIcon color="primary" />;
  if (fileType === 'application/pdf') return <PictureAsPdfIcon color="error" />;
  if (fileType.includes('word')) return <DescriptionIcon color="primary" />;
  if (fileType.includes('excel')) return <TableChartIcon color="success" />;
  return <InsertDriveFileIcon color="action" />;
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 2,
});

const FilePreview = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  margin: '4px 0',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});

const getAllowedFileTypes = (index) => {
  if (index < 3) {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  } else {
    // Accept both common zip mimetypes and empty string (for browsers that don't set it)
    return ['application/zip', 'application/x-zip-compressed', ''];
  }
};

const getAcceptString = (index) => {
  if (index < 3) {
    return '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx';
  } else {
    return '.zip';
  }
};

// ErrorBoundary component to catch runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to an error reporting service here
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 24, textAlign: 'center' }}>
          <h2>خطای غیرمنتظره رخ داد</h2>
          <p>{this.state.error?.message || 'مشکلی پیش آمده است.'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default function FileUploadWizard({ onStepChange }) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [inlineFeedback, setInlineFeedback] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    documentType: null,
    index: null
  });
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [tempFiles, setTempFiles] = useState({});
  const [success, setSuccess] = useState(null);
  const clearMsgTimeout = useRef(null);
  const [step10Triggered, setStep10Triggered] = useState(false);
  // Count how many fields are filled (uploaded)
  const filledCount = Object.values(documents).filter(Boolean).length;

  useEffect(() => {
    console.log('=== Documents Component Mounted ===');
    console.log('Initial state:', {
      documents: documents,
      loading: loading,
      uploading: uploading,
      error: error
    });
    
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'institute') {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      console.log('=== Fetching Documents ===');
      console.log('Current state:', {
        documents: documents,
        loading: loading,
        error: error
      });

      setLoading(true);
      setError(null);

      // Initialize docsMap with empty values for all document types
      const docsMap = {};
      uploadLabels.forEach(label => {
        docsMap[label] = null;
      });
      console.log('Initialized empty document map:', docsMap);

      // Fetch documents for each type
      console.log('Fetching documents for each type');
      for (const type of uploadLabels) {
        try {
          console.log(`Fetching documents for type: ${type}`);
          const response = await axios.get('/api/profile-documents', {
            params: { type }
          });
          
          console.log(`Response for type ${type}:`, {
            success: response.data.success,
            dataCount: response.data.data?.length || 0
          });

          if (response.data.success && Array.isArray(response.data.data)) {
            const docs = response.data.data;
            if (docs.length > 0) {
              console.log(`Found document for type ${type}:`, {
                id: docs[0].id,
                name: docs[0].file_name
              });
              docsMap[type] = docs[0];
            } else {
              console.log(`No documents found for type ${type}`);
            }
          }
        } catch (err) {
          console.error(`Error fetching documents for type ${type}:`, {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });
          // Continue with other types even if one fails
          continue;
        }
      }
      
      console.log('Final document map:', docsMap);
      setDocuments(docsMap);
    } catch (err) {
      console.error('=== Error Fetching Documents ===');
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });

      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Authentication error, redirecting to login');
        showSnackbar('لطفا وارد حساب کاربری خود شوید', 'error');
        navigate('/login');
      } else {
        setError('خطا در دریافت اسناد');
        showSnackbar(err.response?.data?.message || 'خطا در دریافت اسناد', 'error');
      }
    } finally {
      setLoading(false);
      console.log('=== Fetch Documents Complete ===');
      console.log('Final state:', {
        documents: documents,
        loading: loading,
        error: error
      });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    console.log('=== Showing Snackbar ===', {
      message,
      severity
    });
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    console.log('=== Closing Snackbar ===');
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateFile = (file, index) => {
    const allowedTypes = getAllowedFileTypes(index);
    if (index >= 3) {
      const isZip = (
        allowedTypes.includes(file.type) ||
        (file.type === '' && file.name.toLowerCase().endsWith('.zip'))
      );
      if (!isZip) {
        setError('فقط فایل zip مجاز است.');
        return false;
      }
    } else {
      if (!allowedTypes.includes(file.type)) {
        setError('نوع فایل مجاز نیست. فقط فایل‌های تصویر، PDF، Word و Excel مجاز هستند.');
        return false;
      }
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('حجم فایل نباید بیشتر از 10 مگابایت باشد');
      return false;
    }
    return true;
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file, index)) {
      e.target.value = null;
      return;
    }
    setTempFiles(prev => ({ ...prev, [index]: file }));
    setError(null);
    setSuccess('فایل با موفقیت انتخاب شد');
  };

  const removeTempFile = (index) => {
    setTempFiles(prev => {
      const newTempFiles = { ...prev };
      delete newTempFiles[index];
      return newTempFiles;
    });
  };

  const handleUpload = async (index) => {
    const file = tempFiles[index];
    if (!file) {
      setError('لطفا یک فایل انتخاب کنید');
      return;
    }

    setUploading(prev => ({ ...prev, [index]: true }));
    setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', uploadLabels[index]);
    formData.append('is_profile', true);

    try {
      const response = await axios.post(
        `/api/profile-documents/upload?document_type=${uploadLabels[index]}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [index]: percent }));
          }
        }
      );

      console.log('Upload response:', {
        success: response.data.success,
        document: response.data.data
      });

      if (response.data.success) {
        console.log('Fetching updated document list');
        const docResponse = await axios.get('/api/profile-documents', {
          params: { 
            type: uploadLabels[index],
            is_profile: true 
          }
        });

        if (docResponse.data.success && docResponse.data.data.length > 0) {
          setDocuments(prev => ({
            ...prev,
            [uploadLabels[index]]: docResponse.data.data[0]
          }));
        }
        setSuccess('فایل با موفقیت بارگذاری شد');
        removeTempFile(index);
      }
      setUploadProgress(prev => ({ ...prev, [index]: 100 }));
    } catch (err) {
      console.error('=== Error Uploading File ===');
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401 || err.response?.status === 403) {
        showSnackbar('لطفا وارد حساب کاربری خود شوید', 'error');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'خطا در بارگذاری فایل');
      }
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    } finally {
      setUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDelete = async (documentType, index) => {
    console.log('=== Delete Document Request ===', {
      documentType,
      index
    });

    const doc = documents[documentType];
    if (!doc) {
      console.warn('No document found for type:', documentType);
      return;
    }

    try {
      console.log('Sending delete request to server');
      const response = await axios.delete(`/api/profile-documents/${doc.id}`);

      console.log('Delete response:', {
        success: response.data.success,
        message: response.data.message
      });

      if (response.data.success) {
        console.log('Updating documents state after deletion');
        setDocuments(prev => {
          const newDocs = { ...prev };
          newDocs[documentType] = null;
          return newDocs;
        });
        setInlineFeedback(prev => ({ 
          ...prev, 
          [index]: { 
            type: 'success', 
            message: 'سند با موفقیت حذف شد' 
          } 
        }));
      }
    } catch (err) {
      console.error('=== Error Deleting Document ===');
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      setInlineFeedback(prev => ({ 
        ...prev, 
        [index]: { 
          type: 'error', 
          message: err.response?.data?.message || 'خطا در حذف سند' 
        } 
      }));
    }
  };

  const handlePreview = async (document) => {
    console.log('=== Preview Document ===', {
      document
    });
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewFile(document);
    setPreviewLoading(false);
  };

  const handleClosePreview = () => {
    console.log('=== Close Preview ===');
    setPreviewFile(null);
  };

  const handleDeleteClick = (documentType, index) => {
    console.log('=== Delete Click ===', {
      documentType,
      index
    });
    setDeleteDialog({
      open: true,
      documentType,
      index
    });
  };

  const handleDeleteConfirm = async () => {
    console.log('=== Delete Confirm ===', {
      documentType: deleteDialog.documentType,
      index: deleteDialog.index
    });
    await handleDelete(deleteDialog.documentType, deleteDialog.index);
    setDeleteDialog({
      open: false,
      documentType: null,
      index: null
    });
  };

  const handleDeleteCancel = () => {
    console.log('=== Delete Cancel ===');
    setDeleteDialog({
      open: false,
      documentType: null,
      index: null
    });
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return '';
    // Convert backslashes to forward slashes and ensure proper URL format
    return `http://localhost:5000/${filePath.replace(/\\/g, '/')}`;
  };

  // Auto-clear success/error messages after 3 seconds, with robust handling
  useEffect(() => {
    try {
      if (success || error) {
        if (clearMsgTimeout.current) clearTimeout(clearMsgTimeout.current);
        clearMsgTimeout.current = setTimeout(() => {
          setSuccess(null);
          setError(null);
        }, 3000);
      }
      return () => {
        if (clearMsgTimeout.current) clearTimeout(clearMsgTimeout.current);
      };
    } catch (e) {
      // Fallback: just clear messages
      setSuccess(null);
      setError(null);
    }
  }, [success, error]);

  useEffect(() => {
    // When 5 or more documents are uploaded, call onStepChange to mark the step as complete
    if (onStepChange && filledCount >= 5 && !step10Triggered) {
      setStep10Triggered(true);
      onStepChange(); // Signal completion without forcing navigation
    }
    // Reset if the count drops below 5
    if (filledCount < 5 && step10Triggered) {
      setStep10Triggered(false);
    }
  }, [filledCount, onStepChange, step10Triggered]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">
          لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">
          برای بارگذاری اسناد، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.
        </p>
        <hr />
        <p className="mb-0">
          لطفاً با شماره <strong>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            mx: "auto",
            p: 3,
            borderRadius: 2,
            direction: "rtl",
            bgcolor: "background.default",
            color: "text.primary",
            maxWidth: 900
          }}
          aria-label="مدیریت اسناد و مدارک"
        >
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
            sx={{ fontSize: 14 }}
          >
            یاداشت: از ارسال اسناد و مدارک بی ربط و خارج از موارد ذکر شده جلوگیری نمائید. در
            صورت عدم رعایت این مسئله امکان دارد در خواست شما برای اعتباردهی از سوی بورد رد گردد.
          </Typography>

          {uploadLabels.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <InsertDriveFileIcon sx={{ fontSize: 60, color: 'grey.600' }} />
              <Typography variant="h6" color="text.secondary" mt={2}>
                هیچ سندی برای بارگذاری وجود ندارد.
              </Typography>
            </Box>
          )}

          {uploadLabels.map((label, index) => (
            <Accordion key={index} sx={{ bgcolor: "background.paper", mb: 1 }} aria-label={`بارگذاری: ${documentLabels[index]}`}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
                <Typography>{`بارگذاری: ${documentLabels[index]}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading[index] || !!documents[label]}
                      aria-label={`انتخاب فایل برای ${documentLabels[index]}`}
                    >
                      انتخاب فایل
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                        accept={getAcceptString(index)}
                        aria-label={`انتخاب فایل برای ${documentLabels[index]}`}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {index < 3
                        ? "فرمت‌های مجاز: jpg, png, gif, pdf, doc, docx, xls, xlsx | حداکثر ۱۰ مگابایت"
                        : "فقط فایل zip | حداکثر ۱۰ مگابایت"}
                    </Typography>
                    <Typography variant="caption" color="info.main" sx={{ mt: 1, display: 'block' }}>
                      {`راهنما: ${documentLabels[index]}`}
                    </Typography>
                  </Box>

                  {tempFiles[index] && (
                    <FilePreview>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        {getFileIcon(tempFiles[index].type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {tempFiles[index].name} ({(tempFiles[index].size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeTempFile(index)}
                        disabled={uploading[index]}
                        aria-label="حذف فایل موقت"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpload(index)}
                        disabled={uploading[index]}
                        startIcon={uploading[index] ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                      >
                        {uploading[index] ? 'در حال بارگذاری...' : 'بارگذاری'}
                      </Button>
                    </FilePreview>
                  )}

                  {documents[label] && (
                    <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>نوع فایل</TableCell>
                            <TableCell>نام فایل</TableCell>
                            <TableCell>عملیات</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              {getFileIcon(documents[label].file_type)}
                            </TableCell>
                            <TableCell>{documents[label].file_name}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handlePreview(documents[label])}
                                  aria-label={`مشاهده سند ${documentLabels[index]}`}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(label, index)}
                                  disabled={uploading[index]}
                                  aria-label={`حذف سند ${documentLabels[index]}`}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  component="a"
                                  href={getFileUrl(documents[label].file_path)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`دانلود سند ${documentLabels[index]}`}
                                >
                                  <InsertDriveFileIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {uploading[index] && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress variant={uploadProgress[index] ? 'determinate' : 'indeterminate'} value={uploadProgress[index] || 0} />
                      {uploadProgress[index] !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                          {uploadProgress[index]}%
                        </Typography>
                      )}
                    </Box>
                  )}

                  {inlineFeedback[index]?.type === 'error' && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                      <ErrorIcon className="me-2" />
                      {inlineFeedback[index].message}
                    </Alert>
                  )}
                  {inlineFeedback[index]?.type === 'success' && (
                    <Alert severity="success" sx={{ width: '100%' }}>
                      <CheckCircleIcon className="me-2" />
                      {inlineFeedback[index].message}
                    </Alert>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                      <ErrorIcon className="me-2" />
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert severity="success" sx={{ width: '100%' }}>
                      <CheckCircleIcon className="me-2" />
                      {success}
                    </Alert>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* File Preview Dialog */}
          <Dialog
            open={!!previewFile}
            onClose={handleClosePreview}
            maxWidth="md"
            fullWidth
            aria-labelledby="file-preview-dialog-title"
          >
            <DialogTitle id="file-preview-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {previewFile?.file_name}
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClosePreview}
                  aria-label="بستن"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {previewLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : previewError ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="error" gutterBottom>
                    {previewError}
                  </Typography>
                </Box>
              ) : previewFile?.file_type?.startsWith('image/') ? (
                <img
                  src={getFileUrl(previewFile.file_path)}
                  alt={previewFile.file_name}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    setPreviewError('خطا در بارگذاری تصویر');
                  }}
                />
              ) : previewFile?.file_type === 'application/pdf' ? (
                <iframe
                  src={getFileUrl(previewFile.file_path)}
                  style={{ width: '100%', height: '80vh', border: 'none' }}
                  title={previewFile.file_name}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    پیش‌نمایش برای این نوع فایل در دسترس نیست
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href={getFileUrl(previewFile?.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<InsertDriveFileIcon />}
                  >
                    دانلود فایل
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              حذف سند
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                آیا از حذف این سند اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                انصراف
              </Button>
              <Button 
                onClick={handleDeleteConfirm} 
                color="error" 
                autoFocus
                variant="contained"
              >
                حذف
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

FileUploadWizard.propTypes = {
  onStepChange: PropTypes.func
};