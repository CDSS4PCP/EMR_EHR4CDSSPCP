# Rule Management

###### Rev 06/24/2024

## Requirements

- OpenMRS with the `cdss` module and `cdss-esm-app` module. Follow [Technical INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-Technical/INSTALLATION.md) or [User friendly INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-User-Friendly/INSTALLATION.md).
- Functional Rule Modification service. Follow [RULE_MODIFICATION_SERVICE_INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Rule-Modification-Service-Installation/RULE_MODIFICATION_SERVICE_INSTALLATION.md)

## Navigating the Rule Management interface

1. Go to the [OpenMRS homepage](http://localhost/openmrs/spa) and click on *App Menu*
    ![](./HomePage.png)

2. Click on *CDSS Rule Management* 
    ![](./HomePage2.png)

3. This is the *CDSS Rule Management* page
    ![](./ManagementPage.png)

4. The page is blank because vaccine is not selected.
   ![](./ManagementPage2.png)

5. Select a *Measles, Mumps, and Rubella Virus Vaccine* from the center dropdown. This view is a table view that display every rule per row. The columns represent descriptions, rule parameters (denoted with a *$*) and actions.  
   ![](./ManagementPage3.png)

6. The table view may be overwelming, so lets change it. Select *List* from the *View* dropdown in the top left.
   ![](./ManagementPage4.png)

7. This view collapses each rule into an expandable element. 
   ![](./ManagementPage5.png)

8. Click on any rule, and it will expand to show its elements
   ![](./ManagementPage6.png)

## Editing Rules
