<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS New Action"])
    ui.includeCss("cdss", "style.css")


%>



<h2>CDSS Results</h2>

<br/>




<% if (error != null) { %>

${ui.includeFragment('cdss', 'errorMesssage')}
<% } else { %>


<div>
    <h3>Showing Results for</h3>

    <p>${givenName} ${familyName}</p>
    <table>
        <tr>
            <th>Vaccine</th>
            <th>Message</th>
            <th>Rule Id</th>

        </tr>

        <% results.each { res -> %>
        <tr>

            <% if (res.value.getStatus() == 0) { %>

            <td>${res.key}</td>

            <td>
                <% res.value.getActions().each { action -> %>
                <p>${action.getDisplayString()}</p>
                <% } %>
            </td>

            <td>

                <% if (res.value.getRule() == null) { %>
                <p>???</p>
                <% } else { %>
                <p>${res.value.getRule().getId()}</p>
                <% } %>
            </td>

            <% } else { %>

            <td style="color: red;">${res.key}</td>
            <td style="color: red;">
                <% res.value.getActions().each { action -> %>
                <p>${action.getDisplayString()}</p>
                <% } %>
            </td>


            <td style="color: red;">

                <% if (res.value.getRule() == null) { %>
                <p>???</p>
                <% } else { %>
                <p>${res.value.getRule().getId()}</p>
                <% } %>
            </td>
            <% } %>

        </tr>

        <% } %>

    </table>
</div>
<% } %>

