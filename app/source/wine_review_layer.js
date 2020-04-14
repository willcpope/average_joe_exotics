// Creating map object
var myMap = L.map("map", {
    center: [52.52, 13.40],
    zoom: 4
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  function chooseColor(borough) {
    switch (borough) {
    case "Netherlands":
      return "yellow";
    case "Bronx":
      return "red";
    case "Manhattan":
      return "orange";
    case "Queens":
      return "green";
    case "Staten Island":
      return "purple";
    default:
      return "green";
    }
  }
  var geodata = "data/countries-hires.json"
  d3.json(geodata, function(response){
      console.log(response);
      L.geoJson(response,{
        style: function(feature) {
          return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: chooseColor(feature.properties.SOVEREIGNT),
            fillOpacity: 0.5,
            weight: 1.5
          };
        }
      }).addTo(myMap);
  });
  // Store API query variables

  var baseURL = "data/winemag-data-130k-v2.csv";
  
  //var date = "$where=created_date between'2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
  //var complaint = "&complaint_type=Rodent";
  //var limit = "&$limit=10000";
  
  // Assemble API query URL
  //var url = baseURL + date + complaint + limit;
  
  // Grab the data with d3
  d3.csv(baseURL, function(response) {
      console.log(response);
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();
  
    // Loop through data
    for (var i = 0; i < response.length; i++) {
  
      // Set the data location property to a variable
      var location = response[i].location;
  
      // Check for location property
      if (location) {
  
        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
          .bindPopup(response[i].descriptor));
      }
  
    }
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
  });
  