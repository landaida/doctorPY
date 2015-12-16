Template.searchBox.helpers({
  isListPacienteRun: function() {
    // because the Session variable will most probably be undefined the first time
    var isRun = Session.get("isListPacienteRun") == true;
    //console.log(isRun);
    return isRun;
  }
});


Template.header.events({
  'click #btnAddPaciente': function(event, template) {
    event.preventDefault();
    Router.go('pacienteSubmit');
  }
});
