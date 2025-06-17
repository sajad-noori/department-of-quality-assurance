import React from 'react';

const WaitingForResponse = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="rounded-2xl shadow-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">مراحل با موفقیت تکمیل شد</h2>
        <p className="text-gray-600 text-base">
          لطفاً منتظر بمانید. درخواست شما در حال بررسی است و به‌زودی پاسخ را در ایمیل خود دریافت خواهید کرد.
        </p>
      </div>
    </div>
  );
};

export default WaitingForResponse;
