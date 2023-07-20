<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS New Action"])
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
        {label: "Action Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/actionManager.page'},
        {label: "New Action", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/newAction.page'}
    ];
</script>


<form method="post">
    <label>Priority:
        <input type="number" name="priority" value="1">
    </label>
    <br>

    <label>Message:
        <textarea cols="10" rows="10" name="text"></textarea>
    </label>

    <input type="submit">

</form>
