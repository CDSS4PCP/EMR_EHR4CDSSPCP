<#
.SYNOPSIS
    Disables CSRF protection in OpenMRS by modifying the csrfguard.properties file inside the WAR package.

.DESCRIPTION
    This script is intended for use on Windows systems with Docker installed.
    It connects to a running Docker container hosting OpenMRS, extracts the WAR file,
    modifies the CSRF configuration to disable protection, repackages the WAR,
    replaces the original file inside the container, and restarts the container.

    Actions performed:
        1. Copy the WAR file from the Docker container
        2. Extract the contents of the WAR
        3. Find and replace the line:
           org.owasp.csrfguard.Enabled = true
           with
           org.owasp.csrfguard.Enabled = false
        4. Repack the WAR file
        5. Copy it back to the container and restart the container

.PARAMETER ContainerId
    The ID or name of the Docker container running OpenMRS.

.EXAMPLE
    .\Disable-CSRF.ps1 -ContainerId <container_id>

.NOTES
    Requires Docker and PowerShell 5.0 or later.
#>


param (
    [Parameter(Mandatory = $true)]
    [string]$ContainerId
)

# --- Configuration ---
$WarPathInContainer = "/openmrs/distribution/openmrs_core/openmrs.war"
$TmpDir = "disable-csrf-tmp"
$TargetFilePath = "WEB-INF/csrfguard.properties"
$RegexPattern = '^org\.owasp\.csrfguard\.Enabled\s*=\s*true$'
$ReplacementLine = 'org.owasp.csrfguard.Enabled = false'
$UpdatedWarName = "openmrs-updated.war"

# --- Setup temp workspace ---
if (Test-Path $TmpDir) {
    Remove-Item -Recurse -Force $TmpDir
}
New-Item -ItemType Directory -Path $TmpDir | Out-Null

# --- Step 1: Copy WAR from container ---
Write-Host "[1/6] Copying WAR from container..."
docker cp "${ContainerId}:${WarPathInContainer}" "$TmpDir\openmrs-old.war"

# --- Step 2: Extract WAR ---
Write-Host "[2/6] Extracting WAR..."
Expand-Archive -LiteralPath "$TmpDir\openmrs-old.war" -DestinationPath "$TmpDir\extracted" -Force

# --- Step 3: Modify line using regex ---
$FullTargetPath = Join-Path "$TmpDir\extracted" $TargetFilePath
if (-Not (Test-Path $FullTargetPath)) {
    Write-Error "Target file '$TargetFilePath' not found in WAR"
    exit 2
}

Write-Host "[3/6] Modifying line matching regex in $TargetFilePath..."
(Get-Content $FullTargetPath) |
    ForEach-Object {
        if ($_ -match $RegexPattern) {
            $ReplacementLine
        } else {
            $_
        }
    } | Set-Content $FullTargetPath

# --- Step 4: Repack WAR ---
Write-Host "[4/6] Repacking WAR..."
Compress-Archive -Path "$TmpDir\extracted\*" -DestinationPath "$TmpDir\$UpdatedWarName" -Force

# --- Step 5: Copy back to container ---
Write-Host "[5/6] Copying updated WAR back into container..."
docker cp "$TmpDir\$UpdatedWarName" "${ContainerId}:${WarPathInContainer}"

Write-Host "[5b] Restarting container..."
docker container restart $ContainerId | Out-Null

# --- Step 6: Clean up ---
Write-Host "[6/6] Cleaning up..."
Remove-Item -Recurse -Force $TmpDir

Write-Host "✅ WAR modification complete."
