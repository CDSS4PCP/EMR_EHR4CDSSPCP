# Using CDSS

###### Rev 06/24/2024

## Requirements

- OpenMRS with the `cdss` module and `cdss-esm-app` module. Follow [Technical INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-Technical/INSTALLATION.md) or [User friendly INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-User-Friendly/INSTALLATION.md).
- Functional Rule Modification service. Follow [RULE_MODIFICATION_SERVICE_INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Rule-Modification-Service-Installation/RULE_MODIFICATION_SERVICE_INSTALLATION.md)
- CSRF disabled

## Steps

1. Go to the OpenMRS homepage and click on *Search*
    ![](./HomePage.png)

2. Type in a name for a patient. For example, `Joshua Johnson`. Select the patient
    ![](./HomePage2.png)

3. This is the patient dashboard for `Joshua Johnson`. To use CDSS, click on *CDSS* on the left menu.
    ![](./PatientDashboard.png)

4. You will see a progress message explaining that the rules are being checked.

> **Note:** Only enabled and non-archived rules are used.

![](./Cdss.png)

5. Once all the rules are consulted, only rules that generated reccomendations will be displayed. Here we see that rule `MMR3regularyoungerthan47months_18yrsNoMMRRecommendation` generated two recommendations: 
- Recommendation 1: Administer 1 dose

- Recommendation 2: Schedule 2nd dose > = 4 wk of 1st dose
  
  ![](./Cdss2.png)
  
  5.You can accept the recommendations by clicking the green `Checkmark` button or decline the recommendations by clicking the grey `X` button
  ![](./Cdss3.png)
