<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS New Rule"])
    ui.includeCss("cdss", "style.css")

%>


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
        let label = document.createElement("label");
        label.style.cssText = "border: dotted 1px; margin-left: 20px;";


        if (index !== numDoses)


            label.innerHTML = "<br>Time between doses " + index + " and  " + (index + 1) +
                " <input name=\"time-interval-" + index + "\" type=\"number\" > " +
                "<br>Unit " +
                "<select name=\"time-interval-" + index + "-unit\" > " +
                "<option value=\"year\">year</option>" +
                "<option value=\"month\">month</option>" +
                "<option value=\"week\">week</option>" +
                "<option value=\"day\">day</option>" +
                "<option value=\"hour\">hour</option>" +
                "<option value=\"minute\">minute</option>" +
                "</select> " +
                "Inclusive " +
                "<input id=\"time-interval-" + index + "-inclusive\" type=\"checkbox\"> " +
                "<br> " +
                "OR " +
                "<br>  Minimum Administer Age" +

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
                "<br>  Maximum Administer Age" +
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
        else
            label.innerHTML = "<br>Time between doses " + index + " and  action to be taken " +
                " <input name=\"time-interval-" + index + "\" type=\"number\" > " +
                "<br>Unit " +
                "<select name=\"time-interval-" + index + "-unit\" > " +
                "<option value=\"year\">year</option>" +
                "<option value=\"month\">month</option>" +
                "<option value=\"week\">week</option>" +
                "<option value=\"day\">day</option>" +
                "<option value=\"hour\">hour</option>" +
                "<option value=\"minute\">minute</option>" +
                "</select> " +
                "Inclusive " +
                "<input id=\"time-interval-" + index + "-inclusive\" type=\"checkbox\"> " +
                "<br> " +
                "OR " +
                "<br>  Minimum Administer Age" +
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
                "<br>  Maximum Administer Age" +
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



<% if (ruleAddedError) { %>


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
        <option value="${vaccine}" ${presetVaccine != null && presetVaccine.equals(vaccine) ? "selected" : ""}>${vaccine}</option>
        <% } %>
    </select>

    <br>


    <label>Minimum Age
    <% if (presetMinAge != null) { %>
        <input type="number" name="min-age" min="0"
               max="99999" value="${presetMinAge}">
        <% } else { %>
        <input type="number" name="min-age" min="0"
               max="99999">
        <% } %>

        Unit
        <select name="min-age-unit" required>
            <option value="year">year</option>
            <option value="month">month</option>
            <option value="week">week</option>
            <option value="day">day</option>
            <option value="hour">hour</option>
            <option value="minute">minute</option>
        </select>
    </label>

    <br>
    <label>Maximum Age

    <% if (presetMaxAge != null) { %>
        <input type="number" name="max-age" min="0"
               max="99999" value="${presetMaxAge}">
        <% } else { %>
        <input type="number" name="max-age" min="0"
               max="99999">
        <% } %>

        Unit
        <select name="max-age-unit" required>
            <option value="year">year</option>
            <option value="month">month</option>
            <option value="week">week</option>
            <option value="day">day</option>
            <option value="hour">hour</option>
            <option value="minute">minute</option>
        </select>
    </label>


    <div>
        <label>
            Special Condition

            <input id="special-condition-exists" type="checkbox" onchange="specialConditionToggle()"
                   name="special-condition-exists" ${presetSpecialCondition != null ? "checked" : ""}>
        </label>

        <article id="special-condition-section" class="${presetSpecialCondition != null ? "d-block" : "d-none"}">
            <label>Special Condition

            <% if (presetSpecialCondition != null) { %>
                <input type="text" name="special-condition" value="${presetSpecialCondition}">
                <% } else { %>
                <input type="text" name="special-condition">
                <% } %>
            </label>
            <label>Outbreak Condition
                <input type="text" name="outbreak-condition">
            </label>
            <label>
                College Student
                <% if (presetSpecialConditionCollegeStudent != null && presetSpecialConditionCollegeStudent) { %>
                <input type="checkbox" name="college-student" checked>
                <% } else { %>
                <input type="checkbox" name="college-student">
                <% } %>
            </label>
            <label>
                Works in Military
                <% if (presetSpecialConditionMilitaryWorker != null && presetSpecialConditionMilitaryWorker) { %>
                <input type="checkbox" name="military-worker" checked>
                <% } else { %>
                <input type="checkbox" name="military-worker">
                <% } %>
            </label>
            <label>
                Travel
                <% if (presetSpecialConditionTravel != null && presetSpecialConditionTravel) { %>
                <input type="checkbox" name="travel-condition" checked>
                <% } else { %>
                <input type="checkbox" name="travel-condition">
                <% } %>
            </label>
        </article>
    </div>


    <div>
        <label>
            Immunization Record Exists
            <input id="immunization-record-exists" type="checkbox" onchange="immunizationRecordConditionToggle()"
                   name="immunization-record-exists" ${presetImmunizationCondition == true ? "checked" : ""}>
        </label>

        <article id="immunization-record-condition-section"
                 class="${presetImmunizationCondition != null ? "d-block" : "d-none"}">
            <label>Number of Previous Doses Completed

            <% if (presetImmunizationCondition != null) { %>
                <input id="num-prev-doses" type="text" name="num-prev-doses" value="${presetNumPrevDoses}"
                       onchange="numPrevDosesChanged()">
                <% } else { %>
                <input id="num-prev-doses" type="text" name="num-prev-doses" onchange="numPrevDosesChanged()">
                <% } %>

            </label>

            <div id="prev-record-time-intervals-section">

            </div>




        </article>
    </div>

    <label>Medical Indications
        <select multiple name="indications">

            <% if (presetIndications != null && presetIndications.contains("immunocompromised")) { %>
            <option value="immunocompromised" selected>
                Immunocompromised
            </option>
            <% } else { %>
            <option value="immunocompromised">
                Immunocompromised
            </option>
            <% } %>


            <% if (presetIndications != null && presetIndications.contains("allergy")) { %>
            <option value="allergy" selected>
                Allergies
            </option>
            <% } else { %>
            <option value="allergy">
                Allergies
            </option>
            <% } %>

        </select>
    </label>

    <label>Actions

        <select multiple name="actions">
            <% actions.each { action -> %>
            <option value="${action.getId()}">${action.getDisplayString()}</option>

            <% if (presetActions != null && presetActions.contains(action)) { %>
            <option value="${action.getId()}" selected>${action.getDisplayString()}</option>
            <% } else { %>
            <option value="${action.getId()}">${action.getDisplayString()}</option>
            <% } %>
            <% } %>
        </select>
    </label>



    <input type="submit" class="btn confirm">
</form>