<%@ include file="/WEB-INF/template/include.jsp" %>

<%@ include file="/WEB-INF/template/header.jsp" %>

<h2>CDSS Results</h2>

<br/>
<h3>Showing Results for</h3>
<p>${givenName} ${familyName}</p>
<table>
    <tr>
        <th>Vaccine</th>
        <th>Message</th>
    </tr>

    <c:forEach var="res" items="${results}">
        <tr>
            <c:choose>
                <c:when test="${res.value.getStatus() == 0}">
                    <td>${res.key}</td>
                    <td>${res.value.getAction().getDisplayString()}</td>
                </c:when>
                <c:otherwise>
                    <td style="color: red;">${res.key}</td>
                    <td style="color: red;">${res.value.getAction().getDisplayString()}</td>
                </c:otherwise>
            </c:choose>


        </tr>
    </c:forEach>

</table>
<%@ include file="/WEB-INF/template/footer.jsp" %>
