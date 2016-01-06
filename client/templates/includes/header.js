Template.searchBox.helpers({
  isListPacienteRun: function() {
    // because the Session variable will most probably be undefined the first time
    var isRun = Session.get("isListPacienteRun") == true;
    return isRun;
  }
});


Template.header.events({
  'click #btnAddPaciente': function(event, template) {
    event.preventDefault();
    Session.set('editing', false);
    Router.go('pacienteSubmit');
  }
});
