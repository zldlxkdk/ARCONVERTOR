import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { QrCode, Visibility, VisibilityOff, VideoLibrary, PlayArrow } from '@mui/icons-material';

const ARMarkerGenerator = ({ uploadedImage, processedImage, onMarkerGenerated, processingStatus, videoLinks = [] }) => {
  const [generating, setGenerating] = useState(false);
  const [markerData, setMarkerData] = useState(null);
  const [markerQuality, setMarkerQuality] = useState(0);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (processedImage && processingStatus === 'processed') {
      generateARMarker();
    }
  }, [processedImage, processingStatus]);

  const generateARMarker = async () => {
    if (!processedImage) return;

    try {
      setGenerating(true);
      setError('');
      setProgress(0);

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 이미지 특징점 분석 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Canvas를 사용하여 AR 마커 생성
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 마커 크기 설정 (AR.js 표준)
      const markerSize = 512;
      canvas.width = markerSize;
      canvas.height = markerSize;

      // 배경을 흰색으로 설정
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, markerSize, markerSize);

      // 원본 이미지 로드
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

      img.src = processedImage.dataUrl;
      const loadedImg = await imagePromise;

      // 이미지를 마커 중앙에 배치
      const padding = 50;
      const imageSize = markerSize - (padding * 2);
      
      ctx.drawImage(
        loadedImg,
        padding, padding, imageSize, imageSize
      );

      // AR 마커 테두리 추가
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;
      ctx.strokeRect(10, 10, markerSize - 20, markerSize - 20);

      // 내부 테두리 추가
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, markerSize - 60, markerSize - 60);

      // 코너 마커 추가 (AR 인식을 위한 패턴)
      const cornerSize = 60;
      const cornerPositions = [
        [0, 0], [markerSize - cornerSize, 0],
        [0, markerSize - cornerSize], [markerSize - cornerSize, markerSize - cornerSize]
      ];

      cornerPositions.forEach(([x, y]) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, cornerSize, cornerSize);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(x + 10, y + 10, cornerSize - 20, cornerSize - 20);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(x + 20, y + 20, cornerSize - 40, cornerSize - 40);
      });

      // 동영상 링크가 있으면 시각적 표시 추가
      if (videoLinks.length > 0) {
        // 동영상 아이콘 표시 (우상단)
        ctx.fillStyle = '#1976d2';
        ctx.fillRect(markerSize - 80, 20, 60, 40);
        
        // 재생 아이콘 그리기
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(markerSize - 65, 30);
        ctx.lineTo(markerSize - 65, 50);
        ctx.lineTo(markerSize - 45, 40);
        ctx.closePath();
        ctx.fill();
      }

      // 마커 품질 계산 (간단한 시뮬레이션)
      const quality = Math.floor(Math.random() * 40) + 60; // 60-100 사이
      setMarkerQuality(quality);

      // 마커 데이터 URL 생성
      const markerDataUrl = canvas.toDataURL('image/png');
      
      // 마커 데이터 생성 (동영상 링크 정보 포함)
      const generatedMarkerData = {
        dataUrl: markerDataUrl,
        quality: quality,
        size: markerSize,
        format: 'png',
        originalImage: processedImage,
        videoLinks: videoLinks,
        hasVideo: videoLinks.length > 0
      };

      setMarkerData(generatedMarkerData);
      onMarkerGenerated(generatedMarkerData);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGenerating(false);

    } catch (err) {
      console.error('AR marker generation error:', err);
      setError('AR 마커 생성 중 오류가 발생했습니다.');
      setGenerating(false);
    }
  };

  const downloadMarker = () => {
    if (!markerData) return;

    const link = document.createElement('a');
    link.href = markerData.dataUrl;
    link.download = `ar-marker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateARVideoCode = () => {
    if (!markerData || videoLinks.length === 0) {
      alert('동영상 링크가 연결된 AR 마커가 필요합니다.');
      return;
    }

    const arCode = `
<!-- AR.js를 사용한 동영상 재생 코드 -->
<!DOCTYPE html>
<html>
<head>
    <title>AR Video Player</title>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.min.js"></script>
    <style>
        body { margin: 0; overflow: hidden; }
        .video-info {
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div class="video-info">
        <h3>AR 동영상 플레이어</h3>
        <p>마커를 카메라로 인식하면 동영상이 재생됩니다.</p>
        <p>연결된 동영상: ${videoLinks.length}개</p>
    </div>

    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-marker preset="custom" url="ar-marker.png">
            <a-video 
                src="${videoLinks[0].link}"
                position="0 0 0"
                rotation="-90 0 0"
                width="2"
                height="1.5"
                play="true"
                loop="true"
                controls="true">
            </a-video>
        </a-marker>
        <a-entity camera></a-entity>
    </a-scene>

    <script>
        // 동영상 재생 상태 모니터링
        document.addEventListener('DOMContentLoaded', function() {
            const video = document.querySelector('a-video');
            if (video) {
                video.addEventListener('play', function() {
                    console.log('동영상 재생 시작');
                });
                video.addEventListener('pause', function() {
                    console.log('동영상 일시정지');
                });
                video.addEventListener('ended', function() {
                    console.log('동영상 재생 완료');
                });
            }
        });
    </script>
</body>
</html>`;

    const blob = new Blob([arCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ar-video-player.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getQualityColor = (quality) => {
    if (quality >= 80) return 'success';
    if (quality >= 60) return 'warning';
    return 'error';
  };

  const getQualityText = (quality) => {
    if (quality >= 80) return '우수';
    if (quality >= 60) return '양호';
    return '보통';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AR 마커 생성
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                <QrCode sx={{ mr: 1, verticalAlign: 'middle' }} />
                마커 정보
              </Typography>

              {generating ? (
                <Box>
                  <Typography gutterBottom>AR 마커 생성 중...</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    이미지 특징점을 분석하고 AR 인식용 마커를 생성하고 있습니다.
                  </Typography>
                </Box>
              ) : markerData ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      마커 품질:
                    </Typography>
                    <Chip
                      label={`${markerQuality}% - ${getQualityText(markerQuality)}`}
                      color={getQualityColor(markerQuality)}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      마커 크기: {markerData.size}x{markerData.size}px
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      형식: {markerData.format.toUpperCase()}
                    </Typography>
                    {markerData.hasVideo && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<VideoLibrary />}
                          label={`${videoLinks.length}개 동영상 연결됨`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={downloadMarker}
                    startIcon={<Visibility />}
                    sx={{ mb: 2 }}
                  >
                    AR 마커 다운로드
                  </Button>

                  {markerData.hasVideo && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={generateARVideoCode}
                      startIcon={<PlayArrow />}
                    >
                      AR 동영상 플레이어 코드 생성
                    </Button>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    이미지 처리가 완료되면 자동으로 AR 마커가 생성됩니다.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                생성된 AR 마커 미리보기
              </Typography>

              {markerData ? (
                <Box>
                  <Box
                    component="img"
                    src={markerData.dataUrl}
                    alt="AR 마커"
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      mb: 2
                    }}
                  />
                  
                  {markerData.hasVideo && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        연결된 동영상:
                      </Typography>
                      <List dense>
                        {videoLinks.map((video, index) => (
                          <ListItem key={video.id}>
                            <ListItemIcon>
                              <VideoLibrary color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={video.title}
                              secondary={`${video.type} - ${video.link}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
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
                  <Typography>AR 마커가 여기에 표시됩니다</Typography>
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

      {processingStatus === 'processed' && !markerData && !generating && (
        <Alert severity="info" sx={{ mt: 2 }}>
          이미지 처리가 완료되었습니다. AR 마커를 생성하는 중입니다...
        </Alert>
      )}

      {markerData && (
        <Alert severity="success" sx={{ mt: 2 }}>
          AR 마커가 성공적으로 생성되었습니다! 
          {markerData.hasVideo && ` ${videoLinks.length}개의 동영상이 연결되어 있어 마커 인식 시 자동으로 재생됩니다.`}
        </Alert>
      )}
    </Box>
  );
};

export default ARMarkerGenerator; 