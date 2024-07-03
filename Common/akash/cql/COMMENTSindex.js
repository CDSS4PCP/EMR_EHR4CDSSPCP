import {camelCase} from 'lodash';
import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import helpers from './FHIRHelpers.json';
import vsac from 'cql-exec-vsac';

console.log(camelCase('hello world'))



async function checkRulesForPatient(patientid, rule, immunizationData,)  {

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
       let medicationRequestUrl = `http://localhost:8300/apis/fhir/MedicationRequest?patient=${patientid}`;

        // Fetch MedicationRequest resources for the patient
        let medicationRequestResponse = await fetch(medicationRequestUrl, {
            credentials: 'same-origin',
            method: 'GET',
            headers: new Headers({
                'apicsrftoken': apicsrftoken
            })
        });

        if (!medicationRequestResponse.ok) {
            throw new Error('Failed to fetch MedicationRequest data.');
        }

        let medicationRequestData = await medicationRequestResponse.json();
        
       

        // //MedicalStatement

        //  // Construct the Medication URL for the patient
        //  let medicationUrl = `http://localhost:8300/apis/fhir/Medication?patient=${patientid}`;

        //  // Fetch Medication resources for the patient
        //  let medicationResponse = await fetch(medicationUrl, {
        //      credentials: 'same-origin',
        //      method: 'GET',
        //      headers: new Headers({
        //          'apicsrftoken': apicsrftoken
        //      })
        //  });
 
        //  if (!medicationResponse.ok) {
        //      throw new Error('Failed to fetch Medication data.');
        //  }
 
        //  let medicationData = await medicationResponse.json();

          console.log("medicationData");

          console.log(medicationRequestData);

          
 

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
        
        // // Check if Medication resources are not empty and add to parameters
        // if (contextPrescriptionStatements && contextPrescriptionStatements.length > 0) {
        //     parameters['PrescriptionRequest'] = fhirWrapper.wrap(contextPrescriptionStatements);
        // }https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.11.1085

        // if (contextPrescriptionStatements && contextPrescriptionStatements.length > 0) {
            // if (contextPrescriptionStatements && contextPrescriptionStatements.length > 0) {
            //     // Get the first MedicationRequest object from the array
            //     const firstMedicationRequest = contextPrescriptionStatements[0];
            
            //     // Wrap the first MedicationRequest using fhirWrapper (replace with your actual fhirWrapper function)
            //     const wrappedMedicationRequest = fhirWrapper.wrap(firstMedicationRequest);
            
            //     // Store the wrapped MedicationRequest in the PrescriptionRequest key of the parameters object
            //     parameters['PrescriptionRequest'] = wrappedMedicationRequest;
            // } else {
            //     // Handle the case when contextPrescriptionStatements is empty or undefined
            //     parameters['PrescriptionRequest'] = null; // or some other appropriate value
            // }  // }
        
            if (medicationRequestData && medicationRequestData.entry && medicationRequestData.entry.length > 0) 
            {
                console.log("medicationRequestData");
                for (let i = 0; i < medicationRequestData.entry.length; i++) {
                    let wrappedResource = fhirWrapper.wrap(medicationRequestData.entry[i].resource);
                    wrappedResources.push(wrappedResource);
                }
            
                // Assign the array of wrapped resources to the parameters
                parameters['PrescriptionRequest'] = wrappedResources;
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
            

        // Check if MedicationRequest resources are not empty and add to parameters
        // if (contextPrescriptionRequests && contextPrescriptionRequests.length > 0) {
        //     parameters['ContextPrescriptionRequests'] = contextPrescriptionRequests;
        // }

         
         console.log("parameters");

         console.log(parameters);
 
        const psource = new cqlfhir.PatientSource.FHIRv401();

        psource.loadBundles([patient]);


        const libraries = {FHIRHelpers: helpers };

        const lib = new cql.Library(rule, new cql.Repository(libraries));

      //   const executor = new cql.Executor(lib);

      //   const codeService = new vsac.CodeService('./vsac_cache', false);


      const codeService = new vsac.CodeService('vsac_cache', false);

        // codeService.ensureValueSetsInLibraryWithAPIKey(lib, false, '5d7d49f3-4c14-4442-9b1d-a6895ca5a715',false).then(() => {
      
          let executor = new cql.Executor(lib, codeService);
          
           executor.exec(psource)
                    .then(result => {
                        console.log(result);
                        return result;
        
                       
                    })
                    .catch(err => {
                        console.log(err, 'fetch error');
                    });
          
        // })
        // .catch( (err) => {
        //   // There was an error downloading the value sets!
        //   console.error('Error downloading value sets', err);
        // });
                

    
        // const psource = new cql.PatientSource([patientData])

        // Now you can use patientData
        // console.log(patientData); // Output the populated patientData
        // const psource = new cql.PatientSource([patientData]);

      
    //     let paramObject={};
      
    // if (parameters) {

    //     Object.keys(parameters).forEach(function (key) {
    //         console.log("oartest");

            
    //         console.log(parameters[key][0]);
            

    //         paramObject[key] = fhirWrapper.wrap(parameters[key][0]);

    //     })

    // }
    
    // console.log(paramObject);


    executor = executor.withParameters(parameters);


    let result = await executor.exec(psource); // Await the execution result

    return result.patientResults;
  
        // const result = await executor.exec(psource); // Await the execution result
        // // console.log(result.patientResults);
        // return result; // Return the result
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
