Template.pacienteSubmit.onCreated(function() {
  Session.set('pacienteSubmitErrors', {});
  this.fotoFile=new ReactiveVar();
  this.edad=new ReactiveVar();
});
Template.pacienteSubmit.onRendered(function() {
  if(this.data)
    getEdad(undefined, this);
});
getEdad = function(fechaNacimiento, template){
  if(!fechaNacimiento) fechaNacimiento = template.data.fechaNacimiento;
  var today = new Date();
  var birthDate = new Date(fechaNacimiento);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  template.edad.set(age);
}
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
  foto: function() {
    var foto = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    return foto[0];
  },
  urlFoto: function(foto) {
    if(foto)
      return foto.url();
  },
  isInserting: function(){
    return !this._id;
  },
  isEditing: function(){
    return this._id;
  },
  maxDate: function(){
    return Session.get('serverDate');
  },
  edad: function(){
    return Template.instance().edad.get();
  }
});
Template.pacienteSubmit.events({
  'submit form': function(e, template) {
    //poner siempre, previene back or
    e.preventDefault();

    var paciente = {
      dni: $(e.target).find('[name=dni]').val(),
      nombre: $(e.target).find('[name=nombre]').val(),
      fechaNacimiento: $(e.target).find('[name=fechaNacimiento]').val()
    };

    //valida que hay title and url del lado cliente
    var errors = validatePaciente(paciente);
    if (errors.dni || errors.nombre || errors.fechaNacimiento)
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

    if(template.fotoFile.get()){
      var file = new FS.File(template.fotoFile.get());
      file.metadata = {pacienteId: result._id, userId: Meteor.userId()};

      Imagenes.insert(file, function (err, fileObj) {
        if (err){
           // handle error
        } else {
          //var userId = Meteor.userId();
        }
      });
    }
    Router.go('pacientePage', {_id: result._id});
   });
 },
 'change #file-up': function(event, template) {
    event.preventDefault();

    var file = event.target.files[0];
    // Rudimentary check that we're dealing with an image
    var reader = new FileReader();
    if (file && file.type.substring(0,6) === 'image/') {
        reader.onload = function() {
          $('#foto').attr('src', reader.result);
          $('#div-thumbnail').show();
        }
    }
     reader.readAsDataURL(file);

    FS.Utility.eachFile(event, function(file) {
      template.fotoFile.set(file);
    });
  },
  'blur #fechaNacimiento': function(e, template) {
     var fecha = $(e.target).val();
     if(fecha)
        getEdad(fecha, template);
  }
});
