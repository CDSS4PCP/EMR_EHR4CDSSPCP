<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Rule Manager"])
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
        {label: "Rule Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/ruleManager.page'}
    ];
</script>


<h2>CDSS Rule Manager</h2>

<br/>




<script>
    function redirectToFilteredVaccine(evt) {
        let vaccine = evt.target.value;
        window.location.replace("ruleManager.page?filterVaccine=" + vaccine);
    }
</script>
<% if (param.filterVaccine == null) { %>
<div>
    <form>
        <label>
            Select a vaccine

            <select onclick="redirectToFilteredVaccine(event)" name="filterVaccine">
                <% vaccines.each { vaccine -> %>
                <option value="${vaccine}">
                    ${vaccine}
                </option>


                <% } %>
            </select>
        </label>
        <input type="submit" class="button confirm">
    </form>
</div>

<% } else { %>


<div>
    <form>
        <label>
            Filter by vaccine

            <select onchange="redirectToFilteredVaccine(event)">
                <% vaccines.each { vaccine -> %>
                <% if (param.filterVaccine == vaccine) { %>
                <option value="${vaccine}" selected>
                    ${vaccine}
                </option>
                <% } else { %>
                <option value="${vaccine}">
                    ${vaccine}
                </option>
                <% } %>
                <% } %>
            </select>
        </label>
    </form>
</div>


<% if (param.deleteRuleId != null) { %>
${
        ui.includeFragment('cdss', 'confirmation', [title: "Are you sure?", message: "Are you sure you want to delete rule " + param.deleteRuleId[0] + "?", confirmHref: "ruleManager.page?confirmDeleteRuleId=" + deleteRuleId + "&filterVaccine=" + filterVaccine[0], cancelHref: "ruleManager.page?filterVaccine=" + filterVaccine[0]])}
<% } %>

<% filterVaccine = param.filterVaccine %>


<a class="button confirm" href="newRule.page">New rule</a>
<table class="table table-sm table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl rule-table">
    <thead>
    <tr>
        <th>Rule ID</th>
        <th>Vaccine</th>
        <th>Minimum Age (in weeks)</th>
        <th>Maximum Age (in weeks)</th>
        <th>Special Condition</th>
        <th>Num Previous Doses</th>
        <th>Medical Indications</th>


        <th>Actions</th>

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