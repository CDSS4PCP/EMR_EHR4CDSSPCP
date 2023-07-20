<tr>

    <td>${ui.format(config.rule.getId())}</td>
    <td>${ui.format(config.rule.getVaccine())}</td>
    <td>${ui.format(config.rule.getMinimumAge())} ${ui.format(config.rule.getMinimumAgeUnit())}</td>
    <td>${ui.format(config.rule.getMaximumAge())} ${ui.format(config.rule.getMaximumAgeUnit())}</td>
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
    <td>
        <% if (config.rule.getPreviousRecord() != null) { %>
        <ul>
            <li><strong>Previous Doses: ${ui.format(config.rule.getPreviousRecord().getNumberDoses())}</strong></li>
        </ul>

        <% def count = config.rule.getPreviousRecord().getNumberDoses() %>

        <% if (count > 0) { %>
        <div>
            <ul>

                <% (0..count - 1).toList().each { c -> %>
                <li>
                    <p>Dose ${c + 1}</p>
                    <% if (config.rule.getPreviousRecord().isDoseTimePeriodBased(c)) { %>
                    <p>Time before next dose : ${config.rule.getPreviousRecord().getDoseTimePeriod(c)} weeks</p>

                    <% } %>

                    <% if (config.rule.getPreviousRecord().isDoseAgeBased(c)) { %>
                    <p>Minimum Age: ${config.rule.getPreviousRecord().getDoseMinAge(c)}  ${config.rule.getPreviousRecord().getDoseMinAgeUnit(c)}</p>

                    <p>Maximum Age: ${config.rule.getPreviousRecord().getDoseMaxAge(c)} ${config.rule.getPreviousRecord().getDoseMaxAgeUnit(c)}</p>
                    <% } %>
                    <% } %>
                </li>
                <% } %>

            </ul>
        </div>
        <% } %>

    </td>
    <td>

        <% if (config.rule.getMedicalConditions() != null) { %>
        <ul>
            <% config.rule.getMedicalConditions().each { condition -> %>

            <li>${condition}</li>
            <% } %>
        </ul>
        <% } %>

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
            <a class="button" style="margin: 2px;" href="editRule.page?editRuleId=${config.rule.getId()}">
                <i class="icon-pencil"></i>
                Edit
            </a>

            <a class="button cancel" style="margin: 2px;"
               href="ruleManager.page?deleteRuleId=${config.rule.getId()}&filterVaccine=${config.rule.getVaccine()}">
                <i class="icon-trash"></i>
                Delete
            </a>

        </div>
    </td>

</tr>