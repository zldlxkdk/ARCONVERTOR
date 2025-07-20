import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip
} from '@mui/material';
import {
  Download,
  Image,
  QrCode,
  Description,
  CheckCircle,
  Info,
  VideoLibrary
} from '@mui/icons-material';

const DownloadManager = ({ processedImage, arMarker, videoLinks, processingStatus }) => {
  const downloadProcessedImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage.dataUrl;
    link.download = `processed-image-${Date.now()}.${processedImage.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadARMarker = () => {
    if (!arMarker) return;

    const link = document.createElement('a');
    link.href = arMarker.dataUrl;
    link.download = `ar-marker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    if (processedImage) {
      downloadProcessedImage();
    }
    if (arMarker) {
      setTimeout(() => downloadARMarker(), 100);
    }
  };

  const generateUsageGuide = () => {
    const guide = `
# AR 이미지 및 동영상 사용 가이드

## 1. 처리된 이미지 사용법
- 처리된 이미지는 AR 인식에 최적화되어 있습니다
- 다양한 AR 프레임워크에서 사용 가능합니다
- 권장 크기: ${processedImage?.size || '512'}x${processedImage?.size || '512'}px

## 2. AR 마커 사용법
- AR 마커는 AR.js, Vuforia 등에서 사용 가능합니다
- 마커 품질: ${arMarker?.quality || 'N/A'}%
- 마커 크기: ${arMarker?.size || '512'}x${arMarker?.size || '512'}px

## 3. 연결된 동영상 정보
${videoLinks.length > 0 ? videoLinks.map((video, index) => `
### 동영상 ${index + 1}: ${video.title}
- 타입: ${video.type}
- 링크: ${video.link}
- 추가일: ${new Date(video.addedAt).toLocaleDateString()}
`).join('') : '- 연결된 동영상이 없습니다.'}

## 4. AR 프레임워크별 설정

### AR.js (동영상 재생)
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>AR Video Player</title>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.min.js"></script>
</head>
<body style="margin: 0; overflow: hidden;">
    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-marker preset="custom" url="ar-marker.png">
            <a-video 
                src="${videoLinks.length > 0 ? videoLinks[0].link : 'your-video-url.mp4'}"
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
</body>
</html>
\`\`\`

### Vuforia
- Vuforia Target Manager에서 마커 이미지 업로드
- 데이터베이스에 추가하여 사용
- 동영상은 별도로 처리하여 연결

### Unity AR Foundation
- AR 마커를 이미지 타겟으로 설정
- 동영상 플레이어 컴포넌트 연결
- 마커 인식 시 동영상 재생 트리거 설정

## 5. 동영상 타입별 처리 방법

### YouTube 동영상
- YouTube IFrame API 사용
- 자동 재생 정책 고려
- 모바일 브라우저 호환성 확인

### Vimeo 동영상
- Vimeo Player API 사용
- 프라이버시 설정 확인
- 임베드 권한 확인

### 직접 링크 동영상
- CORS 정책 확인
- 적절한 형식 (MP4, WebM) 사용
- 서버 설정 최적화

### 로컬 파일
- 웹 서버에 동영상 파일 업로드
- 상대 경로 사용
- 파일 크기 최적화

## 6. 최적화 팁
- 마커는 평평한 표면에 인쇄하여 사용하세요
- 조명이 충분한 환경에서 사용하세요
- 마커가 손상되지 않도록 보관하세요
- 동영상은 적절한 해상도와 압축률로 최적화하세요
- 네트워크 환경을 고려하여 동영상 품질을 조정하세요

## 7. 문제 해결
- 마커 인식이 안 될 때: 조명 개선, 마커 크기 조정
- 동영상이 재생되지 않을 때: 링크 유효성 확인, 브라우저 정책 확인
- 성능 문제: 동영상 품질 조정, 캐싱 설정 확인
    `;

    const blob = new Blob([guide], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ar-usage-guide.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCompletePackage = () => {
    // 모든 파일을 포함한 ZIP 파일 생성 (시뮬레이션)
    const packageInfo = `
# AR 패키지 정보

생성일: ${new Date().toLocaleString()}

## 포함 파일
1. 처리된 이미지: processed-image.${processedImage?.format || 'png'}
2. AR 마커: ar-marker.png
3. 동영상 링크: ${videoLinks.length}개
4. 사용 가이드: ar-usage-guide.md

## 동영상 목록
${videoLinks.map((video, index) => `${index + 1}. ${video.title} (${video.type})`).join('\n')}

## 설치 방법
1. 모든 파일을 웹 서버에 업로드
2. ar-marker.png를 인쇄
3. HTML 파일을 브라우저에서 열기
4. 카메라로 마커를 인식하여 동영상 재생
    `;

    const blob = new Blob([packageInfo], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ar-package-info.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isCompleted = processingStatus === 'completed';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        다운로드 관리
      </Typography>

      {isCompleted ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                  처리된 이미지
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    형식: {processedImage?.format?.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    크기: {processedImage?.size}x{processedImage?.size}px
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    품질: {processedImage?.quality}%
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Download />}
                  onClick={downloadProcessedImage}
                  sx={{ mb: 2 }}
                >
                  처리된 이미지 다운로드
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <QrCode sx={{ mr: 1, verticalAlign: 'middle' }} />
                  AR 마커
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    형식: {arMarker?.format?.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    크기: {arMarker?.size}x{arMarker?.size}px
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    품질: {arMarker?.quality}%
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Download />}
                  onClick={downloadARMarker}
                  sx={{ mb: 2 }}
                >
                  AR 마커 다운로드
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
                  동영상 링크
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    연결된 동영상: {videoLinks.length}개
                  </Typography>
                  {videoLinks.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {videoLinks.slice(0, 2).map((video, index) => (
                        <Chip
                          key={video.id}
                          label={video.title}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {videoLinks.length > 2 && (
                        <Chip
                          label={`+${videoLinks.length - 2}개 더`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Download />}
                  onClick={generateCompletePackage}
                  sx={{ mb: 2 }}
                >
                  패키지 정보 다운로드
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  일괄 다운로드 및 사용 가이드
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Download />}
                      onClick={downloadAll}
                      sx={{ mb: 2 }}
                    >
                      모든 파일 다운로드
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Description />}
                      onClick={generateUsageGuide}
                      sx={{ mb: 2 }}
                    >
                      사용 가이드 다운로드
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<VideoLibrary />}
                      onClick={generateCompletePackage}
                      sx={{ mb: 2 }}
                    >
                      완전한 패키지 생성
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  사용 방법:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary="처리된 이미지를 AR 애플리케이션에서 타겟으로 사용" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary="AR 마커를 인쇄하여 실제 환경에서 AR 콘텐츠 표시" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary="연결된 동영상이 마커 인식 시 자동 재생" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary="AR.js, Vuforia, Unity AR Foundation 등에서 호환" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Info color="info" />
              <Typography>
                {processingStatus === 'idle' && '이미지를 업로드하고 처리하면 다운로드 옵션이 나타납니다.'}
                {processingStatus === 'uploaded' && '이미지 처리를 완료하면 다운로드할 수 있습니다.'}
                {processingStatus === 'processed' && 'AR 마커 생성이 완료되면 다운로드할 수 있습니다.'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {isCompleted && (
        <Alert severity="success" sx={{ mt: 2 }}>
          모든 처리가 완료되었습니다! 다운로드한 파일을 AR 애플리케이션에서 사용하세요.
          {videoLinks.length > 0 && ` ${videoLinks.length}개의 동영상이 연결되어 있습니다.`}
        </Alert>
      )}
    </Box>
  );
};

export default DownloadManager; 