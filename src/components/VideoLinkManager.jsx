import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  VideoLibrary,
  Add,
  Delete,
  Edit,
  PlayArrow,
  Link
} from '@mui/icons-material';

const VideoLinkManager = ({ arMarker, onVideoLinksUpdate }) => {
  const [videoLinks, setVideoLinks] = useState([]);
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [videoType, setVideoType] = useState('youtube');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const videoTypes = [
    { value: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/watch?v=...' },
    { value: 'vimeo', label: 'Vimeo', placeholder: 'https://vimeo.com/...' },
    { value: 'direct', label: '직접 링크', placeholder: 'https://example.com/video.mp4' },
    { value: 'local', label: '로컬 파일', placeholder: 'video.mp4' }
  ];

  const validateVideoLink = (link, type) => {
    if (!link.trim()) return '링크를 입력해주세요.';

    switch (type) {
      case 'youtube':
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        if (!youtubeRegex.test(link)) {
          return '올바른 YouTube 링크를 입력해주세요.';
        }
        break;
      case 'vimeo':
        const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)/;
        if (!vimeoRegex.test(link)) {
          return '올바른 Vimeo 링크를 입력해주세요.';
        }
        break;
      case 'direct':
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(link)) {
          return '올바른 URL을 입력해주세요.';
        }
        break;
      case 'local':
        if (!link.trim()) {
          return '파일명을 입력해주세요.';
        }
        break;
    }
    return null;
  };

  const addVideoLink = () => {
    const error = validateVideoLink(newVideoLink, videoType);
    if (error) {
      alert(error);
      return;
    }

    const videoData = {
      id: Date.now(),
      title: newVideoTitle || `동영상 ${videoLinks.length + 1}`,
      link: newVideoLink,
      type: videoType,
      addedAt: new Date().toISOString()
    };

    const updatedLinks = [...videoLinks, videoData];
    setVideoLinks(updatedLinks);
    onVideoLinksUpdate(updatedLinks);

    // 폼 초기화
    setNewVideoLink('');
    setNewVideoTitle('');
    setVideoType('youtube');
    setDialogOpen(false);
  };

  const editVideoLink = (index) => {
    const video = videoLinks[index];
    setNewVideoTitle(video.title);
    setNewVideoLink(video.link);
    setVideoType(video.type);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const updateVideoLink = () => {
    const error = validateVideoLink(newVideoLink, videoType);
    if (error) {
      alert(error);
      return;
    }

    const updatedLinks = [...videoLinks];
    updatedLinks[editingIndex] = {
      ...updatedLinks[editingIndex],
      title: newVideoTitle,
      link: newVideoLink,
      type: videoType
    };

    setVideoLinks(updatedLinks);
    onVideoLinksUpdate(updatedLinks);

    // 폼 초기화
    setNewVideoLink('');
    setNewVideoTitle('');
    setVideoType('youtube');
    setEditingIndex(-1);
    setDialogOpen(false);
  };

  const deleteVideoLink = (index) => {
    const updatedLinks = videoLinks.filter((_, i) => i !== index);
    setVideoLinks(updatedLinks);
    onVideoLinksUpdate(updatedLinks);
  };

  const generateARCode = () => {
    if (videoLinks.length === 0) {
      alert('동영상 링크를 먼저 추가해주세요.');
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
</head>
<body style="margin: 0; overflow: hidden;">
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

  const getVideoTypeLabel = (type) => {
    const found = videoTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const getVideoTypeColor = (type) => {
    switch (type) {
      case 'youtube': return 'error';
      case 'vimeo': return 'primary';
      case 'direct': return 'success';
      case 'local': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
        동영상 링크 관리
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  연결된 동영상 목록
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setDialogOpen(true)}
                >
                  동영상 추가
                </Button>
              </Box>

              {videoLinks.length === 0 ? (
                <Alert severity="info">
                  연결된 동영상이 없습니다. "동영상 추가" 버튼을 클릭하여 동영상을 추가하세요.
                </Alert>
              ) : (
                <List>
                  {videoLinks.map((video, index) => (
                    <ListItem key={video.id} divider>
                      <ListItemText
                        primary={video.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {video.link}
                            </Typography>
                            <Chip
                              label={getVideoTypeLabel(video.type)}
                              color={getVideoTypeColor(video.type)}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => editVideoLink(index)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => deleteVideoLink(index)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                AR 코드 생성
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                연결된 동영상으로 AR 재생 코드를 생성할 수 있습니다.
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Link />}
                onClick={generateARCode}
                disabled={videoLinks.length === 0}
                sx={{ mb: 2 }}
              >
                AR 재생 코드 다운로드
              </Button>

              <Alert severity="info">
                <Typography variant="body2">
                  다운로드한 HTML 파일을 웹 서버에 업로드하고, AR 마커와 함께 사용하세요.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 동영상 추가/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingIndex >= 0 ? '동영상 편집' : '동영상 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="동영상 제목"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="동영상 제목을 입력하세요"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>동영상 타입</InputLabel>
              <Select
                value={videoType}
                label="동영상 타입"
                onChange={(e) => setVideoType(e.target.value)}
              >
                {videoTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="동영상 링크"
              value={newVideoLink}
              onChange={(e) => setNewVideoLink(e.target.value)}
              placeholder={videoTypes.find(t => t.value === videoType)?.placeholder}
              helperText="동영상 링크를 입력하세요"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button
            onClick={editingIndex >= 0 ? updateVideoLink : addVideoLink}
            variant="contained"
          >
            {editingIndex >= 0 ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoLinkManager; 