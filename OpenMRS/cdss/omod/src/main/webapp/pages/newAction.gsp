<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS New Action"])
    ui.includeCss("cdss", "style.css")


%>



<form method="post">
    <label>Priority:
        <input type="number" name="priority" value="1">
    </label>
    <br>

    <label>Message:
        <textarea cols="10" rows="10" name="text"></textarea>
    </label>

    <input type="submit">

</form>
