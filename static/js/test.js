// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  

var depth = []
  

//need to figure out what range is

  // console.log(data.features["geometry"]["coordinates"][2]);
 
  //Create circles

  for (var i = 0; i < data.features.length; i++) {


    depth.push(data.features[i].geometry.coordinates[2]);
    

    // // Conditionals for countries points
    // var color = "";
    // if (data.features[i]["geometry"]["coordinates"][2] > 200) {
    //   color = "yellow";
    // }
    // else if (data.features[i]["geometry"]["coordinates"][2] > 100) {
    //   color = "blue";
    // }
    // else if (data.features[i]["geometry"]["coordinates"][2]> 90) {
    //   color = "green";
    // }
    // else {
    //   color = "red";
    // }

    

    
  }




});

Math.min.apply(null,depth)