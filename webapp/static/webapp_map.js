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


var extraStateInfo = {
    MN: {population: 5640000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    CA: {population: 39500000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    NM: {population: 2100000, jeffhaslivedthere: false, fillColor: '#2222aa'},
    OH: {population: 0, jeffhaslivedthere: false, fillColor: '#aa2222'}
};

function initializeMap() {
    var map = new Datamap({ element: document.getElementById('map-container'), 
                            scope: 'usa', 
                            projection: 'equirectangular', 
                            done: onMapDone, 
                            fills: { defaultFill: '#999999' },
                            geographyConfig: {
                                popupTemplate: hoverPopupTemplate, 
                                borderColor: '#eeeeee', 
                                highlightFillColor: '#bbbbbb', 
                                highlightBorderColor: '#000000', 
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


function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}

function hoverPopupTemplate(geography, data) {
    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n'
    return template;
}

function onStateClick(geography) {
    
    var url = getAPIBaseURL() + `/cases/states/${geography.id}/annual`;
        
    fetch(url, {method: 'get'})
    .then((response) => response.json())
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
    
    
}