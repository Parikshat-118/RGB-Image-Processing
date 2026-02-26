import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ImageUploader({ onImageUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageUpload(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    readFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    readFile(file);
  };

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className={`upload-box ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="upload-icon">📁</div>
        <h2>Drop your image here</h2>
        <p>or click to browse files</p>
        <p style={{ marginTop: 12, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
          Supports JPG, PNG, WEBP
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    </motion.div>
  );
}
