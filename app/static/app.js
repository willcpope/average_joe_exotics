// Create a map object
var myMap = L.map("map", {
    center: [50.3785, 14.9706],
    zoom: 4
  });
  
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(myMap);

async function doThings() {
  const geoData = await d3.json('././data/countries_info.json');
  const deathData = await d3.json('././data/traffic_related_deaths.json');
  
  geoData.forEach(obj => {
    var lat = obj.latlng[0];
    var lng = obj.latlng[1];
    var name = obj.name;
  
  deathData.forEach(obj => {
    var fatalities = obj.fatalities_100K_people_per_year;

    // Add circles to map
    L.circle([lat, lng], {
      stroke: false,
      fillOpacity: .75,
      color: getColor(fatalities),
      fillColor: getColor(fatalities),
      // Adjust radius
      radius: fatalities * 5000
    }).bindPopup("<h3>" + name + "<h3><h3>Fatalities: " + fatalities + "</h3>").addTo(myMap);
  });
  });
};
  
// Conditionals for data
function getColor(d) {
  return d > 20 ? 'red' :
         d > 15 ? 'orange' :
         d > 10 ? 'yellow' :
         d > 5 ? 'green' :
         d > 1 ? 'teal' :
                 'blue' ;                
};

doThings();
