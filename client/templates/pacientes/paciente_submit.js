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
  },
  pull: function () {
    var retorno = 'pull-right'
    if(!Meteor.Device.isDesktop())
      retorno = 'pull-left';
    return retorno;
  },
});
Template.pacienteSubmit.created=function(){
  this.fotoFile=new ReactiveVar();
};
Template.pacienteSubmit.events({
  'submit form': function(e, template) {
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

    var file = new FS.File(template.fotoFile.get());
    file.metadata = {pacienteId: result._id, userId: Meteor.userId()};

    Imagenes.insert(file, function (err, fileObj) {
      if (err){
         // handle error
      } else {
        //var userId = Meteor.userId();
      }
    });
    Router.go('pacientePage', {_id: result._id});
   });
 },
 'change #file-up': function(event, template) {
    event.preventDefault();

    var file = event.target.files[0];
    // Rudimentary check that we're dealing with an image
    var reader = new FileReader();
    if (file && file.type.substring(0,6) === 'image/') {

        console.log(reader, 'before');
        reader.onload = function() {
            console.log(reader.result, $('#foto'));
            $('#foto').attr('src', reader.result);
        }
    }
     reader.readAsDataURL(file);

    FS.Utility.eachFile(event, function(file) {
      template.fotoFile.set(file);
    });
  }
});
