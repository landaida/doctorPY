Template.searchBox.helpers({
  isListPacienteRun: function() {
    // because the Session variable will most probably be undefined the first time
    var isRun = Session.get("isListPacienteRun") == undefined || Session.get("isListPacienteRun") == true;
    console.log(isRun);
    return isRun;
  }
});
