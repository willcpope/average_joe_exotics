var base = "http://127.0.0.1:5000";

var routes = [
    "/api/v1.0/alcohol_consumption",
    "/api/v1.0/alcohol_production",
    "/api/v1.0/country",
    "/api/v1.0/reviews",
    "/api/v1.0/traffic_related_deaths"
];

routes.forEach(function(route) {
    d3.json(base + route).then(function(data) {
        console.log("API route: " + route);
        console.log(data);
    })
});