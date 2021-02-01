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
      layer.bindPopup("<h1> Location: " + feature.properties.place + "</h1> <hr> <h2> Magnitude: " + feature.properties.mag + "</h2>" + 
      "<h2> Depth: " + feature.geometry.coordinates[2]);
      
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: (feature.properties.mag)*2.3,
        // Call the chooseColor function to decide which color to color our earthquake location (color based on depth)
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8});
  }


  }).addTo(myMap);
 
  
});

//Creating the legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
    
    //Legend title
    div.innerHTML += '<b>Depth</b><br><hr>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<li style="background:' + chooseColor(depths[i] + 1) + '"></li> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);