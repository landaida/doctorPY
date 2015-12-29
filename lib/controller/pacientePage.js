PacientePageController = RouteController.extend({
  template: 'pacientePage',
  subscriptions: function() {
     Meteor.subscribe('singlePaciente', this.params._id);
     Meteor.subscribe('consultas', this.params._id);
     Meteor.subscribe('imagenes', this.params._id);
  },
  data: function() {
    return Pacientes.findOne(this.params._id);
  }
});
