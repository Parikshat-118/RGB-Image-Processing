import React from 'react';
import { motion } from 'framer-motion';

const sliderConfig = [
  { key: 'brightness', label: ' Brightness', icon: '', min: -100, max: 100, step: 1, defaultVal: 0 },
  { key: 'contrast', label: ' Contrast', icon: '', min: 0.1, max: 3.0, step: 0.1, defaultVal: 1.0 },
  { key: 'red', label: ' Red Channel', icon: '', min: -100, max: 100, step: 1, defaultVal: 0 },
  { key: 'green', label: ' Green Channel', icon: '', min: -100, max: 100, step: 1, defaultVal: 0 },
  { key: 'blue', label: ' Blue Channel', icon: '', min: -100, max: 100, step: 1, defaultVal: 0 },
];

export default function ControlPanel({ settings, onSettingChange }) {
  return (
    <div>
      <h3>🎛️ Adjustments</h3>
      {sliderConfig.map((cfg, i) => (
        <motion.div
          className="control-group"
          key={cfg.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <div className="control-label">
            <span className="label-text">{cfg.label}</span>
            <span className="value-display">
              {cfg.key === 'contrast'
                ? Number(settings[cfg.key]).toFixed(1)
                : settings[cfg.key]}
            </span>
          </div>
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={settings[cfg.key]}
            onChange={(e) =>
              onSettingChange(cfg.key, cfg.key === 'contrast' ? parseFloat(e.target.value) : parseInt(e.target.value, 10))
            }
          />
        </motion.div>
      ))}
    </div>
  );
}
