/*
 * webapp_map.js
 * Yiwen Luo, 27 April 2016
 * 11 November 2020
 *
 */

window.onload = initialize;

function initialize() {
    initializeMap();
    intializeSummaryTable();
}

// Returns the base URL of the API, onto which endpoint components can be appended.
function getAPIBaseURL() {
    
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

//========================================================
//========================================================
//page_map.html

// This is example data that gets used in the click-handler below. Also, the fillColor
// specifies the color those states should be. There's also a default color specified
// in the Datamap initializer below.
var extraStateInfo = {
    MN: {population: 5640000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    CA: {population: 39500000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    NM: {population: 2100000, jeffhaslivedthere: false, fillColor: '#2222aa'},
    OH: {population: 0, jeffhaslivedthere: false, fillColor: '#aa2222'}
};

function initializeMap() {
    var map = new Datamap({ element: document.getElementById('map-container'), // where in the HTML to put the map
                            scope: 'usa', // which map?
                            projection: 'equirectangular', // what map projection? 'mercator' is also an option
                            done: onMapDone, // once the map is loaded, call this function
                            data: extraStateInfo, // here's some data that will be used by the popup template
                            fills: { defaultFill: '#999999' },
                            geographyConfig: {
                                //popupOnHover: false, // You can disable the hover popup
                                //highlightOnHover: false, // You can disable the color change on hover
                                popupTemplate: hoverPopupTemplate, // call this to obtain the HTML for the hover popup
                                borderColor: '#eeeeee', // state/country border color
                                highlightFillColor: '#bbbbbb', // color when you hover on a state/country
                                highlightBorderColor: '#000000', // border color when you hover on a state/country
                            }
                          });
}

function intializeSummaryTable(){
    var stateSummaryElement = document.getElementById('summary_table');
    
    var tableBody = '';
        tableBody += '<tr><th>State Abbreviation</th>';
        tableBody += '<th>State</th>';
        tableBody += '<th>Total Cases</th>';
        tableBody += '<th>2015</th>';
        tableBody += '<th>2016</th>';
        tableBody += '<th>2017</th>';
        tableBody += '<th>2018</th>';
        tableBody += '<th>2019</th>';
        tableBody += '<th>2020</th></tr>';
    
    if (stateSummaryElement) {
            stateSummaryElement.innerHTML = tableBody;
            }
}

// This gets called once the map is drawn, so you can set various attributes like
// state/country click-handlers, etc.
function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}

function hoverPopupTemplate(geography, data) {
    
//    var url = getAPIBaseURL() + `/cases/states/${geography.id}/cumulative`;
    
//     Send the request to the api
//    fetch(url, {method: 'get'})

    // When the results come back, transform them from a JSON string into
    // a Javascript object (in this case, a list of author dictionaries).
//    .then((response) => response.json())
    
    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n'
    
    
//                        + '<strong>Population:</strong> ' + casesDict[2] + '<br>\n'
//    .then(function(casesDict){
//        var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n'
//                        + '<strong>Population:</strong> ' + casesDict[2] + '<br>\n'
//                    + '</div>';
//    })
//    
    return template;
    
//    var url = getAPIBaseURL() + `/cases/states/${geography.id}/cumulative`;
    
//    var population = 0;
//    if (data && 'population' in data) {
//        population = data.population;
//    }
//
//    var jeffHasLivedThere = 'No';
//    if (data && 'jeffhaslivedthere' in data && data.jeffhaslivedthere) {
//        jeffHasLivedThere = 'Yes';
//    }
//
//    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n'
//                    + '<strong>Population:</strong> ' + population + '<br>\n'
//                    + '<strong>Has Jeff lived there?</strong> ' + jeffHasLivedThere + '<br>\n'
//                    + '</div>';
//
//    return template;
}

function onStateClick(geography) {
    
    var url = getAPIBaseURL() + `/cases/states/${geography.id}/annual`;
        
    // Send the request to the api
    fetch(url, {method: 'get'})

    // When the results come back, transform them from a JSON string into
    // a Javascript object (in this case, a list of author dictionaries).
    .then((response) => response.json())
    
    // Once you have your list of author dictionaries, use it to build
    // an HTML table displaying the author names and lifespan.
    .then(function(casesDict) {
        // Build the table body.
        var tableBody = '';
        tableBody += '<tr><th>State Abbreviation</th>';
        tableBody += '<th>State</th>';
        tableBody += '<th>Total Cases</th>';
        tableBody += '<th>2015</th>';
        tableBody += '<th>2016</th>';
        tableBody += '<th>2017</th>';
        tableBody += '<th>2018</th>';
        tableBody += '<th>2019</th>';
        tableBody += '<th>2020</th></tr>';

        tableBody += '</tr><td>'+casesDict['state_abbreviation'] + '</td>';
        tableBody += '<td>'+casesDict['state'] + '</td>';
        tableBody += '<td>'+casesDict['total_cases'] + '</td>';
        tableBody += '<td>'+casesDict['2015'] + '</td>';
        tableBody += '<td>'+casesDict['2016'] + '</td>';
        tableBody += '<td>'+casesDict['2017'] + '</td>';
        tableBody += '<td>'+casesDict['2018'] + '</td>';
        tableBody += '<td>'+casesDict['2019'] + '</td>';
        tableBody += '<td>'+casesDict['2020'] + '</td></tr>';
        


        // Put the table body we just built inside the table that's already on the page.
        var stateSummaryElement = document.getElementById('summary_table');
        if (stateSummaryElement) {
            stateSummaryElement.innerHTML = tableBody;
            }
    })

    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
    

    
//    if (stateSummaryElement) {
//        var summary = '<p><strong>State:</strong> ' + geography.properties.name + '</p>\n'
//                    + '<p><strong>Abbreviation:</strong> ' + geography.id + '</p>\n';
//        if (geography.id in extraStateInfo) {
//            var info = extraStateInfo[geography.id];
//            summary += '<p><strong>Population:</strong> ' + info.population + '</p>\n';
//        }
//
//        stateSummaryElement.innerHTML = summary;
//    }
    
    
}