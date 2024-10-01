<?php

/**
 *
 * @package OpenEMR
 * @link    http://www.open-emr.org
 *
 * @author    Brad Sharp <brad.sharp@claimrev.com>
 * @copyright Copyright (c) 2022 Brad Sharp <brad.sharp@claimrev.com>
 * @license   https://github.com/openemr/openemr/blob/master/LICENSE GNU General Public License 3
 */

use OpenEMR\Modules\ClaimRevConnector\EligibilityData;
use OpenEMR\Modules\ClaimRevConnector\EligibilityInquiryRequest;
use OpenEMR\Modules\ClaimRevConnector\SubscriberPatientEligibilityRequest;
use OpenEMR\Modules\ClaimRevConnector\EligibilityObjectCreator;
use OpenEMR\Modules\ClaimRevConnector\ValueMapping;
use OpenEMR\Modules\CustomModuleSkeleton\PatientDataHandler;

use OpenEMR\Common\Csrf\CsrfUtils;

if ($pid == null) {
    echo xlt("Error retrieving patient.");
    exit;
}

//get uuid from pid 
$uuid = ValueMapping::getPatientUUId($pid);

// PatientDataHandler::fetchPatientData($pid);

//get patient fhir id from uuid
$data =ValueMapping::getFHIRId($uuid);


$rulesData = [
    ['rule_name' => 'Rule 0', 'in_population' => 'no', 'recommendation' => 'Action 1'],
    ['rule_name' => 'Rule 1', 'in_population' => 'nope', 'recommendation' => 'Action B'],
];
?>



<div id="rulesDataContainer" class="immunization-remainder-section">
    <!-- Content will be populated by JavaScript -->
</div>

<script type="module">
    
    const apicsrftoken = <?php echo json_encode(CsrfUtils::collectCsrfToken('api')); ?>; // Ensure JSON encoding and semicolon
    const patientId = "<?php echo htmlspecialchars($uuid, ENT_QUOTES, 'UTF-8'); ?>"; // Encode and add semicolon
// function loadScript(url, callback) {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = url;

//   // Optional: Provide a callback function to execute once the script is loaded
//   if (typeof callback === 'function') {
//       script.onload = callback;
//   }

//   // Append the script to the document's head or body
//   document.head.appendChild(script);
// }

// Usage: Load a JavaScript file and optionally define a callback function

function populateRulesData(rulesData) {
    const container = document.getElementById('rulesDataContainer');

    // Filter the data first to check if there are any entries to display
    const filteredData = rulesData.filter(rule => rule.inPopulation);

    if (filteredData.length > 0) { // Check if there's any data to show
        let tableHtml = `
           <style>
        .rule-table {
            width: 100%;
            border-collapse: collapse;
        }
        .rule-table th, .rule-table td {
            text-align: left;
            padding: 8px;
            border: none;
        }
        .rule-table th {
            background-color: #f2f2f2;
        }
        /* Define equal width for all columns */
        .rule-table th, .rule-table td {
            width: 33.33%; /* Adjust the percentage as needed */
        }
    </style>
            <table class="rule-table">
                <tr>
                    <th>Rule Name</th>
                    <th>Vaccine</th>
                    <th>Recommendation</th>
                </tr>`;

        filteredData.forEach(rule => {
            let actionCellContent = `<a href="#" onclick="loadImmunizations(event)">${rule.recommendation}</a>`;
        
            tableHtml += `
                <tr>
                    <td>${rule.ruleName}</td>
                    <td>${rule.vaccine}</td>
                    <td>${actionCellContent}</td>
                </tr>`;
        });

        tableHtml += `</table>`;
        container.innerHTML = tableHtml;
    } else {
        // Optionally, display a message when no data is available
        container.innerHTML = '<p>No applicable rules found for this population.</p>';
    }
}



function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) { // For old versions of IE
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { // For modern browsers
        script.onload = function() {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}



async function processRules(patientId, ruleNames) {
 
    let allRuleResults = [];  // Array to store results of all rules

    for (let ruleName of ruleNames) {
        try {
            const response = await fetch('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/templates/' + ruleName + '.json');
            const ruleData = await response.json();
            const patientResults = await window.checkRulesForPatient(patientId, ruleData);

            if (patientResults && patientResults[patientId]) {
                const patientData = patientResults[patientId];
                allRuleResults.push({
                    ruleName: patientData.ruleName,
                    inPopulation: patientData.InPopulation,
                    recommendation: patientData.Recommendation,
                    vaccine:patientData.vaccine
                });
            } else {
                console.log(`Patient data for ID ${patientId} not found.`);
            }
        } catch (error) {
            console.error(`Error processing rule ${ruleName}:`, error);
        }
    }
    return allRuleResults;
}

let allRuleResults;


// var rulesData = <?php echo json_encode($rulesData); ?>;
// populateRulesData(rulesData);

loadScript('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/public/cdss.js', function() {
    console.log('Script loaded successfully!');

    // Now that main.js is loaded, call processRules
    const ruleNames = ['mmr_between_12mon_to_4yr_1dose_between_12to15mon_pregnant'];  // Your ruleNames here
    processRules(patientId, ruleNames)
    .then(allRuleResults => {
        console.log(allRuleResults); // Handle the results
    })
    .catch(error => {
        console.error("Error in processRules:", error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
        
        loadScript('http://localhost:8300/interface/modules/custom_modules/oe-module-custom-skeleton/public/main.js', function() {
    console.log('Script loaded successfully!');

    const ruleNames = [ 
                'mmr_between_12mon_to_4yr_1dose_between_12to15mon'
            ];
    processRules(patientId, ruleNames)
    
    .then(allRuleResults => {
        populateRulesData(allRuleResults);
        console.log(allRuleResults); // Handle the results
    })
    .catch(error => {
        console.error("Error in processRules:", error);
    });
});
    });
    window.apicsrftoken = apicsrftoken;
</script>