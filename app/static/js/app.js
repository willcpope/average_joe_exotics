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


/* Alessio Base Layers */
var consumptiondata = "../data/alcohol_consumption.json";
  var geodata = "../data/countries-hires.json";
  
d3.json(consumptiondata, function(response){
    console.log("this is consumption data")
    console.log(response);
    do_this(response);
});

function chooseColor(place) {
  if(place <=2)
  {
    return "#ffffffe3";
  }else if (place <=5)
  {
    return "#bb9ef5e3";
  }
  else if (place <=7)
  {
    return "#9c70f3e3";
  }
  else if (place <=10)
  {
    return "#7d45eae3";
  }
  else if (place <=12)
  {
    return "#5600ff";
  }
  else if (place <=15)
  {
    return "tomato";
  }
  else{
    return "black";
  }
};

function do_this(consumption){
  d3.json(geodata, function(response){
    
    for(var i =0; i<response.features.length; i++){
      country = response.features[i].properties.SOVEREIGNT
      for(var z =0; z<consumption.length; z++){
        if(country==consumption[z].country_name 
        || country == "United States of America"
        || country == "Venezuela"
        || country == "Russia"
        || country == "Czech Republic"
        || country == "Republic of Serbia"
        || country == "Kosovo"
        || country == "Macedonia"
        || country == "Moldova"
        || country == "Bolivia"
        || country == "United Republic of Tanzania"
        || country == "Democratic Republic of the Congo"
        || country == "Republic of the Congo"
        || country == "Ivory Coast"
        || country == "South Sudan"
        || country == "Somaliland"
        || country == "Iran"
        || country == "Palestine"
        || country == "Northern Cyprus"
        || country == "Western Sahara"
        || country == "Guinea Bissau"
        || country == "South Korea"
        || country == "North Korea"
        || country == "Vietnam"
        || country == "Laos" 
        || country == "Syria"
        || country == "Antarctica"
        || country == "Taiwan"
        || country == "East Timor"
        || country == "Brunei"
        || country == "Swaziland"
        || country == "Kashmir"
        || country == "Vatican"
        || country == "San Marino"
        || country == "The Bahamas"
        || country == "Federated States of Micronesia"
        || country == "Monaco"       
        ){
          response.features[i].properties["both_sexes"] = consumption[z].both_sexes;
          response.features[i].properties["male"] = consumption[z].male;
          response.features[i].properties["female"] = consumption[z].female;
          response.features[i].properties["year"] = consumption[z].year;
          
        }
        
      } 
    }
    do_that(response);
  })
};
function do_that(consumption){
    console.log("this is consumption")
    console.log(consumption);
  for(var i =0; i<consumption.features.length; i++){

    if(consumption.features[i].properties.both_sexes == "undefined")
  {
    console.log(consumption.features[i].properties.SOVEREIGNT);
  }
  else{
    //  console.log(consumption.features[i].properties.SOVEREIGNT);
  }
  };
  L.geoJson(consumption, {
   
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.both_sexes),
        fillOpacity: .7,
        weight: 1.5
      };
      
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          });
        },
        click: function(event) {
          console.log(feature.properties.SOVEREIGNT);
          //myMap.fitBounds(event.target.getBounds());
        }
        

      });
      layer.bindPopup("<h4>" + "Per capita consumption is " + feature.properties.both_sexes + "</h4> <hr> <h5>" + feature.properties.SOVEREIGNT + "</h5>");

    }
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#ffffffe3", "#bb9ef5e3", "#9c70f3e3","#7d45eae3","#5600ff","tomato"];
    var colorscodes = ["0-2", "2.1-5","5.5-7","7.1-10","10.1-12", "12.1+"];
    var labels = []

    for(var i = 0; i < colors.length; i ++){
        labels.push("<i style=\"background-color: " + colors[i] + "\">&nbsp;&nbsp;&nbsp;</i><i>" + colorscodes[i] + "</i><br>");
    }

    div.innerHTML += "" + labels.join("") + "";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
};

/* Will Bubble Layer*/

// Country data
var jsonData;
var queryUrl = "../data/traffic_related_deaths.json"
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
  