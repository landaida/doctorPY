Template.pacientePage.helpers({
  consultas: function() {
    return Consultas.find({pacienteId: this._id});
  }
});
