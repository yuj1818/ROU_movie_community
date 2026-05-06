# 🎬 ROU (Movie Community & Recommendation Service)

ROU는 영화 정보를 공유하고,  
**사용자 취향 기반 추천과 커뮤니티 기능을 제공하는 영화 플랫폼**입니다.

---

## 🎯 Key Improvements

- CSR → SSR 전환으로 SEO 점수 **82 → 96 향상**
- React Query 도입으로 **서버 상태 관리 분리 및 데이터 흐름 개선**
- BFF 아키텍처 기반 API 및 인증 구조 개선
- LCP 약 **40% 개선**, Lighthouse Performance **69 → 91 향상**
- 데이터 수집 파이프라인 **30배 성능 개선 (1시간 → 2분)**

---

## 💡 Background

기존 React 기반 CSR 구조에서 다음과 같은 문제를 경험했습니다.

- 초기 로딩 지연 및 SEO 대응 한계  
- 서버 상태와 UI 상태 혼재  
- 데이터 fetching 로직 분산  

이를 해결하기 위해 단순 기술 변경이 아닌

👉 **렌더링 전략, 상태 관리, 데이터 흐름을 포함한 아키텍처 재설계**를 진행했습니다.

---

## 🏗 Architecture

### Rendering Strategy
- SSR (초기 진입) + CSR (인터랙션) 혼합 구조  
- 서버 prefetch + hydration  

### State Management
- Server State → React Query  
- UI State → Zustand  

### BFF Layer
- Next.js API Route 기반 Proxy  
- 인증 및 API 흐름 서버 통합  

### Authentication
- NextAuth + Django JWT 통합  
- OAuth (Google, Kakao) 지원  
- Middleware 기반 라우팅 보호  

---

## 🚀 Features

- 영화 정보 조회 및 검색 (TMDB API)  
- TF-IDF 기반 개인화 추천  
- 커뮤니티 (리뷰, 댓글)  
- 소셜 로그인 및 사용자 프로필  
- 영화 퀴즈 시스템  

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)  
- TypeScript  
- React Query, Zustand  
- TailwindCSS, shadcn/ui  
- NextAuth  

### Backend
- Django, DRF  
- Python (Async Data Pipeline, Recommendation System)  

### Database
- SQLite  

---

## ⚙️ Getting Started

### 1. 프로젝트 설정
```bash
./setup_pjt.sh
```

### 2. 환경 변수 설정 (필수)
아래 파일을 열어 값을 입력하세요:
- back/.env
- front/.ev

### 3. Backend 서버 실행
```bash
cd back
python manage.py runserver
```

### 4. Frontend 서버 실행
```bash
cd front
npm run dev
``` 

## 🧠 What I Learned

- 서버 데이터는 상태가 아닌 캐시 및 동기화 대상
- 렌더링 전략은 성능이 아닌 UX 설계 요소
- 아키텍처 설계의 핵심은 책임 분리
