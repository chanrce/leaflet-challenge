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
  switch (depth) {
  case (depth>=90):
    return "#402060";
  case (depth>=70):
    return "#4d2673";
  case (depth>=50):
    return "#592d86";
  case (depth>=30):
    return "#663399";
  case (depth>=10):
    return "#7339ac";
  case (depth<=10):
      return "#8040bf";
  default:
    return "black";
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
        radius: feature.properties.mag,
        //Defining the depth
        // fillColor: "#ff7800",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8});
  }
  }).addTo(myMap);
 
  
});

