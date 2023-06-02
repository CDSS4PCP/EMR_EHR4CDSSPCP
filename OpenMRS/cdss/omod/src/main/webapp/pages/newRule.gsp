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
        <input type="number">
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
        <input type="number">
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
                <input type="text">
            </label>
            <label>Outbreak Condition
                <input type="text">
            </label>
            <label>
                College Student
                <input type="checkbox">
            </label>
            <label>
                Works in Military
                <input type="checkbox">
            </label>
            <label>
                Travel
                <input type="checkbox">
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
        <select multiple>
            <option>
                Schedule
            </option>
            <option>
                Administer
            </option>
        </select>
    </label>
</form>