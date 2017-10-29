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


var pollData = $('canvas').attr("data-poll");
pollData = JSON.parse(pollData);
pollData = JSON.parse(pollData.pollDetails);

pollData.pollOptions.map((option, index)=>{
    console.log(option)
    $(".vote-buttons").append('<button class="add-vote btn-primary" value='+ pollData.pollVotes[index] +'>'+ option +'</button>');
})

$('.add-vote').on('click', ()=>{
    $(this).val(parseInt($(this).val())+1);
    $('.vote-buttons').hide('ease-out', ()=>{
        //location.reload();

    
    });
    
})

var voteData = {
    labels: pollData.pollOptions,
    datasets: [
        {data: pollData.pollVotes,
        backgroundColor: [
                   
                'rgba(38,198,218 ,0.2)',
                'rgba(236,64,122 ,0.2)',   
                'rgba(255,179,0 ,0.2)',    
                'rgba(27,94,32 ,0.2)',
                'rgba(94,53,177 ,0.2)',    
                'rgba(0,121,107 ,0.2)',    
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
                'rgba(38,198,218 ,1)',
                'rgba(236,64,122 ,1)',   
                'rgba(255,179,0 ,1)',    
                'rgba(27,94,32 ,1)',
                'rgba(94,53,177 ,1)',    
                'rgba(0,121,107 ,1)',    
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
}

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: voteData
});

});// document ready