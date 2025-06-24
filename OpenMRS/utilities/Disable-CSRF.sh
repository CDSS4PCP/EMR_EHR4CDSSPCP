#!/bin/bash

: '
This script disables CSRF protection in OpenMRS by modifying the csrfguard.properties file inside the WAR package.

Purpose:
    - Used to patch an OpenMRS instance running inside a Docker container to disable CSRF protection.

Summary of Actions:
    1. Copy the WAR file from the Docker container
    2. Extract the contents of the WAR
    3. Search for the line:
         org.owasp.csrfguard.Enabled = true
       and replace it with:
         org.owasp.csrfguard.Enabled = false
    4. Repack the WAR file
    5. Copy it back to the container and restart the container

Usage:
    ./Disable-CSRF.sh <container_id>

Requirements:
    - Docker must be installed and available in your PATH
    - unzip and zip must be installed on the system
'


set -e  # Exit on any error

# --- Configuration ---
CONTAINER_ID="$1"
WAR_PATH_IN_CONTAINER="/openmrs/distribution/openmrs_core/openmrs.war"
TMP_DIR="disable-csrf-tmp"
TARGET_FILE_PATH="WEB-INF/csrfguard.properties" # relative path inside WAR
REGEX_PATTERN='^org\.owasp\.csrfguard\.Enabled[ ]*=[ ]*true$'
REPLACEMENT_LINE='org.owasp.csrfguard.Enabled = false'
UPDATED_WAR_NAME="openmrs-updated.war"

# --- Checks ---
if [[ -z "$CONTAINER_ID" ]]; then
  echo "Usage: $0 <container_id>"
  exit 1
fi

# Create temp workspace
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

# Copy WAR from container to host
echo "[1/6] Copying WAR from container..."
docker cp "${CONTAINER_ID}:${WAR_PATH_IN_CONTAINER}" "$TMP_DIR/openmrs-old.war"

# Extract WAR
echo "[2/6] Extracting WAR..."
cd "$TMP_DIR"
mkdir extracted
cd extracted
unzip ../openmrs-old.war > /dev/null

# Modify specific line
echo "[3/6] Modifying line matching regex in $TARGET_FILE_PATH..."
if [[ ! -f "$TARGET_FILE_PATH" ]]; then
  echo "Target file '$TARGET_FILE_PATH' not found in WAR"
  exit 2
fi

# Replace the regex
sed -E -i "s|${REGEX_PATTERN}|${REPLACEMENT_LINE}|" "$TARGET_FILE_PATH"

# Repack WAR
echo "[4/6] Repacking WAR..."
zip -r "../$UPDATED_WAR_NAME" . > /dev/null

# Copy updated WAR back to container
echo "[5/6] Copying updated WAR back into container..."
docker cp "../$UPDATED_WAR_NAME" "${CONTAINER_ID}:${WAR_PATH_IN_CONTAINER}"

echo "[5b] Restarting container..."
docker container restart "${CONTAINER_ID}"

# Clean up
echo "[6/6] Cleaning up..."
rm -rf "$TMP_DIR"

echo "✅ WAR modification complete."
