
//ted-sandbox Weather API
console.log('Welcome to the ted-sandbox Weather API');

// setup the inclues from npm library
var request = require('request');
var express = require('express');
var sortJsonArray = require('sort-json-array');

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


//This is the home enpoint for this express API.
app.get('/', function (req, res) {
    res.send('Welcome to the ted-sandbox weather api!');
});


//This is the endpoint to get all of the currently supported city data
app.get('/weatherAPI/allcities', function (req, res) {
    console.log('All cities data list was requested.')
    res.send(sortJsonArray(citydata,'display','asc'));
});


//This is an endpoint to get the a given lat, long location's weather data
app.get('/weatherAPI/latlong/:ll', function (req, res){

    //Note in the console log that lat and long based weather were requested
    console.log('Weather for lat/long @: ' + req.params.ll + ' was requested.');

    var somell = req.params.ll.split(',')

    //set the citymatch to true since this is a custom lat and long
    var citymatch = true;

    //call the place function
    var someplace = new Place('My Location','MYSTATE','USA',req.params.ll);


    var weather = getWeather(somell[0],somell[1],function(result){
        for(i=0;i<=8;i++){
            someplace.periods[i] = new period(result[i].number,result[i].name,result[i].startTime,result[i].endTime,result[i].temperature,result[i].temperatureUnit,result[i].windSpeed,result[i].windDirection,result[i].shortForecast,result[i].detailedForecast);
        }
        //return the selected city forecast data
        res.send(someplace.periods);
    });

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
		 {'city': 'newyork', 'state':'NY', 'display': 'New York','country':'USA', 'll': '40.7143528,-74.00597309999999'}
		,{'city': 'losangeles', 'state':'CA', 'display':'Los Angeles', 'country':'USA', 'll': '34.0522342,-118.2436849'}
		,{'city': 'chicago', 'state':'IL', 'display':'Chicago', 'country':'USA', 'll': '41.8781136,-87.6297982'}
		,{'city': 'houston', 'state':'TX', 'display':'Houston', 'country':'USA', 'll': '29.7601927,-95.36938959999999'}
		,{'city': 'philadelphia', 'state':'PA', 'display':'Philadelphia', 'country':'USA', 'll': '39.952335,-75.16378900000001'}
		,{'city': 'phoenix', 'state':'AZ', 'display':'Phoenix', 'country':'USA', 'll': '33.4483771,-112.0740373'}
		,{'city': 'sanantonio', 'state':'TX', 'display':'San Antonio', 'country':'USA', 'll': '29.4241219,-98.49362819999999'}
		,{'city': 'sandiego', 'state':'CA', 'display':'San Diego', 'country': 'USA', 'll': '32.7153292,-117.1572551'}
        ,{'city': 'dallas', 'state':'TX', 'display':'Dallas', 'country':'USA', 'll': '32.802955,-96.769923'}
        ,{'city': 'pittsburgh', 'state':'PA', 'display':'Pittsburgh', 'country':'USA', 'll': '40.4406,-79.9959'}
        ,{'city': 'champion', 'state':'PA', 'display':'Champion, PA', 'country':'USA', 'll':'40.0741,-79.3512'}
        ,{'city': 'saltlakecity', 'state':'UT', 'display':'Salt Lake City', 'country':'USA', 'll':'40.7608,-111.8910'}
        ,{'city': 'denver','state':'CO', 'display':'Denver', 'country':'USA','ll':'39.7392,-104.9903'}
        ,{'city': 'seattle','state':'WA', 'display':'Seattle', 'country':'USA','ll':'47.6062,-122.3321'}
        ,{'city': 'keywest','state':'FL', 'display':'Key West', 'country':'USA','ll':'24.5551,-81.7800'}
        ,{'city': 'morgantown', 'state':'WV', 'display':'Morgantown, WV', 'country':'USA','ll':'39.6295,-79.9559'}
        ,{'city': 'lasvegas', 'state':'NV', 'display':'Las Vegas', 'country':'USA','ll':'36.1699,-115.1398'}
        ,{'city': 'omaha', 'state':'NE', 'display':'Omaha', 'country':'USA','ll':'41.2565,-95.9345'}
        ,{'city': 'frontroyal', 'state':'VA', 'display':'Front Royal, VA', 'country':'USA','ll':'38.9182,-78.1944'}
        ,{'city': 'jacksonhole', 'state':'WY', 'display':'Jackson Hole, WY', 'country':'USA','ll':'43.6123,-110.7054'}
        ,{'city': 'austin', 'state':'TX', 'display':'Austin, TX', 'country':'USA','ll':'30.2672,-97.7431'}
        ,{'city': 'boston', 'state':'MA', 'display':'Boston', 'country':'USA','ll':'42.3601,-71.0589'}
        ,{'city': 'ohiopyle', 'state':'PA', 'display':'Ohiopyle, PA', 'country':'USA','ll':'39.8717,-79.4923'}
        ,{'city': 'confluence', 'state':'PA', 'display':'Confluence, PA', 'country':'USA','ll':'39.8129,-79.3567'}
        ,{'city': 'sanfrancisco', 'state':'CA', 'display':'San Francisco', 'country':'USA','ll':'37.7749,-122.4194'}
        ,{'city': 'atlanta', 'state':'GA', 'display':'Atlanta', 'country':'USA','ll':'33.7490,-84.3880'}
        ,{'city': 'washington', 'state':'DC', 'display':'Washington, DC', 'country':'USA','ll':'38.9072,-77.0369'}
        ,{'city': 'tampa', 'state':'FL', 'display':'Tampa', 'country':'USA','ll':'27.9506,-82.4572'}
        ,{'city': 'minneapolis', 'state':'MN', 'display':'Minneapolis', 'country':'USA','ll':'44.9778,-93.2650'}
        ,{'city': 'miami', 'state':'FL', 'display':'Miami, FL', 'country':'USA','ll':'25.7617,-80.1918'}
        ,{'city': 'cleveland', 'state':'OH', 'display':'Cleveland', 'country':'USA','ll':'41.4993,-81.6944'}
        ,{'city': 'orlando', 'state':'FL', 'display':'Orlando', 'country':'USA','ll':'28.5383,-81.3792'}
        ,{'city': 'sacremento', 'state':'CA', 'display':'Sacremento', 'country':'USA','ll':'38.5816,-121.4944'}
        ,{'city': 'stlouis', 'state':'MO', 'display':'St. Louis', 'country':'USA','ll':'38.6270,-90.1994'}
        ,{'city': 'portlandOR', 'state':'OR', 'display':'Portland, OR', 'country':'USA','ll':'45.5122,-122.6587'}
        ,{'city': 'charlotte', 'state':'NC', 'display':'Charlotte, NC', 'country':'USA','ll':'35.2271,-80.8431'}
        ,{'city': 'indianapolis', 'state':'IN', 'display':'Indianapolis', 'country':'USA','ll':'39.7684,-86.1581'}
        ,{'city': 'baltimore', 'state':'MD', 'display':'Baltimore', 'country':'USA','ll':'39.2904,-76.6122'}
        ,{'city': 'raleigh', 'state':'NC', 'display':'Raleigh, NC', 'country':'USA','ll':'35.7796,-78.6382'}
        ,{'city': 'nashville', 'state':'TN', 'display':'Nashville', 'country':'USA','ll':'36.1627,-86.7816'}
        ,{'city': 'squawvalley', 'state':'CA', 'display':'Squaw Valley, CA', 'country':'USA','ll':'39.1970,-120.2357'}
        ,{'city': 'deathvalley', 'state':'CA', 'display':'Death Valley, CA', 'country':'USA','ll':'36.5323,-116.9325'}
        ,{'city': 'greatfalls', 'state':'MT', 'display':'Great Falls, MT', 'country':'USA','ll':'47.5053,-111.3008'}
        ,{'city': 'hiltonhead', 'state':'SC',  'display':'Hilton Head, SC', 'country':'USA','ll':'32.2163,-80.7526'}
        ,{'city': 'albuquerque', 'state':'NM', 'display':'Albuquerque, NM', 'country':'USA','ll':'35.0844,-106.6504'}
        ,{'city': 'jacksonville', 'state':'FL', 'display':'Jacksonville', 'country':'USA','ll':'30.3322,-81.6557'}
        ,{'city': 'elpaso', 'state':'TX', 'display':'El Paso, TX','country':'USA','ll':'31.7619,-106.4850'}
        ,{'city': 'coloradosprings', 'state':'CO', 'display':'Colorado Springs', 'country':'USA','ll':'38.8339,-104.8214'}
        ,{'city': 'honolulu', 'state':'HI', 'display':'Honolulu, HI', 'country':'USA','ll':'21.3069,-157.8583'}
        ,{'city': 'anchorage', 'state':'AK', 'display':'Anchorage, AK', 'country':'USA','ll':'61.2181,-149.9003'}
        ,{'city': 'truckee', 'state':'CA', 'display':'Truckee, CA', 'country':'USA','ll':'39.3280,-120.1833'}
        ,{'city': 'oklahomacity', 'state':'OK', 'display':'Oklahoma City, OK', 'country':'USA','ll':'35.4676,-97.5164'}
        ,{'city': 'lodi', 'state':'CA', 'display':'Lodi, CA', 'country':'USA','ll':'38.1341,-121.2722'}
        ,{'city': 'burlington', 'state':'VT', 'display':'Burlington, VT', 'country':'USA','ll':'44.4759,-73.2121'}
        ,{'city': 'lakeplacid', 'state':'NY', 'display':'Lake Placid, NY', 'country':'USA','ll':'44.2795,-73.9799'}
        ,{'city': 'bismark', 'state':'ND', 'display':'Bismark, ND', 'country':'USA','ll':'46.8083,-100.7837'}
        ,{'city': 'taos', 'state':'NM', 'display':'Taos, NM', 'country':'USA','ll':'36.4072,-105.5731'}
        ,{'city': 'lexington', 'state':'KY', 'display':'Lexington, KY', 'country':'USA','ll':'38.0406,-84.5037'}
        ,{'city': 'birmingham', 'state':'AL', 'display':'Birmingham, AL', 'country':'USA','ll':'33.5207,-86.8025'}
        ,{'city': 'neworleans', 'state':'LA', 'display':'New Orleans', 'country':'USA','ll':'29.9511,-90.0715'}
        ,{'city': 'bristol', 'state':'TN', 'display':'Bristol, TN', 'country':'USA','ll':'36.5951,-82.1887'}
        ,{'city': 'columbia', 'state':'SC', 'display':'Columbia, SC', 'country':'USA','ll':'34.0007,-81.0348'}
        ,{'city': 'malibu', 'state':'CA', 'display':'Malibu, CA', 'country':'USA','ll':'34.0259,-118.7798'}
        ,{'city': 'portlandME', 'state':'MA', 'display':'Portland, ME', 'country':'USA','ll':'43.6591,-70.2568'}
        ,{'city': 'charlestonSC', 'state':'SC', 'display':'Charleston, SC', 'country':'USA','ll':'32.7765,-79.9311'}
        ,{'city': 'lincoln', 'state':'NE', 'display':'Lincoln, NE', 'country':'USA','ll':'40.8136,-96.7026'}
        ,{'city': 'lajolla', 'state':'CA', 'display':'La Jolla, CA', 'country':'USA','ll':'32.8328,-117.2713'}
        ,{'city': 'charlestonWV', 'state':'WV', 'display':'Charleston, WV', 'country':'USA','ll':'38.3498,-81.6326'}
        ,{'city': 'reno', 'state':'NV', 'display':'Reno, NV', 'country':'USA','ll':'39.5296,-119.8138'}
        ,{'city': 'hartford', 'state':'CT', 'display':'Hartford, CT', 'country':'USA','ll':'41.7658,-72.6734'}
        ,{'city': 'buffalo', 'state':'NY', 'display':'Buffalo, NY', 'country':'USA','ll':'42.8864,-78.8784'}
        ,{'city': 'statecollege', 'state':'PA', 'display':'State College, PA', 'country':'USA','ll':'40.7934,-77.8600'}
        ,{'city': 'albany', 'state':'NY', 'display':'Albany, NY', 'country':'USA','ll':'42.6526,-73.7562'}
        ,{'city': 'outerbanks', 'state':'NC', 'display':'Outer Banks, NC', 'country':'USA','ll':'35.5585,-75.4665'}
        ,{'city': 'asheville', 'state':'NC', 'display':'Asheville, NC', 'country':'USA','ll':'35.5951,-82.5515'}
        ,{'city': 'bakersfield', 'state':'CA', 'display':'Bakersfield, CA', 'country':'USA','ll':'35.3733,-119.0187'}
        ,{'city': 'boise', 'state':'ID', 'display':'Boise, ID', 'country':'USA','ll':'43.6150,-116.2023'}
        ,{'city': 'marthasvineyard', 'state':'MA', 'display':"Martha's Vineyard", 'country':'USA','ll':'41.3805,-70.6455'}
        ,{'city': 'pointpleasant', 'state':'NJ', 'display':'Point Pleasant, NJ', 'country':'USA','ll':'40.0912,-74.0479'}
        ,{'city': 'virginiabeach', 'state':'VA', 'display':'Virginia Beach, VA', 'country':'USA','ll':'36.8529,-75.9780'}
        ,{'city': 'providence', 'state':'RI', 'display':'Providence, RI', 'country':'USA','ll':'41.8240,-71.4128'}
        ,{'city': 'columbus', 'state':'OH', 'display':'Columbus, OH', 'country':'USA','ll':'39.9612,-82.9988'}
        ,{'city': 'desmoines', 'state':'IA', 'display':'Des Moines, IA', 'country':'USA','ll':'41.6005,-93.6091'}
        ,{'city': 'spokane', 'state':'WA', 'display':'Spokane, WA', 'country':'USA','ll':'47.6588,-117.4260'}
        ,{'city': 'tallahassee', 'state':'FL', 'display':'Tallahassee, FL', 'country':'USA','ll':'30.4383,-84.2807'}
        ,{'city': 'daytonabeach', 'state':'FL', 'display':'Daytona Beach, FL', 'country':'USA','ll':'29.2108,-81.0228'}
        ,{'city': 'galveston', 'state':'TX', 'display':'Galveston, TX', 'country':'USA','ll':'29.3013,-94.7977'}
        ,{'city': 'brownsville', 'state':'TX', 'display':'Brownsville, TX', 'country':'USA','ll':'25.9017,-97.4975'}
        ,{'city': 'pensacola', 'state':'FL', 'display':'Pensacola, FL', 'country':'USA','ll':'30.4213,-87.2169'}
        ,{'city': 'memphis', 'state':'TN', 'display':'Memphis, TN', 'country':'USA','ll':'35.1495,-90.0490'}
        ,{'city': 'richmond', 'state':'VA', 'display':'Richmond, VA', 'country':'USA','ll':'37.5407,-77.4360'}
        ,{'city': 'syracuse', 'state':'NY', 'display':'Syracuse, NY', 'country':'USA','ll':'43.0481,-76.1474'}
        ,{'city': 'mavericks', 'state':'CA', 'display':'Mavericks, CA', 'country':'USA','ll':'37.4956,-122.4967'}
        ,{'city': 'banzaibeach', 'state':'HI', 'display':'Banzai Beach, HI', 'country':'USA','ll':'21.6653,-158.0575'}
        ,{'city': 'missoula', 'state':'MT', 'display':'Missoula, MT', 'country':'USA','ll':'46.8721,-113.9940'}
        ,{'city': 'huntingtonbeach', 'state':'CA', 'display':'Huntington Beach, CA', 'country':'USA','ll':'33.6595,-117.9988'}
        ,{'city': 'deepcreek', 'state':'MD', 'display':'Deep Creek, MD', 'country':'USA','ll':'39.5117,-79.3156'}
        
	];