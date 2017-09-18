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

});