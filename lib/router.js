Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/pacientes/:_id', {
  name: 'pacientePage',
  // waitOn: function() {
  //   //trae solamente los comentarios que pertenecen al paciente, usando el this.params._id que es el id del paciente
  //   return [
  //    Meteor.subscribe('singlePaciente', this.params._id),
  //    Meteor.subscribe('consultas', this.params._id),
  //    Meteor.subscribe('imagenes', this.params._id)
  //  ];
  // },
  // data: function() { return Pacientes.findOne(this.params._id); }
});

Router.route('/pacientes/:_id/edit', {
  name: 'pacienteEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePaciente', this.params._id);
  },
  data: function() { return Pacientes.findOne(this.params._id); }
});

Router.route('/submit', {name: 'pacienteSubmit'});

Router.route('/:pacientesLimit?', {
  name: 'pacienteList'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'pacientePage'});
Router.onBeforeAction(requireLogin, {only: 'pacienteSubmit'});
