<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Action Manager"])
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
        {label: "Action Manager", link: '/' + OPENMRS_CONTEXT_PATH + '/cdss/actionManager.page'}
    ];
</script>


<h2>CDSS Action Manager</h2>

<br/>




<a class="button confirm" href="newAction.page">Add Action</a>

<table class="table table-sm table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl rule-table">
    <thead>
    <tr>
        <th>Action ID</th>
        <th>Priority</th>
        <th>Message</th>
        <th></th>
    </tr>
    </thead>

    <tbody>

    <% actions.each { action -> %>
    <tr>
        <td>
            ${action.getId()}
        </td>
        <td>
            ${action.getPriority()}
        </td>
        <td>
            ${action.getDisplayString()}
        </td>
        <td>
            <div class="button-group">
                <a class="button" style="margin: 2px;">
                    <i class="icon-pencil"></i>
                    Edit
                </a>

                <a class="button cancel" style="margin: 2px;">
                    <i class="icon-trash"></i>
                    Delete
                </a>
            </div>
        </td>
    </tr>
    <% } %>
    </tbody>
</table>


