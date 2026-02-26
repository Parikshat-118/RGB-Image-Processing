import React from 'react';
import { motion } from 'framer-motion';

const presets = [
  { label: ' Invert Colors', action: 'invert' },
  { label: ' Remove Red', action: 'remove-red' },
  { label: ' Remove Green', action: 'remove-green' },
  { label: ' Remove Blue', action: 'remove-blue' },
  { label: ' Swap R ↔ B', action: 'swap-rb' },
  { label: ' Swap R ↔ G', action: 'swap-rg' },
];

export default function PresetFilters({ onApplyPreset, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h3 style={{ color: '#667eea', fontSize: '1.4rem', marginBottom: 15, textAlign: 'center' }}>
        ⚡ Quick Effects
      </h3>
      <div className="effects-grid">
        {presets.map((p) => (
          <button
            key={p.action}
            className="effect-btn"
            onClick={() => onApplyPreset(p.action)}
            disabled={disabled}
          >
            {p.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
