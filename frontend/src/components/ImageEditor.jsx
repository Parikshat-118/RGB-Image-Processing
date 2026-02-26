import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import ControlPanel from './ControlPanel';
import PresetFilters from './PresetFilters';
import {
  adjustBrightness,
  adjustContrast,
  adjustChannel,
  removeChannel,
  swapChannels,
  invertImage,
} from '../utils/api';

const DEFAULT_SETTINGS = {
  brightness: 0,
  contrast: 1.0,
  red: 0,
  green: 0,
  blue: 0,
};

export default function ImageEditor({ originalImage, onNewImage }) {
  const [displayImage, setDisplayImage] = useState(originalImage);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(false);
  const processingRef = useRef(false);


  const processImage = useCallback(
    async (currentSettings) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setLoading(true);

      try {
        let img = originalImage;


        if (currentSettings.brightness !== 0) {
          const res = await adjustBrightness(img, currentSettings.brightness);
          img = res.data.image;
        }


        if (currentSettings.contrast !== 1.0) {
          const res = await adjustContrast(img, currentSettings.contrast);
          img = res.data.image;
        }


        if (currentSettings.red !== 0) {
          const res = await adjustChannel(img, 'red', currentSettings.red);
          img = res.data.image;
        }


        if (currentSettings.green !== 0) {
          const res = await adjustChannel(img, 'green', currentSettings.green);
          img = res.data.image;
        }


        if (currentSettings.blue !== 0) {
          const res = await adjustChannel(img, 'blue', currentSettings.blue);
          img = res.data.image;
        }

        setDisplayImage(img);
      } catch (err) {
        console.error('Processing error:', err);
      } finally {
        setLoading(false);
        processingRef.current = false;
      }
    },
    [originalImage]
  );


  const debouncedProcess = useCallback(
    debounce((s) => processImage(s), 300),
    [processImage]
  );


  useEffect(() => {
    const isDefault =
      settings.brightness === 0 &&
      settings.contrast === 1.0 &&
      settings.red === 0 &&
      settings.green === 0 &&
      settings.blue === 0;

    if (isDefault) {
      setDisplayImage(originalImage);
    } else {
      debouncedProcess(settings);
    }

    return () => debouncedProcess.cancel();
  }, [settings, debouncedProcess, originalImage]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreset = async (action) => {
    setLoading(true);
    try {
      let res;

      const img = displayImage;

      switch (action) {
        case 'invert':
          res = await invertImage(img);
          break;
        case 'remove-red':
          res = await removeChannel(img, 'red');
          break;
        case 'remove-green':
          res = await removeChannel(img, 'green');
          break;
        case 'remove-blue':
          res = await removeChannel(img, 'blue');
          break;
        case 'swap-rb':
          res = await swapChannels(img, 'red', 'blue');
          break;
        case 'swap-rg':
          res = await swapChannels(img, 'red', 'green');
          break;
        default:
          return;
      }

      setDisplayImage(res.data.image);
    } catch (err) {
      console.error('Preset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setDisplayImage(originalImage);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = displayImage;
    link.download = 'edited-photo.png';
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="editor-container">
        {/* Image Display */}
        <div className="image-display">
          <div className="image-wrapper">
            <img src={displayImage} alt="Edited" />
            {loading && (
              <div className="loading-overlay">
                <div className="spinner" />
              </div>
            )}
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleDownload}>
              💾 Download
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              🔄 Reset
            </button>
            <button className="btn btn-danger" onClick={onNewImage}>
              🖼️ New Image
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="control-panel">
          <ControlPanel settings={settings} onSettingChange={handleSettingChange} />
          <PresetFilters onApplyPreset={handlePreset} disabled={loading} />
        </div>
      </div>
    </motion.div>
  );
}
