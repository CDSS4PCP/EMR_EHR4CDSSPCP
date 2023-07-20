<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS New Rule"])
    ui.includeCss("cdss", "style.css")

%>


<script>
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: " System Administration",
            link: '/' + OPENMRS_CONTEXT_PATH + '/coreapps/systemadministration/systemAdministration.page'
        },
        {label: "CDSS Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/cdssManager.page'},
        {label: "Rule Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/ruleManager.page'},
        {label: "Edit Rule", link: '#'}
    ];
</script>

<script>
    function specialConditionToggle(e) {
        let elem = document.getElementById("special-condition-exists");
        let section = document.getElementById("special-condition-section");

        if (elem.checked) {
            section.classList.remove("d-none");
            section.classList.add("d-block");
        } else {
            section.classList.remove("d-block");
            section.classList.add("d-none");
        }

    }

    function immunizationRecordConditionToggle(e) {
        let elem = document.getElementById("immunization-record-exists");
        let section = document.getElementById("immunization-record-condition-section");

        if (elem.checked) {
            section.classList.remove("d-none");
            section.classList.add("d-block");
        } else {
            section.classList.remove("d-block");
            section.classList.add("d-none");
        }

    }


    function addDoseInput(index, numDoses) {

        <% record = rule.getPreviousRecord()  %>
        let label = document.createElement("div");
        label.style.cssText = "border: dotted 1px; margin-left: 20px;";


        let labelText = "Time between doses " + index + " and  " + (index + 1);

        if (index === numDoses) {
            labelText = "Time between doses " + index + " and  action to be taken ";
        }


        label.innerHTML = "<label>" + labelText +
            "<input name=\"time-interval-" + index + "\" type=\"number\" > " +
            "</label>" +
            "<label>" +
            "<br>Unit " +
            "<select name=\"time-interval-" + index + "-unit\" > " +
            "<option value=\"year\">year</option>" +
            "<option value=\"month\">month</option>" +
            "<option value=\"week\">week</option>" +
            "<option value=\"day\">day</option>" +
            "<option value=\"hour\">hour</option>" +
            "<option value=\"minute\">minute</option>" +
            "</select> " +
            "</label>" +
            "<label>" +
            "Inclusive " +
            "<input id=\"time-interval-" + index + "-inclusive\" type=\"checkbox\"> " +
            "</label> " +
            "OR " +
            "<label>" +
            " Minimum Administer Age" +

            "<input type=\"number\" name=\"time-interval-" + index + "-min-age\" min=\"0\"" +
            "               max=\"99999\">" +
            "        Unit" +
            "        <select name=\"time-interval-" + index + "-min-age-unit\" >" +
            "            <option value=\"year\">year</option>" +
            "            <option value=\"month\">month</option>" +
            "            <option value=\"week\">week</option>" +
            "            <option value=\"day\">day</option>" +
            "            <option value=\"hour\">hour</option>" +
            "            <option value=\"minute\">minute</option>" +
            "        </select>" +
            "    </label>" +
            "<label>" +
            " Maximum Administer Age" +
            "<input type=\"number\" name=\"time-interval-" + index + "-max-age\"  min=\"0\"" +
            "               max=\"99999\">" +
            "        Unit" +
            "        <select name=\"time-interval-" + index + "-max-age-unit\" >" +
            "            <option value=\"year\">year</option>" +
            "            <option value=\"month\">month</option>" +
            "            <option value=\"week\">week</option>" +
            "            <option value=\"day\">day</option>" +
            "            <option value=\"hour\">hour</option>" +
            "            <option value=\"minute\">minute</option>" +
            "        </select>" +
            "    </label>";

        return label;
    }

    function addDoseInputs(numDoses) {
        let section = document.getElementById("prev-record-time-intervals-section");
        section.innerHTML = "";
        for (let i = 1; i <= numDoses; i++) {
            let label = addDoseInput(i, numDoses);
            section.appendChild(label);
        }
    }

    function numPrevDosesChanged(e) {
        let elem = document.getElementById("num-prev-doses");

        let numDoses = elem.value;
        console.log(numDoses);
        addDoseInputs(numDoses);


    }

</script>



<% if (false) { %>


<div class="toast-container">
    <div class="toast-item-wrapper">
        <div class="toast-item toast-type-error">
            <div class="toast-item-image toast-item-image-error"></div>

            <div class="toast-item-close"></div>

            <p>Could not add rule. <br>
                Please check the input values.
            </p>
        </div>
    </div>
</div>

<% } %>


<form method="post">
    <label for="vaccine-selector">
        Vaccine:
    </label>
    <select id="vaccine-selector" name="vaccine" required>
        <% vaccines.each { vaccine -> %>


        <% if (rule.getVaccine() == vaccine) { %>
        <option value="${vaccine}" selected>${vaccine}</option>
        <% } else { %>
        <option value="${vaccine}">${vaccine}</option>

        <% } %>
        <% } %>
    </select>

    <br>

    ${ui.includeFragment('cdss', 'ageConditionWidget', [label: "Minimum Age", name: "min-age", value: rule.getMinimumAge(), unit: rule.getMinimumAgeUnit().toString()])}
    <br>
    ${ui.includeFragment('cdss', 'ageConditionWidget', [label: "Maximum Age", name: "max-age", value: rule.getMaximumAge(), unit: rule.getMaximumAgeUnit().toString()])}

    <div>
        <% if (rule.getSpecialCondition() != null) { %>

        <label>
            Special Condition

            <input id="special-condition-exists" type="checkbox" onchange="specialConditionToggle()"
                   name="special-condition-exists" checked>
        </label>
        <article id="special-condition-section" class="d-block">
            <label>Special Condition
                <input type="text" name="special-condition" value="${ui.format(rule.getSpecialCondition().getLabel())}">
            </label>
            <label>Outbreak Condition
                <input type="text" name="outbreak-condition" value="${ui.format(null)}">
            </label>
            <label>
                College Student
                <input type="checkbox" name="college-student" ${
                        rule.getSpecialCondition ( ).getCollegeStudent ( ) ? "checked": ""}>
            </label>
            <label>
                Works in Military
                <input type="checkbox" name="military-worker" ${
                        rule.getSpecialCondition ( ).getMilitaryWorker ( ) ? "checked": ""}>
            </label>
            <label>
                Travel
                <input type="checkbox" name="travel-condition" ${
                        rule.getSpecialCondition ( ).getTravel ( ) ? "checked": ""}>
            </label>
        </article>

        <% } else { %>
        <label>
            Special Condition
            <input id="special-condition-exists" type="checkbox" onchange="specialConditionToggle()"
                   name="special-condition-exists">
        </label>
        <article id="special-condition-section" class="d-none">
            <label>Special Condition
                <input type="text" name="special-condition">
            </label>
            <label>Outbreak Condition
                <input type="text" name="outbreak-condition">
            </label>
            <label>
                College Student
                <input type="checkbox" name="college-student">
            </label>
            <label>
                Works in Military
                <input type="checkbox" name="military-worker">
            </label>
            <label>
                Travel
                <input type="checkbox" name="travel-condition">
            </label>
        </article>

        <% } %>

    </div>


    <div>
        <% record = rule.getPreviousRecord() %>
        <% if (record != null) { %>
        <% numDoses = record.getNumberDoses(); %>

        <label>
            Immunization Record Exists
            <input id="immunization-record-exists" type="checkbox" onchange="immunizationRecordConditionToggle()"
                   name="immunization-record-exists" checked>
        </label>

        <article id="immunization-record-condition-section"
                 class="d-block">
            <label>Number of Previous Doses Completed


                <input id="num-prev-doses" type="text" name="num-prev-doses" onchange="numPrevDosesChanged()"
                       value="${record.getNumberDoses()}">

            </label>

            <div id="prev-record-time-intervals-section">

                <% for (int i = 1; i <= numDoses; i++) { %>

                <% labelText = "Time between doses " + i + " and  " + (i + 1) %>

                <% if (i == numDoses) { %>
                <% labelText = "Time between doses " + i + " and  action to be taken " %>

                <% } %>

                <div>
                    <label>
                        <br> ${labelText}
                        <input name=${"time-interval-" + i} type="number"
                               value='${ui.format(record.getDoseTimePeriod(i))}'>
                    </label>
                    <label>

                        <br>Unit
                        <select name= ${"time-interval-" + i + "-unit"}>
                            <option value="year">year</option>
                            <option value="month">month</option>
                            <option value="week">week</option>
                            <option value="day">day</option>
                            <option value="hour">hour</option>
                            <option value="minute">minute</option>
                        </select>
                    </label>
                    OR

                    <div>

                        ${ui.includeFragment('cdss', 'ageConditionWidget', [label: "Minimum Administer Age", name: "time-interval-" + i + "-min-age", value: record.getDoseMinAge(i - 1), unit: record.getDoseMinAgeUnit(i - 1).toString()])}




                        <br>


                        ${ui.includeFragment('cdss', 'ageConditionWidget', [label: "Maximum Administer Age", name: "time-interval-" + i + "-max-age", value: record.getDoseMaxAge(i - 1), unit: record.getDoseMaxAgeUnit(i - 1).toString()])}

                    </div>

                </div>

                <% } %>
            </div>

        </article>

        <% } else { %>

        <label>
            Immunization Record Exists
            <input id="immunization-record-exists" type="checkbox" onchange="immunizationRecordConditionToggle()"
                   name="immunization-record-exists">
        </label>

        <article id="immunization-record-condition-section"
                 class="d-none">
            <label>Number of Previous Doses Completed


                <input id="num-prev-doses" type="text" name="num-prev-doses" onchange="numPrevDosesChanged()">

            </label>

            <div id="prev-record-time-intervals-section">

            </div>

        </article>
        <% } %>

    </div>

    <label>Medical Indications
        <select multiple name="indications">

            <option value="immunocompromised">
                Immunocompromised
            </option>


            <option value="allergy">
                Allergies
            </option>

        </select>
    </label>

    <label>Actions

        <select multiple name="actions">
            <% actions.each { action -> %>

            <% if (rule.getActions().contains(action)) { %>
            <option value="${action.getId()}" selected>${action.getDisplayString()}</option>

            <% } else { %>

            <option value="${action.getId()}">${action.getDisplayString()}</option>
            <% } %>
            <% } %>
        </select>
    </label>



    <input type="submit" class="btn confirm">
</form>