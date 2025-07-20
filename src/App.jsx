import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Grid
} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import ARMarkerGenerator from './components/ARMarkerGenerator';
import ImageProcessor from './components/ImageProcessor';
import DownloadManager from './components/DownloadManager';
import VideoLinkManager from './components/VideoLinkManager';
import ARScanner from './components/ARScanner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [arMarker, setArMarker] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [videoLinks, setVideoLinks] = useState([]);

  const handleImageUpload = (imageFile) => {
    setUploadedImage(imageFile);
    setProcessedImage(null);
    setArMarker(null);
    setProcessingStatus('uploaded');
  };

  const handleImageProcess = (processedData) => {
    setProcessedImage(processedData);
    setProcessingStatus('processed');
  };

  const handleARMarkerGenerated = (markerData) => {
    setArMarker(markerData);
    setProcessingStatus('completed');
  };

  const handleVideoLinksUpdate = (links) => {
    setVideoLinks(links);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            AR 이미지 변환기
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            일반 사진을 AR 인식용으로 변환하고 동영상을 연결하세요
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <ImageUploader onImageUpload={handleImageUpload} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <ImageProcessor 
                uploadedImage={uploadedImage}
                onProcess={handleImageProcess}
                onARMarkerGenerated={handleARMarkerGenerated}
                processingStatus={processingStatus}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <ARMarkerGenerator 
                uploadedImage={uploadedImage}
                processedImage={processedImage}
                onMarkerGenerated={handleARMarkerGenerated}
                processingStatus={processingStatus}
                videoLinks={videoLinks}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <VideoLinkManager 
                arMarker={arMarker}
                onVideoLinksUpdate={handleVideoLinksUpdate}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <ARScanner 
                arMarker={arMarker}
                videoLinks={videoLinks}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <DownloadManager 
                processedImage={processedImage}
                arMarker={arMarker}
                videoLinks={videoLinks}
                processingStatus={processingStatus}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
