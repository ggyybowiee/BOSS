#!/bin/sh
VERSION=/opt/wisecloud/boss/boss_web/version

echo -e "\033[32;49;1m [-----ProductName:$(head -n1 ${VERSION} | tail -n1 | cut -d'=' -f2)-----] \033[39;49;0m"
echo -e "\033[32;49;1m [-----ProductVersion:$(head -n2 ${VERSION} | tail -n1 | cut -d'=' -f2)-----] \033[39;49;0m"
echo -e "\033[32;49;1m [-----ProductProvider:$(head -n3 ${VERSION} | tail -n1 | cut -d'=' -f2)-----] \033[39;49;0m"
echo -e "\033[32;49;1m [-----CreateTime:$(head -n4 ${VERSION} | tail -n1 | cut -d'=' -f2)-----] \033[39;49;0m"

process_pid=`ps -ef | grep "/opt/wisecloud/boss/boss_web/nginx/sbin/nginx" | grep -v "grep" |  awk '{print $2}'`
if [ ${process_pid} ];then
	process_starttime=`ps -p ${process_pid} -o lstart | tail -n 1`
	process_starttime=`date -d "${process_starttime}" +"%Y-%m-%d %H:%M:%S"`
else
	process_starttime='null'
fi
echo -e "\033[32;49;1m [-----ProcessStarttime:${process_starttime}-----] \033[39;49;0m"


process=`ps -ef |grep /opt/wisecloud/boss/boss_web/nginx/sbin/nginx |grep -v "grep" |wc -l`
if [ ${process} -eq 1 ];then
    echo -e "\033[32;49;1m [-----Server status:started-----] \033[39;49;0m"
else
    echo -e "\033[31;49;1m [-----Server status:stopped-----] \033[39;49;0m"
fi
exit 0

