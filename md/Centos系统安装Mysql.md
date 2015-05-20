Linux环境:   CentOs 6.2
MySql版本：   5.6.13
资源存储位置：   /usr/local/src

第一步：卸载系统自带Mysql

rpm -e mysql

第二步：安装编译环境

yum -y install gcc gcc-c++ autoconf libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libxml2 \
libxml2-devel zlib zlib-devel glibc glibc-devel glib2 glib2-devel bzip2 bzip2-devel ncurses ncurses-devel curl \
curl-devel e2fsprogs e2fsprogs-devel krb5 krb5-devel libidn libidn-devel openssl openssl-devel
yum groupinstall "Development Tools" "Development Libraries" -yt

第三步：准备

A：添加用户组

/usr/sbin/groupadd mysql
/usr/sbin/useradd mysql -g mysql -M -s /sbin/nologin(-g:指定组 -M:不建立根目录 -s:定义使用shell nologin不能登录)
mkdir /usr/local/mysql
chown -R mysql:mysql /usr/local/mysql/
mkdir /home /home/mysql /home/mysql/data /home/mysql/data/log
chown -R mysql:mysql /home/mysql/

B.安装 [CMake](download.md#cmake)

tar zvxf cmake-2.8.12.tar.gz
cd cmake-2.8.12
./configure
make && make install

C.安装 [mysql](download.md#mysql)

tar zxvf mysql-5.6.13.tar.gz
cd mysql-5.6.13
cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql/ \
-DMYSQL_DATADIR=/home/mysql/data \
-DSYSCONFDIR=/opt/mysql/etc \
-DMYSQL_TCP_PORT=3306 \
-DMYSQL_UNIX_ADDR=/tmp/mysql.sock \
-DMYSQL_USER=mysql \
-DEXTRA_CHARSETS=all \
-DWITH_READLINE=1 \
-DWITH_SSL=system \
-DWITH_EMBEDDED_SERVER=1 \
-DENABLED_LOCAL_INFILE=1 \
-DWITH_INNOBASE_STORAGE_ENGINE=1
make && make install

D.修改 /etc/profile

export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
PATH=$PATH:/usr/local/mysql/bin
source /etc/profile

E.获取 [my.cnf](download.md/my.cnf)文件, 放到/usr/local/mysql/下

vi /usr/local/mysql/my.cnf
chown -R mysql:mysql /home/mysql/
chown -R mysql:mysql /usr/local/mysql/

F.创建数据库

chmod 755 /usr/local/mysql/scripts/mysql_install_db
/usr/local/mysql/scripts/mysql_install_db --defaults-file=/usr/local/mysql/my.cnf --user=mysql --basedir=/usr/local/mysql/ --datadir=/home/mysql/data/ --explicit_defaults_for_timestamp

G.修改管理员密码

cp ./support-files/mysql.server /etc/rc.d/init.d/mysql
chmod +x /etc/rc.d/init.d/mysql
service mysql start

启动服务再修改
mysql 默认密码为空 eg 设置密码为 root
a. /usr/local/mysql/bin/mysqladmin -u root -p password 'root'
enter
ok
如果已经有了密码，修改如下，eg 修改成 123456 
b. /usr/local/mysql/bin/mysqladmin -u root -p password '123456'
enter
输入原密码
ok

H.删除测试库和匿名账户

/usr/local/mysql/bin/mysql_secure_installation
enter enter enter

I.登录

/usr/local/mysql/bin/mysql -uroot -proot
or 
mysql -uroot -proot
(如果无法进入，可以重新删除data临时库，重新设置)

http://dev.mysql.com/doc/internals/en/autotools-to-cmake.html
http://www.sunchis.com/html/db/mysql/2012/0612/419.html
