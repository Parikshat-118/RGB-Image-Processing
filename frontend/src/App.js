import React, { useState } from 'react';
import './App.css';
import ParticleBackground from './components/ParticleBackground';
import ImageUploader from './components/ImageUploader';
import ImageEditor from './components/ImageEditor';
import { motion } from 'framer-motion';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleImageUpload = (imageData) => {
    setOriginalImage(imageData);
    setShowEditor(true);
  };

  const handleNewImage = () => {
    setOriginalImage(null);
    setShowEditor(false);
  };

  return (
    <div className="App">
      <ParticleBackground />
      
      <div className="content">
        <motion.header 
          className="header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="title">🎨 Photo Editor </h1>
          <p className="subtitle">Real-time image manipulation</p>
        </motion.header>

        {!showEditor ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <ImageEditor 
            originalImage={originalImage} 
            onNewImage={handleNewImage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
