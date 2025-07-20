# 🛠️ WebAR 포토 오버레이 시스템 설치 가이드

## 📋 체크리스트

### ✅ 필수 준비물
- [ ] 웹 서버 환경 (HTTPS 또는 localhost)
- [ ] Node.js (MindAR 도구용)
- [ ] 타겟 이미지 파일들 (JPG/PNG)
- [ ] 동영상 파일들 (MP4 권장)
- [ ] 모바일 기기 (테스트용)

## 🚀 단계별 설정

### 1단계: 환경 설정

#### Node.js 설치 확인
```bash
node --version
npm --version
```

#### MindAR 도구 설치
```bash
npm install -g mind-ar-tools
```

### 2단계: 프로젝트 준비

#### 폴더 구조 확인
```
ARCONVERTOR/
├── assets/
│   ├── images/        # 타겟 이미지 위치
│   ├── videos/        # 동영상 파일 위치
│   └── targets.mind   # 생성될 타겟 파일
├── styles/
├── js/
└── index.html
```

#### 권한 확인
```bash
# 폴더 쓰기 권한 확인
ls -la assets/
```

### 3단계: 타겟 이미지 준비

#### 이미지 요구사항
- **형식**: JPG, PNG
- **크기**: 512px ~ 1024px (정사각형 권장)
- **품질**: 고해상도, 명확한 대비
- **내용**: 복잡한 패턴, 텍스트, 로고 등

#### 좋은 타겟 이미지 예시
- ✅ 명함, 포스터, 책 표지
- ✅ 로고가 있는 제품 패키지
- ✅ 복잡한 패턴의 그림
- ✅ 텍스트가 많은 신문/잡지

#### 피해야 할 이미지
- ❌ 단색 배경
- ❌ 흐린 사진
- ❌ 반복 패턴만 있는 이미지
- ❌ 매우 어둡거나 밝은 이미지

### 4단계: 이미지 파일 배치

#### 파일 복사
```bash
# 이미지를 assets/images/ 폴더에 복사
cp photo1.jpg assets/images/
cp photo2.jpg assets/images/
cp photo3.jpg assets/images/
```

#### 파일명 규칙
- 영문자, 숫자, 하이픈만 사용
- 공백 사용 금지
- 예: `photo1.jpg`, `logo-image.png`

### 5단계: 동영상 파일 준비

#### 동영상 요구사항
- **형식**: MP4 (H.264 코덱)
- **해상도**: 720p 이하 권장
- **길이**: 30초 이내 권장
- **크기**: 10MB 이하 권장

#### 동영상 최적화
```bash
# FFmpeg로 동영상 최적화 (선택사항)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k output.mp4
```

#### 파일 배치
```bash
# 동영상을 assets/videos/ 폴더에 복사
cp video1.mp4 assets/videos/
cp video2.mp4 assets/videos/
cp video3.mp4 assets/videos/
```

### 6단계: 매핑 설정

#### photo-video-mapping.json 편집
```json
{
  "photoVideoMapping": [
    {
      "id": "photo1",
      "targetIndex": 0,
      "photoPath": "assets/images/photo1.jpg",
      "videoPath": "assets/videos/video1.mp4",
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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

#### targetIndex 규칙
- 0부터 시작하는 순서
- 이미지 파일명 알파벳 순서대로 할당
- 예: photo1.jpg=0, photo2.jpg=1, photo3.jpg=2

### 7단계: MindAR 타겟 파일 생성

#### 타겟 파일 생성
```bash
# 현재 디렉토리에서 실행
mindar create-image-target --input ./assets/images --output ./assets/targets.mind
```

#### 성공 확인
```bash
# 생성된 파일 확인
ls -la assets/targets.mind
```

#### 출력 예시
```
> MindAR Compiler started...
> Analyzing 3 images...
> Compiling image 0: photo1.jpg
> Compiling image 1: photo2.jpg  
> Compiling image 2: photo3.jpg
> Compilation completed successfully!
> Target file saved: ./assets/targets.mind
```

### 8단계: 웹 서버 실행

#### Python HTTP 서버
```bash
# Python 3
python -m http.server 8000

# Python 2  
python -m SimpleHTTPServer 8000
```

#### Node.js HTTP 서버
```bash
npx http-server -p 8000 -c-1
```

#### 서버 실행 확인
```
브라우저에서 접속: http://localhost:8000
```

### 9단계: 테스트

#### 데스크톱 테스트
1. 브라우저에서 `http://localhost:8000` 접속
2. 카메라 권한 허용
3. 웹캠으로 인쇄된 이미지 테스트

#### 모바일 테스트
1. 모바일 브라우저에서 접속
2. 후면 카메라로 타겟 이미지 스캔
3. AR 동영상 재생 확인

## 🚨 문제 해결

### MindAR 도구 설치 실패
```bash
# 관리자 권한으로 재시도
sudo npm install -g mind-ar-tools

# 또는 npx 사용
npx mind-ar-tools create-image-target --input ./assets/images --output ./assets/targets.mind
```

### 타겟 파일 생성 실패
```bash
# 이미지 파일 확인
ls -la assets/images/
file assets/images/*.jpg

# 권한 확인
chmod 755 assets/images/
```

### 카메라 접근 거부
- HTTPS 환경 사용 확인
- 브라우저 카메라 권한 설정 확인
- 다른 브라우저로 테스트

### 이미지 인식 안됨
- 타겟 이미지 품질 확인
- 조명 환경 개선
- 카메라와 이미지 거리 조절 (20-50cm)

### 동영상 재생 안됨
- MP4 H.264 코덱 확인
- 파일 경로 확인
- 브라우저 자동재생 정책 확인

## 📋 설정 완료 체크리스트

- [ ] Node.js 및 MindAR 도구 설치
- [ ] 타겟 이미지 파일 배치 (`assets/images/`)
- [ ] 동영상 파일 배치 (`assets/videos/`)
- [ ] 매핑 설정 파일 편집 (`photo-video-mapping.json`)
- [ ] MindAR 타겟 파일 생성 (`targets.mind`)
- [ ] 웹 서버 실행
- [ ] 데스크톱 브라우저 테스트
- [ ] 모바일 브라우저 테스트
- [ ] AR 동영상 재생 확인

## 🎯 최적화 팁

### 성능 최적화
- 이미지 크기: 512px~1024px
- 동영상 해상도: 720p 이하
- 타겟 이미지 수: 5개 이하

### 인식률 향상
- 고대비 이미지 사용
- 복잡한 패턴 포함
- 조명 환경 개선
- 안정적인 촬영

### 사용자 경험
- 로딩 시간 최소화
- 직관적인 UI
- 명확한 안내 메시지
- 오류 처리 개선

---

## 📞 추가 지원

설정 중 문제가 발생하면:
1. 브라우저 개발자 도구 콘솔 확인
2. 관리자 패널(⚙️)에서 시스템 상태 확인
3. README.md의 문제 해결 섹션 참조
4. GitHub Issues에 문의

**성공적인 설정을 위해 단계별로 차근차근 진행하세요!** ✨ 