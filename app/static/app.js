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
  
  // Country data
  var countries = [
    {
      name: "Armenia",
      location: [40.069099, 45.038189],
      fatalities: 17.1
    },
    {
      name: "Austria",
      location: [47.516231, 14.550072],
      fatalities: 5.2
    },
    {
      name: "Bulgaria",
      location: [42.733883, 25.48583],
      fatalities: 8.3
    },
    {
      name: "Croatia",
      location: [45.1000, 15.2000],
      fatalities: 8.1
    },
    {
      name: "Cyprus",
      location: [35.126413, 33.429859],
      fatalities: 5.1
    },
    {
      name: "France",
      location: [46.227638, 2.213749],
      fatalities: 5.5
    },
    {
      name: "Georgia",
      location: [42.315407, 43.356892],
      fatalities: 17.1
    },
    {
      name: "Germany",
      location: [51.165691, 10.451526],
      fatalities: 4.1
    },
    {
      name: "Greece",
      location: [39.0742, 21.8243],
      fatalities: 9.2
    },
    {
      name: "Hungary",
      location: [47.1625, 19.5033],
      fatalities: 7.8
    },
    {
      name: "Italy",
      location: [41.8719, 12.5674],
      fatalities: 5.6
    },
    {
      name: "Luxembourg",
      location: [49.8153, 49.8153],
      fatalities: 5.7
    },
    {
      name: "Moldova",
      location: [47.4116, 28.3699],
      fatalities: 9.7
    },
    {
      name: "North Macedonia",
      location: [41.6086, 21.7453],
      fatalities: 6.4
    },
    {
      name: "Portugal",
      location: [41.3609, 7.4381],
      fatalities: 7.4
    },
    {
      name: "Romania",
      location: [45.9432, 24.9668],
      fatalities: 8.7
    },
    {
      name: "Slovakia",
      location: [48.669, 19.699],
      fatalities: 6.1
    },
    {
      name: "Serbia",
      location: [44.0165, 21.0059],
      fatalities: 7.4
    },
    {
      name: "Slovenia",
      location: [46.1512, 14.9955],
      fatalities: 6.4
    },
    {
      name: "Spain",
      location: [40.4637, 3.7492],
      fatalities: 4.1
    },
    {
      name: "Switzerland",
      location: [46.8182, 8.2275],
      fatalities: 2.7
    },
    {
      name: "Turkey",
      location: [38.9637, 35.2433],
      fatalities: 12.3
    },
    {
      name: "Ukraine",
      location: [48.3794, 31.1656],
      fatalities: 13.7
    },
    {
      name: "United Kingdom",
      location: [55.3781, 3.436],
      fatalities: 3.1
    }
  ];
  
  
  // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < countries.length; i++) {
  
    // Conditionals for countries points
    var color = "";
    if (countries[i].fatalities > 15) {
      color = "yellow";
    }
    else if (countries[i].fatalities > 10) {
      color = "blue";
    }
    else if (countries[i].fatalities > 5) {
      color = "green";
    }
    else {
      color = "red";
    }
  
    // Add circles to map
    L.circle(countries[i].location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust radius
      radius: countries[i].fatalities * 12000
    }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Traffic Fatalities (100k): " + countries[i].fatalities + "</h3>").addTo(myMap);
  }
  