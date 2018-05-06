
//ted-sandbox Weather API
console.log('Welcome to the Weather API');

// setup the inclues from npm library
var request = require('request');
var express = require('express');

//Setup a blank array of places we will be getting weather data on
var places = [];

//setup the express variable
var app = express()

//setup the request options needed
//User-Agent was particularly needed, since not having it caused the source NOAA data site to reject this server's request.
const options = {  
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'node.js'
    }
};

//This is the home enpoint for this express API.
app.get('/', function (req, res) {
    res.send('Welcome to Weather API!');
});


//This is the app's main endpoint (city names are passed in as the uri qualifiers)
app.get('/weatherAPI/city/:city', function (req, res) {

    //Note in the console log the requested place
    console.log(req.params.city + ' was requested.');

    //clean up the userentry to have all lower case charaters AND no spaces
    const userentry = req.params.city.toLowerCase().replace(/\s+/g, '');

    //initialize the city match to false
    var citymatch = false;

    //loop through the city data array and 
    citydata.forEach(element => {
        if(userentry == element.city){

            //set the match as being true
            citymatch = true;

            //call the place function
            var someplace = new Place(element.city,element.state,element.country,element.ll);

            var weather = getWeather(someplace.lat,someplace.long,function(result){
                for(i=0;i<=8;i++){
                    someplace.periods[i] = new period(result[i].number,result[i].name,result[i].startTime,result[i].endTime,result[i].temperature,result[i].temperatureUnit,result[i].windSpeed,result[i].windDirection,result[i].shortForecast,result[i].detailedForecast);
                }
                //return the selected city forecast data
                res.send(someplace.periods);
            });
            
        }

    }); //end of foreach

    //if no city match was made, give a message detailing that nothing was matched
    if(citymatch == false){
        res.send('Weather data not available for city entered: ' + req.params.city + '.  Please try another location request.');
    }

});



//This starts the express app listening on a specified port
app.listen(3000, function () {
    console.log('Weather API app listening on port 3000!');
  });


//Develop the model for a Place
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

// Setup a the model for a forecast period
function period(number,name,startTime,endTime,temperature,temperatureUnit,windSpeed,windDirection,shortForecast,detailedForecast){
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
		 {'city': 'newyork', 'state':'NY', 'country':'USA', 'll': '40.7143528,-74.00597309999999'}
		,{'city': 'losangeles', 'state':'CA', 'country':'USA', 'll': '34.0522342,-118.2436849'}
		,{'city': 'chicago', 'state':'IL', 'country':'USA', 'll': '41.8781136,-87.6297982'}
		,{'city': 'houston', 'state':'TX', 'country':'USA', 'll': '29.7601927,-95.36938959999999'}
		,{'city': 'philadelphia', 'state':'PA', 'country':'USA', 'll': '39.952335,-75.16378900000001'}
		,{'city': 'phoenix', 'state':'AZ', 'country':'USA', 'll': '33.4483771,-112.0740373'}
		,{'city': 'sanantonio', 'state':'TX', 'country':'USA', 'll': '29.4241219,-98.49362819999999'}
		,{'city': 'sandiego', 'state':'CA', 'country': 'USA', 'll': '32.7153292,-117.1572551'}
        ,{'city': 'dallas', 'state':'TX', 'country':'USA', 'll': '32.802955,-96.769923'}
        ,{'city': 'pittsburgh', 'state':'PA', 'country':'USA', 'll': '40.4406,-79.9959'}
        ,{'city': 'champion', 'state':'PA', 'country':'USA', 'll':'40.0741,-79.3512'}
        ,{'city': 'saltlakecity', 'state':'UT','country':'USA', 'll':'40.7608,-111.8910'}
        ,{'city': 'denver','state':'CO','country':'USA','ll':'39.7392,-104.9903'}
        ,{'city': 'seattle','state':'WA','country':'USA','ll':'47.6062,-122.3321'}
        ,{'city': 'keywest','state':'FL','country':'USA','ll':'24.5551,-81.7800'}
        ,{'city': 'morgantown', 'state':'WV', 'country':'USA','ll':'39.6295,-79.9559'}
        ,{'city': 'lasvegas', 'state':'NV', 'country':'USA','ll':'36.1699,-115.1398'}
        ,{'city': 'omaha', 'state':'NE', 'country':'USA','ll':'41.2565,-95.9345'}
        ,{'city': 'frontroyal', 'state':'VA', 'country':'USA','ll':'38.9182,-78.1944'}
        ,{'city': 'jacksonhole', 'state':'WY', 'country':'USA','ll':'43.6123,-110.7054'}
        ,{'city': 'austin', 'state':'TX', 'country':'USA','ll':'30.2672,-97.7431'}
        ,{'city': 'boston', 'state':'MA', 'country':'USA','ll':'42.3601,-71.0589'}
        ,{'city': 'ohiopyle', 'state':'PA', 'country':'USA','ll':'39.8717,-79.4923'}
        ,{'city': 'confluence', 'state':'PA', 'country':'USA','ll':'39.8129,-79.3567'}


	];