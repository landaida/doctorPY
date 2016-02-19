Medicamentos = new Mongo.Collection('medicamentos');


Meteor.methods({
  medicamentoInsert: function(attributes) {
    //Comprobamos que el usuario está conectado, que la consulta tiene cuerpo, y que está vinculado a un paciente.
    check(this.userId, String);
    check(attributes, {
      descripcion: String
    });

    var user = Meteor.user();
    var isExist = Medicamentos.find({descripcion: attributes.descripcion.toUpperCase().trim()}).fetch();
    if (isExist.length > 0)
      throw new Meteor.Error('invalid', 'Ya existe dicho medicamento');

    record = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });



    var id =  Medicamentos.insert(record);


    return id;
  }
});
