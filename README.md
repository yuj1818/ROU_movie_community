# ROU (Movie Community & Recommendation Service)

ROU는 영화 정보를 공유하고, 사용자 취향에 맞는 영화를 추천받을 수 있는 종합 영화 커뮤니티 플랫폼입니다.

## 💡 프로젝트 배경 및 마이그레이션

이 프로젝트의 프론트엔드는 기존 `React + JavaScript + Redux + Axios` 조합에서 `Next.js + TypeScript + Zustand + TanStack Query` 조합으로 마이그레이션되었습니다. 이는 개발 효율성 증대, 타입 안정성 확보, 그리고 성능 최적화를 목표로 진행되었습니다.

주요 변경 사항:
- **React -> Next.js**: 이미지 사용이 잦은 서비스이므로 SSR(서버 사이드 렌더링) 등 Next.js의 고급 기능을 활용하여 초기 로딩 속도 개선 및 SEO 최적화
- **JavaScript -> TypeScript**: 코드의 안정성과 유지보수성을 높이기 위한 타입 시스템 도입
- **Redux -> Zustand**: 더 간결하고 직관적인 전역 상태 관리 라이브러리로 전환
- **Axios -> TanStack Query (React Query)**: 비동기 데이터 fetching 및 캐싱 로직을 효율적으로 관리하여 사용자 경험 향상 및 개발 복잡도 감소

---

## 🚀 주요 기능

### 1. 영화 정보 및 검색
- **TMDB API 연동**: 최신 및 인기 영화 정보를 실시간으로 제공합니다.
- **상세 정보**: 예고편, 줄거리, 출연진 정보를 확인할 수 있습니다.
- **컬렉션**: 좋아요, 싫어요, 시청 중, 인생 영화 등 영화를 개인별로 분류하여 관리할 수 있습니다.

### 2. 사용자 맞춤형 추천 (Recommendation System)
- **TF-IDF & 코사인 유사도**: 영화 줄거리와 장르 데이터를 분석하여 유사한 영화를 추천합니다.
- **개인화 필터링**: 사용자가 선호하거나 선호하지 않는 장르 가중치를 적용하여 더욱 정확한 추천 결과를 제공합니다.

### 3. 커뮤니티
- **영화 리뷰**: 영화에 대한 평점과 리뷰를 작성하고 다른 사용자와 의견을 나눌 수 있습니다.
- **댓글 시스템**: 리뷰에 댓글 및 대댓글을 작성하여 소통할 수 있습니다.

### 4. 영화 퀴즈
- **퀴즈 생성 (관리자 전용)**: 관리자만 영화와 관련된 이미지와 문제를 포함한 퀴즈를 직접 생성할 수 있습니다.
- **퀴즈 풀기**: 명대사 퀴즈를 풀며 영화 지식을 테스트할 수 있습니다.

### 5. 사용자 프로필 및 소셜 로그인
- **소셜 로그인**: Google 및 Kakao 계정을 통한 간편 로그인을 지원합니다.
- **프로필 관리**: 내가 작성한 리뷰, 퀴즈, 참여한 영화 목록을 한눈에 관리할 수 있습니다.

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: NextAuth.js
- **Animation**: LottieFiles

### Backend
- **Framework**: Django 5.1
- **API**: Django REST Framework (DRF)
- **Database**: SQLite (Development)
- **Authentication**: dj-rest-auth, django-allauth (Social Login)
- **Data Analysis**: scikit-learn, Pandas, NumPy (추천 알고리즘)
- **Natural Language Processing**: Kiwi (한국어 형태소 분석)

---

## ⚙️ 설치 및 실행 방법

### Prerequisites
- Python 3.10+
- Node.js 20+
- TMDB API Key (영화 데이터 연동을 위해 필요)

### Backend (Django)

1. **저장소 복제 및 이동**
   ```bash
   git clone <repository-url>
   cd ROU_movie_community/back
   ```

2. **가상환경 설정 및 패키지 설치**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **환경 변수 설정**
   `back/` 폴더 내에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
   ```env
   API_KEY=your_tmdb_api_key
   ```

4. **데이터베이스 마이그레이션 및 데이터 시딩**
   ```bash
   python manage.py migrate
   python manage.py seed_movies  # 초기 영화 데이터 수집
   ```

5. **서버 실행**
   ```bash
   python manage.py runserver
   ```

### Frontend (Next.js)

1. **폴더 이동 및 패키지 설치**
   ```bash
   cd ../front
   npm install
   ```

2. **환경 변수 설정**
   `front/` 폴더 내에 `.env.local` 파일을 생성하고 아래 내용을 입력합니다.
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_SECRET=your_google_secret
   
   KAKAO_CLIENT_ID=your_kakao_client_id
   KAKAO_CLIENT_SECRET=your_kakao_client_secret
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

---

## 📂 프로젝트 구조

### Backend (`back/`)
- `ACCOUNTS/`: 사용자 관리 및 인증 로직
- `COMMUNITY/`: 리뷰 및 댓글 관련 기능
- `MOVIES/`: 영화 데이터 관리 및 추천 알고리즘 (`recommend.py`)
- `QUIZZES/`: 퀴즈 생성 및 조회 기능
- `ROU/`: 프로젝트 설정 및 URL 라우팅

### Frontend (`front/`)
- `app/`: Next.js App Router (페이지 및 API 라우트)
- `components/`: 재사용 가능한 UI 컴포넌트
- `hooks/`: 커스텀 React Hooks
- `lib/`: 유틸리티 및 API 클라이언트 설정
- `stores/`: Zustand 상태 저장소
- `types/`: TypeScript 타입 정의

---

## 📝 라이선스
이 프로젝트는 교육적 목적으로 제작된 토이 프로젝트입니다.
