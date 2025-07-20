# 📸 WebAR 포토 오버레이 시스템

MindAR.js와 A-Frame을 활용한 웹 기반 AR 이미지 인식 및 동영상 오버레이 시스템입니다.

## ✨ 주요 기능

- 📱 **웹 기반 AR**: 앱 설치 없이 모바일 브라우저에서 직접 실행
- 🎯 **이미지 인식**: 사진을 카메라로 비추면 자동 인식
- 🎬 **동영상 오버레이**: 인식된 사진 위에 정확히 동영상 재생
- 🔊 **오디오 지원**: 터치로 음소거/해제 가능
- ⚙️ **동적 설정**: JSON 파일로 사진-동영상 매핑 관리

## 🚀 빠른 시작

### 1. 프로젝트 구조
```
ARCONVERTOR/
├── index.html                    # 메인 WebAR 페이지
├── assets/
│   ├── images/                   # 타겟 이미지들
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── photo3.jpg
│   ├── videos/                   # 대응 동영상들
│   │   ├── video1.mp4
│   │   ├── video2.mp4
│   │   └── video3.mp4
│   ├── targets.mind              # MindAR 타겟 파일
│   └── photo-video-mapping.json  # 매핑 설정
├── styles/
│   └── webaar-main.css          # WebAR 시스템 스타일
└── js/
    └── webaar-system.js         # WebAR 시스템 로직
```

### 2. 설치 및 실행

#### HTTP 서버 실행 (필수)
WebAR은 HTTPS 또는 localhost에서만 작동합니다.

**Python 사용:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Node.js 사용:**
```bash
npx http-server -p 8000
```

**Live Server (VS Code):**
- VS Code에서 Live Server 확장 설치
- index.html 우클릭 → "Open with Live Server"

#### 브라우저 접속
```
http://localhost:8000
```

### 3. MindAR 타겟 파일 생성

#### 설치
```bash
npm install -g mind-ar-tools
```

#### 타겟 파일 생성
```bash
mindar create-image-target --input ./assets/images --output ./assets/targets.mind
```

이 명령어는 `assets/images` 폴더의 모든 이미지를 분석하여 AR 인식용 `.mind` 파일을 생성합니다.

## ⚙️ 설정 방법

### 사진-동영상 매핑 설정

`assets/photo-video-mapping.json` 파일을 편집하여 매핑을 관리합니다:

```json
{
  "photoVideoMapping": [
    {
      "id": "photo1",
      "targetIndex": 0,
      "photoPath": "assets/images/photo1.jpg",
      "videoPath": "assets/videos/video1.mp4",
      "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "videoSettings": {
        "autoplay": true,
        "muted": true,
        "loop": true,
        "playsinline": true,
        "position": { "x": 0, "y": 0, "z": 0 },
        "rotation": { "x": -90, "y": 0, "z": 0 },
        "scale": { "x": 1, "y": 0.5625, "z": 1 },
        "width": 1,
        "height": 0.5625
      }
    }
  ]
}
```

### 매핑 속성 설명

- **id**: 고유 식별자
- **targetIndex**: MindAR 타겟 인덱스 (이미지 순서)
- **photoPath**: 타겟 이미지 경로
- **videoPath**: 로컬 동영상 파일 경로 (선택)
- **youtubeUrl**: YouTube 동영상 URL (videoPath가 없을 때 사용)
- **videoSettings**: AR 오버레이 설정
  - **position**: 3D 위치 (x, y, z)
  - **rotation**: 회전값 (x, y, z)
  - **scale**: 크기 (x, y, z)
  - **width/height**: 비디오 크기

## 📱 사용 방법

### 1. 웹사이트 접속
- 모바일 브라우저에서 웹사이트 접속
- 카메라 권한 허용

### 2. 사진 인식
- 등록된 사진을 카메라에 비춤
- 자동으로 이미지 인식 시작

### 3. AR 동영상 재생
- 인식된 사진 위에 동영상 자동 재생
- 터치로 음소거/해제 가능
- 전체화면 모드 지원

### 4. 관리자 패널 (개발용)
- 우하단 ⚙️ 버튼 클릭
- 매핑 상태 확인 및 테스트

## 🔧 개발 가이드

### 새로운 사진-동영상 추가

1. **이미지 추가**
   ```bash
   # assets/images/ 폴더에 새 이미지 추가
   cp new-photo.jpg assets/images/
   ```

2. **동영상 추가**
   ```bash
   # assets/videos/ 폴더에 새 동영상 추가
   cp new-video.mp4 assets/videos/
   ```

3. **매핑 설정 업데이트**
   ```json
   // assets/photo-video-mapping.json에 새 매핑 추가
   {
     "id": "new-photo",
     "targetIndex": 3,
     "photoPath": "assets/images/new-photo.jpg",
     "videoPath": "assets/videos/new-video.mp4",
     "videoSettings": { /* 설정값 */ }
   }
   ```

4. **타겟 파일 재생성**
   ```bash
   mindar create-image-target --input ./assets/images --output ./assets/targets.mind
   ```

### 커스터마이징

#### CSS 스타일 수정
`styles/webaar-main.css` 파일을 편집하여 UI 커스터마이징

#### JavaScript 로직 수정
`js/webaar-system.js` 파일을 편집하여 동작 로직 변경

#### 동영상 설정 조정
`photo-video-mapping.json`의 `videoSettings` 객체로 위치/크기 조정

## 📊 브라우저 지원

### 지원 브라우저
- ✅ Chrome (Android/Desktop)
- ✅ Safari (iOS/macOS)
- ✅ Firefox (Android/Desktop)
- ✅ Edge (Windows/Android)

### 요구사항
- **HTTPS** 또는 **localhost** 환경
- **카메라 권한** 허용
- **WebRTC** 지원
- **WebGL** 지원

## 🚨 문제 해결

### 카메라 접근 오류
```
해결: HTTPS 환경에서 실행하거나 localhost 사용
- HTTP에서는 카메라 접근 불가
- 브라우저 설정에서 카메라 권한 확인
```

### 이미지 인식 실패
```
해결: 타겟 이미지 품질 확인
- 고해상도, 명확한 대비의 이미지 사용
- 복잡한 패턴이나 텍스트가 포함된 이미지 권장
- 단색 배경이나 흐린 이미지 피하기
```

### 동영상 재생 실패
```
해결: 동영상 포맷 및 설정 확인
- MP4 H.264 코덱 사용 권장
- 파일 경로 및 권한 확인
- 브라우저 자동재생 정책 확인
```

### 성능 최적화
```
권장사항:
- 이미지 크기: 최대 1024px
- 동영상 해상도: 720p 이하
- 동영상 길이: 30초 이내
- 타겟 이미지 수: 5개 이하
```

## 🔄 향후 개발 계획

### 단기 목표
- [ ] 동영상 업로드 UI 추가
- [ ] 실시간 타겟 이미지 등록
- [ ] PWA 지원 (오프라인 사용)

### 중기 목표
- [ ] 스테가노그래피 마커 지원
- [ ] Firebase 연동 (클라우드 저장)
- [ ] 다중 타겟 동시 인식

### 장기 목표
- [ ] 자연 이미지 추적 (마커 없이)
- [ ] 3D 모델 오버레이
- [ ] 공간 앵커링

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 질문이 있으시면:
- GitHub Issues에 문의
- 개발자 콘솔 로그 확인
- 관리자 패널에서 시스템 상태 확인

---

**⚡ 빠른 테스트**: `index.html`을 웹서버에서 열고 스마트폰으로 접속하여 카메라를 종이에 인쇄된 이미지에 비춰보세요! 