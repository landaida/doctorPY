Consultas = new Meteor.Collection("consultas", {
  transform: function (doc) {
    doc.imc = function () {
      imc(this.peso, this.altura);
      return imc;
    };
    return doc;
  }
});

Meteor.methods({
  consultaInsert: function(consultaAttributes) {
    //Comprobamos que el usuario está conectado, que la consulta tiene cuerpo, y que está vinculado a un paciente.
    check(this.userId, String);
    check(consultaAttributes, {
      pacienteId: String,
      motivo: String,
      diagnostico: String,
      tratamiento: String,
      peso: Number,
      altura: Number,
      recetas: Array
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
    var last = Consultas.findOne({},{sort:{id:-1}});
    var currentId = 0;
    if(last)
      currentId = last.id;
    consulta.id = currentId + 1;

    // update the paciente with the number of consultas
    Pacientes.update(consulta.pacienteId, {$inc: {consultasCount: 1}});

    var idConsulta =  Consultas.insert(consulta);


    ///////////////////////////////////
    //INICIO INSERT MEDICAMENTOS
    ///////////////////////////////////
      consulta.recetas.forEach(function(record){
        var medicamento = Medicamentos.find({descripcion: record.medicamento}).fetch();
        if (medicamento.length == 0){
          medicamento = {descripcion: record.medicamento}
          Meteor.call('medicamentoInsert', medicamento, function(error, id) {
            if (error) {
              throwError(error.reason);
            } else {

            }
          });
        }
      });
    ///////////////////////////////////
    //FIN INSERT MEDICAMENTOS
    ///////////////////////////////////

    return idConsulta;
  }
});
