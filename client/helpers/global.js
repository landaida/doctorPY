var containsAny = function(str, substrings) {
  for (var i = 0; i != substrings.length; i++) {
     var substring = substrings[i];
     if (str.indexOf(substring) != - 1) {
       return substring;
     }
  }
  return null;
}

var arrayMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre']

var helpers = {
  dateToText: function(date, onlyDate) {
    if(onlyDate){
      if(this.submitted)
        return moment(this.submitted).format('L')
      else
        return moment(date, 'dd/mm/YYYY')
    }else if ( containsAny(date, arrayMonths) == '') {
      return moment(date, 'dd/mm/YYYY')//.format('LLL');
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
  pull_desktop: function (side) {
    var retorno = 'pull-' + side;
    if(!Meteor.Device.isDesktop())
      retorno = '';
    return retorno;
  },
  isDesktop: function () {
    return Meteor.Device.isDesktop();
  },
  equals: function (a, b) {
    console.log(a, b, a === b)
    return a === b;
  },
  getDescription: function(type){
    if(this.unicaDosis && type != 'DO')
      return '';
    var lista = [], tipo = '';
    switch(type) {
    case 'DO':
      lista = Session.get('tiposDosis');
      tipo = this.dosisTipo;
      break;
    case 'FR':
      lista = Session.get('tiposFrecuencia');
      tipo = this.frecuenciaTipo;
      break;
    case 'DU':
      lista = Session.get('tiposDuracion');
      tipo = this.duracionTipo;
      break;
    }
    var obj = lista.filter(function(item) {
      if(item._id === tipo)
        return item;
    })[0];
    if(obj)
      return obj.descripcion;
  }
};

_.each(helpers, function(value, key){
  Template.registerHelper(key, value);
});


Session.set('isListPacienteRun', false);

//retrieve date from server
Meteor.call("getServerDate", function (error, result) {
  Session.set('serverDate', result);
});
