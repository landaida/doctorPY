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
    //return Pacientes.find({}, this.findOptions());
    // return PacientesSearch.getData({
    //   transform: function(matchText, regExp) {
    //     return matchText.replace(regExp, "<b>$&</b>")
    //   },
    //   sort: {nombre: -1},
    //   limit: this.pacientesLimit()
    // });
    return PacientesSearch.search("", this.pacientesLimit() );
  },
  data: function() {
    var hasMore = this.pacientes().length === this.pacientesLimit();
    var nextPath = this.route.path({pacientesLimit: this.pacientesLimit() + this.increment});
    return {
      pacientes: this.pacientes(),
      ready: this.pacientesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});
