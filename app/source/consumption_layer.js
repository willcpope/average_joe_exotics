// Creating map object
var myMap = L.map("map", {
    center: [52.52, 13.40],
    zoom: 4
  });

  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  var consumptiondata = "data/alcohol_consumption.json";
  var geodata = "data/countries-hires.json";
  var consumption = []
  var color = ""



d3.json(consumptiondata, function(response){
    console.log("this is response")
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
    return "#6e2cefed";
  }
  else if (place <=15)
  {
    return "#5600ff";
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
        if(country==consumption[z].country_name || country == "United States of America"
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
        ){
          response.features[i].properties["both_sexes"] = consumption[z].both_sexes;
          response.features[i].properties["male"] = consumption[z].male;
          response.features[i].properties["female"] = consumption[z].female;
          response.features[i].properties["year"] = consumption[z].year;
        }
      }

    }
    console.log(response.features);
    do_that(response);
    
  });
};
function do_that(consumption){
  

  console.log("this is consumption")
  console.log(consumption);

  L.geoJson(consumption, {
   
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.both_sexes),
        fillOpacity: 0.5,
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
            fillOpacity: 0.5
          });
        },
        click: function(event) {
          console.log(feature.properties.both_sexes);
          myMap.fitBounds(event.target.getBounds());
        }
      });
      layer.bindPopup("<h4>" + "Per capita consumption is " + feature.properties.both_sexes + "</h4> <hr> <h5>" + feature.properties.SOVEREIGNT + "</h5>");

    }
  }).addTo(myMap);
}
