dockerfile
docker build -t uwhangouts .

docker tag uwhangouts harim2000/finalproject

docker push harim2000/finalproject

ssh ec2-user@ec2-3-227-39-243.compute-1.amazonaws.com "docker rm -f uwhangouts; docker pull harim2000/finalproject; docker run --name uwhangouts -d -p 443:443 harim2000/finalproject"