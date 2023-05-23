<%@ include file="/WEB-INF/template/include.jsp" %>

<%@ include file="/WEB-INF/template/header.jsp" %>

<h2>CDSS Rule Manager</h2>

<br/>
<table>
    <thead>
    <tr>
        <th>Vaccine</th>
        <th># of defined rules</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach var="ruleset" items="${rulesets}">
<%--        <%@ include file="/WEB-INF/view/module/cdss/fragments/ruleWidget.gsp" rule="${ruleset}" %>--%>

        <tr>
            <td>${ruleset.getId()}</td>
            <td>${ruleset.getVaccine()}</td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<%@ include file="/WEB-INF/template/footer.jsp" %>
