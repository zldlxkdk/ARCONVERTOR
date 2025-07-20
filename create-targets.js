// mindAR 타겟 생성 스크립트
// Node.js 환경에서 실행하여 타겟 파일을 생성합니다.

const fs = require('fs');
const path = require('path');

// 타겟 생성 가이드
const guide = `
# mindAR 타겟 파일 생성 가이드

## 1. 필요한 도구 설치
npm install -g @hiukim/mind-ar-js-tools

## 2. 이미지 준비
public/images/ 폴더에 다음 파일들을 준비하세요:
- photo1.jpg (첫 번째 타겟 이미지)
- photo2.jpg (두 번째 타겟 이미지)  
- photo3.jpg (세 번째 타겟 이미지)

## 3. 타겟 파일 생성
다음 명령어를 실행하세요:

\`\`\`bash
cd public
mind-ar-js-compiler --input-folder ./images --output-file ./targets/targets.mind
\`\`\`

## 4. 비디오 파일 준비
public/videos/ 폴더에 다음 파일들을 준비하세요:
- v1.mp4 (photo1.jpg와 연결될 비디오)
- v2.mp4 (photo2.jpg와 연결될 비디오)
- v3.mp4 (photo3.jpg와 연결될 비디오)

## 5. 이미지 타겟 최적화 팁
- 고대비, 명확한 패턴이 있는 이미지 사용
- 단색 배경보다는 복잡한 패턴이 좋음
- 정사각형보다는 직사각형이 인식률이 높음
- 최소 해상도: 480x480px 권장
- 최대 해상도: 2048x2048px

## 6. 테스트
mindar-app.html 파일을 웹서버에서 실행하여 테스트하세요.
로컬 테스트의 경우:
\`\`\`bash
npx http-server public -p 8080
\`\`\`

그 후 https://localhost:8080/mindar-app.html 에 접속
`;

// 가이드 파일 생성
fs.writeFileSync(path.join(__dirname, 'TARGET_CREATION_GUIDE.md'), guide);

// package.json에 스크립트 추가를 위한 템플릿
const packageScripts = {
  "create-targets": "cd public && mind-ar-js-compiler --input-folder ./images --output-file ./targets/targets.mind",
  "serve-local": "npx http-server public -p 8080 -c-1",
  "test-ar": "npm run create-targets && npm run serve-local"
};

console.log('✅ 타겟 생성 가이드가 생성되었습니다!');
console.log('📄 파일: public/TARGET_CREATION_GUIDE.md');
console.log('\n🔧 다음 단계:');
console.log('1. public/images/ 폴더에 이미지 파일들을 추가하세요');
console.log('2. public/videos/ 폴더에 비디오 파일들을 추가하세요');
console.log('3. 다음 명령어로 타겟을 생성하세요:');
console.log('   npm install -g @hiukim/mind-ar-js-tools');
console.log('   cd public && mind-ar-js-compiler --input-folder ./images --output-file ./targets/targets.mind');

// 샘플 이미지 정보
const sampleInfo = `
# 샘플 이미지 정보

테스트용 샘플 이미지들을 준비해주세요:

## photo1.jpg
- 추천: 책 표지, 포스터, 명함 등
- 특징: 텍스트와 이미지가 조화로운 복합 패턴

## photo2.jpg  
- 추천: 로고, 아이콘, 패턴이 있는 이미지
- 특징: 기하학적 패턴이나 강한 대비

## photo3.jpg
- 추천: 사진, 그림, 복잡한 패턴
- 특징: 자연스러운 패턴이나 질감

## 비디오 파일 (MP4 형식 권장)
- v1.mp4: 10초 내외, 1280x720 해상도
- v2.mp4: 10초 내외, 1280x720 해상도  
- v3.mp4: 10초 내외, 1280x720 해상도

⚠️ 주의사항:
- HTTPS 환경에서만 카메라 접근 가능
- 비디오 자동재생은 사용자 상호작용 후에만 가능
- iOS Safari의 경우 webkit-playsinline 속성 필수
`;

fs.writeFileSync(path.join(__dirname, 'SAMPLE_INFO.md'), sampleInfo);

console.log('📋 샘플 정보 파일도 생성되었습니다!');
console.log('📄 파일: public/SAMPLE_INFO.md'); 