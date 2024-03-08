// Get the Samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data)
    // Display the default plots
    function init() {
        /////////////////////////////////////////////
        // Create a horizonal bar chart with a dropown menu to display the top 10 OTUs found in that individual
        //    Use sample_values as the values for the bar chart
        //    Use otu_ids as the labels for the bar chart
        //    Use otu_labels as the hovertext for the chart

        // Slice first 10 sample_values for bar plot
        let sample = data.samples[0];
        let toptenSamples = sample.sample_values.slice(0, 10);
        toptenSamples.reverse();
        let toptenLabels = sample.otu_ids.slice(0, 10);
        toptenLabels.reverse();
        let toptenHovers = sample.otu_labels.slice(0, 10);
        toptenHovers.reverse();

        console.log(sample)
        console.log(toptenSamples)
        console.log(toptenLabels)
        console.log(toptenHovers)

        // Get OTU names as labels
        let labels = toptenLabels.map(function (row){
            return `OTU ${row}`;
        });

        console.log(labels)

        // Trace for bar graph OTU data
        let trace1 = {
            type: 'bar',
            x: toptenSamples.map(row => row),
            y: labels,
            text: toptenHovers,
            orientation: 'h'
        };
        // Data trace array
        let array1 = [trace1];
        // Apply title and margins to the layout
        let layout = {
            title: 'Top 10 OTUs Found',
            height: 600,
            width: 600
        };
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot('bar', array1, layout);

        /////////////////////////////////////////////
        // Create a bubble chart that displays each sample
        //    Use otu_ids for the x values
        //    Use sample_values for the y values
        //    Use sample values for the marker size
        //    Use otu_ids for the marker colors
        //    Use otu_labels for the text values

        let trace2 = {
            x: data.samples[0].otu_ids.map(row => row),
            y: data.samples[0].sample_values.map(row => row),
            mode: 'markers',
            marker: {
                size: data.samples[0].sample_values.map(row => row),
                color: data.samples[0].otu_ids.map(row => row)
            },
            text: data.samples[0].otu_labels.map(row => row)
        };
        // Data trace array
        let array2 = [trace2];
        // Apply title and margins to the layout
        let layout2 = {
            title: 'OTU Samples',
            height: 600,
            width: 600
        };
        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot('bubble', array2, layout2);

        /////////////////////////////////////////////
        // Display the sample metadata, i.e., an individual's demographic information
        //    Display each key-value pair from the metadata JSON object somewhere on the page.
        // let displayMD = d3.select('sample-metadata')
        let metadataPanel = d3.select("#sample-metadata");
        let metadataInfo = data.metadata[0];
        for (const [key, value] of Object.entries(metadataInfo)) {
            metadataPanel.append("h5").text(`${key}: ${value}`);
        };

        console.log(metadataInfo)
    };


    // Function called by DOM changes
    function optionChanged() {
        let dropdownMenu = d3.select('#selDataset');
        // Assign the value of the dropdown menu option to a variable
        let dataset = dropdownMenu.node().value;

        /* Create function to select the data for the id that corresponds to the
        current value selected in the dropdown*/
        function selectWhere(data, propertyName) {
            for (var i = 0; i < data.length; i++) {
                if (data[i][propertyName] == dataset) return data[i];
            };
        };

        // Get the data for the id that corresponds with the current value of the dropdown menu
        current = selectWhere(data.samples, "id");
        // Recalculate variables for the bar chart
        toptenSamples = current.sample_values.slice(0,10);
        toptenSamples.reverse();
        toptenLabels = current.otu_ids.slice(0,10);
        toptenLabels.reverse();
        toptenHovers = current.otu_labels.slice(0,10);
        toptenHovers.reverse();
        // Update labels for the bar chart
        labels = toptenLabels.map(function (row){
            return `OTU ${row}`;
        });

        // Grab and update data for the metadata panel
        metadataPanel = d3.select("#sample-metadata");
        metadataInfo = selectWhere(data.metadata, "id");
        metadataPanel.html("")

        console.log(toptenSamples)
        console.log(toptenLabels)
        console.log(toptenHovers)
        console.log(metadataInfo)

        for (const [key, value] of Object.entries(metadataInfo)) {
            metadataPanel.append("h5").text(`${key}: ${value}`);
        };

        // Call function to update the chart
        updatePlotly(current, toptenSamples, labels, toptenHovers);
    };


    // Update the restyle plot's values
    function updatePlotly(newdata, newsamples, newlabels, newhovers) {
        // Update trace1 for the bar chart
        let trace1 = {
            type: 'bar',
            x: newsamples,
            y: newlabels,
            text: newhovers,
            orientation: 'h'
        };
        // Data trace array
        let array1 = [trace1];
        // Apply title and margins to the layout
        let layout = {
            title: 'Top 10 OTUs Found',
            height: 600,
            width: 600
        };

        // Update trace2 for the bubble chart
        let trace2 = {
            x: newdata.otu_ids.map(row => row),
            y: newdata.sample_values.map(row => row),
            mode: 'markers',
            marker: {
                size: newdata.sample_values.map(row => row),
                color: newdata.otu_ids.map(row => row)
            },
            text: newdata.otu_labels.map(row => row)
        };
        // Data trace array
        let array2 = [trace2];
        // Apply title and margins to the layout
        let layout2 = {
            title: 'OTU Samples',
            height: 600,
            width: 600
        };

        // Update the bar and bubble charts
        Plotly.newPlot('bar', array1, layout);
        Plotly.newPlot('bubble', array2, layout2);
    };


    // On change to the DOM, call optionChanged()
    d3.selectAll("#selDataset").on("change", optionChanged);

    // Set dropdown menu values
    let dropMenu = document.getElementById("selDataset");
    let dropOptions = data.names;

    for(var i = 0; i < dropOptions.length; i++) {
        var opt = dropOptions[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropMenu.appendChild(el);
    };
    
    init();
});