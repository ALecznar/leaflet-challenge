// Initialize the map 
var myMap = L.map("map").setView([37.09, -95.71], 5);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Get Data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
        // Loop through the features array
        for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];
            var coordinates = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coordinates[2];

            // Create a circle with color and size based on depth and magnitude
            L.circle([coordinates[1], coordinates[0]], {
                fillOpacity: 0.75,
                color: depthColor(depth), // function to determine color
                fillColor: depthColor(depth),
                radius: magnitude * 10000  // Radius based on magnitude
            }).bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><h4>Magnitude: " + magnitude + "</h4><h4>Depth: " + depth + "</h4>").addTo(myMap);
        }
    });

// Color based on depth 
function depthColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FFEDA0';
}

// egend (Syling in the css file)
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
        depth = [-10, 10, 30, 50, 70, 90], // Depth categories
        labels = [];

    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add Legend to the map
legend.addTo(myMap);
