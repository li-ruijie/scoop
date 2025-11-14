@ECHO OFF
SETLOCAL

SET SCOOP_BIN=D:\Env\scoop\local\apps\scoop\current\bin
SET BUCKET_DIR=%~dp0bucket

powershell -NoProfile -ExecutionPolicy Bypass -Command "& '%SCOOP_BIN%\checkver.ps1' -Dir '%BUCKET_DIR%' -Update"

ENDLOCAL
