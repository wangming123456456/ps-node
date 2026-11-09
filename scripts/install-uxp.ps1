# Install the PS UXP plugin into Adobe's external plugin folder and enable UXP developer mode.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\install-uxp.ps1 [-Name a1b2c3d4_PS]
param(
    [string]$Name = "a1b2c3d4_PS"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repoRoot "ps-uxp"
if (-not (Test-Path (Join-Path $source "manifest.json"))) {
    throw "ps-uxp/manifest.json not found. Run this script from the ps-node repository."
}

# 1) UXP developer mode
$devDir = "C:\Program Files\Common Files\Adobe\UXP\Developer"
$devSettings = Join-Path $devDir "settings.json"
if (-not (Test-Path $devSettings)) {
    try {
        New-Item -ItemType Directory -Force -Path $devDir | Out-Null
        Set-Content -Path $devSettings -Value '{ "developer": true }' -Encoding ASCII
        Write-Host "[ok] UXP developer mode enabled: $devSettings"
    } catch {
        Write-Warning "Could not create $devSettings (run PowerShell as Administrator). PS plugin will not load until developer mode is enabled."
    }
} else {
    $content = Get-Content $devSettings -Raw
    if ($content -notmatch '"developer"\s*:\s*true') {
        Write-Warning "$devSettings exists but developer mode is not true. Please set: { \"developer\": true }"
    } else {
        Write-Host "[ok] UXP developer mode already enabled"
    }
}

# 2) Copy plugin folder
$destRoot = Join-Path $env:APPDATA "Adobe\UXP\Plugins\External"
$dest = Join-Path $destRoot $Name
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item (Join-Path $source "*") $dest -Recurse -Force
Write-Host "[ok] PS plugin copied to: $dest"

# 3) Force PS to scan the External plugins folder on every start.
# The UXP user plugin registry PluginsInfo\v1\PS.json suppresses the External scan whenever it exists,
# and PS rewrites it as an empty list {"plugins":[]} after loading External plugins, so the plugin
# disappears on the next restart. Replacing that file with a directory keeps the read failing forever.
$infoDir = Join-Path $env:APPDATA "Adobe\UXP\PluginsInfo\v1"
New-Item -ItemType Directory -Force -Path $infoDir | Out-Null
$infoFile = Join-Path $infoDir "PS.json"
if (Test-Path $infoFile -PathType Leaf) {
    $raw = Get-Content $infoFile -Raw
    if ($raw -match '"plugins"\s*:\s*\[\s*\]') {
        Remove-Item $infoFile -Force
        New-Item -ItemType Directory -Path $infoFile | Out-Null
        Write-Host "[ok] Empty UXP plugin registry replaced with a directory (keeps External scan enabled)"
    } else {
        Write-Warning "$infoFile has a non-empty user plugin registry; left untouched. If the plugin is missing after restart, back it up and delete it."
    }
} elseif (-not (Test-Path $infoFile)) {
    New-Item -ItemType Directory -Path $infoFile | Out-Null
    Write-Host "[ok] Created PS.json directory (forces the External plugin fallback)"
}

# 4) Summary
$manifest = Get-Content (Join-Path $dest "manifest.json") -Raw | ConvertFrom-Json
Write-Host ""
Write-Host "Plugin id:      $($manifest.id)"
Write-Host "Plugin name:    $($manifest.name)"
Write-Host "Plugin version: $($manifest.version)"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Restart Photoshop."
Write-Host "  2. Menu: Plugins (增效工具) -> PS node panel, open it once (the script only starts when the panel opens)."
Write-Host "  3. Start the relay/host first: node electron/ps-relay.cjs --port 23310 (or run the canvas host)."
