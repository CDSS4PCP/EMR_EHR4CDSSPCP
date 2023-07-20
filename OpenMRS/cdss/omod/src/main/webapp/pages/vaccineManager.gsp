<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Vaccine Manager"])
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
        {label: "Vaccine Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/vaccineManager.page'}
    ];
</script>

<% if (errorAddingVaccine) { %>


<div class="toast-container">
    <div class="toast-item-wrapper">
        <div class="toast-item toast-type-error">
            <div class="toast-item-image toast-item-image-error"></div>

            <div class="toast-item-close"></div>

            <p>Could not add vaccine. <br>
                Check if a vaccine with the same name exist!
            </p>
        </div>
    </div>
</div>

<% } %>

<h3>Add new Vaccine</h3>

<form method="post">
    <label>Name:
        <input type="text" name="name">
    </label>

    <input type="submit" class="btn confirm">
</form>

<hr>

<h3>Registered Vaccines</h3>

<table>
    <thead>
    <tr>
        <th>Name</th>
    </tr>
    </thead>
    <tbody>
    <% vaccines.each { vaccine -> %>


    <tr>
        <td>${vaccine}</td>
    </tr>


    <% } %>
    </tbody>
</table>
