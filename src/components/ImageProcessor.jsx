import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Settings, AutoFixHigh } from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';

const ImageProcessor = ({ uploadedImage, onProcess, processingStatus }) => {
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputSize, setOutputSize] = useState(512);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // TensorFlow.js 초기화
    tf.ready().then(() => {
      console.log('TensorFlow.js initialized');
    });
  }, []);

  const processImage = async () => {
    if (!uploadedImage) return;

    try {
      setProcessing(true);
      setError('');

      // 이미지를 텐서로 변환
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(uploadedImage);

      const loadedImg = await imagePromise;

      // Canvas 생성 및 이미지 처리
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 출력 크기 설정
      canvas.width = outputSize;
      canvas.height = outputSize;

      // 이미지 품질 향상을 위한 처리
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 이미지를 정사각형으로 리사이즈
      const size = Math.min(loadedImg.width, loadedImg.height);
      const offsetX = (loadedImg.width - size) / 2;
      const offsetY = (loadedImg.height - size) / 2;

      ctx.drawImage(
        loadedImg,
        offsetX, offsetY, size, size,
        0, 0, outputSize, outputSize
      );

      // 이미지 향상 처리 (간단한 필터 적용)
      const imageData = ctx.getImageData(0, 0, outputSize, outputSize);
      const data = imageData.data;

      // 대비 및 밝기 조정
      const contrast = 1.2;
      const brightness = 10;
      
      for (let i = 0; i < data.length; i += 4) {
        // 대비 조정
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128 + brightness));
      }

      ctx.putImageData(imageData, 0, 0);

      // 처리된 이미지를 데이터 URL로 변환
      const processedDataUrl = canvas.toDataURL(`image/${outputFormat}`, quality / 100);
      setProcessedPreview(processedDataUrl);

      // 처리된 이미지 데이터 생성
      const processedData = {
        dataUrl: processedDataUrl,
        format: outputFormat,
        size: outputSize,
        quality: quality,
        originalFile: uploadedImage
      };

      onProcess(processedData);
      setProcessing(false);

    } catch (err) {
      console.error('Image processing error:', err);
      setError('이미지 처리 중 오류가 발생했습니다.');
      setProcessing(false);
    }
  };

  const resetProcessing = () => {
    setProcessedPreview(null);
    onProcess(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        이미지 처리 설정
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                처리 옵션
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>품질 ({quality}%)</Typography>
                <Slider
                  value={quality}
                  onChange={(e, newValue) => setQuality(newValue)}
                  min={10}
                  max={100}
                  marks={[
                    { value: 10, label: '10%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>출력 형식</InputLabel>
                  <Select
                    value={outputFormat}
                    label="출력 형식"
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="jpeg">JPEG</MenuItem>
                    <MenuItem value="webp">WebP</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>출력 크기</InputLabel>
                  <Select
                    value={outputSize}
                    label="출력 크기"
                    onChange={(e) => setOutputSize(e.target.value)}
                  >
                    <MenuItem value={256}>256x256</MenuItem>
                    <MenuItem value={512}>512x512</MenuItem>
                    <MenuItem value={1024}>1024x1024</MenuItem>
                    <MenuItem value={2048}>2048x2048</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={processing ? <CircularProgress size={20} /> : <AutoFixHigh />}
                onClick={processImage}
                disabled={!uploadedImage || processing}
                sx={{ mb: 2 }}
              >
                {processing ? '처리 중...' : '이미지 처리'}
              </Button>

              {processedPreview && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={resetProcessing}
                >
                  다시 처리
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                처리 결과 미리보기
              </Typography>

              {processedPreview ? (
                <Box
                  component="img"
                  src={processedPreview}
                  alt="처리된 이미지"
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.300'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <Typography>처리된 이미지가 여기에 표시됩니다</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {processingStatus === 'uploaded' && !processedPreview && (
        <Alert severity="info" sx={{ mt: 2 }}>
          이미지를 업로드했습니다. 처리 옵션을 설정하고 "이미지 처리" 버튼을 클릭하세요.
        </Alert>
      )}
    </Box>
  );
};

export default ImageProcessor; 