// Create a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);


/* Alessio Base Layers*/

var consuptiondata = "../data/alcohol_consumption.json";
var geodata = "../data/countries-hires.json"

d3.json(consuptiondata, function(response){
    console.log(response);
  });

function countrycolor(chocolate){
    //console.log(item)
    if (chocolate >= 1){
        return "yellow"
    }
    else if (chocolate >= 2){
        return "red"
    }
    else {
        return "black"
    }
}

function chooseColor(country) {
    switch (country) {
    case "Poland":
      return "brown"; 
    case "Germany":
      return "red";
    case "Italy":
      return "orange";
    case "France":
      return "white";
    case "Belgium":
      return "purple";
    default:
      return "green";
    }
  }
  
d3.json(geodata, function(response){
      console.log(response);
      L.geoJson(response,{
        style: function(apple) {
          
          return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: chooseColor(apple.properties.SOVEREIGNT),
            fillOpacity: 0.5,
            weight: 1.5
          };
        }
      
      })
  }).addTo(myMap);

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

/* Will Bubble Layer*/

// Country data
var jsonData;
var queryUrl = "data/traffic_related_deaths.json"
d3.json(queryUrl, function (data) {
  jsonData = data;
  
  data.features.forEach(obj => {
    var lat = obj.geometry.coordinates[1];
    var lng = obj.geometry.coordinates[0];
    var fatality = obj.properties.fatalities_100K_people_per_year;
    var country = obj.properties.country_name;
  
    // Add circles to map
    L.circle([lat, lng], {
      stroke: false,
      fillOpacity: .75,
      color: getColor(fatality),
      fillColor: getColor(fatality),
      // Adjust radius
      radius: fatality * 30000
    }).bindPopup("<h3>" + country + "<h3><h3>Fatalities 100K People Per Year: " + fatality + "</h3>").addTo(myMap);
  });
});
  
// Conditionals for data
function getColor(d) {
  return d > 5 ? 'red' :
         d > 4 ? 'orange' :
         d > 3 ? 'yellow' :
         d > 2 ? 'green' :
         d > 1 ? 'teal' :
                 'blue' ;                
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    fatalities = [0, 1, 2, 3, 4, 5],
    labels = [];
  
    // Loop through data
  for (var i = 0; i < fatalities.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(fatalities[i] + 1) + '"></i> ' +
      fatalities[i] + (fatalities[i + 1] ? '&ndash;' + fatalities[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap);
  