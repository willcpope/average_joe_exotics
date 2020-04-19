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
  
// Country & Fatality data
var jsonData;
var queryUrl = "//ENTER URL HERE"
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