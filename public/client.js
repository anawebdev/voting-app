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

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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