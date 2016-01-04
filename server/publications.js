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
