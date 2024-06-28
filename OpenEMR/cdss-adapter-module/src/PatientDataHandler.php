<?php

namespace OpenEMR\Modules\PatientDataHandler;


use OpenEMR\Common\Csrf\CsrfUtils;

use OpenEMR\Common\Http\HttpRestRequest;
use OpenEMR\Common\Http\HttpRestRouteHandler;

class PatientDataHandler
{
    public static function getPatientUUId($patientId)
    {
        $query      = "SELECT * FROM patient_data where pid=?";
        $pat_data   = sqlQuery($query, array($patientId));
        $uuid = $pat_data['uuid'];
        return $uuid;
    }

    public static function getFHIRId($patientUUId)
    {
        // Initialize the REST configuration
        require_once(__DIR__ . "/../../_rest_config.php");
        $restConfig = RestConfig::GetInstance();
        $restConfig::setNotRestCall();
    
        // Create a new REST request
        $restRequest = new HttpRestRequest($restConfig, $_SERVER);
        $restRequest->setRequestMethod("GET");
        $restRequest->setApiType("fhir");
        $restRequest->setRequestPath("/fhir/Patient/" . urlencode($patientUUId));
        $restRequest->setIsLocalApi(true);
    
        // Dispatch the request using the route handler
        $response = HttpRestRouteHandler::dispatch($restConfig::$FHIR_ROUTE_MAP, $restRequest, 'direct-json');
    
        // Decode JSON response
        $data = json_decode($response, true);
    
        // Handle the data as needed
        if ($data) {
            // Process your data here
            return $data;
        } else {
            echo 'No data returned or JSON decode error';
            return null;
        }

    // Other methods to handle various functionalities like generateParametersAndCheckRules, generateConditionFHIRResponse, etc.
    
    // Since PHP is server-side, you might need to adapt these methods significantly,
    // especially if they rely on client-side actions or browser-specific features.
}
}
?>


