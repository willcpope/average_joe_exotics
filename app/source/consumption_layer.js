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

  var consumptiondata = "data/alcohol_consumption.json";
  var geodata = "data/countries-hires.json";
  var consumption = []
  var color = ""



d3.json(consumptiondata, function(response){
    console.log("this is response")
    console.log(response);
    // consumption.push(Object.values(response));
    do_this(response);
    // response.forEach((banana) => {
    //   var x = banana.country_name
      
    //   // color_x = chooseColor(x)
      
    //   // var cons_color = countrycolor(color_x)
    //   // console.log(cons_color);

    //     // Iterate through each key and value
    //     console.log(banana);
    //     Object.entries(banana).forEach(([key, value]) => {
    //       consumption.push(banana);
    //      });
    // });
});

function chooseColor(borough) {
  if(borough=="Brooklyn")
  {
    return "yellow";
  }else if (borough=="Bronx")
  {
    return "purple";
  }else{
    return "black";
  }
  // switch (borough) {
  // case "Brooklyn":
  //   return "yellow";
  // case "Bronx":
  //   return "red";
  // case "Manhattan":
  //   return "orange";
  // case "Queens":
  //   return "green";
  // case "Staten Island":
  //   return "purple";
  // default:
  //   return "black";
  // }
}

function do_this(consumption){
  d3.json(geodata, function(response){
    
    for(var i =0; i<response.features.length; i++){
      country = response.features[i].properties.SOVEREIGNT
      for(var z =0; z<consumption.length; z++){
        if(country==consumption[z].country_name){
          response.features[i].properties["both_sexes"] = consumption[z].both_sexes;
          response.features[i].properties["male"] = consumption[z].male;
          response.features[i].properties["female"] = consumption[z].female;
          response.features[i].properties["year"] = consumption[z].year;
        }
      }

    }
    console.log(response.features);
    
  });
  console.log("this is consumption")
  console.log(consumption);
  // L.geoJson(consumption, {
  //   // Style each feature (in this case a neighborhood)
  //   style: function(feature) {
  //     return {
  //       color: "white",
  //       // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
  //       fillColor: chooseColor(feature.properties.country_name),
  //       fillOpacity: 0.5,
  //       weight: 1.5
  //     };
  //   },
  //   // Called on each feature
  //   onEachFeature: function(feature, layer) {
  //     // Set mouse events to change map styling
  //     layer.on({
  //       // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
  //       mouseover: function(event) {
  //         layer = event.target;
  //         layer.setStyle({
  //           fillOpacity: 0.9
  //         });
  //       },
  //       // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
  //       mouseout: function(event) {
  //         layer = event.target;
  //         layer.setStyle({
  //           fillOpacity: 0.5
  //         });
  //       },
  //       // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
  //       click: function(event) {
  //         map.fitBounds(event.target.getBounds());
  //       }
  //     });
  //     // Giving each feature a pop-up with information pertinent to it
  //     layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

  //   }
  // }).addTo(map);
  // L.geoJson(consumption,{
  //   color: "white",
  //   fillColor: row.color,
  //   fillOpacity: 0.5,
  //   weight: 1.5
  // });

}
// console.log("this is consumption")
// console.log(consumption);

//     function countrycolor(item){
//     // console.log("this is both sexes")
//     // console.log(item.both_sexes);
//     if (item >= 1){
//         return "yellow"
//     }
//     else if (item >= 2){
//         return "red"
//     }
//     else {
//         return "black"
//     }
// };

// // function chooseColor(object) {
// //   //console.log(consumption);
// //   // console.log(object.both_sexes);
// //   Object.entries(consumption).forEach(([key, value]) => {
// //     console.log(consumption.country_name);
// //   });
// //     switch (consumption.country_name) {
// //     case "Portugal":
// //       console.log("switch case Portugal");
// //       return countrycolor(consumption.both_sexes);
// //       // return "blue"; 
// //     case "Germany":
// //       return "red";
// //     case "Italy":
// //       return "orange";
// //     case "France":
// //       return "white";
// //     case "Belgium":
// //       return "purple";
// //     case "Iceland":
// //       return "purple";
// //     default:
// //       return "green";
// //     }
// //   }
//   d3.json(geodata, function(response){
//     // console.log(response);
//     console.log(consumption);
//     consumption.forEach((row) => {
//       if (row.both_sexes >= 1 && row.both_sexes <=7){
//         color = "yellow"
//         row["color"] = color;
//       }
//       else if (row.both_sexes > 7 && row.both_sexes <=13){
//         color = "red"
//         row["color"] = color;
//       }
//       else {
//         color = "black"
//         row["color"] = color;     
//       }
//     });
  
    
// consumption.forEach((row) => { 
// console.log(row.color)});
//     // var x = chooseColor(consumption);
//     consumption.forEach((row) => {
    
//         // console.log("this is SOVEREIGNT");
//         // console.log(apple.properties.SOVEREIGNT);
//         // console.log("this is choose color consumption");
//         // console.log(chooseColor(consumption));
//     }).addTo(myMap);
// });