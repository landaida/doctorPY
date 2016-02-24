Template.pacienteList.onCreated(function() {
  Session.set('isListPacienteRun', true);
});

Template.pacienteList.onDestroyed(function() {
  Session.set('isListPacienteRun', false);
});

Template.searchResult.helpers({
  // getPacientes: function() {
  //   var controller = Router.current();
  //   return PacientesSearch.getData({
  //     transform: function(matchText, regExp) {
  //       return matchText.replace(regExp, "<b>$&</b>")
  //     },
  //     sort: {nombre: -1}
  //   });
  // },

  isLoading: function() {
    return PacientesSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  var controller = Router.current();
  PacientesSearch.search('', {limit: controller.pacientesLimit(), sort: {_id: -1}});
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var controller = Router.current();
    var text = $(e.target).val().trim();
    PacientesSearch.search(text, {limit: controller.pacientesLimit(), sort: {_id: -1}});
  }, 200)
});
