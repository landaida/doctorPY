Template.pacienteSubmit.onCreated(function() {
  Session.set('pacienteSubmitErrors', {});
});
Template.pacienteSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('pacienteSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('pacienteSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.pacienteSubmit.events({
  'submit form': function(e) {
    //poner siempre, previene back or
    e.preventDefault();

    var paciente = {
      dni: $(e.target).find('[name=dni]').val(),
      nombre: $(e.target).find('[name=nombre]').val()
    };

    //valida que hay title and url del lado cliente
    var errors = validatePaciente(paciente);
    if (errors.dni || errors.nombre)
      return Session.set('pacienteSubmitErrors', errors);

    //paciente._id = Pacientes.insert(paciente);
    //Router.go('pacientePage', paciente);
    Meteor.call('pacienteInsert', paciente, function(error, result) {
     // display the error to the user and abort
     if (error)
       return throwError(error.reason);

     // show this result but route anyway
    if (result.pacienteExists)
      throwError('Este paciente ya existe');

     Router.go('pacientePage', {_id: result._id});
   });
  }
});
