Template.pacienteList.onCreated(function() {
  Session.set('isListPacienteRun', true);
});

Template.pacienteList.onDestroyed(function() {
  Session.set('isListPacienteRun', false);
});

Template.searchResult.helpers({
  getPacientes: function() {
    var controller = Router.current();
    return PacientesSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {nombre: -1}
    });
  },

  isLoading: function() {
    return PacientesSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  var controller = Router.current();
  PacientesSearch.search('', {limit: controller.pacientesLimit()});
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var controller = Router.current();
    var text = $(e.target).val().trim();
    PacientesSearch.search('', {limit: controller.pacientesLimit()});
  }, 200)
});

// Template.pacienteList.events({
//   'click .load-more': function (e){debugger
//     console.log('load-more');
//     var controller = Router.current();
//     var text = $(e.target).val().trim();
//     PacientesSearch.search(text, {limit: controller.pacientesLimit()});
//   }
// });


var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
}
var fields = ['nombre', 'dni']

PacientesSearch = new SearchSource('pacientes', fields, options);
