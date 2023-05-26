<%@ page import="org.openmrs.module.cdss.api.data.Rule" %>
<%@ page import="java.util.ArrayList" %>

<style>
    <%@ include file="/openmrs.css" %>
</style>
<%@ include file="/WEB-INF/template/include.jsp" %>
<%@ include file="/WEB-INF/template/header.jsp" %>

<h2>CDSS Rule Manager</h2>

<br/>


<c:choose>
    <c:when test="${clarifyVaccineNeeded}">
        <div>
            <h2>
                Select a vaccine
            </h2>
            <form method="post">
                <label>Vaccine:
                    <select id="vaccine-dropdown" name="vaccine">
                        <c:forEach var="vaccine" items="${vaccines}">
                            <option value="${vaccine}">
                                    ${vaccine}
                            </option>
                        </c:forEach>

                    </select>
                    <br>
                    <input type="submit">
                </label>
            </form>
        </div>
    </c:when>

    <c:when test="${!clarifyVaccineNeeded}">
        <table>
            <thead>
            <tr>
                <th>Rule ID</th>
                <th>Vaccine</th>
                <th>Minimum Age (in weeks)</th>
                <th>Maximum Age (in weeks)</th>
            </tr>
            </thead>
            <tbody>

            <% ArrayList<Rule> rulesets = (ArrayList<Rule>) request.getAttribute("rulesets"); %>

            <% for (int i = 0; i < rulesets.size(); i++) { %>

            <tr class="<%= i % 2 == 1 ? "oddRow" : "evenRow" %>">
                <td>
                    <%= rulesets.get(i).getId() %>
                </td>

                <td>
                    <%=  rulesets.get(i).getVaccine() %>
                </td>

                <td>
                    <%= rulesets.get(i).getMinimumAge() %>
                </td>

                <td>
                    <%= rulesets.get(i).getMaximumAge() %>
                </td>



            </tr>
            <% } %>


            </tbody>
        </table>

    </c:when>
</c:choose>


<%@ include file="/WEB-INF/template/footer.jsp" %>
