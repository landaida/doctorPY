var helpers = {
  validatePaciente : function (paciente) {
    var errors = {};debugger
    if (!paciente.nombre)
      errors.nombre = "Por favor complete el nombre del paciente\n";
    if (!paciente.edad)
      errors.edad =  "Por favor complete la edad del paciente\n";
    if (!paciente.fechaNacimiento)
      errors.fechaNacimiento =  "Por favor complete la fecha de nacimiento del paciente\n";
    return errors;
  },
  buildRegExp: function(searchText) {
    // this is a dumb implementation
    var parts = searchText.trim().split(/[ \-\:]+/);
    return new RegExp("(" + parts.join('|') + ")", "ig");
  },
  dateToText: function(date) {
    if ( date) {
      if(moment(date).isValid())
        return moment(date).format('LLL');
    }
    return date;
  },
  numberFormat: function(value){
      if(value)
        return numeral(value).format('0,0');
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
  },
  classContainer: function() {
    var retorno = 'container'
    if(!Meteor.Device.isDesktop())
      retorno = 'container-fluid';
    return retorno;
  },
  renderImageAndText: function(text) {
    var retorno = ' '+text;
    if(!Meteor.Device.isDesktop())
      retorno = '';
    return retorno;
  },
  fechaHoy: function() {
    Meteor.call("getServerDate", function (error, result) {
      var fecha = moment(result).format("YYYY/MM/DD");
      console.log(fecha);
      return fecha.toString();
    });
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

Session.set('isListPacienteRun', false);
