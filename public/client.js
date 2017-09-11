$( document ).ready(function() {
var option = 3; 
  $('#addOption').on('click', function(){
      console.log('option number' + option);
      var add = "<div><label>Option " + option + ": <input type='text', name='option" + option +"'/></label></div><br>";
      $('#add').innerHTML == add;
      option++;
  });
});