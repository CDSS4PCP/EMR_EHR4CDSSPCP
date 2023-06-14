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
                   name="immunization-record-exists" ${presetImmunizationCondition != null ? "checked" : ""}>
        </label>

        <article id="immunization-record-condition-section"
                 class="${presetImmunizationCondition != null ? "d-block" : "d-none"}">
            <label>Number of Doses Completed

            <% if (presetImmunizationCondition != null) { %>
                <input type="text" name="num-prev-doses" value="${presetImmunizationCondition}">
                <% } else { %>
                <input type="text" name="num-prev-doses">
                <% } %>

            </label>

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