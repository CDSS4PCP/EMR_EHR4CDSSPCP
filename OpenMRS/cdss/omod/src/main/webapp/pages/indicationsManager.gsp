<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Indications Manager"])
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
        {label: "Indications", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/indicationsManager.page'}
    ];
</script>

<h2>CDSS Indications and Conditions</h2>

<br/>

${ui.includeFragment('cdss', 'notImplementedWidget')}

