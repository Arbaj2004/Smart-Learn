import  { useState } from "react";
import { Upload, X } from "lucide-react";
import uploadFile from "../utils/UploadFiles";

const Loading = () => (
  <div className="flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const ImageUploader = ({ onUploadSuccess }) => {
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // Store the preview URL
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadedFile = await uploadFile(file);

      if (onUploadSuccess) {
        onUploadSuccess(uploadedFile.secure_url);
      }

      setUploadPhoto(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a local preview
      e.target.value = ""; // Reset the input field
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      try {
        setLoading(true);
        const uploadedFile = await uploadFile(file);

        if (onUploadSuccess) {
          onUploadSuccess(uploadedFile.secure_url);
        }

        setUploadPhoto(file);
        setPreviewUrl(URL.createObjectURL(file)); // Generate a local preview
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearUpload = () => {
    setUploadPhoto(null);
    setPreviewUrl("");
    if (onUploadSuccess) {
      onUploadSuccess("");
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative rounded-lg transition-all duration-300 ${
          loading ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <label
          htmlFor="profilePic"
          className={`relative block ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/5"
              : "border-indigo-200/20 hover:border-indigo-400/40"
          } cursor-pointer rounded-lg transition-all duration-300`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loading />
                <p className="text-sm text-indigo-600">Uploading...</p>
              </div>
            ) : previewUrl ? (
              <div className="flex items-center space-x-4">
                {/* Image on the left */}
                <div className="relative w-24 h-24">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearUpload();
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
            
                {/* File name on the right */}
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700">{uploadPhoto?.name}</p>
                  <p className="text-xs text-gray-500">{(uploadPhoto?.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-indigo-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-600">
                    Drop your image here, or{" "}
                    <span className="text-indigo-500 underline">browse</span>
                  </p>
                  <p className="text-xs text-indigo-500/70">
                    Supports PNG, JPEG or JPG
                  </p>
                </div>
              </div>
            )}
          </div>
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          id="profilePic"
          name="profilePic"
          className="hidden"
          onChange={handleUploadProfilePhoto}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
