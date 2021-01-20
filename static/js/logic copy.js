// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create list to hold the circles
circlelist = []

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);

  



//need to figure out what range is

  // console.log(data.features["geometry"]["coordinates"][2]);
 
  //Create circles

  for (var i = 0; i < data.features.length; i++) {

    // Conditionals for countries points
    var color = "";
    if (data.features[i]["geometry"]["coordinates"][2] > 200) {
      color = "yellow";
    }
    else if (data.features[i]["geometry"]["coordinates"][2] > 100) {
      color = "blue";
    }
    else if (data.features[i]["geometry"]["coordinates"][2]> 90) {
      color = "green";
    }
    else {
      color = "red";
    }

    

    //Getting coordinates
    var lat = data.features[i]["geometry"]["coordinates"][1]
    var long = data.features[i]["geometry"]["coordinates"][0]
    circlelist.push(
      // Add circles to map
      L.circle([lat, long], {
        fillOpacity: 0.75,
        color: "black",
        // fillColor: color,
        // Adjust radius
        radius: (data.features[i].properties.mag) * 3000
      })
    )
  }




});


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p> Date: " + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    var earthquakes = L.geoJSON(earthquakeData, {

      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }



//Create Circles

// for (var i = 0; i < data.features; i++) {

//   // // Conditionals for countries points
//   // var color = "";
//   // if (countries[i].points > 200) {
//   //   color = "yellow";
//   // }
//   // else if (countries[i].points > 100) {
//   //   color = "blue";
//   // }
//   // else if (countries[i].points > 90) {
//   //   color = "green";
//   // }
//   // else {
//   //   color = "red";
//   // }

//   // Add circles to map
//   L.circle(data.features[i].location, {
//     fillOpacity: 0.75,
//     color: "white",
//     fillColor: color,
//     // Adjust radius
//     radius: data.features[i].mag * 1500
//   }).bindPopup("<h1>" + data.features[i].location + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
// }




function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}