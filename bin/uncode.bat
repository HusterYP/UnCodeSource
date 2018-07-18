@echo off
rem Licensed to the Apache Software Foundation (ASF) under one or more


if "%OS%" == "Windows_NT" setlocal
rem ---------------------------------------------------------------------------
rem $Id: uncode.bat 1344732 2015-01-26 14:08:02Z kkolinko $
rem ---------------------------------------------------------------------------

if ""%1"" == ""start"" goto doStart
if ""%1"" == ""restart"" goto doRestart
if ""%1"" == ""status"" goto doStatus
if ""%1"" == ""stop"" goto doStop
if ""%1"" == ""version"" goto doVersion

echo Usage:  Uncode ( commands ... )
echo commands:
echo   status             Start Uncode in a debugger
echo   start             Start Uncode in a separate window
echo   restart             Start Uncode in a separate window
echo   stop              Stop Uncode
echo   version           What version of Uncode are you running?
goto end

:doRestart
goto end

:doStart
shift
copy "%~d0%~p0..\conf\system.properties" "%~d0%~p0..\modules\WEB-INF\classes\system.properties"
java -jar jettyRunner.jar
goto end

:doStop
shift
taskkill /F /im java.exe
goto end

:doStatus
shift
SET status=1
(TASKLIST|FIND /I "java.exe"||SET status=0) 2>nul 1>nul
IF %status% EQU 1 (ECHO Uncode is already running.) ELSE (ECHO Uncode is not run.)
goto end


:doVersion
echo Uncode version: 1.0.0
goto end



:end
