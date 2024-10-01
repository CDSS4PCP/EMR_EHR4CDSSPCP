<?php

/**
 * Sample HTML page
 *
 * @package   OpenEMR
 * @link      http://www.open-emr.org
 *
 * @author    Stephen Nielson <stephen@nielson.org>
 * @copyright Copyright (c) 2021 Stephen Nielson <stephen@nielson.org>
 * @license   https://github.com/openemr/openemr/blob/master/LICENSE GNU General Public License 3
 */
use OpenEMR\Common\Http\HttpRestRequest;
use OpenEMR\Common\Http\HttpRestRouteHandler;



use OpenEMR\Common\Csrf\CsrfUtils;
use OpenEMR\Core\Header;

require_once(__DIR__ . "/../../../../../interface/globals.php");
require_once(__DIR__ . "/../../../../../_rest_config.php");


?>

<!DOCTYPE html>
<html>

<head>
    <?php Header::setupAssets('jquery'); ?>
    <script src="cdss.js"></script> 


    <script>
        const apicsrftoken = <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
    </script>
    <script>
        function testFetchApi() {
            fetch('/../../../../../../apis/fhir/Patient', {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {
                    generatePatientsList(data);
                })
                .catch(error => console.error(error));
        }

        $(function () {
            testFetchApi();
        });

        function testFetchApiList() {
            fetch('/../../../../../../apis/fhir/Patient?' + 'patient=99eed1f5-d1dd-430f-b9a0-18f1aedb52d8', {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {

                    document.getElementById('fetchapi').innerHTML = JSON.stringify(data);
                })
                .catch(error => console.error(error));
        }

        $(function () {
            testFetchApi();
        });

        function generatePatientsList(data) {
            const patientsList = document.getElementById('patients-list'); // Get the patients-list element
            patientsList.innerHTML = ''; // Clear previous content

            const selectList = document.createElement('select'); // Create a select element

            const patients = data.entry.map(entry => ({
                id: entry.resource.id,
                name: entry.resource.name[0].family + ' ' + entry.resource.name[0].given[0]
            }));

            patients.forEach(patient => {
                const option = document.createElement('option');
                option.textContent = patient.name;
                option.value = patient.id;
                selectList.appendChild(option);
            });

            selectList.addEventListener('change', () => {
                const selectedPatientId = selectList.value;
                handlePatientClick(selectedPatientId);
            });

            patientsList.appendChild(selectList);
        }


        // async function handlePatientClick(patientId) {
        //     console.log('Selected patient with ID:', patientId);
        //     //'mmr_between_12mon_to_4yr_1dose_between_12to15mon_pregnant', 
        //     // 'mmr_between_12mon_to_4yr_1dose_between_12to15mon',
        //     //     'mmr_betwwen_12monto4yr_1st_dose_<4week',
        //     //     'mmr_no_vaccine_record_between_12to47_months',

        //     try {
        //         patientData = getPatientDetails(patientId);
        //         console.log('patientDta ' +patientData);
        //         let ruleName = 'mmr_between_12mon_to_4yr_1dose_between_12to15mon';
        //         let response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + ruleName + '.json');
        //         const ruleData = await response.json();

        //         response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + 'FHIRHelpers.json');
        //         const library = await response.json();

        //         immunizationData = getImmunizationData(patientId);

        //         console.log('immunizationData ' +immunizationData);
                

        //         // const result = await window.executeCql(patientData,ruleData,library, immunizationData);
        //         // console.log(result); // Handle the result as needed
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        async function handlePatientClick(patientId) {
    console.log('Selected patient with ID:', patientId);

    try {
        // Await the async function to get the actual patient data
        const patientData = await getPatientDetails(patientId);
        console.log('patientData', patientData); // Use 'console.log' directly with the object to properly log it

        let ruleName = 'MMR_Rule4';
        let response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + ruleName + '.json');
        const ruleData = await response.json();

        response2 = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/FHIRHelpers.json');
        const library = await response2.json();

        // Await the async function to get the actual immunization data
        const immunizationData = await getImmunizationData(patientId);
        // console.log('immunizationData', immunizationData); // Use 'console.log' directly with the object to properly log it
        console.log(library);
        const result = await window.executeCql(patientData, ruleData, {'FHIRHelpers': library}, {'Imm': immunizationData});
        console.log('Result:', result); // Log the actual result
        displayRuleResults(result[patientId]);
    } catch (error) {
        console.error('Error:', error);
    }
}



      

        async function getPatientDetails(patientid)  {
         
                let url = 'http://localhost:8300/apis/fhir/Patient/'+patientid;

                const response = await fetch(url, {
                    credentials: 'same-origin',
                    method: 'GET',
                    headers: new Headers({
                        'apicsrftoken': apicsrftoken
                    })
                });
                const data = await response.json();


                console.log(JSON.stringify(data));
                return data;
        }

        async function getImmunizationData(patientid)  {
         
            let immunizationnUrl = `http://localhost:8300/apis/fhir/Immunization?patient=${patientid}`;

            // Fetch Medication resources for the patient
            let immunizationResponse = await fetch(immunizationnUrl, {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': apicsrftoken
                })
            });

            if (!immunizationResponse.ok) {
                throw new Error('Failed to fetch Medication data.');
            }

            let immunizationData = await immunizationResponse.json();
            return immunizationData;
        }

        function displayRuleResults(result) {
            const resultElement = document.getElementById('patients-result');
            resultElement.innerHTML = '';  // Clear existing content

            // ruleResults.forEach(result => {
            //     const content = `Rule Name: ${result.ruleName}<br>In Population: ${result.inPopulation}<br>Recommendation: ${result.recommendation}<br><br>`;
            //     resultElement.innerHTML += content;  // Append each rule's result
            // });
            const content = `In Population: ${result.InPopulation}<br>Recommendation: ${result.Recommendation}<br><br>`;
resultElement.innerHTML += content; 
        }


        async function generateParametersAndCheckRules(patientId) {
            try {
                patientData = getPatientDetails(patientId);
                const response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + ruleName + '.json');
                const ruleData = await response.json();

                response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + FHIRHelpers + '.json');
                const library = await response.json();

                immunizationData = getImmunizationData(patientId);
                

                const result = await window.executeCql(patientData,ruleData,library, parameters);
                console.log(result); // Handle the result as needed
            } catch (error) {
                console.error(error);
            }
        }

        function generateConditionFHIRResponse(patientId) {
            fetch('/../../../../../../apis/fhir/Condition?' + 'patient=' + patientId, {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => console.error(error));
        }


        function generateMedicationFHIRResponse(patientId) {
            fetch('/../../../../../../apis/fhir/Medication?' + 'patient=' + patientId, {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {

                    document.getElementById('patient-medication-fhir-response').innerHTML = JSON.stringify(data);
                    const entryList = data.entry.map(entry => entry.resource); // Extracting the 'resource' from each entry
                    return entryList;
                })
                .catch(error => console.error(error));
        }



        function generateMedicationRequestFHIRResponse(patientId) {
            fetch('/../../../../../../apis/fhir/MedicationRequest?' + 'patient=' + patientId, {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {

                    document.getElementById('patient-medication-request-fhir-response').innerHTML = JSON.stringify(data);
                    const entryList = data.entry.map(entry => entry.resource); // Extracting the 'resource' from each entry
                    return entryList;
                })
                .catch(error => console.error(error));
        }



        function generatePrescriptionFHIRResponse() {
            fetch('/../../../../../../apis/prescription', {
                credentials: 'same-origin',
                method: 'GET',
                headers: new Headers({
                    'apicsrftoken': <?php echo js_escape(CsrfUtils::collectCsrfToken('api')); ?>
                })
            })
                .then(response => response.json())
                .then(data => {

                    document.getElementById('patient-prescription-fhir-response').innerHTML = JSON.stringify(data);
                    const entryList = data.entry.map(entry => entry.resource); // Extracting the 'resource' from each entry
                    return entryList;
                })
                .catch(error => console.error(error));
        }





        function generatePatientsTable(data) {
            const patientsTable = document.getElementById('patients-table'); // Get the patients-table element
            patientsTable.innerHTML = ''; // Clear previous content

            const table = document.createElement('table'); // Create a table element
            const thead = document.createElement('thead'); // Create a table header element
            const tbody = document.createElement('tbody'); // Create a table body element

            // Create table header row
            const headerRow = document.createElement('tr');
            const headerNames = ['Name', 'Gender', 'Date of Birth', 'InDemographics'];
            headerNames.forEach(name => {
                const th = document.createElement('th');
                th.textContent = name;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create table body rows
            const patientResults = data.patientResults;

            Object.keys(patientResults).forEach(patientId => {
                const patientData = patientResults[patientId].Patient;
                const inDemographicValue = patientResults[patientId].InPopulation;

                const row = document.createElement('tr');

                const cellName = document.createElement('td');
                cellName.textContent = `${patientData.name[0].prefix[0].value} ${patientData.name[0].given[0].value} ${patientData.name[0].family.value}`;
                row.appendChild(cellName);

                const cellGender = document.createElement('td');
                cellGender.textContent = patientData.gender.value;
                row.appendChild(cellGender);

                const cellBirthDate = document.createElement('td');
                cellBirthDate.textContent = patientData.birthDate.value;
                row.appendChild(cellBirthDate);

                const cellInDemographics = document.createElement('td');
                cellInDemographics.textContent = inDemographicValue;
                row.appendChild(cellInDemographics);

                // Add styling for space between columns
                [cellName, cellGender, cellBirthDate, cellInDemographics].forEach(cell => {
                    cell.style.padding = '10px'; // Adjust the padding value as needed
                });

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            patientsTable.appendChild(table);
        }


    </script>
    <title>CDSS Module</title>
</head>

<body>
    <h1>Patient Details</h1>
    <div id="fetchapi"></div>
    <div id="patients-list"></div>
    Patient Results
    
    <div id="patients-result"></div>

   <a href="configure-rules.php" class="button-style">Configure Rules</a>



    <!-- 
    <?php echo phpinfo(); ?> -->

</body>

</html>