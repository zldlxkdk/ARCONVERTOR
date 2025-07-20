# AR 이미지 변환기

일반 사진을 AR(증강현실) 인식용으로 변환하고 동영상을 연결할 수 있는 웹 애플리케이션입니다.

## 주요 기능

### 🖼️ 이미지 처리
- **드래그 앤 드롭** 이미지 업로드
- **다양한 형식 지원**: JPG, PNG, WebP (최대 10MB)
- **이미지 최적화**: AR 인식에 최적화된 이미지 변환
- **품질 조정**: 10% ~ 100% 품질 설정
- **크기 조정**: 256x256 ~ 2048x2048px 출력 크기

### 🎯 AR 마커 생성
- **자동 마커 생성**: 업로드된 이미지에서 AR 마커 자동 생성
- **품질 평가**: 마커 인식 품질 점수 제공
- **표준 호환**: AR.js, Vuforia 등 주요 AR 프레임워크 호환
- **시각적 표시**: 동영상 연결 시 마커에 재생 아이콘 표시

### 🎬 동영상 링크 관리
- **다양한 동영상 플랫폼 지원**:
  - YouTube
  - Vimeo
  - 직접 링크 (MP4, WebM 등)
  - 로컬 파일
- **링크 검증**: 각 플랫폼별 링크 형식 자동 검증
- **편집 기능**: 동영상 제목, 링크 수정 가능
- **AR 코드 생성**: 연결된 동영상으로 AR 재생 코드 자동 생성

### 📥 다운로드 관리
- **개별 다운로드**: 처리된 이미지, AR 마커 개별 다운로드
- **일괄 다운로드**: 모든 파일 한 번에 다운로드
- **사용 가이드**: 상세한 사용법 가이드 자동 생성
- **패키지 생성**: 완전한 AR 패키지 정보 생성

### 🔍 AR 스캐너 (신규 기능)
- **실시간 AR 스캔**: TensorFlow.js 기반 고급 이미지 인식
- **마커 감지**: AR 마커 실시간 감지 및 추적
- **비디오 오버레이**: 감지된 마커 위치에 동영상 표시
- **조정 가능한 감지**: 감지 임계값 실시간 조정
- **고성능 처리**: WebGL 가속을 통한 빠른 이미지 분석

## 기술 스택

- **Frontend**: React.js 18.x
- **UI Framework**: Material-UI (MUI) 5.x
- **Image Processing**: TensorFlow.js, Canvas API
- **AR Processing**: TensorFlow.js, WebRTC, WebGL
- **Build Tool**: Vite
- **Package Manager**: npm

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd ARCONVERTOR
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 접속
```
http://localhost:5173
```

## 🌐 GitHub Pages 배포

### 자동 배포 (권장)
1. GitHub 저장소에 코드를 푸시하면 자동으로 배포됩니다
2. `main` 브랜치에 푸시할 때마다 GitHub Actions가 자동 빌드 및 배포
3. 배포 완료 후 `https://zldlxkdk.github.io/ARCONVERTOR`에서 접속 가능

### 수동 배포
```bash
npm run build
npm run deploy
```

### GitHub Pages 설정
1. GitHub 저장소 → Settings → Pages
2. Source: "Deploy from a branch" 선택
3. Branch: "gh-pages" 선택
4. Save 클릭

## 사용 방법

### 1. 이미지 업로드
- 드래그 앤 드롭으로 이미지 파일을 업로드하거나
- "파일 선택" 버튼을 클릭하여 이미지 선택

### 2. 이미지 처리
- 품질, 출력 형식, 크기 설정
- "이미지 처리" 버튼 클릭
- 처리된 이미지 미리보기 확인

### 3. AR 마커 생성
- 이미지 처리 완료 후 자동으로 AR 마커 생성
- 마커 품질 및 정보 확인
- AR 마커 다운로드

### 4. 동영상 링크 연결
- "동영상 추가" 버튼 클릭
- 동영상 제목, 타입, 링크 입력
- 링크 검증 후 추가

### 5. AR 코드 생성
- "AR 동영상 플레이어 코드 생성" 버튼 클릭
- HTML 파일 다운로드
- 웹 서버에 업로드하여 사용

### 6. AR 스캐너 사용 (신규)
- "AR 스캔 시작" 버튼 클릭
- 카메라를 AR 마커에 비춰주세요
- 마커가 감지되면 동영상이 자동으로 표시됩니다
- 감지 임계값을 조정하여 정확도를 높일 수 있습니다

## AR 프레임워크별 사용법

### AR.js
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.min.js"></script>
</head>
<body>
    <a-scene embedded arjs="sourceType: webcam;">
        <a-marker preset="custom" url="ar-marker.png">
            <a-video src="your-video.mp4" position="0 0 0" play="true"></a-video>
        </a-marker>
        <a-entity camera></a-entity>
    </a-scene>
</body>
</html>
```

### Vuforia
1. Vuforia Target Manager에서 마커 이미지 업로드
2. 데이터베이스에 추가
3. Unity에서 동영상 플레이어 연결

### Unity AR Foundation
1. AR 마커를 이미지 타겟으로 설정
2. 동영상 플레이어 컴포넌트 연결
3. 마커 인식 시 동영상 재생 트리거 설정

## 동영상 타입별 처리

### YouTube
- YouTube IFrame API 사용
- 자동 재생 정책 고려
- 모바일 브라우저 호환성 확인

### Vimeo
- Vimeo Player API 사용
- 프라이버시 설정 확인
- 임베드 권한 확인

### 직접 링크
- CORS 정책 확인
- 적절한 형식 (MP4, WebM) 사용
- 서버 설정 최적화

### 로컬 파일
- 웹 서버에 동영상 파일 업로드
- 상대 경로 사용
- 파일 크기 최적화

## AR 스캐너 상세 가이드

### TensorFlow.js 기반 마커 감지
- **CNN 모델**: 64x64 해상도로 이미지 분석
- **실시간 처리**: WebGL 가속을 통한 빠른 프레임 분석
- **메모리 최적화**: 자동 메모리 정리로 성능 유지
- **오류 복구**: 감지 실패 시 백업 알고리즘 자동 실행

### 감지 임계값 조정
- **낮은 임계값 (0.1-0.3)**: 민감한 감지, 오탐 가능성 높음
- **중간 임계값 (0.4-0.6)**: 균형잡힌 감지, 권장 설정
- **높은 임계값 (0.7-0.9)**: 정확한 감지, 미탐 가능성 높음

### 카메라 설정
- **환경 카메라**: 기본적으로 후면 카메라 사용
- **해상도**: 1280x720 권장 (성능과 품질의 균형)
- **프레임레이트**: 30fps로 실시간 처리

## 최적화 팁

### 마커 인식 개선
- 평평한 표면에 마커 인쇄
- 충분한 조명 확보
- 마커 손상 방지
- 마커 크기: 최소 5cm x 5cm 권장

### 동영상 최적화
- 적절한 해상도와 압축률 설정
- 네트워크 환경 고려
- 캐싱 설정 확인

### 성능 개선
- 이미지 크기 최적화
- 동영상 품질 조정
- 브라우저 호환성 확인

## 문제 해결

### 마커 인식 문제
- 조명 개선
- 마커 크기 조정
- 카메라 각도 조정

### 동영상 재생 문제
- 링크 유효성 확인
- 브라우저 정책 확인
- CORS 설정 확인

### 성능 문제
- 동영상 품질 조정
- 이미지 크기 최적화
- 캐싱 설정 확인

### AR 스캐너 문제
- **카메라 접근 권한**: 브라우저에서 카메라 권한 허용 필요
- **TensorFlow 모델 로딩**: 첫 실행 시 모델 초기화 시간 필요
- **감지 정확도**: 조명 조건과 마커 품질에 따라 달라짐
- **성능 저하**: 고해상도 카메라 사용 시 성능 조정 필요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
