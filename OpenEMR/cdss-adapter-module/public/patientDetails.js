import { checkRulesForPatient } from './main.js';

async function processRules(patientId, ruleNames) {
    let allRuleResults = [];  // Array to store results of all rules

    for (let ruleName of ruleNames) {
        try {
            const response = await fetch('./' + ruleName + '.json');
            const ruleData = await response.json();
            const patientResults = await checkRulesForPatient(patientId, ruleData);

            if (patientResults && patientResults[patientId]) {
                const patientData = patientResults[patientId];
                allRuleResults.push({
                    ruleName: patientData.ruleName,
                    inPopulation: patientData.InPopulation,
                    recommendation: patientData.Recommendation
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

// Export the processRules function to be used in other modules
export { processRules };