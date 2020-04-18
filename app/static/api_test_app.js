
// var url = "http://127.0.0.1:5000/api/v1.0/alcohol_consumption";

d3.json(url, function(data) {

var url = "http://127.0.0.1:5000/api/v1.0/alcohol_production";

d3.json(url).then(function(data){

    console.log(data);
});