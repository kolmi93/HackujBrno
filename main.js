let dataSkoly = undefined;
let dataSkolyParsed = undefined;
let dataHriste = undefined;
let dataHristeParsed = undefined;

let dataSkolyMinimas = [];
let globalData = {};

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

        // globalData.forEach((item) => {
        for (const [key, item] of Object.entries(globalData)) {
            console.log(item);
            map.addSource(item['name'], {
                type: 'geojson',
                data: {
                    'type': 'FeatureCollection',
                    'features': item['features']
                }
            });

            map.addLayer({
                'id': item['name'] + 'Layer',
                'type': 'circle',
                'source': item['name'],
                'layout': {},
                'paint': {
                    'circle-radius': 8,
                    'circle-color': config[item['name']]['color'],
                    'circle-blur': 0.1,
                    'circle-opacity': 0.7,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-opacity': 0.9
                }
            });
        }
        // )
        //     ;


        // map.addSource('hriste', {
        //     type: 'geojson',
        //     data: {
        //         'type': 'FeatureCollection',
        //         'features': dataHristeParsed
        //     }
        // });

        // Apply 'within' expressionwerwer to points
        // Routes within Colorado have 'circle-color': '#f55442'
        // Fallback values (routes not within Colorado) have 'circle-color': '#484848'


        // map.addLayer({
        //     'id': 'hristeLayer',
        //     'type': 'circle',
        //     'source': 'hriste',
        //     'layout': {},
        //     'paint': {
        //         'circle-radius': 8,
        //         'circle-color': '#bf0053',
        //         'circle-blur': 0.1,
        //         'circle-opacity': 0.7,
        //         'circle-stroke-width': 2,
        //         'circle-stroke-color': '#ffffff',
        //         'circle-stroke-opacity': 0.9
        //     }
        // });
    });
    map.on('click', (e) => {
        // Copy coordinates array.
        let lat = e.lngLat.lat;
        let lng = e.lngLat.lng;

        let myDistance = calculateClosest(lat, lng, dataSkolyParsed);
        let maxDistance = Math.max(...dataSkolyMinimas);
        let index = Math.ceil((10 * myDistance) / maxDistance);

        console.log("index : " + index);

    });
}


// Async function to load CSV data
async function loadCSVData(fileName) {
    try {
        // Await the fetch call to resolve and get the response
        const response = await fetch(fileName + '.csv');

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Await the text data from the response
        const data = await response.text();
        let parsedData = csvToJson(data);
        let minimas = [];
        parsedData.forEach((item) => {
            let localLat = item.geometry.coordinates[1];
            let localLng = item.geometry.coordinates[0];
            let val = calculateClosest(localLat, localLng, parsedData);
            if (val !== Infinity) minimas.push(val);
        });

        globalData[fileName] = {'features': parsedData, 'minimas': minimas, 'name': fileName};
        return data; // Returning the data if needed elsewhere
    } catch (error) {
        console.error('Error loading the CSV file:', error);
    }
}

// // Call the function
// let x = loadCSVData('skoly.csv').then(data => {
//     // This will log the data returned from the function, if needed
//     dataSkoly = data;
//     dataSkolyParsed = csvToJson(dataSkoly);
//
//     loadCSVData('hriste.csv').then(data => {
//         dataHriste = data;
//         initMap();
//
//         dataSkolyParsed.forEach((item) => {
//             let localLat = item.geometry.coordinates[1];
//             let localLng = item.geometry.coordinates[0];
//             let val = calculateClosest(localLat, localLng, dataSkolyParsed);
//             if(val !== Infinity) dataSkolyMinimas.push(val);
//         });
//     });
// });

let config = {
    'skoly': {
        'color': '#007cbf'
    },
    'hriste': {
        'color': '#bf0033'
    }
}

async function loadData() {
    await loadCSVData('skoly');
    await loadCSVData('hriste');
}

loadData().then(() => {
    initMap();
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

function calculateClosest(lat, lng, data) {
    let closest = Infinity;
    let farest = 0;
    let closestName = '';

    data.forEach((item) => {
        let localLat = item.geometry.coordinates[1];
        let localLng = item.geometry.coordinates[0];
        if (lat === localLat && lng === localLng) return;

        let distance = measure(lat, lng, localLat, localLng);
        // console.log("distance : " + distance);
        if (distance < closest) {
            closest = distance;
            closestName = item.name;
        }
        if (distance > farest) {
            farest = distance;
            closestName = item.name;
        }
    });

    // let index = Math.ceil((10 * closest) / farest);
    // console.log(index);
    return closest;
}

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
}
