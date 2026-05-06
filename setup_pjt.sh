set -e

echo "🚀 전체 프로젝트 초기 설정 시작"

echo "📄 환경 변수 파일 설정"

# backend
if [ ! -f "back/.env" ]; then
  cp back/.env.example back/.env
  echo "⚠️ back/.env 생성됨 → 값 수정 필요"
fi

# frontend
if [ ! -f "front/.env" ]; then
  cp front/.env.example front/.env
  echo "⚠️ front/.env 생성됨 → 값 수정 필요"
fi

##################################
# 🧩 BACKEND SETUP
##################################
echo ""
echo "🔧 [Backend] 설정 시작"
cd back

echo "가상환경 생성"
python -m venv venv

echo "🔌 가상환경 활성화"
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "📚 패키지 설치"
pip install -r requirements.txt

echo "🗄️ DB 마이그레이션"
python manage.py migrate

echo "📥 초기 데이터 로드"
python manage.py loaddata init_data.json || echo "⚠️ init_data 로드 실패 (무시)"

echo "⚡ 캐시 테이블 생성"
python manage.py createcachetable || echo "⚠️ 캐시 테이블 이미 존재"

cd ..

##################################
# 🎨 FRONTEND SETUP
##################################
echo ""
echo "🎨 [Frontend] 설정 시작"
cd front

echo "📦 npm 패키지 설치"
npm install

cd ..

echo ""
echo "✅ 전체 환경 설정 완료!"

echo ""
echo "❗ 중요: 환경 변수 설정 필요"
echo "👉 back/.env 파일을 열어서 API_KEY 등을 입력하세요"
echo "👉 front/.env도 필요 시 수정하세요"
echo ""