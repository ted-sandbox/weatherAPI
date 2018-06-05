## A basic weather API based on currently available NOAA forecast data.

## Uses node.js & Express based construction to transmute/shape, and then serve, the NOAA data to a data consuming party.

### A basic primer for this app:

#### To access a city's data, it's just the app's root url/city/'your-city-name-goes-here'

#### To access a lat long based location's data, it's just the app's root url/latlong/'your-latitude,your-longitude'
#### For example: '40.4406,-79.9959' would be the search string used for Pittsburgh, PA if searching by direct lat and long instead of providing cityname

### To access a list of supported cities used by this app, it's just the app's root url/allcities

#### Currently directly searchable cities are:
#### New York, Los Angeles, Chicago, Houston, Philadelphia, Phoenix, San Antonio, San Diego, Dallas, Pittsburgh, Champion (PA), Salt Lake City, Denver, Seattle, Key West, Morgantown (WV), Las Vegas, Omaha, Front Royal (VA), Jackson Hole (WY), Austin (TX), Boston, Ohiopyle (PA), Confluence (PA), San Francisco, Atlanta, Washington (DC), Tampa, Minneapolis, Miami, Cleveland, Orlando, Sacremento, St. Louis, Portland (OR), Charlotte, Indianapolis,Baltimore, Raleigh (NC), Nashville, Squaw Valley (CA), Death Valley (CA), Great Falls (MT), Hilton Head (SC), Albuquerque (NM), Jacksonville (FL), El Paso (TX), Colorado Springs, Honolulu (HI), Anchorage (AK), Truckee (CA),Oklahoma City (OK), Lodi (CA), Burlington (VT), Lake Placid (NY), Bismark (ND), Taos (NM), Lexington (KY), Birmingham (AL), New Orleans, Bristol (TN), Columbia (SC), Malibu (CA), Portland (ME), Charleston (SC), Lincoln(NE), La Jolla (CA), Charleston (WV), Reno (NV), Hartford (CT), Buffalo (NY), State College (PA), Albany (NY),Outer Banks (NC), Asheville (NC), Bakersfield (CA), Boise (ID), Martha's Vineyard (MA), Point Pleasant (NJ), Virginia Beach (VA), Providence (RI), Columbus (OH), Des Moines (IA), Spokane (WA), Tallahassee (FL), Daytona Beach (FL), Galveston (TX), Brownsville (TX), Pensacola (FL), Memphis (TN), Richmond (VA), Syracuse (NY), Mavericks (CA),, Banzai Beach (HI),Missoula (MT), Huntington Beach (CA), Deep Creek (MD)

#### *** Please review the actual data set in the code to examine the actual 'city' name value used for each city location.  For example: New York uses 'newyork' for the city field and Charleston (SC) uses 'charlestonSC'. ***
