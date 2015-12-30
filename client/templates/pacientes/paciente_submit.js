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
  pull_right_device: function () {
    var retorno = 'pull-right'
    if(!Meteor.Device.isDesktop())
      retorno = '';
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
  },
  selectedEstadoCivil: function(key){
    var retorno = '';
    if(this.estadoCivil && key === this.estadoCivil)
        retorno = 'selected'
    else if(!this.estadoCivil && key === ESTADO_CIVIL_SOLTERO)
        retorno = 'selected'
    return retorno;
  },
  selectedSexo: function(key){
    var retorno = '';
    if(this.sexo && key === this.sexo)
        retorno = 'selected'
    else if(!this.sexo && key === SEXO_MASCULINO)
        retorno = 'selected'
    return retorno;
  },
  selectedAseguradora: function(key){
    var retorno = '';
    if(this.aseguradora && key === this.aseguradora)
        retorno = 'selected'
    else if(!this.aseguradora && key === ASEGURADORA_NINGUNA)
        retorno = 'selected'
    return retorno;
  },
  hidden: function(index){
    var retorno = 'hidden';
    if((this.telefono2 && index == 2) || (this.telefono3 && index == 3))
        retorno = '';
    return retorno;
  }
});
Template.pacienteSubmit.events({
  'submit form': function(e, template) {
    //poner siempre, previene back or
    e.preventDefault();

    var paciente = {
      dni: $(e.target).find('[name=dni]').val(),
      nombre: $(e.target).find('[name=nombre]').val(),
      fechaNacimiento: $(e.target).find('[name=fechaNacimiento]').val(),
      sexo: $(e.target).find('[name=sexo]').val(),
      estadoCivil: $(e.target).find('[name=estadoCivil]').val(),
      domicilio: $(e.target).find('[name=domicilio]').val(),
      email: $(e.target).find('[name=email]').val(),
      aseguradora: $(e.target).find('[name=aseguradora]').val(),
      telefono1: $(e.target).find('[name=telefono1]').val(),
      telefono2: $(e.target).find('[name=telefono2]').val(),
      telefono3: $(e.target).find('[name=telefono3]').val(),
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
  },
  'click .telefono': function(e, template){
      e.preventDefault();
      var v_telefono2 = $('#div-telefono2')[0], v_telefono3 = $('#div-telefono3')[0];
      if(v_telefono2.getAttribute('class').indexOf('hidden') != -1)
        v_telefono2.setAttribute('class', v_telefono2.getAttribute('class').replace('hidden', ''))
      else if(v_telefono3.getAttribute('class').indexOf('hidden') != -1)
        v_telefono3.setAttribute('class', v_telefono3.getAttribute('class').replace('hidden', ''))
   },
});
