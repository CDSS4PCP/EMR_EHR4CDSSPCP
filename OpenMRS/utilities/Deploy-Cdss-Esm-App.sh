#!/bin/bash
set -e

: '
================================================================================
Script: Deploy-Cdss-Esm-App.sh

Description:
------------
This script deploys the OpenMRS CDSS ESM  app into
a running Docker container hosting an OpenMRS O3 frontend.

The script accepts two parameters:
  1. Docker container ID or name for the Frontend container!
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
  ./Deploy-Cdss-Esm-App.sh <container_id> <path_to_zip_file>

Example:
--------
  ./Deploy-Cdss-Esm-App.sh openmrs_container ./openmrs-esm-cdss-app-1.0.0-ALPHA.zip

Requirements:
-------------
- jq (for JSON manipulation)
- unzip
- Docker CLI
================================================================================
'



# --- Input Arguments ---
CONTAINER_ID="$1"
ZIP_FILE="$2"

if [[ -z "$CONTAINER_ID" || -z "$ZIP_FILE" ]]; then
  echo "Usage: $0 <container_id> <path_to_zip_file>"
  exit 1
fi

# --- Derived Variables ---
TMP_DIR="cdss-deploy-temp"
trap "rm -rf $TMP_DIR" EXIT

ZIP_BASENAME=$(basename "$ZIP_FILE")
VERSION=$(echo "$ZIP_BASENAME" | sed -n 's/.*openmrs-esm-cdss-app-\(.*\)\.zip/\1/p')

if [[ -z "$VERSION" ]]; then
  echo "❌ Error: Could not extract version from ZIP filename. Expected format: openmrs-esm-cdss-app-<VERSION>.zip"
  exit 1
fi

APP_DIR="openmrs-esm-cdss-app-$VERSION"
CONTAINER_WEB_PATH="/usr/share/nginx/html"

# --- Step 1: Unpack zip file ---
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
unzip "$ZIP_FILE" -d "$TMP_DIR"

# --- Step 2: Copy dist to container ---
docker cp "$TMP_DIR/dist" "$CONTAINER_ID:$CONTAINER_WEB_PATH/$APP_DIR"

# --- Step 3: Copy routes.registry.json from container ---
docker cp "$CONTAINER_ID:$CONTAINER_WEB_PATH/routes.registry.json" "$TMP_DIR/routes.registry.json"

# --- Step 4: Update routes.registry.json ---
ROUTES_JSON=$(cat "$TMP_DIR/routes.json")
jq --argjson newRoute "$ROUTES_JSON" '.["@openmrs/esm-cdss-app"] = $newRoute' \
  "$TMP_DIR/routes.registry.json" > "$TMP_DIR/routes.registry.updated.json"

# --- Step 5: Copy updated routes.registry.json to container ---
docker cp "$TMP_DIR/routes.registry.updated.json" "$CONTAINER_ID:$CONTAINER_WEB_PATH/routes.registry.json"

# --- Step 6: Copy importmap.json from container ---
docker cp "$CONTAINER_ID:$CONTAINER_WEB_PATH/importmap.json" "$TMP_DIR/importmap.json"

# --- Step 7: Modify importmap.json ---
IMPORT_PATH="./$APP_DIR/openmrs-esm-cdss-app.js"
jq --arg path "$IMPORT_PATH" '.imports["@openmrs/esm-cdss-app"] = $path' \
  "$TMP_DIR/importmap.json" > "$TMP_DIR/importmap.updated.json"

# --- Step 8: Copy updated importmap.json to container ---
docker cp "$TMP_DIR/importmap.updated.json" "$CONTAINER_ID:$CONTAINER_WEB_PATH/importmap.json"

# --- Step 9: Restart the container ---
docker restart "$CONTAINER_ID"

echo "✅ CDSS App deployed successfully to container $CONTAINER_ID (version $VERSION)"
