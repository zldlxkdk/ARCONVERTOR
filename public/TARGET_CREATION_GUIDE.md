# mindAR 타겟 파일 생성 가이드

## 1. 필요한 도구 설치
```bash
npm install -g @hiukim/mind-ar-js-tools
```

## 2. 이미지 준비
public/images/ 폴더에 다음 파일들을 준비하세요:
- photo1.jpg (첫 번째 타겟 이미지)
- photo2.jpg (두 번째 타겟 이미지)  
- photo3.jpg (세 번째 타겟 이미지)

## 3. 타겟 파일 생성
다음 명령어를 실행하세요:

```bash
cd public
mind-ar-js-compiler --input-folder ./images --output-file ./targets/targets.mind
```

## 4. 비디오 파일 준비
public/videos/ 폴더에 다음 파일들을 준비하세요:
- v1.mp4 (photo1.jpg와 연결될 비디오)
- v2.mp4 (photo2.jpg와 연결될 비디오)
- v3.mp4 (photo3.jpg와 연결될 비디오)

## 5. 이미지 타겟 최적화 팁
- **고대비**: 명확한 패턴이 있는 이미지 사용
- **복잡한 패턴**: 단색 배경보다는 복잡한 패턴이 좋음
- **직사각형**: 정사각형보다는 직사각형이 인식률이 높음
- **해상도**: 최소 480x480px, 최대 2048x2048px 권장
- **파일 크기**: 각 이미지당 2MB 이하 권장

## 6. 로컬 테스트
mindar-app.html 파일을 웹서버에서 실행하여 테스트하세요.

```bash
# 간단한 HTTP 서버 실행
npx http-server public -p 8080 -c-1

# 또는 Python 서버
# cd public && python -m http.server 8080
```

그 후 `http://localhost:8080/mindar-app.html`에 접속

## 7. 배포용 빌드
GitHub Pages나 다른 호스팅에 배포할 때:

```bash
# 1. 타겟 파일 생성
npm run create-targets

# 2. 빌드 및 배포
npm run build
npm run deploy
```

## 8. 문제 해결

### 타겟 인식이 안 될 때:
- 조명 확인 (너무 어둡거나 밝지 않게)
- 이미지 품질 확인 (흐릿하거나 손상되지 않게)
- 카메라와 이미지 간 거리 조정 (20-50cm 권장)
- 이미지 각도 조정 (정면에서 촬영)

### 비디오가 재생되지 않을 때:
- HTTPS 환경에서 테스트
- 브라우저 콘솔에서 오류 확인
- 비디오 형식 확인 (MP4 H.264 권장)
- 파일 경로 확인

### 성능이 느릴 때:
- 이미지/비디오 파일 크기 최적화
- 타겟 이미지 개수 줄이기 (3개 이하 권장)
- 브라우저 하드웨어 가속 활성화 