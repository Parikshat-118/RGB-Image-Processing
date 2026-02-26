import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const adjustBrightness = (image, value) =>
  api.post('/adjust-brightness', { image, value });

export const adjustContrast = (image, alpha, beta = 0) =>
  api.post('/adjust-contrast', { image, alpha, beta });

export const adjustChannel = (image, channel, value) =>
  api.post('/adjust-channel', { image, channel, value });

export const removeChannel = (image, channel) =>
  api.post('/remove-channel', { image, channel });

export const swapChannels = (image, channel1, channel2) =>
  api.post('/swap-channels', { image, channel1, channel2 });

export const invertImage = (image) =>
  api.post('/invert', { image });

export const resetImage = (image) =>
  api.post('/reset', { image });
