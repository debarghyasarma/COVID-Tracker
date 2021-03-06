let dropdown = document.getElementById("countries-dropdown");
dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "Worldwide";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const request = new XMLHttpRequest();
request.open("GET", "https://disease.sh/v3/covid-19/countries", true);

request.onload = function () {
  if (request.status == 200) {
    const data = JSON.parse(request.responseText);
    let option;

    for (let i = 0; i < data.length; i++) {
      option = document.createElement("option");
      option.text = data[i].country;
      option.value = data[i].countryInfo.iso2;
      dropdown.add(option);
    }

    //By default
    request.open("GET", "https://disease.sh/v3/covid-19/all", true);
    request.onload = function () {
      const data = JSON.parse(request.responseText);
      document.getElementById("todayCases").innerText = "+" + data.todayCases;
      document.getElementById("cases").innerText = data.cases;
      document.getElementById("todayRecovered").innerText =
        "+" + data.todayRecovered;
      document.getElementById("recovered").innerText = data.recovered;
      document.getElementById("todayDealth").innerText = "+" + data.todayDeaths;
      document.getElementById("dealths").innerText = data.deaths;

      Table();
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(
        axesLinearchart(data.cases, data.recovered, data.deaths)
      );
    };
    request.send();

    //onChange----
    document
      .getElementById("countries-dropdown")
      .addEventListener("change", getSelectvalue);
    function getSelectvalue() {
      var selectedvalue = document.getElementById("countries-dropdown");
      var index = selectedvalue.options[selectedvalue.selectedIndex].text;

      if (index != "Worldwide") {
        request.open(
          "GET",
          `https://disease.sh/v3/covid-19/countries/${index}`,
          true
        );
        request.onload = function () {
          let data = JSON.parse(request.responseText);
          document.getElementById("todayCases").innerText =
            "+" + data.todayCases;
          document.getElementById("cases").innerText = data.cases;
          document.getElementById("todayRecovered").innerText =
            "+" + data.todayRecovered;
          document.getElementById("recovered").innerText = data.recovered;
          document.getElementById("todayDealth").innerText =
            "+" + data.todayDeaths;
          document.getElementById("dealths").innerText = data.deaths;
          google.charts.load("current", { packages: ["corechart"] });
          google.charts.setOnLoadCallback(
            axesLinearchart(data.cases, data.recovered, data.deaths)
          );
        };
        request.send();
      } else {
        request.open("GET", "https://disease.sh/v3/covid-19/all", true);
        request.onload = function () {
          let data = JSON.parse(request.responseText);
          document.getElementById("todayCases").innerText =
            "+" + data.todayCases;
          document.getElementById("cases").innerText = data.cases;
          document.getElementById("todayRecovered").innerText =
            "+" + data.todayRecovered;
          document.getElementById("recovered").innerText = data.recovered;
          document.getElementById("todayDealth").innerText =
            "+" + data.todayDeaths;
          document.getElementById("dealths").innerText = data.deaths;
          google.charts.load("current", { packages: ["corechart"] });
          google.charts.setOnLoadCallback(
            axesLinearchart(data.cases, data.recovered, data.deaths)
          );
        };
        request.send();
      }
    }
  } else {
    console.log("error");
  }
};

request.onerror = function () {
  console.error("An error occurred fetching the JSON from " + url);
};

request.send();

function Table() {
  var table = document.getElementById("table");
  var tablearea = document.getElementById("table-area");

  request.open("GET", "https://disease.sh/v3/covid-19/countries", true);
  request.onload = function () {
    const data = JSON.parse(request.responseText);
    for (let i = 0; i < data.length; i++) {
      var tr = document.createElement("tr");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");

      var text1 = document.createTextNode(data[i].country);
      var text2 = document.createTextNode(data[i].cases);

      td1.append(text1);
      td2.append(text2);
      tr.appendChild(td1);
      tr.appendChild(td2);

      table.appendChild(tr);
    }
    tablearea.appendChild(table);
  };
  request.send();
}

function axesLinearchart(cases, recoveries, dealths) {
  var data = google.visualization.arrayToDataTable([
    ["CoronaDetails", "Number", { role: "style" }],
    ["Cases", cases, "#037DD6"],
    ["Recoveries", recoveries, "#03FF5B"],
    ["Dealths", dealths, "#F62D00"],
  ]);
  var view = new google.visualization.DataView(data);
  view.setColumns([
    0,
    1,
    { calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" },
    2,
  ]);
  var options = {
    title: "COVID-Graph",
    width: 800,
    height: 400,
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(
    document.getElementById("chart-section")
  );
  chart.draw(view, options);
}
