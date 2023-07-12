<div class="row">
    <div class="col-9 form-group">

        <% label = config.label != null ? config.label : "Age Condition" %>
        <% name = config.name != null ? config.name : "age-condition" %>
        <% minimum = config.minimum != null ? config.minimum : 0 %>
        <% maximum = config.maximum != null ? config.maximum : 99999 %>
        <% value = config.value != null ? config.value : null %>
        <% unitName = name + "-unit" %>
        <% selectedUnit = config.unit != null ? config.unit : "day" %>


        <label>${ui.format(label)}


        <% if (value != null) { %>
            <input type="number" name=${name} value= ${value}
                   min=${minimum} max= ${maximum}>
            <% } else { %>
            <input type="number" name=${name}
            min= ${minimum} max= ${maximum}>
            <% } %>
        </label>

    </div>

    <div class="col-3 form-group">

        <label>
            Unit
            <select name=${unitName} required>
                <option value="year" ${selectedUnit == "year" ? "selected" : ""}>year</option>
                <option value="month" ${selectedUnit == "month" ? "selected" : ""}>month</option>
                <option value="week" ${selectedUnit == "month" ? "week" : ""}>week</option>
                <option value="day" ${selectedUnit == "month" ? "day" : ""}>day</option>
            </select>
        </label>
    </div>
</div>
