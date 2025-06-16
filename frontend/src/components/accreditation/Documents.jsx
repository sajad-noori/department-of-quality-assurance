import React, { useState, useEffect } from "react";
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

const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    primary: {
      main: "#90caf9",
    },
    success: {
      main: "#66bb6a",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "sans-serif",
  },
});

const uploadLabels = [
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

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = '/login';
    }
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

export default function FileUploadWizard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
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
          const response = await axios.get('/api/documents', {
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

  const validateFile = (file) => {
    console.log('=== Validating File ===', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.warn('File validation failed: Invalid file type', {
        fileType: file.type,
        allowedTypes: ALLOWED_FILE_TYPES
      });
      setError('نوع فایل مجاز نیست. فقط فایل‌های تصویر، PDF، Word و Excel مجاز هستند.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      console.warn('File validation failed: File too large', {
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE
      });
      setError('حجم فایل نباید بیشتر از 10 مگابایت باشد');
      return false;
    }

    console.log('File validation passed');
    return true;
  };

  const handleFileChange = (e, index) => {
    console.log('=== File Change Event ===', {
      index,
      documentType: uploadLabels[index]
    });

    const file = e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    if (!validateFile(file)) {
      console.log('File validation failed, clearing input');
      e.target.value = null;
      return;
    }

    setTempFiles(prev => ({
      ...prev,
      [index]: file
    }));
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

    console.log('Starting file upload process');
    setUploading(prev => ({ ...prev, [index]: true }));
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', uploadLabels[index]);

    try {
      console.log('Uploading file to server');
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', {
        success: response.data.success,
        document: response.data.data
      });

      if (response.data.success) {
        console.log('Fetching updated document list');
        const docResponse = await axios.get('/api/documents', {
          params: { type: uploadLabels[index] }
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
      const response = await axios.delete(`/api/documents/${doc.id}`);

      console.log('Delete response:', {
        success: response.data.success,
        message: response.data.message
      });

      if (response.data.success) {
        console.log('Updating documents state after deletion');
        setDocuments(prev => {
          const newDocs = { ...prev };
          delete newDocs[documentType];
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: '400px' }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            دسترسی محدود
          </Typography>
          <Typography variant="body1" gutterBottom>
            لطفاً ابتدا وارد حساب کاربری خود شوید.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            ورود به سیستم
          </Button>
        </Alert>
      </Box>
    );
  }

  if (user.role !== 'institute') {
    return (
      <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            دسترسی محدود
          </Typography>
          <Typography variant="body1" gutterBottom>
            برای بارگذاری اسناد، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            لطفاً با شماره <strong>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
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
          <Accordion key={index} sx={{ bgcolor: "background.paper", mb: 1 }} aria-label={`بارگذاری: ${label}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
              <Typography>{`بارگذاری: ${label}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading[index]}
                    aria-label={`انتخاب فایل برای ${label}`}
                  >
                  انتخاب فایل
                    <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
                      aria-label={`انتخاب فایل برای ${label}`}
                    />
                  </Button>
                </Box>

                {tempFiles[index] && (
                  <FilePreview>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {tempFiles[index].name}
                        </Typography>
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
                                aria-label={`مشاهده سند ${label}`}
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(label, index)}
                                disabled={uploading[index]}
                                aria-label={`حذف سند ${label}`}
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
                                aria-label={`دانلود سند ${label}`}
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

                {uploading[index] && (
                  <LinearProgress sx={{ width: '100%' }} aria-label="در حال بارگذاری..." />
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
  );
}
