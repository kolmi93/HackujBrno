let globalData = {};
let map = undefined;
let marker = undefined;
let airData = undefined;

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiamlya2FzZW1tbGVyIiwiYSI6ImNsdXh2d3kzdDBzb2Eyam55MGx3OGlzeDkifQ.1xn7r6c7OnYB-meA5S3S5w';
    map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style:
            'mapbox://styles/mapbox/light-v11', // style URL
        center: [16.608904709836153, 49.19476456348063], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });

    map.on('load', () => {
        for (const [key, item] of Object.entries(globalData)) {
            map.addSource(item['name'], {
                type: 'geojson',
                data: {
                    'type': 'FeatureCollection',
                    'features': item['features']
                }
            });

            document.getElementById('legend-' + item['name']).style = 'background-color: ' + config[item['name']]['color'];

            map.addLayer({
                'id': item['name'] + 'Layer',
                'type': 'circle',
                'source': item['name'],
                'layout': {
                    // Make the layer visible by default.
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 5,
                    'circle-color': config[item['name']]['color'],
                    'circle-blur': 0.1,
                    'circle-opacity': 0.7,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-opacity': 0.9
                }
            });
        }

        //
        // map.addSource('maine', {
        //     'type': 'geojson',
        //     'data': {
        //         'type': 'Feature',
        //         'geometry': {
        //             'type': 'Polygon',
        //             // These coordinates outline Maine.
        //             'coordinates': [
        //                 [
        //                     16.593948,
        //                     49.2080651
        //                 ],
        //                 [
        //                     16.5944512,
        //                     49.2072391
        //                 ],
        //                 [
        //                     16.5946283,
        //                     49.2069453
        //                 ],
        //                 [
        //                     16.594888,
        //                     49.2065225
        //                 ],
        //                 [
        //                     16.5948146,
        //                     49.2064988
        //                 ],
        //                 [
        //                     16.5936548,
        //                     49.206134
        //                 ],
        //                 [
        //                     16.5936274,
        //                     49.206161
        //                 ],
        //                 [
        //                     16.5935062,
        //                     49.2062799
        //                 ],
        //                 [
        //                     16.5935026,
        //                     49.2063134
        //                 ],
        //                 [
        //                     16.5929531,
        //                     49.2067989
        //                 ],
        //                 [
        //                     16.5930155,
        //                     49.206938
        //                 ],
        //                 [
        //                     16.5927077,
        //                     49.2073789
        //                 ],
        //                 [
        //                     16.5925628,
        //                     49.2076649
        //                 ],
        //                 [
        //                     16.5925459,
        //                     49.2076987
        //                 ],
        //                 [
        //                     16.593948,
        //                     49.2080651
        //                 ]
        //             ]
        //         }
        //     }
        // });

        // // Add a new layer to visualize the polygon.
        // map.addLayer({
        //     'id': 'maine',
        //     'type': 'fill',
        //     'source': 'maine', // reference the data source
        //     'layout': {},
        //     'paint': {
        //         'fill-color': '#ff0000', // blue color fill
        //         'fill-opacity': 1
        //     }
        // });
        // // Add a black outline around the polygon.
        // map.addLayer({
        //     'id': 'outline',
        //     'type': 'line',
        //     'source': 'maine',
        //     'layout': {},
        //     'paint': {
        //         'line-color': '#000',
        //         'line-width': 3
        //     }
        // });


        map.addSource('maine', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    // These coordinates outline Maine.
                    'coordinates': [
                        [
                            [
                                16.593948,
                                49.2080651
                            ],
                            [
                                16.5944512,
                                49.2072391
                            ],
                            [
                                16.5946283,
                                49.2069453
                            ],
                            [
                                16.594888,
                                49.2065225
                            ],
                            [
                                16.5948146,
                                49.2064988
                            ],
                            [
                                16.5936548,
                                49.206134
                            ],
                            [
                                16.5936274,
                                49.206161
                            ],
                            [
                                16.5935062,
                                49.2062799
                            ],
                            [
                                16.5935026,
                                49.2063134
                            ],
                            [
                                16.5929531,
                                49.2067989
                            ],
                            [
                                16.5930155,
                                49.206938
                            ],
                            [
                                16.5927077,
                                49.2073789
                            ],
                            [
                                16.5925628,
                                49.2076649
                            ],
                            [
                                16.5925459,
                                49.2076987
                            ],
                            [
                                16.593948,
                                49.2080651
                            ]
                        ]
                    ]
                }
            }
        });

        // Add a new layer to visualize the polygon.
        map.addLayer({
            'id': 'maine',
            'type': 'fill',
            'source': 'maine', // reference the data source
            'layout': {},
            'paint': {
                'fill-color': '#6e9367', // blue color fill
                'fill-opacity': 0.5
            }
        });
        // Add a black outline around the polygon.
        map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'maine',
            'layout': {},
            'paint': {
                'line-color': '#53c73d',
                'line-width': 1
            }
        });


    });

    map.on('click', (e) => {
        // Copy coordinates array.
        let lat = e.lngLat.lat;
        let lng = e.lngLat.lng;
        let indexes = [];


        for (const [key, item] of Object.entries(globalData)) {
            let name = item['name'];
            let myDistance = calculateClosest(lat, lng, globalData[name]['features']);
            let maxDistance = Math.max(...globalData[name]['minimas']);
            let index = Math.round((10 * myDistance) / maxDistance);
            // console.log("index : " + index + "  : " + name);

            const checkboxSpan = document.querySelector('#index-' + name);
            checkboxSpan.classList = 'bg bg-default';
            if (index > 10) {
                index = 10;
            }

            if (index < 1) {
                index = 1;
            }
            checkboxSpan.classList.add('bg-color-' + index);
            checkboxSpan.textContent = index;
            indexes.push(index);
        }

        countAirIndex(lat, lng);

        let totalIndex = Math.round(calculateAverage(indexes));

        const totalIndexElement = document.querySelector('#index-total');
        if (totalIndex > 10) {
            totalIndex = 10;
        }
        totalIndexElement.classList = 'bg bg-default';
        totalIndexElement.classList.add('bg-color-' + totalIndex);


        totalIndexElement.textContent = totalIndex;


        if (marker !== undefined) {
            marker.remove();
        }

        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add it to the map
        marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);
    });

}

function countAirIndex(lat, lng) {
    let minValue = 0.36;
    let maxValue = 0.8;
    let indexes = [];
    let myValue = calculateClosestAir(lat, lng, airData['features']);
    let index = Math.round((10 * (myValue - minValue)) / (maxValue - minValue));
    const checkboxSpan = document.querySelector('#index-air');
    checkboxSpan.classList = 'bg bg-default';
    if (index > 10) {
        index = 10;
    }

    if (index < 1) {
        index = 1;
    }
    checkboxSpan.classList.add('bg-color-' + index);
    checkboxSpan.textContent = index;
    indexes.push(index);
    return Math.round(calculateAverage(indexes));

}

const calculateAverage = numbers => numbers.reduce((sum, value) => sum + value, 0) / numbers.length || 0;


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
        let parsedData = csvToJson(data, fileName);
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


// Async function to load CSV data
async function loadAirData() {
    let fileName = 'kvalita';
    try {
        // Await the fetch call to resolve and get the response
        const response = await fetch('kvalita.csv');

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Await the text data from the response
        const data = await response.text();
        let parsedData = csvToJson(data, fileName);
        let minimas = [];
        parsedData.forEach((item) => {
            let localLat = item.geometry.coordinates[1];
            let localLng = item.geometry.coordinates[0];
            let val = calculateClosest(localLat, localLng, parsedData);
            if (val !== Infinity) minimas.push(val);
        });

        airData = {'features': parsedData};
        return data; // Returning the data if needed elsewhere
    } catch (error) {
        console.error('Error loading the CSV file:', error);
    }
}


let config = {
    'skoly': {
        'color': '#007cbf'
    },
    'hriste': {
        'color': '#bd411b'
    },
    'zelen': {
        'color': '#056900'
    },
    'skolky': {
        'color': '#ffd100'
    },
    'sportoviste': {
        'color': '#b700ff'
    },
    'lekarny': {
        'color': '#9f9f9f'
    },
    'lekari': {
        'color': '#4fc3d7'
    },
    'pediatri': {
        'color': '#143e5b'
    },
    'mhd': {
        'color': '#273034'
    },
    'shop': {
        'color': '#53c73d'
    }
}

async function loadData() {
    await loadCSVData('skoly');
    await loadCSVData('hriste');
    await loadCSVData('zelen');
    await loadCSVData('skolky');
    await loadCSVData('sportoviste');
    await loadCSVData('lekarny');
    await loadCSVData('lekari');
    await loadCSVData('pediatri');
    await loadCSVData('mhd');
    await loadCSVData('shop');
    await loadAirData();
}

loadData().then(() => {
    initMap();
});

// Function to convert CSV to JSON
function csvToJson(csvString, fileName) {
    // Split the CSV into lines
    let lines = csvString.split('\n');

    lines = lines.filter(line => line.length > 0);
    lines = lines.filter(line => line.length > 0);
    // Map each line to a JSON object
    let filteredData = lines.filter(line => {
        // Split each line by comma to get individual values
        let [name, X, Y] = line.split(',');

        let parsedX = parseFloat(X);
        let parsedY = parseFloat(Y);
        return parsedX > 16 && parsedX < 16.8 && parsedY > 49 && parsedY < 49.5;

    });

    let jsonResult = filteredData.map(line => {
        let [name, X, Y, value] = line.split(',');

        let parsedX = parseFloat(X);
        let parsedY = parseFloat(Y);

        return {
            'type': 'Feature',
            'properties': {
                'name': fileName,
                'value': value,
            },
            'geometry': {
                'coordinates': [parsedX, parsedY],
                'type': 'Point'
            }
        }
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
        if (distance < closest) {
            closest = distance;
            closestName = item.name;
        }
        if (distance > farest) {
            farest = distance;
            closestName = item.name;
        }
    });

    return closest;
}

function calculateClosestAir(lat, lng, data) {
    let closest = Infinity;
    let closestName = '';
    let closestValue = 0;
    data.forEach((item) => {
        let localLat = item.geometry.coordinates[1];
        let localLng = item.geometry.coordinates[0];
        if (lat === localLat && lng === localLng) return;

        let distance = measure(lat, lng, localLat, localLng);
        if (distance < closest) {
            closest = distance;
            closestName = item.name;
            closestValue = parseFloat(item.properties.value);
        }
    });

    return closestValue;
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


function toggleDataset(element, dataset) {
    if (dataset !== 'air') {
        const clickedLayer = dataset + 'Layer';

        const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
        );

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        } else {
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
    }

    const checkboxSpan = element.querySelector('.checkbox');
    checkboxSpan.classList.toggle('checked');
    element.classList.toggle('disabled-checkbox');
}

function hide(element, dataset) {
    if (dataset !== 'air') {
        const clickedLayer = dataset + 'Layer';

        // Toggle layer visibility by changing the layout object's visibility property.
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    }

    const checkboxSpan = element.querySelector('.checkbox');
    element.classList = 'custom-checkbox disabled-checkbox';
    checkboxSpan.classList = 'checkbox';
}

function show(element, dataset) {
    if (dataset !== 'air') {
        const clickedLayer = dataset + 'Layer';


        map.setLayoutProperty(
            clickedLayer,
            'visibility',
            'visible'
        );
    }

    const checkboxSpan = element.querySelector('.checkbox');
    checkboxSpan.classList = 'checkbox checked';
    element.classList = 'custom-checkbox';
}

function selectPersona(element, persona) {
    if(element.classList.contains('selected-persona')){

        element.classList.remove('selected-persona');
        for (const [key, item] of Object.entries(config)) {
            let element = document.querySelector('#checkbox-' + key);
            show(element, key);
        }
        return;
    }

    const personas = document.querySelectorAll('.persona');
    personas.forEach((persona) => {
        persona.classList.remove('selected-persona');
    });

    element.classList.add('selected-persona');

    let localConfig = {
        'old': ['air', 'zelen', 'lekarny', 'lekari', 'shop'],
        'fam': ['air', 'hriste', 'skoly', 'skolky', 'zelen', 'pediatri'],
        'young': ['sportoviste', 'zelen', 'shop'],
    }

    for (const [key, item] of Object.entries(config)) {
        let element = document.querySelector('#checkbox-' + key);

        hide(element, key);
    }
    for (const [key, item] of Object.entries(localConfig[persona])) {
        let element = document.querySelector('#checkbox-' + item);
        show(element, item);
    }


}
