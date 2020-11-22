/*
 * webapp.js
 * Yiwen Luo, 27 April 2016
 * 11 November 2020
 *
 */

window.onload = initialize;

function initialize() {
    
//    initializeMap();
    
    getCasesButtonClicked();
    
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
