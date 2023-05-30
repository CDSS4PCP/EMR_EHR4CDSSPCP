<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Rule Manager"])
    ui.includeCss("cdss", "style.css")

%>
<h2>CDSS Rule Manager</h2>

<br/>



<% if (clarifyVaccineNeeded) { %>
<div>
    <h2>
        Select a vaccine
    </h2>

    <form method="post">
        <label>Vaccine:
            <select id="vaccine-dropdown" name="vaccine">

                <% vaccines.each { vaccine -> %>

                <option value="${vaccine}">
                    ${vaccine}
                </option>

                <% } %>

            </select>
            <br>
            <input type="submit" class="btn confirm">
        </label>
    </form>
</div>

<% } else { %>

<button class="button confirm">Add rule</button>
<table class="table table-sm table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl rule-table">
    <thead>
    <tr>
        <th>Rule ID</th>
        <th>Vaccine</th>
        <th>Minimum Age (in weeks)</th>
        <th>Maximum Age (in weeks)</th>
        <th></th>
    </tr>
    </thead>
    <tbody>

    <% rulesets.each { rule -> %>

    ${ui.includeFragment('cdss', 'ruleWidget', [rule: rule])}



    <% } %>

    </tbody>
</table>


<% } %>
