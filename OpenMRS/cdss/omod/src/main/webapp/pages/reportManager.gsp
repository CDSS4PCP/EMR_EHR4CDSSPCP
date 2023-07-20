<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Reports"])
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
        {label: "Reports", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/reportManager.page'}
    ];
</script>


<h2>CDSS Reports</h2>

<br/>

${ui.includeFragment('cdss', 'notImplementedWidget')}

