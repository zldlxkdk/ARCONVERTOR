/**
 * WebAR 포토 오버레이 시스템
 * MindAR.js + A-Frame 기반 이미지 인식 AR 시스템
 */

class WebARPhotoOverlay {
    constructor() {
        this.photoMappings = [];
        this.currentPlayingVideo = null;
        this.arScene = null;
        this.isInitialized = false;
        this.isMuted = true;
        
        // DOM 요소들
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            scanGuide: document.getElementById('scan-guide'),
            videoControls: document.getElementById('video-controls'),
            statusDisplay: document.getElementById('status-display'),
            statusText: document.getElementById('status-text'),
            muteBtn: document.getElementById('muteBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            closeBtn: document.getElementById('closeBtn'),
            adminPanel: document.getElementById('admin-panel'),
            mappingList: document.getElementById('mapping-list')
        };
        
        this.init();
    }
    
    async init() {
        console.log('🚀 WebAR 포토 오버레이 시스템 초기화 시작');
        
        try {
            // 1. 사진-동영상 매핑 로드
            await this.loadPhotoMappings();
            
            // 2. A-Frame 씬 대기
            await this.waitForAFrameReady();
            
            // 3. AR 시스템 초기화
            await this.initializeARSystem();
            
            // 4. 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 5. UI 업데이트
            this.updateUI('ready');
            
            this.isInitialized = true;
            console.log('✅ WebAR 시스템 초기화 완료');
            
        } catch (error) {
            console.error('❌ WebAR 시스템 초기화 실패:', error);
            this.updateUI('error', error.message);
        }
    }
    
    async loadPhotoMappings() {
        try {
            console.log('📋 사진-동영상 매핑 로드 중...');
            
            const response = await fetch('./assets/photo-video-mapping.json');
            if (!response.ok) {
                throw new Error(`매핑 파일 로드 실패: ${response.status}`);
            }
            
            const data = await response.json();
            this.photoMappings = data.photoVideoMapping || [];
            this.arSettings = data.arSettings || {};
            this.videoPresets = data.videoPresets || {};
            
            console.log(`✅ ${this.photoMappings.length}개의 사진-동영상 매핑 로드 완료`);
            this.updateMappingList();
            
        } catch (error) {
            console.warn('⚠️ 매핑 파일 로드 실패, 기본 설정 사용:', error);
            this.loadDefaultMappings();
        }
    }
    
    loadDefaultMappings() {
        // 기본 매핑 설정 (매핑 파일이 없을 때 사용)
        this.photoMappings = [
            {
                id: 'default1',
                targetIndex: 0,
                youtubeUrl: 'https://www.youtube.com/watch?v=MX_UceuxveA',
                videoSettings: {
                    autoplay: true,
                    muted: true,
                    loop: true,
                    playsinline: true,
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: -90, y: 0, z: 0 },
                    scale: { x: 1, y: 0.5625, z: 1 },
                    width: 1,
                    height: 0.5625
                }
            }
        ];
        
        this.arSettings = {
            targetImageSrc: './assets/targets.mind',
            cameraFacing: 'environment'
        };
        
        console.log('📋 기본 매핑 설정 로드 완료');
    }
    
    async waitForAFrameReady() {
        return new Promise((resolve) => {
            if (document.querySelector('a-scene').hasLoaded) {
                resolve();
            } else {
                document.querySelector('a-scene').addEventListener('loaded', resolve);
            }
        });
    }
    
    async initializeARSystem() {
        console.log('🎯 AR 시스템 초기화 중...');
        
        this.arScene = document.querySelector('a-scene');
        const assets = this.arScene.querySelector('a-assets');
        
        // 각 매핑에 대해 AR 타겟과 비디오 요소 생성
        this.photoMappings.forEach((mapping, index) => {
            this.createARTarget(mapping, assets);
        });
        
        // MindAR 이벤트 리스너 설정
        this.setupMindAREvents();
        
        console.log('✅ AR 시스템 초기화 완료');
    }
    
    createARTarget(mapping, assets) {
        const { id, targetIndex, videoSettings } = mapping;
        
        // 비디오 에셋 생성
        let videoElement;
        
        if (mapping.videoPath) {
            // 로컬 비디오 파일 사용
            videoElement = document.createElement('video');
            videoElement.id = `video-${id}`;
            videoElement.src = mapping.videoPath;
            videoElement.setAttribute('autoplay', 'false');
            videoElement.setAttribute('muted', 'true');
            videoElement.setAttribute('loop', 'true');
            videoElement.setAttribute('playsinline', 'true');
            videoElement.setAttribute('webkit-playsinline', 'true');
            videoElement.setAttribute('crossorigin', 'anonymous');
            assets.appendChild(videoElement);
        }
        
        // AR 타겟 엔티티 생성
        const target = document.createElement('a-entity');
        target.setAttribute('mindar-image-target', `targetIndex: ${targetIndex}`);
        target.id = `target-${id}`;
        
        if (mapping.videoPath && videoElement) {
            // 로컬 비디오 사용
            const video = document.createElement('a-video');
            video.id = `ar-video-${id}`;
            video.setAttribute('src', `#video-${id}`);
            video.setAttribute('position', `${videoSettings.position.x} ${videoSettings.position.y} ${videoSettings.position.z}`);
            video.setAttribute('rotation', `${videoSettings.rotation.x} ${videoSettings.rotation.y} ${videoSettings.rotation.z}`);
            video.setAttribute('width', videoSettings.width);
            video.setAttribute('height', videoSettings.height);
            video.setAttribute('material', 'shader: flat');
            target.appendChild(video);
        } else if (mapping.youtubeUrl) {
            // YouTube 임베드 사용 (대체 방법)
            const plane = document.createElement('a-plane');
            plane.id = `ar-plane-${id}`;
            plane.setAttribute('position', `${videoSettings.position.x} ${videoSettings.position.y} ${videoSettings.position.z}`);
            plane.setAttribute('rotation', `${videoSettings.rotation.x} ${videoSettings.rotation.y} ${videoSettings.rotation.z}`);
            plane.setAttribute('width', videoSettings.width);
            plane.setAttribute('height', videoSettings.height);
            plane.setAttribute('material', 'color: #000; transparent: true; opacity: 0.8');
            plane.setAttribute('text', `value: YouTube Video; align: center; color: white; position: 0 0 0.01`);
            target.appendChild(plane);
        }
        
        this.arScene.appendChild(target);
        
        console.log(`📹 AR 타겟 생성 완료: ${id} (타겟 인덱스: ${targetIndex})`);
    }
    
    setupMindAREvents() {
        // 타겟 발견 이벤트
        this.arScene.addEventListener('targetFound', (event) => {
            const targetIndex = event.detail.targetIndex;
            const mapping = this.photoMappings.find(m => m.targetIndex === targetIndex);
            
            if (mapping) {
                console.log(`🎯 타겟 발견: ${mapping.id} (인덱스: ${targetIndex})`);
                this.onTargetFound(mapping);
            }
        });
        
        // 타겟 손실 이벤트
        this.arScene.addEventListener('targetLost', (event) => {
            const targetIndex = event.detail.targetIndex;
            const mapping = this.photoMappings.find(m => m.targetIndex === targetIndex);
            
            if (mapping) {
                console.log(`📵 타겟 손실: ${mapping.id} (인덱스: ${targetIndex})`);
                this.onTargetLost(mapping);
            }
        });
    }
    
    onTargetFound(mapping) {
        this.updateUI('targetFound', `${mapping.id} 감지됨`);
        
        // 다른 비디오 정지
        this.stopAllVideos();
        
        // 해당 비디오 재생
        this.playVideo(mapping);
        
        // 비디오 컨트롤 표시
        this.elements.videoControls.style.display = 'block';
    }
    
    onTargetLost(mapping) {
        this.updateUI('targetLost', '타겟을 찾는 중...');
        
        // 비디오 일시정지 (선택적)
        // this.pauseVideo(mapping);
        
        // 비디오 컨트롤 숨기기
        this.elements.videoControls.style.display = 'none';
    }
    
    playVideo(mapping) {
        if (mapping.videoPath) {
            // 로컬 비디오 재생
            const videoElement = document.getElementById(`video-${mapping.id}`);
            if (videoElement) {
                videoElement.currentTime = 0;
                videoElement.muted = this.isMuted;
                
                const playPromise = videoElement.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log(`▶️ 비디오 재생 시작: ${mapping.id}`);
                            this.currentPlayingVideo = mapping;
                        })
                        .catch(error => {
                            console.warn('비디오 재생 실패:', error);
                            this.showYouTubeAlternative(mapping);
                        });
                }
            }
        } else if (mapping.youtubeUrl) {
            // YouTube 비디오 처리
            this.showYouTubeAlternative(mapping);
        }
    }
    
    showYouTubeAlternative(mapping) {
        // YouTube 링크 열기 또는 iframe 표시
        const videoId = this.extractYouTubeVideoId(mapping.youtubeUrl);
        if (videoId) {
            // YouTube 플레이어 표시 (간단한 구현)
            const confirmOpen = confirm(`${mapping.id}의 YouTube 비디오를 새 탭에서 열까요?`);
            if (confirmOpen) {
                window.open(mapping.youtubeUrl, '_blank');
            }
        }
    }
    
    extractYouTubeVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    stopAllVideos() {
        this.photoMappings.forEach(mapping => {
            if (mapping.videoPath) {
                const videoElement = document.getElementById(`video-${mapping.id}`);
                if (videoElement && !videoElement.paused) {
                    videoElement.pause();
                }
            }
        });
        this.currentPlayingVideo = null;
    }
    
    pauseVideo(mapping) {
        if (mapping.videoPath) {
            const videoElement = document.getElementById(`video-${mapping.id}`);
            if (videoElement && !videoElement.paused) {
                videoElement.pause();
            }
        }
    }
    
    setupEventListeners() {
        // 음소거 토글
        this.elements.muteBtn.addEventListener('click', () => {
            this.toggleMute();
        });
        
        // 전체화면
        this.elements.fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // 닫기
        this.elements.closeBtn.addEventListener('click', () => {
            this.stopAllVideos();
            this.elements.videoControls.style.display = 'none';
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // 현재 재생 중인 비디오 음소거 상태 변경
        if (this.currentPlayingVideo && this.currentPlayingVideo.videoPath) {
            const videoElement = document.getElementById(`video-${this.currentPlayingVideo.id}`);
            if (videoElement) {
                videoElement.muted = this.isMuted;
            }
        }
        
        // 버튼 아이콘 업데이트
        this.elements.muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
        
        console.log(`🔊 음소거 ${this.isMuted ? '켜짐' : '꺼짐'}`);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('전체화면 모드 실패:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    updateUI(state, message = '') {
        switch (state) {
            case 'loading':
                this.elements.loadingScreen.style.display = 'flex';
                this.elements.scanGuide.style.display = 'none';
                this.elements.statusText.textContent = message || '로딩 중...';
                break;
                
            case 'ready':
                this.elements.loadingScreen.style.display = 'none';
                this.elements.scanGuide.style.display = 'block';
                this.elements.statusText.textContent = '사진을 카메라에 비춰주세요';
                break;
                
            case 'targetFound':
                this.elements.scanGuide.style.display = 'none';
                this.elements.statusText.textContent = message || '타겟 감지됨';
                break;
                
            case 'targetLost':
                this.elements.scanGuide.style.display = 'block';
                this.elements.statusText.textContent = message || '타겟을 찾는 중...';
                break;
                
            case 'error':
                this.elements.loadingScreen.style.display = 'none';
                this.elements.scanGuide.style.display = 'block';
                this.elements.statusText.textContent = `오류: ${message}`;
                break;
        }
    }
    
    updateMappingList() {
        if (this.elements.mappingList) {
            this.elements.mappingList.innerHTML = '';
            
            this.photoMappings.forEach((mapping, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${mapping.id}</strong> (타겟: ${mapping.targetIndex})<br>
                    📁 ${mapping.videoPath || '로컬 비디오 없음'}<br>
                    🔗 ${mapping.youtubeUrl || 'YouTube URL 없음'}
                `;
                this.elements.mappingList.appendChild(li);
            });
        }
    }
}

// 관리자 패널 함수들
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
}

function reloadPhotoMappings() {
    if (window.webARSystem) {
        window.webARSystem.loadPhotoMappings().then(() => {
            alert('매핑이 새로고침되었습니다.');
        });
    }
}

function testARSystem() {
    if (window.webARSystem) {
        console.log('🧪 AR 시스템 테스트');
        console.log('매핑 수:', window.webARSystem.photoMappings.length);
        console.log('초기화 상태:', window.webARSystem.isInitialized);
        alert('콘솔을 확인해주세요.');
    }
}

// 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM 로드 완료, WebAR 시스템 시작');
    window.webARSystem = new WebARPhotoOverlay();
});

// 모바일 최적화
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 서비스 워커는 선택적으로 등록 (PWA 기능)
        console.log('📱 모바일 브라우저 감지');
    });
}

// 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('🚨 전역 오류:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 처리되지 않은 Promise 거부:', event.reason);
}); 