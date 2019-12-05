dockerfile
docker build -t uwhangouts .

docker tag uwhangouts harim2000/finalproject

docker push harim2000/finalproject

ssh ec2-user@harim2000-student.me "docker rm -f uwhangouts; docker pull harim2000/finalproject; docker run --name uwhangouts -d -p 443:443 harim2000/finalproject"