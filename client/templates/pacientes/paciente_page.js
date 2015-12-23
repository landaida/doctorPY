
Template.pacientePage.onRendered(function () {
  var foto = Imagenes.find({"metadata.pacienteId": this.data._id}).fetch();
  if(foto[0]){
    this.$('#div-thumbnail').show();
  }else{
    this.$('#div-thumbnail').hide();
  }
});

Template.pacientePage.helpers({
  consultas: function() {
    return Consultas.find({pacienteId: this._id});
  },
  foto: function() {
    var foto = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    return foto[0];
  },
  urlFoto: function(foto) {
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
  'click .btn-danger': function(e, template){
      Router.go('pacienteList');
   },

});
