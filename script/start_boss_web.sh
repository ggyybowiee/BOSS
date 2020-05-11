#!/bin/bash
/opt/wisecloud/boss/boss_web/nginx/sbin/nginx -c /opt/wisecloud/boss/boss_web/nginx/conf/nginx.conf -p /opt/wisecloud/boss/boss_web/nginx/
ps aux | grep /opt/wisecloud/boss/boss_web/nginx/sbin/nginx
status_boss_web
exit 0