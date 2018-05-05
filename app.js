
//ted-sandbox Weather API
console.log('Welcome to the Weather API');

//Setup a blank array of places we will be getting weather data on
var places = [];

// setup the request include from npm library
var request = require('request');

//setup the request options needed
const options = {  
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'node.js'
    }
};

//call the place function
var someplace = new Place('Pittsburgh','PA','USA', '40.4406,-79.9959');


var weather = getWeather(someplace.lat,someplace.long,function(result){
    //console.log(result);
    for(i=0;i<=2;i++){
    someplace.periods[i] = new Period(result[i].number,result[i].name,result[i].startTime,result[i].endTime,result[i].temperature,result[i].temperatureUnit,result[i].windSpeed,result[i].windDirection,result[i].shortForecast,result[i].detailedForecast);
    }
    console.log(someplace);
});



function Place(city,state,country,ll) {
    this.name = city;

    //now, examine city data array and assign city specific data (if passed in city is found)
    this.state = state;
    this.country = country;

    //set the lat and longitude
    var array = ll.split(',')
    this.lat = array[0];
    this.long = array[1];
    
    //initialize the Place object to have an array of forecast periods
    this.periods= [];
    
}

//
function Period(number,name,startTime,endTime,temperature,temperatureUnit,windSpeed,windDirection,shortForecast,detailedForecast){
    this.number = number;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.temperature = temperature;
    this.temperatureUnit = temperatureUnit;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.shortForecast = shortForecast;
    this.detailedForecast = detailedForecast;
}


function getWeather(lat,long,callback) {
    request('https://api.weather.gov/points/' + lat + ',' + long + '/forecast', options, function (error, response, body) {
    //console.log(JSON.parse(body).properties.periods[0]);// Show the HTML for raw NOAA call
    callback(JSON.parse(body).properties.periods);
 })

}




var citydata = 
	[
		 {'city': 'New York', 'state':'NY', 'country':'USA', 'll': '40.7143528,-74.00597309999999'}
		,{'city': 'Los Angeles', 'state':'CA', 'country':'USA', 'll': '34.0522342,-118.2436849'}
		,{'city': 'Chicago', 'state':'IL', 'country':'USA', 'll': '41.8781136,-87.6297982'}
		,{'city': 'Houston', 'state':'TX', 'country':'USA', 'll': '29.7601927,-95.36938959999999'}
		,{'city': 'Philadelphia', 'state':'PA', 'country':'USA', 'll': '39.952335,-75.16378900000001'}
		,{'city': 'Phoenix', 'state':'AZ', 'country':'USA', 'll': '33.4483771,-112.0740373'}
		,{'city': 'San Antonio', 'state':'TX', 'country':'USA', 'll': '29.4241219,-98.49362819999999'}
		,{'city': 'San Diego', 'state':'CA', 'country': 'USA', 'll': '32.7153292,-117.1572551'}
        ,{'city': 'Dallas', 'state':'TX', 'country':'USA', 'll': '32.802955,-96.769923'}
        ,{'city': 'Pittsburgh', 'state':'PA', 'country':'USA', 'll': '40.4406,-79.9959'}
	];