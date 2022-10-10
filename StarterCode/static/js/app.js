// function which populates metadata
function demoInfo(sample)
{
    //console.log(sample);

    d3.json("../data/samples.json").then((data) => {
        //grab the metadata
        let metaData = data.metadata;
        //console.log(metaData);

        //filter based on value of sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);

        // clear out the metadata
        d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs so that you can just populate them in the sample metadata
        Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data/demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        })
    });
}

// function which builds the graphs
function buildBarChart(sample)
{
    //console.log(sample);
    //let data = d3.json("../data/samples.json");
    //console.log(data);

    d3.json("../data/samples.json").then((data) => {
        //grab the sampledata
        let sampleData = data.samples;
        //console.log(sampleData);

        //filter based on value of sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);

        // get otu_ids, labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        // build that chart
        // get the y ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        //console.log(yticks);

        let xValues = sample_values.slice(0, 10);
        //console.log(xValues);

        let textLabels = otu_labels.slice(0, 10);
        //console.log(textLabels);

        let barChart = {
            y: yticks.reverse(), // .reverse() so it goes greatest at the top and least at the bottom instead of default (least at top, greatest at bottom)
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }
        let layout = {
            title: "Top 10 Bellybutton Bacteria"
        }

        Plotly.newPlot("bar", [barChart], layout);

        // clear out the metadata
        //d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs so that you can just populate them in the sample metadata
        //Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data/demographics section
            //d3.select("#sample-metadata")
                //.append("h5").text(`${key}: ${value}`);
        //})
    });    
}

// function to build the bubble chart
function buildBubbleChart(sample)
{
    //console.log(sample);
    //let data = d3.json("../data/samples.json");
    //console.log(data);

    d3.json("../data/samples.json").then((data) => {
        //grab the sampledata
        let sampleData = data.samples;
        //console.log(sampleData);

        //filter based on value of sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);

        // get otu_ids, labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "fall"
            }
        }
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU_ID"}
        }

        Plotly.newPlot("bubble", [bubbleChart], layout);

        // clear out the metadata
        //d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs so that you can just populate them in the sample metadata
        //Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data/demographics section
            //d3.select("#sample-metadata")
                //.append("h5").text(`${key}: ${value}`);
        //})
    });    
}

// function which initializes the dashboard
function init()
{
    // load the data from the file
    //let data = d3.json("../data/samples.json");
    //console.log(data);

    // access dropdown selector from index.html
    // in id="selDataset"
    var select = d3.select("#selDataset"); // for some reason, if I don't include the #, the following lines don't append the options to the selector? Weird. I wonder why.

    // use d3.json to get the data
    d3.json("../data/samples.json").then((data) => {
        let sampleNames = data.names; // array of just names
        //console.log(sampleNames);

        // use a foreach to create options for each sample in selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // gotta pass in the first sample info
        let firstSample = sampleNames[0];
        //console.log(firstSample);

        //call function to build metadata
        demoInfo(firstSample);
        // calls function to build bar chart
        buildBarChart(firstSample);
        // calls function to build bubble chart
        buildBubbleChart(firstSample);
    });
}

// function which updates the dashboard
function optionChanged(item)
{
    // call update to metadata
    demoInfo(item);
    // calls function to build bar chart
    buildBarChart(item);
    // calls function to build bubble chart
    buildBubbleChart(item);
}

// call init function
init()