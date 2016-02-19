
var archivoStore = new FS.Store.GridFS("archivos");

Archivos = new FS.Collection("archivos", {
  stores: [archivoStore]
});

// Meteor.methods({
//   archivoInsert: function(attributes) {
//     //Comprobamos que el usuario está conectado, que la consulta tiene cuerpo, y que está vinculado a un paciente.
//     check(this.userId, String);
//     check(attributes, {
//       file: Object,
//       pacienteId: String
//     });
//
//     var user = Meteor.user();
//
//     var last = Archivos.find({"metadata.pacienteId": attributes.pacienteId},{sort:{"metadata.id":-1}}).fetch();
//     var currentId = 0;
//     if(last.length > 0)
//       currentId = last.id;
//     attributes.id = currentId + 1;
//
//
//     var file = new FS.File(attributes.file);
//     file.metadata = {
//       pacienteId: attributes.pacienteId,
//       userId: user._id,
//       author: user.username,
//       id: attributes.id,
//       submitted: new Date()
//     };
//
//     Archivos.insert(file, function(err, fileObj) {
//       debugger
//       if (err) {
//         // handle error
//       } else {
//         //var userId = Meteor.userId();
//       }
//     });
//
//     //var id =  Archivos.insert(record);
// 
//
//   //  return id;
//   }
// });


Archivos.deny({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  },
  download: function() {
    return false;
  }
});

Archivos.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});
