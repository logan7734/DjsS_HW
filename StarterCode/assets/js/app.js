// @TODO: YOUR CODE HERE!

var margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

function makeResponsive() {


    var svgArea = d3.select("body").select("svg");
  

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;


    var height = svgHeight-margins.top-margins.bottom;
    var width = svgWidth-margins.left-margins.right;

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height",svgHeight)
        .attr("width",svgWidth);

    var chartGroup = svg.append("g")
        .attr("transfrom", `translate(${margins.left},${margins.top})`)
        .classed("preventMeddling",true);
    var labelGroup = chartGroup.append("g")

    var yLabel = labelGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",margins.left/3)
    .attr("x",-height/2)
    .style("font-size","1.5rem")
    .style("text-anchor","middle")
    .text("Obesity (%)");

    var xLabel = labelGroup.append("text")
    .attr("transform",`translate(${svgWidth/2},${svgHeight-margins.bottom})`)
    .style("font-size","1.5rem")
    .style("text-anchor","middle")
    .text("Poverty (%)");

    d3.csv("assets/data/data.csv").then((data)=> {
        xDomain = d3.extent(data, d => parseFloat(d.poverty));
        xDomain[0] *= .98;
        xDomain[1] *= 1.02;

        yDomain = d3.extent(data, d => parseFloat(d.obesity)).reverse();
        yDomain[1] *= .98;
        yDomain[0] *= 1.02;

        // scaling

        var xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([margins.left,width+margins.left]);
        var yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([margins.top,height]);

        // creating axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
        chartGroup.append("g")
            .attr("transform",`translate(${margins.left},0)`)
            .call(yAxis);


        // labels and circles
        var stateCircles = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.obesity))
            .attr("r","10")
            .attr("fill", "silver")
            .attr("stroke", "black");
        var stateText = chartGroup.selectAll(".preventMeddling > text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.obesity)+5)
            .attr("textLength",13)
            .attr("lengthAdjust","spacingAndGlyphs")
            .style("text-anchor","middle")
            .text(d => d.abbr)
    });
};

makeResponsive();

d3.select(window).on("resize", makeResponsive);
