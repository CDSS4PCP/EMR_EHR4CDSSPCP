<tr>

    <td>${config.rule.getId()}</td>
    <td>${config.rule.getVaccine()}</td>
    <td>${config.rule.getMinimumAge()}</td>
    <td>${config.rule.getMaximumAge()}</td>
    <td>
        <ul>
            <% config.rule.getActions().each { action -> %>

            <li>${action.getDisplayString()}</li>
            <% } %>
        </ul>
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