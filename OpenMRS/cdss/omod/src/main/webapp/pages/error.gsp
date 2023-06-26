<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Error"])
    ui.includeCss("cdss", "style.css")

%>

<div>
    <h2 style="color: darkred">
        Something went wrong!
    </h2>


    <% if (nonExistentRuleId != null) { %>
    <p style="color:red;" class="text-center">Rule with id of ${nonExistentRuleId} does not exist!</p>
    <% } %>

</div>