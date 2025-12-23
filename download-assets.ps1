#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Download all assets for Unlock Our Love wedding invitation game
.DESCRIPTION
    Downloads fonts, background music, and optional placeholder images from open/free sources
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$root = $PSScriptRoot
$assetsRoot = Join-Path $root 'public\assets'

# User-Agent for web requests
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Unlock Our Love - Asset Downloader" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# 1. FONTS (Google Fonts - OFL Licensed)
# ============================================================
Write-Host "[1/3] Downloading Fonts..." -ForegroundColor Yellow

$fontsDir = Join-Path $assetsRoot 'fonts'
New-Item -ItemType Directory -Path $fontsDir -Force | Out-Null

# Playfair Display (elegant serif) + Inter (clean sans-serif)
$cssUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600&display=swap'

Write-Host "  - Fetching Google Fonts CSS..."
$css = (Invoke-WebRequest -Uri $cssUrl -Headers @{ 'User-Agent' = $ua }).Content

# Extract all woff2 URLs
$pattern = "url\((https:[^)]+)\) format\('woff2'\)"
$urls = [regex]::Matches($css, $pattern) | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

if (-not $urls -or $urls.Count -eq 0) {
    Write-Warning "No woff2 URLs found. Fonts may not download correctly."
} else {
    Write-Host "  - Found $($urls.Count) font files. Downloading..."
    
    $i = 0
    $urlMap = @{}
    
    foreach ($u in $urls) {
        $i++
        $fileName = "font-{0:D2}.woff2" -f $i
        $outFile = Join-Path $fontsDir $fileName
        
        try {
            Invoke-WebRequest -Uri $u -Headers @{ 'User-Agent' = $ua } -OutFile $outFile
            $urlMap[$u] = "./$fileName"
            Write-Host "    ✓ $fileName" -ForegroundColor Green
        } catch {
            Write-Warning "Failed to download $fileName : $_"
        }
    }
    
    # Create local fonts.css
    $localCss = $css
    foreach ($url in $urlMap.Keys) {
        $localCss = $localCss.Replace($url, $urlMap[$url])
    }
    
    $fontsFile = Join-Path $fontsDir 'fonts.css'
    Set-Content -Path $fontsFile -Value $localCss -Encoding UTF8
    Write-Host "  ✓ Created fonts.css" -ForegroundColor Green
}

# ============================================================
# 2. BACKGROUND MUSIC (Royalty-free)
# ============================================================
Write-Host ""
Write-Host "[2/3] Downloading Background Music..." -ForegroundColor Yellow

$audioDir = Join-Path $assetsRoot 'audio'
New-Item -ItemType Directory -Path $audioDir -Force | Out-Null

# Using a royalty-free romantic track from Free Music Archive (CC0/Public Domain)
# Fallback: Direct link to a CC0 romantic piano piece
$musicSources = @(
    @{
        Name = "romantic-piano.mp3"
        Url = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_4a8ef1dc83.mp3?filename=love-song-149387.mp3"
        License = "Pixabay License (Free for commercial use)"
    }
)

foreach ($source in $musicSources) {
    $outFile = Join-Path $audioDir $source.Name
    
    try {
        Write-Host "  - Downloading: $($source.Name)..."
        Invoke-WebRequest -Uri $source.Url -Headers @{ 'User-Agent' = $ua } -OutFile $outFile
        Write-Host "    ✓ $($source.Name) (License: $($source.License))" -ForegroundColor Green
        
        # Create audio license file
        $audioLicenseFile = Join-Path $audioDir 'LICENSE.md'
        $licenseContent = @"
# Audio License

**File:** $($source.Name)
**Source:** $($source.Url)
**License:** $($source.License)

This audio track is free to use for personal and commercial projects.
"@
        Set-Content -Path $audioLicenseFile -Value $licenseContent -Encoding UTF8
        
    } catch {
        Write-Warning "Failed to download music: $_"
        Write-Host "  ℹ You can manually add your own music file to: $audioDir" -ForegroundColor Cyan
    }
}

# ============================================================
# 3. PLACEHOLDER COUPLE PHOTOS (Optional - Unsplash)
# ============================================================
Write-Host ""
Write-Host "[3/3] Downloading Placeholder Images..." -ForegroundColor Yellow

$imagesDir = Join-Path $assetsRoot 'images'
New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null

# Unsplash Source API for royalty-free romantic/wedding images
$photoSources = @(
    @{
        Name = "couple-1.jpg"
        Url = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
        Description = "Wedding couple photo"
    },
    @{
        Name = "couple-2.jpg"
        Url = "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80"
        Description = "Romantic couple photo"
    }
)

foreach ($photo in $photoSources) {
    $outFile = Join-Path $imagesDir $photo.Name
    
    try {
        Write-Host "  - Downloading: $($photo.Name)..."
        Invoke-WebRequest -Uri $photo.Url -Headers @{ 'User-Agent' = $ua } -OutFile $outFile
        Write-Host "    ✓ $($photo.Name) ($($photo.Description))" -ForegroundColor Green
    } catch {
        Write-Warning "Failed to download $($photo.Name): $_"
    }
}

# Create images license file
$imagesLicenseFile = Join-Path $imagesDir 'IMAGES-LICENSE.md'
$imagesLicense = @"
# Image Licenses

All placeholder couple photos are from Unsplash and are free to use under the Unsplash License.

**License:** https://unsplash.com/license
- Free to use for commercial and non-commercial purposes
- No permission needed
- Attribution appreciated but not required

**Note:** These are placeholder images. Replace them with your actual couple photos before deployment.
"@
Set-Content -Path $imagesLicenseFile -Value $imagesLicense -Encoding UTF8

# ============================================================
# Summary
# ============================================================
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Download Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Assets downloaded to:" -ForegroundColor White
Write-Host "  • Fonts:  $fontsDir" -ForegroundColor Gray
Write-Host "  • Audio:  $audioDir" -ForegroundColor Gray
Write-Host "  • Images: $imagesDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Replace placeholder images with your actual couple photos"
Write-Host "  2. (Optional) Replace music with your preferred track"
Write-Host "  3. Update config file with your wedding details"
Write-Host "  4. Run the app and test all assets load correctly"
Write-Host ""
