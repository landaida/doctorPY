Template.pacienteSubmit.onCreated(function() {
  FlashMessages.clear();
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
  foto: function() {
    var foto = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    return foto[0];
  },
  urlFoto: function() {
    var foto = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    foto = foto[0];
    if(foto)
      return foto.url();
    else
      return '/img/user_profile_photo.png';
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
    else if(!this.aseguradora && key === NINGUNA)
        retorno = 'selected'
    return retorno;
  },
  selectedGrupoSanguineo: function(key){
    var retorno = '';
    if(this.grupoSanguineo && key === this.grupoSanguineo)
        retorno = 'selected'
    else if(!this.grupoSanguineo && key === 'N')
        retorno = 'selected'
    return retorno;
  },
  hidden: function(index){
    var retorno = 'hidden';
    if((this.telefono2 && index == 2) || (this.telefono3 && index == 3))
        retorno = '';
    return retorno;
  },
  hiddenIfInserting: function(){
    return !this._id ? 'hidden' : '';
  }
});
Template.pacienteSubmit.events({
  'submit form': savePaciente,

 'click .profile-image': function(event, template) {
   $('#file-up').click();
 },
 'change #file-up': inputFileProfile,
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
