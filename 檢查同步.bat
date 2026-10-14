@echo off
rem Check that mobile core files match the desktop version (read only).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\check_sync.ps1" %*
