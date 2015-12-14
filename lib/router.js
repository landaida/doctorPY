Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/pacientes/:_id', {
  name: 'pacientePage',
  waitOn: function() {
    //trae solamente los comentarios que pertenecen al paciente, usando el this.params._id que es el id del paciente
    return [
     Meteor.subscribe('singlePaciente', this.params._id),
     Meteor.subscribe('consultas', this.params._id)
   ];
  },
  data: function() { return Pacientes.findOne(this.params._id); }
});

Router.route('/pacientes/:_id/edit', {
  name: 'pacienteEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePaciente', this.params._id);
  },
  data: function() { return Pacientes.findOne(this.params._id); }
});

Router.route('/submit', {name: 'pacienteSubmit'});
Router.route('/pacienteCRUD', {name: 'pacienteCRUD'});
PacienteListController = RouteController.extend({
  template: 'pacienteList',
  increment: 5,
  pacientesLimit: function() {
    return parseInt(this.params.pacientesLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.pacientesLimit()};
  },
  subscriptions: function() {
    this.pacientesSub = Meteor.subscribe('pacientes', this.findOptions());
  },
  pacientes: function() {
    return Pacientes.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.pacientes().count() === this.pacientesLimit();
    var nextPath = this.route.path({pacientesLimit: this.pacientesLimit() + this.increment});
    return {
      pacientes: this.pacientes(),
      ready: this.pacientesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/:pacientesLimit?', {
  name: 'pacienteList',
  /*waitOn: function() {
    //por defecto es 5 la paginacion
    var limit = parseInt(this.params.pacientesLimit) || 5;
    return Meteor.subscribe('pacientes', {sort: {submitted: -1}, limit: limit});
  },
  data: function() {
    var limit = parseInt(this.params.pacientesLimit) || 5;
    return {
      pacientes: Pacientes.find({}, {sort: {submitted: -1}, limit: limit})
    };
  }*/
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
