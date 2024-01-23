<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Clientside"])
    ui.includeCss("cdss", "style.css")

%>


<script type="application/javascript">
    var global = window;
</script>

<script src="/openmrs/ms/uiframework/resource/cdss/scripts/cdss.js">
</script>


<h1>Patient</h1>

<div id="patient-view">

</div>

<h1>Results</h1>

<div id="result-view">

</div>




<script async>

    // Set the endpoints
    global.cdss.endpoints = {
        "metadata": {
            "systemName": "OpenMRS", "remoteAddress": "http://localhost:8080/openmrs",
        },
        "patientById": {
            address: "http://localhost:8080/openmrs/ws/fhir2/R4/Patient/{{patientId}}",
            method: "GET",
        },
        "medicationRequestByPatientId": {
            address: "http://localhost:8080/openmrs/ws/fhir2/R4/MedicationRequest/{{medicationRequestId}}",
            method: "GET",
        },
        "medicationByMedicationRequestId": {
            address: "http://localhost:8080/openmrs/ws/fhir2/R4/Medication/{{medicationId}}",
            method: "GET",
        },
        "immunizationByPatientId": {
            address: "http://localhost:8080/openmrs/ws/fhir2/R4/Immunization/{{patientId}}",
            method: "GET",
        },
        "observationByPatientId": {
            address: "http://localhost:8080/openmrs/ws/fhir2/R4/Observation/{{patientId}}",
            method: "GET",
        },
        "ruleById": {
            address: "http://localhost:8080/openmrs/cdss/rule/{{ruleId}}.json",
            method: "GET",
        }

    };


    async function doCoolStuff() {

        let patientId = "${patientId}";
        let ruleId = "age-1.json";

        let result = await global.cdss.executeRuleWithPatient(patientId, ruleId);

        document.getElementById("result-view").innerHTML = "<pre>Inpopulation:" + result[patientId].InPopulation + "</pre>";

        document.getElementById("patient-view").innerHTML = "<pre>" + patientId + "</pre>";

    }

    doCoolStuff();



</script>