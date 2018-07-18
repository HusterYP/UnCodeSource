#!/bin/bash
#chkconfig:2345 80 30 

#jetty: start/stop/restart/status jetty


# Source function library
. /etc/rc.d/init.d/functions

#match these valuse to your environment
#################################################################################################
export JAVA_HOME=/usr/local/jdk1.7.0_65
#export CATALINA_HOME=/usr/local/jetty7.0.54
export CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/jre/lib/rt.jar
export PATH=$PATH:$JAVA_HOME/bin
#export JAVA_OPTS="-server -Xms512m -Xmx512m"
#################################################################################################


getPID(){
	PID=$(ps -ef | grep -v 'grep' | grep "java -jar jettyRunner.jar" | awk '{print $2}')
}
start(){
	getPID
	if [[ "${PID}X" != "X" ]]; then
		echo "Uncode is already running!"
	else
		echo "Uncode is starting ...."
		\cp ../conf/system.properties ../modules/WEB-INF/classes/
		#${JAVA_HOME}/bin/jave -jar ./jettyRunner.jar
		java -jar ./jettyRunner.jar
	fi
}
stop(){
	getPID
	if [[ "${PID}X" == "X" ]];then
		echo "Uncode is not running"
	else
		kill -9 $PID
	echo "Uncode is stop done"
	fi
}
restart(){
	getPID
	if [[ "${PID}" == "X" ]];then
		echo "Uncode is not running;and will be start"
		#${JAVA_HOME}/bin/jave -jar ./jettyRunner.jar
		java -jar ./jettyRunner.jar
		echo "Uncode is starting"
	else
		kill -9 $PID
		echo "Uncode is stop"
		\cp ./system.properties ./modules/WEB-INF/classes/
		#${JAVA_HOME}/bin/jave -jar ./jettyRunner.jar
		java -jar ./jettyRunner.jar
		echo "Uncode is starting ....."
	fi
}
status(){
	getPID
	if [[ "${PID}X" == "X" ]];then
		echo "Uncode is not running!"
	else
		echo "Uncode is running!"
	fi
}
version(){
	echo "Uncode version: 1.0.0"
}
case $1 in 
	start )
		start
		;;
	stop )
		stop
		;;
	restart )
		restart
		;;
	status )
		status
		;;
	version )
		version
		;;
	* )
		echo $"Usage: $0 {start|stop|restart|status}"
		exit 2
		;;
esac
