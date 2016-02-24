PacienteListController = RouteController.extend({
  template: 'pacienteList',
  increment: 5,
  pacientesLimit: function() {
    return parseInt(this.params.pacientesLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {_id: -1}, limit: this.pacientesLimit()};
  },
  subscriptions: function() {
    this.pacientesSub = Meteor.subscribe('pacientes', this.findOptions());
    var texto = '', input_search = $('#search-box');
    if(input_search.val())
      texto = input_search.val();
    PacientesSearch.search(texto, {limit: this.pacientesLimit(), sort: {_id: -1}});
  },
  pacientes: function() {
    // return Pacientes.find({}, this.findOptions());
    //retrieve only cursor of collections
    var onlyCursor = true;
    return PacientesSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {_id: -1},
      limit: this.pacientesLimit()
    }, onlyCursor);
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
