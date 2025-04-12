cd back
npm run build
cd ..
docker build --platform linux/amd64 -t baryosef212/front-img ./front
docker push baryosef212/front-img

cd back
npm run build
cd ..
docker build --platform linux/amd64 -t baryosef212/back-img ./back
docker push baryosef212/back-img

echo "🚀 Both images built and pushed!"
