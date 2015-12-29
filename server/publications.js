Meteor.publish('pacientes', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Pacientes.find({}, options);
});

Meteor.publish('singlePaciente', function(id) {
  check(id, String)
  return Pacientes.find(id);
});

Meteor.publish('consultas', function(pacienteId) {
  check(pacienteId, String);
  return Consultas.find({pacienteId: pacienteId});
});

Meteor.publish('imagenes', function(pacienteId) {
  check(pacienteId, String);
  var retorno = Imagenes.find({});
  return retorno;
});

buildRegExp = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}




SearchSource.defineSource('pacientes', function(searchText, options) {
  if(!options){
    options = {sort: {nombre: -1}, limit: 10};
  } else if(!options.limit){
    options.limit = 10;
  } else if(!options.sort){
    options.sort = {nombre: -1};
  }

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {dni: regExp},
      {nombre: regExp}
    ]};

    return Pacientes.find(selector, options).fetch();
  } else {
    return Pacientes.find({}, options).fetch();
  }
});
