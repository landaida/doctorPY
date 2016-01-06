Template.pacientePage.onCreated(function () {
  console.log('editing');
  this.fotoFile=new ReactiveVar();
  Session.set('editing', true);
});
Template.pacientePage.onRendered(function () {
  var me = this;
//   setTimeout(function(){
//   var foto = Imagenes.find({"metadata.pacienteId": me.data._id}).fetch();
//   if(foto[0]){
//     console.log('photo found');
//     me.$('#div-thumbnail').show();
//   }else{
//     me.$('#div-thumbnail').hide();
//     console.log('photo not found', me);
//   }
// }, 50);
});

Template.pacientePage.helpers({
  consultas: function() {
    return Consultas.find({pacienteId: this._id});
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
    else {
      return '/img/user_profile_photo.png';
    }
  },
  tituloPage: function(){
    //setTimeout(function(){
      return Session.get('tituloPage') ? Session.get('tituloPage') : 'Datos de la consulta';
    //}, 50);
  }
});


Template.pacientePage.events({
  'click .listanav': function(e, template){
      e.preventDefault();
      Session.set('tituloPage', e.target.offsetParent.title);
      //Template.pacientePage.__helpers.get('foto').call()
   },
  'click #btnCancelar': function(e, template){
      Router.go('pacienteList');
   },
   'submit form': savePaciente,
   'click .profile-image': function(event, template) {
     $('#file-up').click();
   },
   'change #file-up': inputFileProfile,
});
