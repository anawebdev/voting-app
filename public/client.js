$( document ).ready(function() {
var option = 3; 
var max_fields = 20;
var wrapper = $(".input_wrap");
var add_button = $(".add_button");
$(add_button).click(function(e){
  e.preventDefault();
  var add = "<div><label>Option : <input type='text', name='option"+option+"'/></label><button class='remove_fields btn-danger'>X</button></div>";
  if(option<max_fields){
    option++;
    $(wrapper).append(add);
  }
});

$(wrapper).on("click",".remove_fields", function(e){
  e.preventDefault();
  $(this).parent('div').remove();
})

$('#submit').on('click', function(){
  setTimeout(()=>{
    document.forms['create_poll'].reset();
  }, 500)
  
})

var data = $('canvas').attr("data-poll");
var data = JSON.parse(data);
var data = JSON.parse(data.pollDetails);
console.log(data.pollOptions)

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: data.pollOptions,
        datasets: [{
            label: '# of Votes',
            data: data.pollVotes,
            backgroundColor: [
                   
                'rgba(225,101,82,0.2)',
                'rgba(201,74,83,0.2)',   
                'rgba(190,81,104,0.2)',    
                'rgba(163,73,116,0.2)',
                'rgba(153,55,103,0.2)',    
                'rgba(101,56,125,0.2)',    
                'rgba(78,36,114,0.2)',
                'rgba(145,99,182,0.2)',    
                'rgba(226,121,163,0.2)',    
                'rgba(224,89,139,0.2)',
                'rgba(124,159,176,0.2)',    
                'rgba(86,152,196,0.2)',    
                'rgba(154,191,136,0.2)',
                'rgba(81,87,74, 0.5)',    
                'rgba(68,124,105,0.5)',
                'rgba(116,196,147,0.5)',
                'rgba(142,140,109,0.5)',    
                'rgba(228,191,128,0.5)',    
                'rgba(233,215,142,0.5)',
                'rgba(226,151,93,0.2)',   
                'rgba(241,150,112,0.2)'

            ],
            borderColor: [
                'rgba(225,101,82, 1)',
                'rgba(201,74,83, 1)',   
                'rgba(190,81,104, 1)',    
                'rgba(163,73,116, 1)',
                'rgba(153,55,103, 1)',    
                'rgba(101,56,125, 1)',    
                'rgba(78,36,114, 1)',
                'rgba(145,99,182, 1)',    
                'rgba(226,121,163, 1)',    
                'rgba(224,89,139, 1)',
                'rgba(124,159,176, 1)',    
                'rgba(86,152,196, 1)',    
                'rgba(154,191,136, 1)',
                'rgba(81,87,74, 1)',    
                'rgba(68,124,105, 1)',
                'rgba(116,196,147, 1)',
                'rgba(142,140,109, 1)',    
                'rgba(228,191,128, 1)',    
                'rgba(233,215,142, 1)',
                'rgba(226,151,93, 1)',   
                'rgba(241,150,112, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

});// document ready