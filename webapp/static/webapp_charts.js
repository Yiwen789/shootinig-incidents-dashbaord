/*
 * webapp.js
 * Yiwen Luo, 27 April 2016
 * 11 November 2020
 *
 */

window.onload = initialize;

function initialize() {
    
//    initializeMap();
    
    getPieChartData();
//    initializeCharts();
    
    
//    var element_2 = document.getElementById('get_cases_button');
//
//    element_2.onclick = getPieChartData;
}

// Returns the base URL of the API, onto which endpoint components can be appended.
function getAPIBaseURL() {
    
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}



function renderPieChart(data, labels){
    var ctx = document.getElementById("racial-pie-chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
            }],
        }
    });
}
   

function getPieChartData(){
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

    // Send the request to the api
    fetch(url, {method: 'get'})

    // When the results come back, transform them from a JSON string into
    // a Javascript object (in this case, a list of author dictionaries).
    .then((response) => response.json())
    
    .then(data =>{
        var data = data['data'];
        var labels = data['labels'];
        
//        console.log(data)
        console.log[labels];
        
        renderPieChart(data, labels);
    })
    
//    .then(function(response){
//        var responseJson = response.json();
//        
//        console.log(responseJson)
//        renderPieChart([0, 1, 2, 3, 4], ['a', 'b', 'c', 'd', 'e']);
//        
//    })

        
    
  
    
}