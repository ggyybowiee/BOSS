#!/bin/bash

echo "#回滚前先杀掉程序"
stop_boss_web.sh

#SETUP_URL
SETUP_URL=$(grep "SETUP_URL" param.properties | awk -F '=' '{print $2}')
echo "$SETUP_URL"
	
echo "#判断安装目录下的data备份目录是否存在"
if [ -d $SETUP_URL/data ]; then
	echo "SETUP_URL/data is exists!"
	echo "#判断data是否为空"
	if [ "`ls -A $SETUP_URL/data`" = "" ]; then
		echo "Data is empty, can not to rollback!"
		exit 0
	else
		echo "Data is not empty"
		echo "#移除安装目录的除了rollback.sh的其他文件"
		rm -rf $SETUP_URL/param.properties
		rm -rf $SETUP_URL/script
		rm -rf $SETUP_URL/software
		rm -rf $SETUP_URL/setup.sh
		rm -rf $SETUP_URL/version
		rm -rf $SETUP_URL/nginx
		
		echo "#将data目录内容回滚版本，除了rollback.sh"
		cp $SETUP_URL/data/param.properties $SETUP_URL
		cp -r $SETUP_URL/data/script $SETUP_URL
		cp -r $SETUP_URL/data/software $SETUP_URL
		cp $SETUP_URL/data/setup.sh $SETUP_URL
		cp $SETUP_URL/data/version $SETUP_URL
		cp -r $SETUP_URL/data/nginx $SETUP_URL
		
		#cp script/* /bin

	    yes|cp script/restart_boss_web.sh /bin/restart_boss_web
	    chmod 755 /bin/restart_boss_web

	    yes|cp script/start_boss_web.sh /bin/start_boss_web
	    chmod 755 /bin/start_boss_web

	    yes|cp script/status_boss_web.sh /bin/status_boss_web
	    chmod 755 /bin/status_boss_web

	    yes|cp script/stop_boss_web.sh /bin/stop_boss_web
	    chmod 755 /bin/stop_boss_web

		#ln -s $SETUP_URL/script/restart_DCMP_PC.sh /bin/restart_DCMP_PC
		#ln -s $SETUP_URL/script/start_DCMP_PC.sh /bin/start_DCMP_PC
		#ln -s $SETUP_URL/script/status_DCMP_PC.sh /bin/status_DCMP_PC
		#ln -s $SETUP_URL/script/stop_DCMP_PC.sh /bin/stop_DCMP_PC	
		
		echo "#启动程序"
		start_boss_web
	fi
	
else
	echo "Data is not exists,can not to rollback!"
	exit 0
fi
exit 0