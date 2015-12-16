Template.pacientePage.helpers({
  consultas: function() {
    return Consultas.find({pacienteId: this._id});
  },
  foto: function() {
    var foto = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    return foto[0];
  },
  urlFoto: function(foto) {
    return foto.url();
  },
});
