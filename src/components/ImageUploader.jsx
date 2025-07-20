import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';

const ImageUploader = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다.');
    }

    if (file.size > maxSize) {
      throw new Error('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.');
    }

    return true;
  };

  const handleFile = (file) => {
    try {
      setError('');
      setUploading(true);
      
      validateFile(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageUpload(file);
        setUploading(false);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        이미지 업로드
      </Typography>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {!preview ? (
        <Paper
          elevation={dragActive ? 8 : 1}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: dragActive ? 'primary.50' : 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
            }
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {uploading ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress size={40} />
              <Typography>업로드 중...</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h6">
                이미지를 여기에 드래그하거나 클릭하여 선택하세요
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG, WebP 형식 지원 (최대 10MB)
              </Typography>
              <Button
                variant="contained"
                startIcon={<Image />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick();
                }}
              >
                파일 선택
              </Button>
            </Box>
          )}
        </Paper>
      ) : (
        <Box>
          <Box
            component="img"
            src={preview}
            alt="업로드된 이미지"
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'contain',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              mb: 2
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setPreview(null);
              onImageUpload(null);
            }}
            fullWidth
          >
            다른 이미지 선택
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUploader; 