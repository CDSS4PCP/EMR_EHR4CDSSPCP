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
        <tr>
            <td>${ruleset}</td>
            <td>0</td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<%@ include file="/WEB-INF/template/footer.jsp" %>
