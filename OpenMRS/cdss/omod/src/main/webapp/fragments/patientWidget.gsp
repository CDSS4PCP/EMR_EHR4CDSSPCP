<div id="cdss-widget" class="info-section">
    <div class="info-header">
        <i class="icon-stethoscope"></i>

        <h3>CDSS Results</h3>
        <i class="icon-link edit-action right"
           onclick="location.href = '../../module/cdss/results.form?patientUuid=${patientUuid}'"></i>
    </div>

    <div class="info-body">

        <table>
            <thead>
            <tr>
                <th>Vaccine</th>
                <th>Status</th>
            </tr>
            </thead>

            <tbody>

            <% results.each { res -> %>

            <% if (res != null) { %>
            <tr>

                <% if (res.getStatus() != null && res.getStatus() == 0) { %>
                <td>${res.getVaccine()}</td>
                <td>
                    <% res.getActions().each { act -> %>

                    <p>
                        ${act.getDisplayString()}
                    </p>


                    <% } %>

                </td>

                <% } else { %>
                <td style="color: red;">${res.getVaccine()}</td>
                <td style="color: red;">
                    <% res.getActions().each { act -> %>
                    <p>
                        ${act.getDisplayString()}
                    </p>
                    <% } %>
            </td>
                <% } %>
            </tr>
            <% } %>
            <% } %>
            </tbody>
        </table>
    </div>
</div>