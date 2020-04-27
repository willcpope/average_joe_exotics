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


/* Alessio Base Layers */
var consumptiondata = "data/alcohol_consumption.json";
var geodata = "data/countries-hires.json";
  
d3.json(consumptiondata, function(response){
    // debugging
    console.log("this is consumption data")
    console.log(response);
    consumption_layer(response);
    load_animation();
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

function consumption_layer(consumption){

  d3.json(geodata, function(response){

    // loop thru response 
    for(var i = 0; i < response.features.length; i++){
      
      // declare country name
      country = response.features[i].properties.SOVEREIGNT

      // loop thru consumption object
      for(var j = 0; j < consumption.length; j++){

        // find country name in consumption object
        if(country == consumption[j].country_name 
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
        || country == "Liechtenstein"       
        ){
          // update geodata properties to match consumption object's
          response.features[i].properties["both_sexes"] = consumption[j].both_sexes;
          response.features[i].properties["male"] = consumption[j].male;
          response.features[i].properties["female"] = consumption[j].female;
          response.features[i].properties["year"] = consumption[j].year;
          
        }
        
      } 
    }
    
    // send geodata object to function
    country_borders(response);
  })
};

function country_borders(consumption){

  // debugging
  console.log("this is consumption");
  console.log(consumption);
  
  // cleanup both_sexes field
  for(var i =0; i<consumption.features.length; i++){

    if(consumption.features[i].properties.both_sexes == "undefined") {
      console.log(consumption.features[i].properties.SOVEREIGNT);
    }
  };

  // create geoJson layer
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
        }
        

      });
      layer.bindPopup("<h4>" + "Per capita consumption is " + feature.properties.both_sexes + "</h4> <hr> <h5>" + feature.properties.SOVEREIGNT + "</h5>");

    }
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#ffffffe3", "#bb9ef5e3", "#9c70f3e3","#7d45eae3","#5600ff","tomato"];
    var colorscodes = ["0-2","2.1-5","5.5-7","7.1-10","10.1-12","12.1+"];
    var labels = []

    labels.push("<p>CPCL</p>");
    for(var i = 0; i < colors.length; i ++){
        labels.push("<i style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;</i><i>"+colorscodes[i] +"</i><br>");
    }

    div.innerHTML += "" + labels.join("") + "";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  create_death_bubbles();
  create_production_bubbles();
};

function create_death_bubbles() {
  d3.json('data/countries_info.json', function(geoData){
    
    d3.json('data/traffic_related_deaths.json', function(deathData){
      
      var lat = [];
      var lng = [];
      var name = [];
      var fatalities = [];
    
      for(var i = 0; i < deathData.length; i++) {
        for(var j = 0; j < geoData.length; j++) {
          if(deathData[i].country_name === geoData[j].name) {
            lat.push(geoData[j].latlng[0]);
            lng.push(geoData[j].latlng[1]);
            name.push(geoData[j].name);
            fatalities.push(deathData[i].fatalities_100K_people_per_year);
          }
        }
      }

      // Add circles to map
      for(var i = 0; i < fatalities.length; i++) {
        L.circle([lat[i], lng[i]], {
          stroke: true,
          fillOpacity: .75,
          color: 'black',
          weight: 1,
          fillColor: getColor(fatalities[i]),
          // Adjust radius
          radius: fatalities[i] * 8000
        }).bindPopup("<h3>" + name[i] + "</h3><hr><h4>Fatalities(100K) Per Year: " + fatalities[i] + "</h4>").addTo(myMap);
  
        // Conditionals for data
        function getColor(d) {
          return d > 24 ? 'black' :
                  d > 16 ? 'red' :
                  d > 8 ? 'orange' :
                  d > 1 ? 'yellow' :
                          'white' ;    
        }
      }
    });
  });
}

function create_production_bubbles() {
  d3.json('data/countries_info.json', function(geoData){
    
    d3.json('data/alcohol_production.json', function(production_data){
      
      var lat = [];
      var lng = [];
      var name = [];
      var production = [];

      for(var i = 0; i < production_data.length; i++) {
        for(var j = 0; j < geoData.length; j++) {
          if(production_data[i].country_name === geoData[j].name) {
            lat.push(geoData[j].latlng[0]);
            lng.push(geoData[j].latlng[1]);
            name.push(geoData[j].name);
            production.push(production_data[i].production_tonnes);
          }
        }
      }

      var bins = (Math.max(...production) - Math.min(...production))/4

      // Add circles to map
      for(var i = 0; i < production.length; i++) {
        L.circle([lat[i], lng[i]], {
          stroke: true,
          fillOpacity: .75,
          color: 'black',
          weight: 1,
          fillColor: getColor(production[i]),
          // Adjust radius
          radius: production[i] * 0.005
        }).bindPopup("<h3>" + name[i] + "</h3><hr><h4>Production in Tonnes " + production[i] + "</h4>").addTo(myMap);
  
        // Conditionals for data
        function getColor(d) {
          return d > bins * 4 ? 'black' :
                  d > bins * 3 ? 'red' :
                  d > bins * 2 ? 'orange' :
                  d > bins * 1 ? 'yellow' :
                          'white' ;    
        }
      }
    });
  });
}

function load_animation() {
  const xMax = 100;
  anime({
    targets: '.header',
    easing: 'easeInOutSine',
    delay: 3000,
    duration: 2000,
    translateX: [
      {
        value: xMax * -1,
      },
      {
        value: xMax,
      },
      {
        value: xMax/-2,
      },
      {
        value: xMax/2,
      },
      {
        value: 0
      }
    ],
  });
}

