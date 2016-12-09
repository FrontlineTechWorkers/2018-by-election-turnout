var dataUrl = "https://docs.google.com/spreadsheets/d/1Kbb8B2oPdvmsmoGqSzVScUaMMx76Mc6t156q_94QxSA/pubhtml"
var myScale = d3.scale.linear().domain([0, 1]).range([0, 2 * Math.PI]);
var gap = 2;
var width = 22;
var maxRadius = 115;
var cat = ["ECNow", "LegcoNow", "LegcoFinal"];
var catNames = ["選委即時", "立會同期", "立會最終"]
var catColors = ["#ff0000", "#999999", "#000000"];

function draw(data, tabletop) {
  console.log(data);

  var svg = d3.select("#charts").selectAll("svg").data(data);

  var newChart = svg.enter()
    .append("svg")
    .style("width", "280px")
    .style("height", "280px")
    .style("background", "#d0d0d0")
    .style("margin", "10px");

  // Sector name.
  newChart.append("text")
    .attr("x", "8")
    .attr("y", "265")
    .attr("text-anchor", "begin")
    .attr("font-weight", "bold")
    .text(function(d) {
      return d["DisplayName"]
    });

  // Updated time.
  newChart.append("text")
    .attr("x", "272")
    .attr("y", "265")
    .attr("font-size", "11")
    .attr("text-anchor", "end")
    .text(function(d) {
      return "更新至" + (d["Updated"] || "?");
    });

  // Deficit.
  newChart.append("text")
    .attr("x", "0")
    .attr("y", "0")
    .attr("font-size", "32")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("transform", "translate(140,130)")
    .text(function(d) {
      var ec = parseFloat(d[cat[0]]);
      var legco = parseFloat(d[cat[1]]);
      return isNaN(legco) ? "" : Math.round(100 * ((ec || 0) - legco)) + "%";
    });

  // Rings.
  for (var i = 0; i < 3; i++) {
    // Label.
    newChart.append("text")
      .attr("x", -35)
      .attr("y", -(maxRadius - i * (width + gap) - width / 2 - 5))
      .attr("fill", i == 0 ? "black" : "#606060")
      .attr("font-size", "14")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("transform", "translate(140,130)")
      .text(function(d) {
        return (i != 0 && !parseFloat(d[cat[i]])) ? "" : catNames[i];
      });

    // Value.
    newChart.append("text")
      .attr("x", -3)
      .attr("y", -(maxRadius - i * (width + gap) - width / 2 - 5))
      .attr("fill", i == 0 ? "black" : "#606060")
      .attr("font-size", "14")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("transform", "translate(140,130)")
      .text(function(d) {
        var v = parseFloat(d[cat[i]]);
        return (i != 0 && !v) ? "" : Math.round(100 * v || 0) + "%";
      });

    // Arc.
    newChart.append("path")
      .style("fill", catColors[i])
      .attr("transform", "translate(140,130)")
      .attr("d", d3.svg.arc()
        .innerRadius(maxRadius - i * (width + gap) - width)
        .outerRadius(maxRadius - i * (width + gap))
        .startAngle(0)
        .endAngle(function(d) {
          return myScale(parseFloat(d[cat[i]]) || 0);
        })
      );
  }

  svg.exit().remove();
}

function load() {
  Tabletop.init({
    key: dataUrl,
    callback: draw,
    simpleSheet: true
  });
}

load();