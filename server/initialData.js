Meteor.startup(function() {
  if (Cie10.find().count() === 0) {
    var docs = [];
    var records = [];

    debugger

    var cie10 = JSON.parse(Assets.getText('data/cie10.json'));

    var i = 0;
    _.each(cie10, function(item) {
      Cie10.insert(item);
      i++;
    });
  }

  if (Tipos.find().count() === 0) {
    //Tipos de dosis
    Tipos.insert({descripcion:'cc', tipo: TIPOS_DOSIS, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});
    Tipos.insert({descripcion:'mg', tipo: TIPOS_DOSIS, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});

    //Tipos de frecuencia
    Tipos.insert({descripcion:'hora', tipo: TIPOS_FRECUENCIA, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});
    Tipos.insert({descripcion:'dia', tipo: TIPOS_FRECUENCIA, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});

    //Tipos de duracion
    Tipos.insert({descripcion:'dia', tipo: TIPOS_DURACION, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});
    Tipos.insert({descripcion:'semana', tipo: TIPOS_DURACION, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});
    Tipos.insert({descripcion:'mes', tipo: TIPOS_DURACION, situacion: SITUACION_ACTIVO, userId: null, author: null, submitted: new Date()});


  }
});
