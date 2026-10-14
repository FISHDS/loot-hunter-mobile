# 檢查手機版和電腦版的核心規則是否一致（只看、不改任何檔案）
# 建立日期：2026-10-14
# 「不一致」代表：電腦版改了還沒同步，或是有人直接改了手機版的共用檔案（下次同步會被蓋掉）。
param([switch]$Quiet)
$dst = Split-Path -Parent $PSScriptRoot
$src = Join-Path (Split-Path -Parent $dst) 'LOOT HUNTER CC'
$files = @('core','data','items','character','map','pack','sim','game','sprites','kid','portrait','audio','music','render' | ForEach-Object { "js\$_.js" }) + @('tests\rules.test.js','tests\load.js')
$bad = 0
foreach ($f in $files) {
  $a = Join-Path $src $f; $b = Join-Path $dst $f
  if ((Test-Path $a) -and (Test-Path $b) -and ((Get-FileHash $a).Hash -eq (Get-FileHash $b).Hash)) { Write-Host "  一致：$f" }
  else { Write-Host "  不一致：$f" -ForegroundColor Red; $bad++ }
}
Write-Host ''
if ($bad) {
  Write-Host "有 $bad 個檔案不一致。電腦版改過的話，請點「同步核心.bat」；手機版的共用檔案被直接改了的話，請先把那段改動搬回電腦版再同步。" -ForegroundColor Yellow
} else { Write-Host '全部一致，可以上傳。' -ForegroundColor Green }
if (-not $Quiet) { Read-Host '按 Enter 關閉' | Out-Null }
exit $bad
