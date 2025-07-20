# 🛠️ mindAR 기반 AR 웹앱 프로젝트

WebAR 기반으로 사진을 인식하여 해당 위치에 동영상을 오버레이하는 완전한 솔루션입니다.

## 🎯 프로젝트 개요

- **목표**: 브라우저에서 카메라로 특정 이미지를 비추면 해당 이미지 위에 동영상이 AR로 재생
- **기술**: mindAR.js + A-Frame + WebRTC
- **지원**: 모바일 우선, iOS/Android 브라우저 지원
- **오디오**: 사용자 상호작용 후 소리 포함 재생

## 🚀 빠른 시작

### 1. 데모 체험
```bash
npm run test-mindar
```
브라우저에서 `http://localhost:8080/demo-mindar.html` 접속

### 2. 실제 AR 테스트 (타겟 파일 필요)
```bash
npm run test-mindar
```
브라우저에서 `http://localhost:8080/mindar-app.html` 접속

## 📁 프로젝트 구조

```
📦 ARCONVERTOR/
├── 📂 public/
│   ├── 📂 images/           # AR 타겟 이미지들
│   │   ├── 📄 photo1.jpg
│   │   ├── 📄 photo2.jpg
│   │   └── 📄 photo3.jpg
│   ├── 📂 videos/           # 연결될 비디오들
│   │   ├── 🎬 v1.mp4
│   │   ├── 🎬 v2.mp4
│   │   └── 🎬 v3.mp4
│   ├── 📂 targets/          # mindAR 타겟 파일
│   │   └── 📄 targets.mind
│   ├── 🌐 mindar-app.html   # 실제 AR 앱
│   ├── 🎮 demo-mindar.html  # 데모/테스트 버전
│   ├── 📋 TARGET_CREATION_GUIDE.md
│   └── 📋 SAMPLE_INFO.md
├── 📂 src/                  # React 기반 기존 도구들
└── 📄 README_MINDAR.md      # 이 파일
```

## 🛠️ 설치 및 설정

### 1. 의존성 설치
```bash
npm install
npm install -g @hiukim/mind-ar-js-tools
```

### 2. 이미지 타겟 준비
`public/images/` 폴더에 다음 파일들을 준비:
- `photo1.jpg` - 책표지, 포스터 등 (복합 패턴)
- `photo2.jpg` - 로고, 아이콘 등 (기하학적 패턴)  
- `photo3.jpg` - 사진, 일러스트 등 (자연 패턴)

**이미지 최적화 팁:**
- 해상도: 512x512 ~ 1024x1024px
- 파일 크기: 1-2MB 이하
- 고대비, 명확한 패턴
- 정면에서 촬영된 선명한 이미지

### 3. 비디오 파일 준비
`public/videos/` 폴더에 다음 파일들을 준비:
- `v1.mp4` - photo1.jpg와 연결될 비디오
- `v2.mp4` - photo2.jpg와 연결될 비디오
- `v3.mp4` - photo3.jpg와 연결될 비디오

**비디오 최적화:**
- 형식: MP4 (H.264 + AAC)
- 해상도: 1280x720 (720p)
- 길이: 5-15초 권장
- 파일 크기: 5-10MB 이하

### 4. AR 타겟 파일 생성
```bash
cd public
mind-ar-js-compiler --input-folder ./images --output-file ./targets/targets.mind
```

## 🎮 사용 방법

### A. 데모 모드 (타겟 파일 없이 테스트)
1. `npm run test-mindar` 실행
2. `http://localhost:8080/demo-mindar.html` 접속
3. "시작하기" 클릭하여 오디오 활성화
4. "타겟 1/2/3" 버튼으로 가상 AR 체험

### B. 실제 AR 모드 (타겟 파일 필요)
1. 이미지 및 비디오 파일 준비
2. 타겟 파일 생성 (`targets.mind`)
3. `http://localhost:8080/mindar-app.html` 접속
4. 카메라 권한 허용
5. 준비된 이미지를 카메라로 비춰서 AR 체험

## 📱 모바일 최적화

### iOS Safari
- HTTPS 환경에서만 작동
- `webkit-playsinline` 속성 자동 적용
- 사용자 터치 후 오디오 재생

### Android Chrome
- HTTPS 환경에서만 카메라 접근 가능
- 하드웨어 가속 자동 활성화
- WebGL 지원 필요

## 🔧 커스터마이징

### 더 많은 타겟 추가
1. **이미지 추가**: `public/images/photo4.jpg` 등
2. **비디오 추가**: `public/videos/v4.mp4` 등
3. **HTML 수정**: `mindar-app.html`에서 새 타겟 엔티티 추가
```html
<!-- Target 4 추가 예시 -->
<a-entity id="target4" mindar-image-target="targetIndex: 3">
    <a-video src="#vid4" width="1.5" height="1"></a-video>
</a-entity>
```
4. **타겟 재생성**: 새로운 `targets.mind` 파일 생성

### 비디오 효과 추가
```html
<!-- 3D 회전 효과 -->
<a-video 
    src="#vid1" 
    animation="property: rotation; to: 0 360 0; loop: true; dur: 10000">
</a-video>

<!-- 페이드 인/아웃 -->
<a-video 
    src="#vid1"
    animation__fadein="property: material.opacity; from: 0; to: 1; dur: 1000"
    animation__fadeout="property: material.opacity; from: 1; to: 0; dur: 1000; startEvents: targetLost">
</a-video>
```

### UI 테마 변경
CSS 변수를 수정하여 색상 테마 변경:
```css
:root {
    --primary-color: #ff6b35;    /* 메인 색상 */
    --secondary-color: #f7931e;  /* 보조 색상 */
    --accent-color: #764ba2;     /* 강조 색상 */
}
```

## 🌐 배포

### GitHub Pages
```bash
npm run build
npm run deploy
```

### 다른 호스팅 (Netlify, Vercel 등)
1. `public/` 폴더 전체를 업로드
2. HTTPS 설정 확인
3. MIME 타입 설정:
   - `.mind` → `application/octet-stream`
   - `.mp4` → `video/mp4`

## 🐛 문제 해결

### 타겟 인식이 안 될 때
- ✅ 조명 확인 (너무 어둡거나 밝지 않게)
- ✅ 이미지 품질 확인 (선명하고 손상되지 않게)
- ✅ 거리 조정 (20-50cm 권장)
- ✅ 각도 조정 (정면에서 인식)

### 비디오가 재생되지 않을 때
- ✅ HTTPS 환경 확인
- ✅ 브라우저 콘솔 오류 확인
- ✅ 비디오 형식 확인 (MP4 H.264)
- ✅ 파일 경로 및 CORS 설정 확인

### 성능이 느릴 때
- ✅ 이미지/비디오 파일 크기 최적화
- ✅ 타겟 개수 줄이기 (3개 이하 권장)
- ✅ 브라우저 하드웨어 가속 확인

### 카메라 접근 오류
- ✅ HTTPS 환경 필수
- ✅ 브라우저 권한 설정 확인
- ✅ 다른 앱에서 카메라 사용 중인지 확인

## 🎯 최적화 가이드

### 이미지 타겟 최적화
```bash
# ImageMagick으로 이미지 최적화
convert input.jpg -resize 1024x1024 -quality 85 output.jpg

# 대비 및 선명도 향상
convert input.jpg -normalize -sharpen 0x1 output.jpg
```

### 비디오 최적화
```bash
# FFmpeg으로 비디오 최적화
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# 웹 최적화 (빠른 시작)
ffmpeg -i input.mp4 -movflags +faststart output.mp4
```

## 📊 브라우저 지원

| 브라우저 | 지원 | 카메라 | 오디오 | 참고사항 |
|---------|------|--------|--------|----------|
| Chrome (Android) | ✅ | ✅ | ✅ | 권장 브라우저 |
| Safari (iOS) | ✅ | ✅ | ⚠️ | 사용자 터치 필요 |
| Firefox (Mobile) | ✅ | ✅ | ✅ | 성능 주의 |
| Samsung Internet | ✅ | ✅ | ✅ | 안정적 |
| Edge (Mobile) | ✅ | ✅ | ✅ | 안정적 |

## 🔗 유용한 링크

- [mindAR 공식 문서](https://hiukim.github.io/mind-ar-js-doc/)
- [A-Frame 가이드](https://aframe.io/docs/)
- [WebXR 표준](https://www.w3.org/TR/webxr/)
- [무료 테스트 리소스](https://pexels.com/videos/)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🎉 완성된 파일 목록

✅ **WebAR 애플리케이션**
- `public/mindar-app.html` - 실제 AR 앱
- `public/demo-mindar.html` - 데모/테스트 버전

✅ **가이드 문서**
- `public/TARGET_CREATION_GUIDE.md` - 타겟 생성 가이드
- `public/SAMPLE_INFO.md` - 샘플 리소스 정보
- `README_MINDAR.md` - 프로젝트 전체 가이드

✅ **폴더 구조**
- `public/images/` - AR 타겟 이미지 폴더
- `public/videos/` - 비디오 파일 폴더
- `public/targets/` - mindAR 타겟 파일 폴더

이제 이미지와 비디오 파일만 추가하면 완전한 WebAR 애플리케이션이 완성됩니다! 