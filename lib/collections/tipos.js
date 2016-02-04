Tipos = new Mongo.Collection('tipos');


Meteor.methods({
  tipoInsert: function(attributes) {
    //Comprobamos que el usuario está conectado, que la consulta tiene cuerpo, y que está vinculado a un paciente.
    check(this.userId, String);
    check(attributes, {
      descripcion: String,
      tipo: Number
    });

    var user = Meteor.user();
    var tipo = Tipos.find({descripcion: attributes.descripcion.toLowerCase().trim()});
    if (!tipo)
      throw new Meteor.Error('invalid', 'Ya existe dicho tipo');

    record = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      situacion: SITUACION_ACTIVO
    });



    var id =  Tipos.insert(record);


    return id;
  }
});
