// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -50.0059],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// //Defining depth variable:
// var depth = data.features.geometry.coordinates[2];
// console.log(depth)

//Choosing color based on 
function chooseColor(depth) {
  switch (true) {
  case (depth>=90):
    return "#402060";
  case (depth>=70):
    return "#28085f";
  case (depth>=50):
    return "#3e2377";
  case (depth>=30):
    return "#524595";
  case (depth>=10):
    return "#807fbb";
  case (depth<10):
      return "#cca4c5";
  default:
    return "white";
  }
}


d3.json(queryUrl, function(data) {
    
  
  // Once we get a response, send the data.features object to the createFeatures function
  L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
      
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: (feature.properties.mag)*2.3,
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8});
  }


  }).addTo(myMap);
 
  
});

// var legend = L.control({position: 'bottomright'});
//     legend.onAdd = function () {

//     var div = L.DomUtil.create('div', 'info legend');
//     // labels = ['<strong>Categories</strong>'],
//     var categories = [-10,10,30,50,70,90];
//     var colors =["#cca4c5", "#807fbb", "#524595", "#3e2377","#28085f","#402060"]

    

//     for (var i = 0; i < categories.length; i++) {

//             div.innerHTML += 
//             // labels.push(
//               '<i style="background:' + colors[i+1] + '"></i> ' + 
//               categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');

//         }
//         // div.innerHTML = labels.join('<br>');
//     return div;
//     };
//     legend.addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<li style="background:' + chooseColor(grades[i] + 1) + '"></li> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);