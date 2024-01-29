<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Results for " + givenName + " " + familyName])
    ui.includeCss("cdss", "style.css")


%>


<script type="application/javascript">
    var global = window;
</script>

<script src="/openmrs/ms/uiframework/resource/cdss/scripts/cdss.js">
</script>



<script async>


    async function doCoolStuff() {


        let patientId = "${patientId}";

        let r1 = await fetch("/openmrs/cdss/rule1.form");
        let j1 = await r1.json();

        console.log(j1);
        let fh = await fetch("/openmrs/cdss/FHIRHelpers.form");
        let fhirHelpers = await fh.json();

        let p = await fetch('/openmrs/ws/fhir2/R4/Patient/' + patientId);
        let p1 = await p.json();
        console.log(p1);

        let result = await global.cdss.executeCql(p1, j1, {"FHIRHelpers": fhirHelpers}, {});
        console.log(result);


        document.getElementById("result-table-head").innerHTML = "<tr><th>Rule File</th><th>InPopulation</th></tr>";
        document.getElementById("result-table-body").innerHTML = "<tr><td>" + j1.library.identifier.id + "-" + j1.library.identifier.version + "</td><td>" + result[patientId].InPopulation + "</td></tr>";

    }

</script>

<h2>CDSS Results</h2>

<br/>

<table>
    <thead id="result-table-head">

    </thead>

    <tbody id="result-table-body">

    </tbody>
</table>


<script>
    doCoolStuff();
</script>


