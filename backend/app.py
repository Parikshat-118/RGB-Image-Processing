from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Image manipulation functions from the original code
def adj_brt(img, value):
    """Adjust brightness by adding/subtracting a value"""
    temp = img.astype(np.int16)
    temp = temp + value
    temp = np.clip(temp, 0, 255)
    return temp.astype(np.uint8)

def adj_cont(img, alpha, beta=0):
    """Adjust contrast using alpha and beta parameters"""
    temp = img.astype(np.float32)
    temp = alpha * (temp - 128) + beta + 128
    temp = np.clip(temp, 0, 255)
    return temp.astype(np.uint8)

def blue_ch(image, value):
    """Boost or reduce blue channel"""
    temp = image.copy()
    blue = temp[:, :, 2].astype(np.int16)
    blue = blue + value
    blue = np.clip(blue, 0, 255)
    temp[:, :, 2] = blue.astype(np.uint8)
    return temp

def red_ch(image, value):
    """Boost or reduce red channel"""
    temp = image.copy()
    red = temp[:, :, 0].astype(np.int16)
    red = red + value
    red = np.clip(red, 0, 255)
    temp[:, :, 0] = red.astype(np.uint8)
    return temp

def green_ch(image, value):
    """Boost or reduce green channel"""
    temp = image.copy()
    green = temp[:, :, 1].astype(np.int16)
    green = green + value
    green = np.clip(green, 0, 255)
    temp[:, :, 1] = green.astype(np.uint8)
    return temp

def remove_channel(img, channel):
    """Remove a specific color channel"""
    temp = img.copy()
    temp[:, :, channel] = 0
    return temp

def swap_channels(img, ch1, ch2):
    """Swap two color channels"""
    temp = img.copy()
    temp[:, :, ch1], temp[:, :, ch2] = temp[:, :, ch2].copy(), temp[:, :, ch1].copy()
    return temp

def inv_img(img):
    """Invert the image colors"""
    return 255 - img

def convert_image_to_base64(img_array):
    """Convert numpy array to base64 string"""
    img = Image.fromarray(img_array.astype(np.uint8))
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode()
    return f"data:image/png;base64,{img_str}"

def decode_base64_image(base64_string):
    """Decode base64 string to numpy array"""
    # Remove data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    img_data = base64.b64decode(base64_string)
    img = Image.open(io.BytesIO(img_data))
    img = img.convert('RGB')
    return np.array(img)

@app.route('/')
def home():
    return "Photo Editor API is running!"

@app.route('/api/adjust-brightness', methods=['POST'])
def adjust_brightness():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        value = int(data['value'])
        
        result = adj_brt(img_array, value)
        result_base64 = convert_image_to_base64(result)
        
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/adjust-contrast', methods=['POST'])
def adjust_contrast():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        alpha = float(data['alpha'])
        beta = float(data.get('beta', 0))
        
        result = adj_cont(img_array, alpha, beta)
        result_base64 = convert_image_to_base64(result)
        
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/adjust-channel', methods=['POST'])
def adjust_channel():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        channel = data['channel']
        value = int(data['value'])
        
        if channel == 'red':
            result = red_ch(img_array, value)
        elif channel == 'green':
            result = green_ch(img_array, value)
        elif channel == 'blue':
            result = blue_ch(img_array, value)
        else:
            return jsonify({'error': 'Invalid channel'}), 400
        
        result_base64 = convert_image_to_base64(result)
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/remove-channel', methods=['POST'])
def remove_color_channel():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        channel_name = data['channel']
        
        channel_map = {'red': 0, 'green': 1, 'blue': 2}
        channel = channel_map.get(channel_name)
        
        if channel is None:
            return jsonify({'error': 'Invalid channel'}), 400
        
        result = remove_channel(img_array, channel)
        result_base64 = convert_image_to_base64(result)
        
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/swap-channels', methods=['POST'])
def swap_color_channels():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        ch1_name = data['channel1']
        ch2_name = data['channel2']
        
        channel_map = {'red': 0, 'green': 1, 'blue': 2}
        ch1 = channel_map.get(ch1_name)
        ch2 = channel_map.get(ch2_name)
        
        if ch1 is None or ch2 is None:
            return jsonify({'error': 'Invalid channels'}), 400
        
        result = swap_channels(img_array, ch1, ch2)
        result_base64 = convert_image_to_base64(result)
        
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/invert', methods=['POST'])
def invert_image():
    try:
        data = request.json
        img_array = decode_base64_image(data['image'])
        
        result = inv_img(img_array)
        result_base64 = convert_image_to_base64(result)
        
        return jsonify({'image': result_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/reset', methods=['POST'])
def reset_image():
    try:
        data = request.json
        # Simply return the original image
        return jsonify({'image': data['image']})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)