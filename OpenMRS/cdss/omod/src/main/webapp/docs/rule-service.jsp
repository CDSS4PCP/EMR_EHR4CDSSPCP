<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>CDSS Rule Management API</title>
    <link rel="stylesheet" href="/openmrs/moduleResources/cdss/styles/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="/openmrs/moduleResources/cdss/javascript/swagger-ui-bundle.js" crossorigin></script>
<script>
    window.onload = () => {
        window.ui = SwaggerUIBundle({
            url: '/openmrs/moduleResources/cdss/openapi/rule-service-openapi.yaml',
            dom_id: '#swagger-ui',
        });
    };
</script>
</body>
</html>
