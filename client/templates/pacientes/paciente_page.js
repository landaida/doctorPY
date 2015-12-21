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
    return Session.get('tituloPage') ? Session.get('tituloPage') : 'Datos de la consulta';
  }
});


Template.pacientePage.events({
  'click .listanav': function(e, template){
    e.preventDefault(); 
    //alert(e.target.title);
    console.log(e.target.title);
      Session.set('tituloPage', e.target.title);
   },
  'click .btn-danger': function(e, template){
      Router.go('pacienteList');
   },

});
