/*
 * webapp.js
 * Yiwen Luo, 27 April 2016
 * 11 November 2020
 *
 */

window.onload = initialize;

function initialize() {
    getCasesButtonClicked();
    
    var element = document.getElementById('get_cases_button');

    element.onclick = getCasesButtonClicked;
    
}


//function selectDropdown() {
//    var mental_illness_selected_value = document.getElementById('mental_illness_dropdown').value;
//    mental_illness_selected_value.onclick = getCasesButtonClicked;
//}


function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

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


    fetch(url, {method: 'get'})
    .then((response) => response.json())
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

    var resultsTableElement = document.getElementById('results_table');
    if (resultsTableElement) {
        resultsTableElement.innerHTML = tableBody;
    }
})

//======================================
//    chart race
//======================================
        
    var url = getAPIBaseURL() + '/cases/total/demographics/race';

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

    var resultsTableElement = document.getElementById('racial-pie-chart');

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then(function(casesList){
        
        var data = []
        var labels = []
        for(var k = 0; k < casesList.length; k++){
            data.push(casesList[k]['data']);
            labels.push(casesList[k]['label']);
        }

        renderPieChartRace(data, labels);
        
    })
    
    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
    

//======================================
//    chart gender
//======================================
            
var url = getAPIBaseURL() + '/cases/total/demographics/gender';

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

    var resultsTableElement = document.getElementById('gender-pie-chart');

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then(function(casesList){
        var data = []
        var labels = []
        for(var k = 0; k < casesList.length; k++){
            data.push(casesList[k]['data']);
            labels.push(casesList[k]['label']);
        }
        renderPieChartGender(data, labels);
    })
    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
}

function renderPieChartRace(data, labels){
    var ctx = document.getElementById("racial-pie-chart").getContext("2d");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4D525A', '#3E7DCC', '#8F9CB3', '#00C8C8', '#F9D84A', '#8CC0FF']
            }],
        },
        options: {
            tooltips: {enabled: false},
            hover: {mode: null},
            tooltips: false,
          }
    });
}
    
function renderPieChartGender(data, labels){
    var ctxGender = document.getElementById("gender-pie-chart").getContext("2d");
    var myPieChart = new Chart(ctxGender, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4D525A', '#3E7DCC', '#8F9CB3', '#00C8C8', '#F9D84A', '#8CC0FF']
            }],
        },
        options: {
            tooltips: {enabled: false},
            hover: {mode: null},
            tooltips: false,
          }
    });
    
}
   

