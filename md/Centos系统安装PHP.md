Linux环境:   CentOs 6.2
PHP版本：   PHP 5.4.20
资源存储位置：   /usr/local/src

第一步：安装编译环境

 yum -y install gcc gcc-c++ autoconf libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libxml2 \
 libxml2-devel zlib zlib-devel glibc glibc-devel glib2 glib2-devel bzip2 bzip2-devel ncurses ncurses-devel curl \
 curl-devel e2fsprogs e2fsprogs-devel krb5 krb5-devel libidn libidn-devel openssl openssl-devel openldap \
 openldap-devel nss_ldap openldap-clients openldap-servers

第二步：安装PHP支持库

 A：[libiconv](download.md#libiconv) - 对编码的支持
 tar zxvf libiconv-1.14.tar.gz
 cd libiconv-1.14
 ./configure --prefix=/usr/local/
 make && make install
 B：加密相关
 * [libmcrypt](download.md#libmcrypt)
 tar zxvf libmcrypt-2.5.8.tar.gz
 cd libmcrypt-2.5.8
 ./configure
 make && make install
 /sbin/ldconfig #缓存库文件
 cd libltdl/
 ./configure --enable-ltdl-install
 make && make install
 * [mhash](download.md#mhash)
 tar zxvf mhash-0.9.9.9.tar.gz
 cd mhash-0.9.9.9
 ./configure
 make && make install
 建立软连接
 ln -s /usr/local/lib/libmcrypt.la /usr/lib/libmcrypt.la
 ln -s /usr/local/lib/libmcrypt.so /usr/lib/libmcrypt.so
 ln -s /usr/local/lib/libmcrypt.so.4 /usr/lib/libmcrypt.so.4
 ln -s /usr/local/lib/libmcrypt.so.4.4.8 /usr/lib/libmcrypt.so.4.4.8
 ln -s /usr/local/lib/libmhash.a /usr/lib/libmhash.a
 ln -s /usr/local/lib/libmhash.la /usr/lib/libmhash.la
 ln -s /usr/local/lib/libmhash.so /usr/lib/libmhash.so
 ln -s /usr/local/lib/libmhash.so.2 /usr/lib/libmhash.so.2
 ln -s /usr/local/lib/libmhash.so.2.0.1 /usr/lib/libmhash.so.2.0.1
 ln -s /usr/local/bin/libmcrypt-config /usr/lib/libmcrypt-config   
 * [mcrypt](download.md#mcrypt)
 tar zxvf mcrypt-2.6.8.tar.gz
 cd mcrypt-2.6.8
 /sbin/ldconfig
 ./configure
 make && make install

第三步：安装[PHP](download.md#php)

 tar xzvf php-5.4.20.tar.gz
 cd php-5.4.20
 ./configure --prefix=/usr/local/php \
 --with-config-file-path=/usr/local/php/etc \
 --with-mysql=mysqlnd \
 --with-mysqli=mysqlnd \
 --with-pdo-mysql=mysqlnd \
 --with-iconv-dir=/usr/local \
 --with-freetype-dir \
 --with-jpeg-dir=/usr/lib \
 --with-png-dir=/usr/lib  \
 --with-zlib \
 --with-libxml-dir=/usr \
 --enable-xml \
 --disable-rpath \
 --enable-bcmath \
 --enable-shmop \
 --enable-sysvsem \
 --enable-inline-optimization \
 --with-curl \
 --enable-mbregex \
 --enable-fpm  \
 --enable-mbstring \
 --with-mcrypt \
 --with-gd \
 --enable-gd-native-ttf \
 --with-openssl \
 --with-mhash \
 --enable-pcntl \
 --enable-sockets \
 --with-xmlrpc \
 --enable-zip \
 --enable-soap \
 --with-gettext
 make ZEND_EXTRA_LIBS='-liconv'
 make install

第四步：安装PHP扩展模块

 A：[APC](download.md#APC)缓存
 tar zxvf APC-3.1.10.tgz
 cd APC-3.1.10
 /usr/local/php/bin/phpize
 ./configure --enable-apc --enable-apc-mmap --enable-apc-spinlocks --disable-apc-pthreadmutex --with-php-config=/usr/local/php/bin/php-config
 make && make install
 (/usr/local/php/lib/php/extensions/no-debug-non-zts-20100525/)
 B：imagick
 ref: ftp://ftp.kddlabs.co.jp/graphics/ImageMagick/
 [ImageMagick](download.md#ImageMagick)(如果安装不成功，可以安装新版本)
 tar zxvf ImageMagick.tar.gz
 cd ImageMagick-6.5.1-2/
 ./configure
 make && make install
 [imagick](download.md#imagick)(新版本目录结构变化 ln -s /usr/local/include/ImageMagick-6 /usr/local/include/ImageMagick)
 tar zxvf imagick-3.1.0RC1.tgz
 cd imagick-3.1.0RC1
 /usr/local/php/bin/phpize
 ./configure --with-php-config=/usr/local/php/bin/php-config
 make && make install

第五步：修改php.ini配置
 
 A：修改配置文件
 cp /usr/local/src/php-5.4.20/php.ini-development /usr/local/php/etc/php.ini
 修改 extension_dir = "/usr/local/php/lib/php/extensions/no-debug-non-zts-20100525/" (728line)
 增加 extension = "apc.so"
 增加 extension = "imagick.so"
 修改 date.timezone = "Asia/Chongqing"
 修改 output_buffering = On
 修改 memory_limit = 256M
 修改 mysqli.reconnect = On
 增加
 [apc]
 apc.enabled = 1
 apc.shm_segments = 1
 apc.shm_size = 30M
 apc.num_files_hint = 1000
 apc.user_entries_hint = 4096
 apc.stat=1
 apc.stat_ctime=0
 apc.ttl = 0
 apc.user_ttl = 0
 apc.slam_defense=0
 apc.write_lock = 1
 apc.file_update_protection=2
 apc.max_file_size=1M
 apc.filters=NULL
 apc.cache_by_default = 1
 B：创建用户
 groupadd www
 useradd -g www www
 mkdir -p /data/www
 chmod +w /data/www
 chown -R www:www /data/www
 C：修改php-fpm
 cp /usr/local/src/php-5.4.20/sapi/fpm/init.d.php-fpm.in /etc/init.d/php-fpm
 chmod 755 /etc/init.d/php-fpm
 cp /usr/local/src/php-5.4.20/sapi/fpm/php-fpm.conf.in /etc/php-fpm.conf
 vi /etc/init.d/php-fpm
 php_fpm_BIN=/usr/local/php/sbin/php-fpm
 php_fpm_CONF=/etc/php-fpm.conf
 php_fpm_PID=/var/run/php-fpm/php-fpm.pid
 mkdir -p /var/run/php-fpm
 chown www.www /var/run/php-fpm
 vi /etc/php-fpm.conf
 pid = /var/run/php-fpm/php-fpm.pid (25 line)
 error_log = /data/logs/php-fpm.log (32 line)
 user = www (147 line)
 group = www
 listen = 127.0.0.1:9000 (159 line)
 process.max=1000 (77 line)
 rlimit_files = 102400 (93 line)
 a 高端配置
 pm = static (214 line)
 pm.max_children = 500
 pm.max_requests = 2000
 b 一般配置 -- ★
 pm = dynamic (214 line)
 pm.max_children = 1000
 pm.start_servers = 100
 pm.min_spare_servers = 50
 pm.max_spare_servers = 100
 pm.max_requests = 2000
 D：启动
 /sbin/chkconfig --add php-fpm
 /sbin/chkconfig php-fpm on
 
 mkdir /data/logs
 chmod +w /data/logs
 chown -R www:www /data/logs/
 service php-fpm start
 lsof -i tcp:9000

 vi /etc/profile
 在 'export' 前加入(55 line)
 PAHT=$PATH:/usr/local/php/bin
 source /etc/profile
第六步：查看
 ps -ef | grep php-fpm

 Done!


备注：
 由于php 5.5+ 已经内置了 OPcache 缓存， 而且 5.5 + APC 缓存现在还不支持， 如果安装 5.5 + 可不用安装 APC
 如果想安装 Opcache ，编译时 打开  --enable-opcache， 然后 安装扩展模块，具体配置见PHP官网
