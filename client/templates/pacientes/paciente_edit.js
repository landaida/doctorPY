Template.pacienteEdit.onCreated(function() {
  Session.set('pacienteEditErrors', {});
});

Template.pacienteEdit.helpers({
  errorMessage: function(field) {
    return Session.get('pacienteEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('pacienteEditErrors')[field] ? 'has-error' : '';
  }
});


Template.pacienteEdit.events({
  'submit form': function(e) {
    //verificar exactamente para que sirve, busque mucho y no encontré algo entendible
    e.preventDefault();

    var currentPacienteId = this._id;

    var pacienteProperties = {
      dni: $(e.target).find('[name=dni]').val(),
      nombre: $(e.target).find('[name=nombre]').val()
    }

    //valida la existencia de ciertos atributos del lado cliente
    var errors = validatePaciente(pacienteProperties);
    if (errors.dni || errors.nombre)
      return Session.set('pacienteEditErrors', errors);

    Pacientes.update(currentPacienteId, {$set: pacienteProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('pacientePage', {_id: currentPacienteId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Eliminar este paciente?")) {
      var currentPacienteId = this._id;
      Pacientes.remove(currentPacienteId);
      Router.go('pacienteList');
    }
  }
});
