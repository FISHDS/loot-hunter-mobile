@echo off
chcp 65001 >nul
rem 把電腦版（LOOT HUNTER CC）的核心規則同步到手機版。手機版自己的畫面（ui.js、main.js、m.css、index.html）不會被蓋掉。
set SRC=%~dp0..\LOOT HUNTER CC
set DST=%~dp0
for %%F in (core data items character map pack sim game sprites audio music render) do copy /Y "%SRC%\js\%%F.js" "%DST%js\%%F.js" >nul
copy /Y "%SRC%\tests\rules.test.js" "%DST%tests\rules.test.js" >nul
copy /Y "%SRC%\tests\load.js" "%DST%tests\load.js" >nul
echo 已同步核心規則。
echo 上傳到網站前，記得把 sw.js 裡的 VERSION 和 index.html 的 ?v= 版本號加一，手機才會換成新版。
pause
