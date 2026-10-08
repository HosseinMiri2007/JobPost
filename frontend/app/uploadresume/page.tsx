// frontend/components/ResumeUploader.tsx
"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ResumeUploader() {
  // State for the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for upload status
  const [isUploading, setIsUploading] = useState(false);

  // State for upload message
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the upload function from auth context
  const { uploadresume, user, loading } = useAuth();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        text: "❌ فرمت فایل مجاز نیست. فقط PDF، PNG، JPG، DOC، DOCX",
        type: "error",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: "❌ حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        type: "error",
      });
      return;
    }

    // Clear any previous messages
    setMessage({ text: "", type: "" });

    // Set the selected file
    setSelectedFile(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({
        text: "⚠️ لطفاً ابتدا یک فایل انتخاب کنید",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    setMessage({ text: "⏳ در حال آپلود...", type: "" });

    try {
      await uploadresume(selectedFile);

      setMessage({
        text: "✅ رزومه با موفقیت آپلود شد!",
        type: "success",
      });

      // Clear the selected file after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage({
        text: "❌ خطا در آپلود رزومه. لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing the selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMessage({ text: "", type: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">📄 آپلود رزومه</h2>

      {/* Show current resume if exists */}
      {user?.resume && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ رزومه فعلی: {user.resume.split("/").pop()}
          </p>
        </div>
      )}

      {/* File input area */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          انتخاب فایل رزومه
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
          disabled={isUploading || loading}
        />
      </div>

      {/* Show selected file info */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center">
          <div className="flex-1">
            <span className="text-sm font-medium">📄 {selectedFile.name}</span>
            <span className="text-xs text-gray-500 block">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2"
            disabled={isUploading}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || loading}
        className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${
          !selectedFile || isUploading || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        }`}
      >
        {isUploading ? "⏳ در حال آپلود..." : "📤 آپلود رزومه"}
      </button>

      {/* Message display */}
      {message.text && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              : message.type === "error"
                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Supported formats info */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>فرمت‌های مجاز: PDF, PNG, JPG, DOC, DOCX</p>
        <p>حداکثر حجم: ۵ مگابایت</p>
      </div>
    </div>
  );
}
