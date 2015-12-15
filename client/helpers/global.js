var helpers = {
  dateToText: function(date) {
    if ( date ) {
      return moment(date).format('LLL');
    }else {
      return null;
    }
  },
  numbersonly: function (myfield, e){
    var key;
    var keychar;

    if (window.event)
        key = window.event.keyCode;
    else if (e)
        key = e.which;
    else
        return true;

    keychar = String.fromCharCode(key);

    // control keys
    if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
        return true;

    // numbers
    else if ((("0123456789").indexOf(keychar) > -1))
        return true;


    else
        return false;
  }
};

_.each(helpers, function(value, key){
  Template.registerHelper(key, value);
});
/*
Template.registerHelper('dateToText',(date) => {
  if ( date ) {
    return moment(date).format('LLL');
  }else {
    return null;
  }
})
*/

Template.body.events({
  ' input[type=number] keydown': function(e) {
    var key;
    var keychar;

    if (window.event)
        key = window.event.keyCode;
    else if (e)
        key = e.which;
    else
        return true;

    keychar = String.fromCharCode(key);

    // control keys
    if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
        return true;

    // numbers
    else if ((("0123456789").indexOf(keychar) > -1))
        return true;


    else{
      event.stopPropagation();
      return false;
    }

  }
});
