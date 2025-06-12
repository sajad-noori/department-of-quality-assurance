import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


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

function Standard({ value, onChange }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);

  const handleFileChange = (event) => {
    const filesArray = Array.from(event.target.files);
    setTempFiles((prev) => [...prev, ...filesArray]);
  };

  const handleAdd = () => {
    const firstLine = value.split("\n")[0];
    const filesWithDescription = tempFiles.map((file) => ({
      name: file.name,
      firstLine,
    }));
    setUploadedFiles((prev) => [...prev, ...filesWithDescription]);
    setTempFiles([]); // Clear temporary files
  };

  return (
    <>
    <label htmlFor="description" className="form-label small d-block mb-2">
            در این بخش مرکز آموزشی باید مطابقت ساختار های موجود در مرکز آموزشی را با ستندرد ها و معیارات ریاست تضمین کیفیت و اعتبار دهی بصورت مشرح طبق روال ذیل بیان نماید:
          </label>
      <div className="p-3 border rounded shadow-sm">
        {/* Title */}
        {/* Description Section */}
        <div className="mb-4">
          <textarea
            id="description"
            value={value}
            onChange={onChange}
            placeholder={`ستندرد اول :(عنوان ستندرد)
تشریح ساختار های موجود در مطابقت با نیازمندی های تعریف شده ستندرد را در اینجا بنوسید.`}
            className="form-control white-placeholder"
            rows={10}
            style={{ resize: "none", backgroundColor: "transparent", color: "white" }}
          />
        </div>

        {/* File Upload Section */}
        <div className="mb-4 p-3 border rounded">
          <p className="small mb-2">مدارک اثباته برای هر ستندرد جداگانه در این قسمت اضافه کنید:</p>
          <div className="text-center">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              آپلود فایل
              <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleAdd} className="btn btn-primary w-100">
          افزودن
        </button>
      </div>

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h6 className="mb-3">ستندرد های اپلود شده</h6>
          <table className="table table-bordered table-sm table-striped text-center">
            <thead className="table-light">
              <tr>
                <th>شماره</th>
                <th>ستندرد</th>
                <th>نام فایل</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{file.firstLine || "-"}</td>
                  <td>{file.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}


export default Standard;