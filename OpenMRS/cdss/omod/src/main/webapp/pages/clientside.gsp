<%
    ui.decorateWith("appui", "standardEmrPage", [title: "CDSS Clientside"])
    ui.includeCss("cdss", "style.css")

%>


<script type="application/javascript">
    var global = window;
</script>

<script src="/openmrs/ms/uiframework/resource/cdss/scripts/cdss.js">
</script>


<h1>Patient</h1>

<div id="patient-view">

</div>

<h1>Results</h1>

<div id="result-view">

</div>




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

        document.getElementById("result-view").innerHTML = "<pre>Inpopulation:" + result[patientId].InPopulation + "</pre>";

        document.getElementById("patient-view").innerHTML = "<pre>" + JSON.stringify(p1, null, 2) + "</pre>";

    }

    doCoolStuff();



</script>