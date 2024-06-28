import {camelCase} from 'lodash';
import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import helpers from './FHIRHelpers.json';
//import vsac from 'cql-exec-vsac';

console.log(camelCase('hello world'))



export async function checkRulesForPatient(patientid, rule)  {

    const fhirWrapper = cqlfhir.FHIRWrapper.FHIRv401(); // or .FHIRv102() or .FHIRv300() or .FHIRv400()

    try {

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

       const patient = createBundle(data, url);

       //MedicalRequest
       let conditionRequestUrl = `http://localhost:8300/apis/fhir/Condition?patient=${patientid}`;

        // Fetch MedicationRequest resources for the patient
        let conditionRequestResponse = await fetch(conditionRequestUrl, {
            credentials: 'same-origin',
            method: 'GET',
            headers: new Headers({
                'apicsrftoken': apicsrftoken
            })
        });

        if (!conditionRequestResponse.ok) {
            throw new Error('Failed to fetch MedicationRequest data.');
        }

        let conditionRequestData = await conditionRequestResponse.json();
        
       

     
          console.log("conditionData");

          console.log(conditionRequestData);

          
 

          // Construct the Medication URL for the patient
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
 
          
       
        let parameters ={};
        
   
        
            if (conditionRequestData && conditionRequestData.entry && conditionRequestData.entry.length > 0) 
            {
                console.log("medicationRequestData");
                 let wrappedResources = [];
                for (let i = 0; i < conditionRequestData.entry.length; i++) {
                    let wrappedResource = fhirWrapper.wrap(conditionRequestData.entry[i].resource);
                    wrappedResources.push(wrappedResource);
                }
            
                // Assign the array of wrapped resources to the parameters

                // let wrappedResource = fhirWrapper.wrap(conditionRequestData.entry[0].resource);
                //     wrappedResources.push(wrappedResource);
                parameters['ConditionData'] = wrappedResources;
            }
            else {
                console.log('medicationRequestData does not exist or the entry array is empty');
              }
              if (immunizationData && immunizationData.entry && immunizationData.entry.length > 0) {
                console.log("immunizationData");
                console.log(immunizationData);
            
                // Initialize an empty array for the wrapped resources
                let wrappedResources = [];
            
                // Iterate over each entry in the immunizationData
                for (let i = 0; i < immunizationData.entry.length; i++) {
                    let wrappedResource = fhirWrapper.wrap(immunizationData.entry[i].resource);
                    wrappedResources.push(wrappedResource);
                }
            
                // Assign the array of wrapped resources to the parameters
                parameters['ImmunizationData'] = wrappedResources;
            
            } else {
                console.log('immunizationData does not exist or the entry array is empty');
            }
            

     
         
         console.log("parameters");

         console.log(parameters);
 
        const psource = new cqlfhir.PatientSource.FHIRv401();

        psource.loadBundles([patient]);


        const libraries = {FHIRHelpers: helpers };

        const lib = new cql.Library(rule, new cql.Repository(libraries));

    
        //  const codeService = new vsac.CodeService('./vsac_cache', false);
        // codeService.ensureValueSetsInLibraryWithApiKey(library, true, '5d7d49f3-4c14-4442-9b1d-a6895ca5a715').then(async () => { 

         let executor = new cql.Executor(lib, "");
          
           executor.exec(psource)
                    .then(result => {
                        console.log(result);
                        return result;
        
                       
                    })
                    .catch(err => {
                        console.log(err, 'fetch error');
                    });
          
      

    executor = executor.withParameters(parameters);


    let result = await executor.exec(psource); // Await the execution result

    return result.patientResults;
// })
// .catch((err) => {
//     // Handle any errors that occur during the value set download or execution
//     console.error('Error downloading value sets or executing the library', err);
// });
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error
    } 
}

window.checkRulesForPatient = checkRulesForPatient;

function createBundle(resource, url) {
    if (resource.resourceType !== "Bundle") {
        if (url === null)
            return {resourceType: "Bundle", entry: [{resource: resource}]}
        return {resourceType: "Bundle", entry: [{resource: resource, fullUrl: url}]}
    }
    return resource
}
