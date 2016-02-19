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

Meteor.publish('cie10', function(options) {
  return Cie10.find({}, options);
});

Meteor.publish('tipos', function() {
  return Tipos.find({situacion: SITUACION_ACTIVO});
});

Meteor.publish('medicamentos', function() {
  return Medicamentos.find({});
});
