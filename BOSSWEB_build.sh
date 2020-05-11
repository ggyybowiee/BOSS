#!/bin/sh

pwdDir=`pwd`
buildDir=/home/jenkins/workspace/
jobID="BOSS_WEB"
webdir="BOSS_WEB"
ver="3.1.1"
curday=$(date +%Y%02m%02d)
buildtime=$(date +"%Y-%02m-%02d %02H:%02M:%02S")
desdir="output"
svnVS=""

checkoutLocadData()
{
	cd ${buildDir}${jobID}
	
	rm -rf .svn
	
	#产生version文件
	echo "NEName=$webdir" > version
	echo "Version=$ver" >> version
	echo "Provider=小溪流" >> version
	echo "BuildTime=$curday" >> version

	cp -r dist/ software

	#创建打包输出目录
	if [ ! -d $desdir ]
	then
		mkdir -v $desdir
	else
		rm -rf $desdir/*        
	fi;

	echo "***开始打包！"
	
	#进入output目录
	cd ${desdir}

	#创建包目录
	if [ ! -d ${webdir}_${ver}_${curday} ]
	then
		mkdir -v ${webdir}_${ver}_${curday}
	else
		rm -rf ${webdir}_${ver}_${curday}/*
	fi;
	

	cd ${webdir}_${ver}_${curday}

	#复制需要的所有打包文件到此目录下
	cp ${buildDir}${jobID}/param.properties .
	cp -r ${buildDir}${jobID}/script .
	cp -r ${buildDir}${jobID}/software .
	cp ${buildDir}${jobID}/setup.sh .
	cp ${buildDir}${jobID}/rollback.sh .
	cp ${buildDir}${jobID}/version .

	
	#返回output目录
	cd ../

	#打包命令
	tar -zcf $webdir"_"$ver"_"$curday.tar.gz ${webdir}_${ver}_${curday}
	rm -rf ${webdir}_${ver}_${curday}
	echo "***打包结束！"
	#2018/4/17
}


#paramNum=$#
#if [ "$paramNum" != "4" ];then
#	echo "format must is :\"sh buildSVN.sh jobID svnURL webdir ver module\""
#	echo "jobID \"Jenkins Job Name.\""
#	echo "webdir \"code prefix.\""
#	echo "ver \"Version number.\""
#	echo "module \"One of beta and release.\""
#   exit 1;	
#fi;	

#jobID=$1
#if [ "${jobID}d" == "d" ]; then
#    echo "parameter must be JobID value!"
#    exit 1;
#fi;

#webdir=$2
#if [ "${webdir}d" == "d" ]; then
#    echo "parameter must be webdir value!"
#    exit 1;
#fi;

#ver=$3
#if [ "${ver}d" == "d" ]; then
#    echo "parameter must be ver value!"
#    exit 1;
#fi;

#module=$4
#if [ "${module}d" == "d" ]; then
#    echo "parameter must be module value!"
#    exit 1;
#fi;


checkoutLocadData;

exit 0;

