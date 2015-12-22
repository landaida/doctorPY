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
    //alert(e.target.title);

      console.log(e);
      Session.set('tituloPage', e.target.offsetParent.title);

   },
  'click .btn-danger': function(e, template){
      Router.go('pacienteList');
   },

});
