<tr>

    <td>${ui.format(config.rule.getId())}</td>
    <td>${ui.format(config.rule.getVaccine())}</td>
    <td>${ui.format(config.rule.getMinimumAge())}</td>
    <td>${ui.format(config.rule.getMaximumAge())}</td>
    <td>

        <ul>
            <% if (config.rule.getSpecialCondition() != null && config.rule.getSpecialCondition().getLabel() != null) { %>
            <li>
                ${ui.format(config.rule.getSpecialCondition().getLabel())}
            </li>
            <% } %>

            <% if (config.rule.getSpecialCondition() != null && config.rule.getSpecialCondition().getCollegeStudent()) { %>
            <li>
                College Student
            </li>
            <% } %>

            <% if (config.rule.getSpecialCondition() != null && config.rule.getSpecialCondition().getMilitaryWorker()) { %>
            <li>
                Military Worker
            </li>
            <% } %>

            <% if (config.rule.getSpecialCondition() != null && config.rule.getSpecialCondition().getTravel()) { %>
            <li>
                International Travel
            </li>
            <% } %>

        </ul>
    </td>
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
            <a class="button" style="margin: 2px;" href="newRule.page?editRuleId=${config.rule.getId()}">
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