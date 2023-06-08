<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Rule Manager"])
    ui.includeCss("cdss", "style.css")

%>


<script>
    function specialConditionToggle(e) {
        let elem = document.getElementById("special-condition-section");

        if (elem.classList.contains("d-block")) {
            elem.classList.remove("d-block");
            elem.classList.add("d-none");

        } else {
            elem.classList.remove("d-none");
            elem.classList.add("d-block");

        }

    }

    function immunizationRecordConditionToggle(e) {
        let elem = document.getElementById("immunization-record-condition-section");

        if (elem.classList.contains("d-block")) {
            elem.classList.remove("d-block");
            elem.classList.add("d-none");

        } else {
            elem.classList.remove("d-none");
            elem.classList.add("d-block");

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
        <option value="${vaccine}">${vaccine}</option>

        <% } %>
    </select>

    <br>


    <label>Minimum Age
        <input type="number" name="min-age" min="0" max="99999">
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
        <input type="number" name="max-age" min="0" max="99999">
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
            <input type="checkbox" onchange="specialConditionToggle()">
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
    </div>


    <div>
        <label>
            Immunization Record Exists
            <input type="checkbox" onchange="immunizationRecordConditionToggle()">
        </label>

        <article id="immunization-record-condition-section" class="d-none">
            <label>Number of Doses Completed
                <input type="text">
            </label>

        </article>
    </div>

    <label>Medical Indications
        <select multiple>
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
            <option value="${action.getId()}">${action.getDisplayString()}</option>

            <% } %>
        </select>
    </label>



    <input type="submit" class="btn confirm">
</form>