import React, { useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

export default function FileUploadWizard() {
  const [files, setFiles] = useState(Array(uploadLabels.length).fill(null));
  const [progresses, setProgresses] = useState(Array(uploadLabels.length).fill(0));

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFiles = [...files];
    newFiles[index] = { file, preview: null };
    setFiles(newFiles);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 100) progress = 100;

      const newProgresses = [...progresses];
      newProgresses[index] = progress;
      setProgresses(newProgresses);

      if (progress === 100) {
        clearInterval(interval);

        let preview = null;
        const fileType = file.type;
        if (fileType.startsWith("image/") || fileType === "application/pdf") {
          preview = URL.createObjectURL(file);
        }
        const updatedFiles = [...newFiles];
        updatedFiles[index] = { file, preview };
        setFiles(updatedFiles);
      }
    }, 150);
  };

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

        {uploadLabels.map((label, index) => (
          <Accordion key={index} sx={{ bgcolor: "background.paper", mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
              <Typography>{`بارگذاری: ${label}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Button variant="contained" component="label" color="primary">
                  انتخاب فایل
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </Button>

                {files[index] && (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={progresses[index]}
                      sx={{ height: 10, borderRadius: 5 }}
                      color={progresses[index] === 100 ? "success" : "primary"}
                    />
                    {progresses[index] === 100 && (
                      <>
                        <Typography color="success.main" fontWeight="bold">
                          فایل با موفقیت بارگذاری شد ✅
                        </Typography>
                        <Box
                          component={
                            files[index].file.type === "application/pdf"
                              ? "iframe"
                              : "img"
                          }
                          src={files[index].preview}
                          alt="پیش نمایش"
                          sx={{
                            mt: 1,
                            maxHeight: 200,
                            width: "100%",
                            borderRadius: 1,
                            boxShadow: 1,
                            border: "1px solid #444",
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </ThemeProvider>
  );
}
