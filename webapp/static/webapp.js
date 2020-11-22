/*
 * shooting.js
 * Ruofei Li and Yiwen Luo, 27 April 2016
 * 11 November 2020
 *
 * We are temperarily using the api path ".../cases/total? *  * filter=mental_illness" and it means to be "cases/total? * filter=mental_illness&mental_illness=true". Will fix later.
 * A little bit of Javascript showing one small example of AJAX
 * within the "books and authors" sample for Carleton CS257.
 *
 * This example uses a very simple-minded approach to Javascript
 * program structure. We'll talk more about this after you get
 * a feel for some Javascript basics.
 */

window.onload = initialize;

function initialize() {
    
    initializeMap();
    
    var element = document.getElementById('get_cases_button');

    element.onclick = getCasesButtonClicked;
    
}

function selectDropdown() {
    var mental_illness_selected_value = document.getElementById('mental_illness_dropdown').value;
    
    mental_illness_selected_value.onclick = getCasesButtonClicked;
}

// Returns the base URL of the API, onto which endpoint components can be appended.
function getAPIBaseURL() {
    
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

//page_search.html

function getCasesButtonClicked() {
    
    var conditions = {
        signs_of_mental_illness: document.getElementById('mental_illness_dropdown').value,
        threat_level: document.getElementById('threat_level').value,
        flee: document.getElementById('flee').value,
        body_camera: document.getElementById('body_camera').value,
        manner_of_death: document.getElementById('manner_of_death').value,
        arm_category: document.getElementById('arm_category').value
    }
    
    var all_default = true;
    
    for (condition in conditions){
        if (conditions[condition] != 'None'){
            all_default = false;
            break;
        } 
    }
    
    var url = getAPIBaseURL() + '/cases/total';

    if (all_default == true){
        //
    } else{
        url += '?'
        for (condition in conditions){
            if(conditions[condition] == 'None'){
                continue;
            }
            else{
                url += `${String(condition)}=${conditions[condition].replace('%20', " ")}&`;
            }
        }
       url = url.slice(0, -1);
    }
    


    // Send the request to the api
    fetch(url, {method: 'get'})

    // When the results come back, transform them from a JSON string into
    // a Javascript object (in this case, a list of author dictionaries).
    .then((response) => response.json())

    // Once you have your list of author dictionaries, use it to build
    // an HTML table displaying the author names and lifespan.
    .then(function(casesList) {
        // Build the table body.
        var tableBody = '';
        tableBody += '<tr><th>State Abbreviation</th>';
        tableBody += '<th>State</th>';
        tableBody += '<th>Date</th>';
        tableBody += '<th>Full Name</th>';
        tableBody += '<th>Gender</th>';
        tableBody += '<th>Race</th>';
        tableBody += '<th>Age</th>';
        tableBody += '<th>Signs of Mental Illness</th>';
        tableBody += '<th>Threat Level</th>';
        tableBody += '<th>Flee</th>';
        tableBody += '<th>Body Camera</th>';
        tableBody += '<th>Manner of Death</th>';
        tableBody += '<th>Arm Category</th></tr>';
        for (var k = 0; k < casesList.length; k++) {
            tableBody += '</tr><td>'+casesList[k]['state_abbreviation'] + '</td>';
            tableBody += '<td>'+casesList[k]['state'] + '</td>';
            tableBody += '<td>'+casesList[k]['date'] + '</td>';
            tableBody += '<td>'+casesList[k]['full_name'] + '</td>';
            tableBody += '<td>'+casesList[k]['gender'] + '</td>';
            tableBody += '<td>'+casesList[k]['race'] + '</td>';
            tableBody += '<td>'+casesList[k]['age'] + '</td>';
            tableBody += '<td>'+casesList[k]['signs_of_mental_illness'] + '</td>';
            tableBody += '<td>'+casesList[k]['threat_level'] + '</td>';
            tableBody += '<td>'+casesList[k]['flee'] + '</td>';
            tableBody += '<td>'+casesList[k]['body_camera'] + '</td>';
            tableBody += '<td>'+casesList[k]['manner_of_death'] + '</td>';
            tableBody += '<td>'+casesList[k]['arm_category'] + '</td></tr>';
        }

        // Put the table body we just built inside the table that's already on the page.
        var resultsTableElement = document.getElementById('results_table');
        if (resultsTableElement) {
            resultsTableElement.innerHTML = tableBody;
        }
    })

    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
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

// This gets called once the map is drawn, so you can set various attributes like
// state/country click-handlers, etc.
function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}

function hoverPopupTemplate(geography, data) {
    var population = 0;
    if (data && 'population' in data) {
        population = data.population;
    }

    var jeffHasLivedThere = 'No';
    if (data && 'jeffhaslivedthere' in data && data.jeffhaslivedthere) {
        jeffHasLivedThere = 'Yes';
    }

    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n'
                    + '<strong>Population:</strong> ' + population + '<br>\n'
                    + '<strong>Has Jeff lived there?</strong> ' + jeffHasLivedThere + '<br>\n'
                    + '</div>';

    return template;
}

function onStateClick(geography) {
    
    var url = getAPIBaseURL() + `/cases/states/${geography.id}/cumulative`;
        
    // Send the request to the api
    fetch(url, {method: 'get'})

    // When the results come back, transform them from a JSON string into
    // a Javascript object (in this case, a list of author dictionaries).
    .then((response) => response.json())
    
    // Once you have your list of author dictionaries, use it to build
    // an HTML table displaying the author names and lifespan.
    .then(function(casesList) {
        // Build the table body.
        var tableBody = '';
        tableBody += '<tr><th>State Abbreviation</th>';
        tableBody += '<th>State</th>';
        tableBody += '<th>Total Cases</th></tr>';

        tableBody += '</tr><td>'+casesList['state_abbreviation'] + '</td>';
        tableBody += '<td>'+casesList['state'] + '</td>';
        tableBody += '<td>'+casesList['total_cases'] + '</td></tr>';
        
        
//        for (var k = 0; k < casesList.length; k++) {
//            tableBody += '</tr><td>'+casesList[k]['state_abbreviation'] + '</td>';
//            tableBody += '<td>'+casesList[k]['state'] + '</td>';
//            tableBody += '<td>'+casesList[k]['total_cases'] + '</td></tr>';
//        }

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