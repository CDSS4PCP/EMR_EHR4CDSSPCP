<#
================================================================================
Script: Deploy-Cdss-Esm-App.ps1

Description:
------------
This script deploys the OpenMRS CDSS ESM app into
a running Docker container hosting an OpenMRS O3 frontend.

The script accepts two parameters:
  1. Docker container ID or name for the Frontend container
  2. Path to a ZIP file containing the CDSS app (including dist/ and routes.json)

Steps Performed:
----------------
1. Unzips the provided ZIP file into a temporary working directory.
2. Copies the "dist" directory into the container under:
     /usr/share/nginx/html/openmrs-esm-cdss-app-<VERSION>
3. Extracts the container's routes.registry.json.
4. Adds a new entry "@openmrs/esm-cdss-app" to the routes registry using routes.json.
5. Pushes the updated routes.registry.json back into the container.
6. Extracts the container's importmap.json.
7. Adds a new entry "@openmrs/esm-cdss-app" pointing to the deployed app JS file.
8. Pushes the updated importmap.json back into the container.
9. Restarts the Docker container to apply changes.

Usage:
------
  .\Deploy-Cdss-Esm-App.ps1 <container_id> <path_to_zip_file>

Requirements:
-------------
- PowerShell 5.1+ or PowerShell Core
- Docker CLI
================================================================================
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$ContainerId,

    [Parameter(Mandatory = $true)]
    [string]$ZipFile
)

# --- Derived Variables ---
$TmpDir = "cdss-deploy-temp"
$ZipBaseName = [System.IO.Path]::GetFileName($ZipFile)
if ($ZipBaseName -match "openmrs-esm-cdss-app-(.*)\.zip") {
    $Version = $matches[1]
} else {
    Write-Error "❌ Error: Could not extract version from ZIP filename. Expected format: openmrs-esm-cdss-app-<VERSION>.zip"
    exit 1
}

$AppDir = "openmrs-esm-cdss-app-$Version"
$ContainerWebPath = "/usr/share/nginx/html"

# Clean up temp dir on exit
$cleanup = {
    if (Test-Path $TmpDir) {
        Remove-Item -Recurse -Force $TmpDir
    }
}
Register-EngineEvent PowerShell.Exiting -Action $cleanup

# --- Step 1: Unpack zip file ---
if (Test-Path $TmpDir) {
    Remove-Item -Recurse -Force $TmpDir
}
New-Item -ItemType Directory -Path $TmpDir | Out-Null
Expand-Archive -Path $ZipFile -DestinationPath $TmpDir

# --- Step 2: Copy dist to container ---
docker cp "$TmpDir\dist" "${ContainerId}:${ContainerWebPath}/${AppDir}"

# --- Step 3: Copy routes.registry.json from container ---
$RoutesRegistryPath = Join-Path $TmpDir "routes.registry.json"
docker cp "${ContainerId}:${ContainerWebPath}/routes.registry.json" "${RoutesRegistryPath}"

# --- Step 4: Update routes.registry.json ---
$RoutesRegistryRaw = Get-Content $RoutesRegistryPath -Raw
$RoutesRegistryObj = $RoutesRegistryRaw | ConvertFrom-Json

# Convert to hashtable so we can assign keys with special characters
$RoutesRegistry = @{}
$RoutesRegistryObj.PSObject.Properties | ForEach-Object {
    $RoutesRegistry[$_.Name] = $_.Value
}

$NewRoutes = Get-Content "$TmpDir\routes.json" -Raw | ConvertFrom-Json
$RoutesRegistry['@openmrs/esm-cdss-app'] = $NewRoutes

$RoutesRegistry | ConvertTo-Json -Depth 10 | Set-Content "$TmpDir\routes.registry.updated.json"


# --- Step 5: Copy updated routes.registry.json to container ---
docker cp "${TmpDir}\routes.registry.updated.json" "${ContainerId}:${ContainerWebPath}/routes.registry.json"

# --- Step 6: Copy importmap.json from container ---
$ImportmapPath = Join-Path $TmpDir "importmap.json"
docker cp "${ContainerId}:${ContainerWebPath}/importmap.json" "$ImportmapPath"


# --- Step 7: Modify importmap.json ---
$ImportmapRaw = Get-Content $ImportmapPath -Raw
$ImportmapObj = $ImportmapRaw | ConvertFrom-Json

# Ensure 'imports' exists and convert to hashtable
$Imports = @{}
if ($ImportmapObj.imports) {
    $ImportmapObj.imports.PSObject.Properties | ForEach-Object {
        $Imports[$_.Name] = $_.Value
    }
}
$ImportPath = "./$AppDir/openmrs-esm-cdss-app.js"
$Imports['@openmrs/esm-cdss-app'] = $ImportPath

# Reconstruct final importmap object
$Importmap = @{
    imports = $Imports
}
$Importmap | ConvertTo-Json -Depth 10 | Set-Content "$TmpDir\importmap.updated.json"


# --- Step 8: Copy updated importmap.json to container ---
docker cp "${TmpDir}\importmap.updated.json" "${ContainerId}:${ContainerWebPath}/importmap.json"

# --- Step 9: Restart the container ---
docker restart $ContainerId | Out-Null

Write-Host "✅ CDSS App deployed successfully to container $ContainerId (version $Version)"
