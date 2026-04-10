ROU Movie Community는 영화 정보 조회, 커뮤니티 활동, 그리고 퀴즈를 즐길 수 있는 모던 영화 커뮤니티 플랫폼의
프론트엔드 프로젝트입니다.

## 🎞️ 프로젝트 개요

- 목적: 영화 애호가들을 위한 정보 공유 및 소통 공간 제공
- 대상: 최신 영화 트렌드를 확인하고, 리뷰를 작성하며, 영화 퀴즈로 지식을 뽐내고 싶은 사용자
- 핵심 가치: 사용자 친화적인 UI/UX, 빠른 데이터 로딩, 다양한 소셜 로그인 지원

## ✨ 주요 기능

- 영화 탐색: 트렌드, 장르별 정렬 필터를 통한 고도화된 영화 검색 및 탐색 기능
- 영화 상세 정보: 출연진 정보, 영화 평점, 사용자 반응(좋아요/싫어요/찜) 및 유사 영화 추천
- 커뮤니티: 자유로운 게시글 및 리뷰 작성, 이미지 및 댓글 시스템이 통합된 게시판
- 인터랙티브 퀴즈: 영화 지식을 테스트할 수 있는 퀴즈 생성 및 풀이 시스템
- 개인화 프로필: 활동 내역 확인 및 유저 정보 관리
- 소셜 인증: Credentials, Google, Kakao를 연동한 하이브리드 로그인 시스템

## 🛠 기술 스택

#### `Core`

- Next.js 16 (App Router): SSR/ISR을 통한 SEO 최적화 및 복잡한 레이아웃 구조의 효율적 관리
- React 19: 최신 리액트 기능을 활용한 고성능 컴포넌트 설계
- TypeScript: 코드 안정성 확보 및 개발자 생산성 향상

#### `State Management`

- TanStack Query (React Query): 서버 상태 관리, 캐싱, 데이터 동기화 최적화
- Zustand: 전역 UI 상태 및 클라이언트 사이드 데이터(태그, 임시 게시물 등)의 경량 관리

#### `Styling & UI`

- Tailwind CSS 4: 유틸리티 우선의 스타일링으로 빠른 UI 구현 및 일관된 디자인 시스템 구축
- Radix UI: 접근성(Accessibility)이 보장된 비제어(Headless) 컴포넌트를 활용한 견고한 UI 기반 마련
- Lucide React & Lottie: 직관적인 아이콘과 생동감 있는 애니메이션으로 UX 강화

#### `Authentication`

- NextAuth.js (Auth.js): 다중 소셜 로그인 및 JWT 기반의 안전한 세션 관리

## 🚀 기술적 도전 및 해결 방안

### 1. 하이브리드 소셜 로그인 처리

- 도전: NextAuth와 별도의 백엔드(Django) 서버 간의 인증 상태 동기화 문제.
- 해결: signIn 콜백을 활용하여 소셜 인증 성공 시 백엔드 API로 토큰을 교환(Exchange)하고, 반환된 백엔드 JWT를
  NextAuth 세션에 저장하는 커스텀 로직을 구현하여 일관된 인증 시스템을 구축했습니다.

### 2. 복잡한 필터링 및 서버 데이터 동기화

- 도전: 영화 목록에서 장르, 정렬 등 다양한 필터 조건에 따른 데이터 최신성 유지.
- 해결: TanStack Query의 queryKeys를 동적으로 관리하여 필터 변경 시 자동으로 관련 쿼리만 무효화(Invalidation)하고
  최신 데이터를 페칭함으로써 사용자에게 즉각적인 피드백을 제공했습니다.

### 3. 클라이언트/서버 컴포넌트 최적화

- 도전: App Router 환경에서 데이터 페칭 전략 결정(Client vs Server).
- 해결: SEO와 초기 로딩 속도가 중요한 상세 페이지는 서버 컴포넌트에서 Prefetching을 수행하고, 인터랙션이 잦은
  커뮤니티 필터링이나 좋아요 기능은 클라이언트 컴포넌트로 분리하여 사용자 경험을 극대화했습니다.

## ⚙️ 실행 방법

### 1. 의존성 설치

```bash
  npm install
```

### 2. **환경 변수 설정**

- `.env.local` 파일을 생성하고 다음 정보를 입력합니다:

```
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  NEXT_PUBLIC_API_BASE_URL=http://your-backend-api.com
  NEXTAUTH_SECRET=your_secret
  GOOGLE_CLIENT_ID=...
  GOOGLE_SECRET=...
  KAKAO_CLIENT_ID=...
  KAKAO_CLIENT_SECRET=...
```

### 3-1. **개발 서버 실행**

```bash
  npm run dev
```

### 3-2. **빌드 및 실행**

```bash
  npm run build
  npm run start
```
