import { useState } from "react";

export default function useThumbnailUpload() {
  const [files, setFiles] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();

    const newFiles = files.filter((_, i) => i !== index);

    setFiles(newFiles);

    if (newFiles.length === 0) {
      setThumbnailIndex(0);
    } else if (index === thumbnailIndex) {
      setThumbnailIndex(0);
    } else if (index < thumbnailIndex) {
      setThumbnailIndex((prev) => prev - 1);
    }
  };

  return {
    files,
    thumbnailIndex,
    setThumbnailIndex,
    handleFileChange,
    handleDelete,
  };
}