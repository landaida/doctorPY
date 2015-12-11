Template.consultaSubmit.onCreated(function() {
  Session.set('consultaSubmitErrors', {});
});

Template.consultaSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('consultaSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('consultaSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.consultaSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var consulta = {
      body: $body.val(),
      pacienteId: template.data._id
    };

    var errors = {};
    if (! consulta.body) {
      errors.body = "Por favor completa el contenido";
      return Session.set('consultaSubmitErrors', errors);
    }

    Meteor.call('consultaInsert', consulta, function(error, consultaId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});
