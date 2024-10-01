$env:OMRS_BACKEND_CONTAINER_ID = "a0b86c3238c5";
echo "Using $env:OMRS_BACKEND_CONTAINER_ID as the backend container";
docker cp cdss-1.0.0-SNAPSHOT.omod $env:OMRS_BACKEND_CONTAINER_ID":/openmrs/data/modules/cdss-1.0.0-SNAPSHOT.omod";
echo "Restarting container $env:OMRS_BACKEND_CONTAINER_ID"; docker container restart $env:OMRS_BACKEND_CONTAINER_ID;
exit;