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
    base_layer(response);
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

function base_layer(consumption){

  d3.json(geodata, function(response){

    // debugging
    //console.log("geodata response object:");
    //console.log(response);

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

    // debugging
    //console.log("Updated geodata");
    //console.log(response);
    
    // send geodata object to function
    do_that(response);
  })
};

function do_that(consumption){

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
    var colorscodes = ["0-2","2.1-5","5.5-7","7.1-10","10.1-12","12.1+"];
    var labels = []

    for(var i = 0; i < colors.length; i ++){
        labels.push("<i style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;</i><i>"+colorscodes[i] +"</i><br>");
    }

    div.innerHTML += "" + labels.join("") + "";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  create_bubbles();
};

function create_bubbles() {
  d3.json('data/countries_info.json', function(geoData){
    
    d3.json('data/traffic_related_deaths.json', function(deathData){
      
      var lat = [];
      var lng = [];
      var name = [];
    
      // debugging
      //console.log("geoData object");
      //console.log(geoData);
    
      // retreive data and save to lists
      geoData.forEach(obj => {
        lat.push(obj.latlng[0]);
        lng.push(obj.latlng[1]);
        name.push(obj.name);
      });
      
      var fatalities = [];

      // debugging
      //console.log("deathData object");
      //console.log(deathData);

      // retrieve data and save list
      deathData.forEach(obj => {
        fatalities.push(obj.fatalities_100K_people_per_year);
      });
      
      //console.log(fatalities);

      // Add circles to map
      for(var i = 0; i < fatalities.length; i++) {
        L.circle([lat[i], lng[i]], {
          stroke: true,
          fillOpacity: .75,
          color: 'black',
          fillColor: getColor(fatalities[i]),
          // Adjust radius
          radius: fatalities[i] * 5000
        }).bindPopup("<h3>" + name[i] + "<h3><h3>Fatalities(100K) Per Year: " + fatalities[i] + "</h3>").addTo(myMap);
  
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
