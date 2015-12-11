Consultas = new Mongo.Collection('consultas');

Meteor.methods({
  consultaInsert: function(consultaAttributes) {
    //Comprobamos que el usuario está conectado, que la consulta tiene cuerpo, y que está vinculado a un paciente.
    check(this.userId, String);
    check(consultaAttributes, {
      pacienteId: String,
      body: String
    });
    var user = Meteor.user();
    var paciente = Pacientes.findOne(consultaAttributes.pacienteId);
    if (!paciente)
      throw new Meteor.Error('invalid-consulta', 'Usted debe seleccionar un paciente para crear una consulta');

    consulta = _.extend(consultaAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // update the paciente with the number of consultas
    Pacientes.update(consulta.pacienteId, {$inc: {consultasCount: 1}});

    return Consultas.insert(consulta);
  }
});
