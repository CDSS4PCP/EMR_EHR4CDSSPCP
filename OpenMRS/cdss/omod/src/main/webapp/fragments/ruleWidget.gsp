<tr>

    <td>${ui.format(config.rule.getId())}</td>
    <td>${ui.format(config.rule.getVaccine())}</td>
    <td>${ui.format(config.rule.getMinimumAge())}</td>
    <td>${ui.format(config.rule.getMaximumAge())}</td>
    <td>${ui.format(config.rule.getSpecialCondition())}</td>
    <td>${ui.format(config.rule.getPreviousRecord())}</td>
    <td>

        <ul>
            <% config.rule.getMedicalConditions().each { condition -> %>

            <li>${condition}</li>
            <% } %>
        </ul>
    </td>

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