# Rule Management

###### Rev 06/24/2024

## Requirements

- OpenMRS with the `cdss` module and `cdss-esm-app` module. Follow [Technical INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-Technical/INSTALLATION.md) or [User friendly INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Installation-User-Friendly/INSTALLATION.md).
- Functional Rule Modification service. Follow [RULE_MODIFICATION_SERVICE_INSTALLATION.md](https://github.com/xjing16/EMR_EHR4CDSSPCP/blob/main/OpenMRS/docs/Rule-Modification-Service-Installation/RULE_MODIFICATION_SERVICE_INSTALLATION.md)
- CSRF disabled

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

## Enabling/Disabling Rules

If a rule is disabled, that means it will not be used in Clinical Decision Suppport and cannot be modified. Only enabled rules are used in CDS and are able to be modified. 

### Disabling a Rule

1. To disable a rule, select the *No* option on the *Enabled* column of the rule
   ![](./ManagementPage7.png)
2. This will make two more buttons appear: *Save* and *Reset*. Click *Save* to save the disable action. *Reset* fill revert the disable option to it's default. 
   ![](./ManagementPage8.png)
3. Onced *Save* is clicked, the rule will be disabled and no longer usable.
   ![](./ManagementPage9.png)

### Enabling a Rule

1. To enable a rule, select the *Yes* option on the *Enabled* column of the rule
2. This will make two more buttons appear: *Save* and *Reset*. Click *Save* to save the enable action. *Reset* fill revert the enable option to it's default. 
3. Onced *Save* is clicked, the rule will be enabled and usable.

## Modifying Rules

Only parameters on enabled rules can be modified. Make sure to enable the rule that you want to modify befor change parameters.
A parameter is a special expression in the CQL that begins with a `$` and returns a primitive value. For example the highlighted paramater `$Age2` in the following screenshot is defined as the following in CQL
![](./ManagementPage10.png)

```cql
define "$Age2": 
    12
```

And as the following in the `rule-manifest.json` file.

```json
{
"$Age2": {
          "type": "Integer",
          "value": 12,
          "default": 12
        }
}
```

### Modify a parameter

1. Choose the parameter that you want to modify. In this example, we will modify `$Age2` of the rule `MMR1regularyoungerthan12monthsNoMMRRecommendation-1.0.0`.

2. `$Age2` is an integer value, so simply type in a new integer or use the +/- buttons to right to adjust it's value. We will change it to be `15`.
   ![](./ManagementPage11.png)

3. This will cause two more buttons to appear: *Save* and *Reset*. Click save to to make your change perminent. 
   ![](./ManagementPage12.png)

4. This will send the request to modify the rule to the `cdss` backend module, an it will in turn, send the request to the configure `rule-modification-service`. If the modification is successful, then a new rule will be created (typically in the bottom of the list/table) with the new value and an increment version number. See the following screenshot.
   ![](./ManagementPage13.png)

5. If the modification is not successful, then you will see an error. To find the complete error message, open the Developer Tools on your browser and look at the `Requests` tab to find the failing modification request.
   ![](./ErrorManagementPage.png)


## Archiving Rules
Instead of deleting rules, 
