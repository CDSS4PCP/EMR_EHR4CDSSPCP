<%
    ui.includeCss("cdss", "style.css")
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Manager"])

%>
<h2>CDSS Manager</h2>

<br/>


<a class="btn btn-default btn-lg button app big align-self-center" href="vaccineManager.page">
    <i class="fas fa-fw fa-syringe"></i>
    Vaccine Management
</a>

<a class="btn btn-default btn-lg button app big align-self-center" href="ruleManager.page">
    <i class="icon-list"></i>
    Rule Management
</a>

<a class="btn btn-default btn-lg button app big align-self-center">
    <i class="fas fa-fw fa-exclamation"></i>
    Indications and Conditions
</a>

<a class="btn btn-default btn-lg button app big align-self-center" href="actionManager.page">
    <i class="fas fa-fw icon-double-angle-right"></i>
    Action Management
</a>
