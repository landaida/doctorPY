Template.pacienteItem.helpers({
  ownPaciente: function() {
    return this.userId === Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});


// Template.pacienteItem.events({
//   'click #btn-edit': function(e, template){
//       e.preventDefault();
//       Router.go('pacientePage');
//    }
// });
