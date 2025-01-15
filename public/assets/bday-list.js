
$(document).ready(function(){

  var buttonText 
  $('form button').on('click', function() {
    buttonText = $(this).text();
  }); $('form').on('submit', function(){
     console.log("Button clicked: " + buttonText);

      var item1 = $('form input[name="name"]');
      var item2 = $('form input[name="dob"]');
      var bday = {"name": item1.val(), "dob": item2.val(), "button": buttonText};

      $.ajax({
        type: 'POST',
        url: '/bday',
        data: bday,
        success: function(data){
          //do something with the data via front-end framework
          console.log(data);
          location.reload();
        }
      });

      return false;

  });


//   $('form #search').on('submit', function(){

//     var item1 = $('form input[name="name"]');
//     var item2 = $('form input[name="dob"]');
//     var bday = {"name": item1.val(), "dob": item2.val()};

//     $.ajax({
//       type: 'POST',
//       url: '/bday',
//       data: bday,
//       success: function(data){
//         //do something with the data via front-end framework
//         console.log(data);
//         location.reload();
//       }
//     });

//     return false;

// });

  




  



  $('li #del_button').on('click', function(){
    var item = $(this).closest('li').text().split(" ")[0];
    $.ajax({
      type: 'DELETE',
      url: '/bday/' + item,
      success: function(data){ 
      location.reload();
      }
    });
    });

  $('li #edit_button').on('click', function(){
    var item = $(this).closest('li').text().split(" ")[0];
    console.log("This is the url "+item)
    // var newName = prompt("Enter new name:");
    var newDob = prompt(`Enter new date of birth for ${item}:`);
    console.log("newdob "+newDob)
    if (item && newDob) {
      $.ajax({
      type: 'PUT',
      url: '/bday/' + item,
      data: newDob,
      success: function(data){
        console.log("data=  "+data);
        location.reload();
      }
      });
    }
    });


});
