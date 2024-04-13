let dataSkoly = undefined;
let dataHriste = undefined;

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiamlya2FzZW1tbGVyIiwiYSI6ImNsdXh2d3kzdDBzb2Eyam55MGx3OGlzeDkifQ.1xn7r6c7OnYB-meA5S3S5w';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v11', // style URL
        center: [16.608904709836153, 49.19476456348063], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });

    map.on('load', () => {

        map.addSource('skoly', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': csvToJson(dataSkoly)
            }
        });
        map.addSource('hriste', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': csvToJson(dataHriste)
            }
        });

        // Apply 'within' expressionwerwer to points
        // Routes within Colorado have 'circle-color': '#f55442'
        // Fallback values (routes not within Colorado) have 'circle-color': '#484848'
        map.addLayer({
            'id': 'skolyLayer',
            'type': 'circle',
            'source': 'skoly',
            'layout': {},
            'paint': {
                'circle-radius': 8,
                'circle-color': '#007cbf',
                'circle-blur': 0.1,
                'circle-opacity': 0.7,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.9
            }
        });

        map.addLayer({
            'id': 'hristeLayer',
            'type': 'circle',
            'source': 'hriste',
            'layout': {},
            'paint': {
                'circle-radius': 8,
                'circle-color': '#bf0053',
                'circle-blur': 0.1,
                'circle-opacity': 0.7,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.9
            }
        });
    });
}


// Async function to load CSV data
async function loadCSVData(fileName) {
    try {
        // Await the fetch call to resolve and get the response
        const response = await fetch(fileName);

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Await the text data from the response
        const data = await response.text();

        // Now you can use the CSV data
//        console.log(data);
        return data; // Returning the data if needed elsewhere
    } catch (error) {
        console.error('Error loading the CSV file:', error);
    }
}

// Call the function
loadCSVData('skoly.csv').then(data => {
    // This will log the data returned from the function, if needed
    dataSkoly = data;
    loadCSVData('hriste.csv').then(data => {
        dataHriste = data;
        initMap();
    });
});

// Function to convert CSV to JSON
function csvToJson(csvString) {
    // Split the CSV into lines
    let lines = csvString.split('\n');

    // Map each line to a JSON object
    let jsonResult = lines.map(line => {
        // Split each line by comma to get individual values
        let [name, X, Y] = line.split(',');

        // Return the desired JSON structure
        return {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'coordinates': [parseFloat(X), parseFloat(Y)],
                'type': 'Point'
            }
        };
    });

    return jsonResult;
}
