dockerfile
docker build -t uwhangouts/mysql .

ssh ec2-user@ec2-3-227-39-243.compute-1.amazonaws.com

export MYSQL_ROOT_PASSWORD='uwhangoutspass'
docker run -d \
-p 3306:3306 \
--name mysql \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-e MYSQL_DATABASE=accounts \
mysql

docker run -it \
--rm \
--network host \
mysql sh -c "mysql -h127.0.0.1 -uroot -p$MYSQL_ROOT_PASSWORD"