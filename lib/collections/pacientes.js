Pacientes = new Mongo.Collection('pacientes');
if(Meteor.isServer) {
  Pacientes._ensureIndex({nombre: 1, dni: 1});
}
Pacientes.allow({
  update: function(userId, paciente) { return ownsDocument(userId, paciente); },
  remove: function(userId, paciente) { return ownsDocument(userId, paciente); },
});

Meteor.methods({
  pacienteInsert: function(pacienteAttributes) {
    //check viene del package audit-argument-checks
    //check if the userId is a String
    check(Meteor.userId(), String);
    //check if the Paciente object containts title and url attributes
    check(pacienteAttributes, {
      dni:String,
      nombre: String,
      fechaNacimiento: String
    });

    //valida que hay title and url del lado server
    var errors = validatePaciente(pacienteAttributes);
    if (errors.dni || errors.nombre || errors.fechaNacimiento)
      throw new Meteor.Error('invalid-paciente', "Usted debe completar todos los campos obligatorios del paciente");

    //Evita duplicidad de urls
    var pacienteWithSameLink = Pacientes.findOne({dni: pacienteAttributes.dni});
    if (pacienteWithSameLink) {
      return {
        pacienteExists: true,
        _id: pacienteWithSameLink._id
      }
    }
    var user = Meteor.user();
    //_.extend() copia los atributos de pacienteAttributes al var paciente.
    var paciente = _.extend(pacienteAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      consultasCount: 0
    });

    var pacienteId = Pacientes.insert(paciente);
    return {
      _id: pacienteId
    };
  }
});

//valida si se modifica algunos atributtos que yo permita
Pacientes.deny({
  update: function(userId, paciente, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'dni', 'nombre').length > 0);
  }
});
//aca verifica si no estan vacias
Pacientes.deny({
  update: function(userId, paciente, fieldNames, modifier) {
    var errors = validatePaciente(modifier.$set);
    return errors.dni || errors.nombre;
  }
});

validatePaciente = function (paciente) {
  var errors = {};
  if (!paciente.nombre)
    errors.nombre = "Por favor complete el nombre del paciente\n";
  if (!paciente.edad)
    errors.edad =  "Por favor complete la edad del paciente\n";
  if (!paciente.fechaNacimiento)
    errors.fechaNacimiento =  "Por favor complete la fecha de nacimiento del paciente\n";
  return errors;
}
