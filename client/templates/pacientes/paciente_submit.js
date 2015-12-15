Template.pacienteSubmit.onCreated(function() {
  Session.set('pacienteSubmitErrors', {});
});
Template.pacienteSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('pacienteSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('pacienteSubmitErrors')[field] ? 'has-error' : '';
  },
  photo: function () {
    return '/img/user_profile_photo.png';
  }
});
Template.pacienteSubmit.created=function(){
  this.fotoBuffer=new ReactiveVar();
};
Template.pacienteSubmit.events({
  'submit form': function(e, template) {
    //poner siempre, previene back or
    e.preventDefault();

    var paciente = {
      dni: $(e.target).find('[name=dni]').val(),
      nombre: $(e.target).find('[name=nombre]').val(),
      foto: template.fotoBuffer.get()
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
 },
 'change #foto': function(event, template) {
   event.preventDefault();
     var file = event.target.files[0]; //assuming you have only 1 file
     var reader = new FileReader(); //create a reader according to HTML5 File API

     reader.onload = function(event){
       var result = reader.result //assign the result, if you console.log(result), you get {}
       buffer = new Uint8Array(result) // convert to binary
       template.fotoBuffer.set(buffer);
       //console.log(this, buffer);
     }

     reader.readAsArrayBuffer(file); //read the file as arraybuffer
     //reader.readAsDataURL(file)
  }
});
