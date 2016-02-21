PacientePageController = RouteController.extend({
  template: 'pacientePage',
  subscriptions: function() {
     Meteor.subscribe('singlePaciente', this.params._id);
     Meteor.subscribe('consultas', this.params._id);
     Meteor.subscribe('imagenes', this.params._id);
     Meteor.subscribe('tipos');
     Meteor.subscribe('medicamentos');
     Meteor.subscribe('archivos', this.params._id);

     //Meteor.subscribe('cie10');
     var texto = '', input_search = $('#search-cie10');
     if(input_search.val())
       texto = input_search.val();
     Cie10Search.search(texto);
  },
  consultas: function(){
    var consultas = Consultas.find({pacienteId: this.params._id}, {sort: {id: -1}, limit: PAGINATION_HISTORIA_NEXT}).fetch();
    Session.set('consultas', consultas);
    if(consultas.length > 0){
      Session.set('last', consultas.slice(-1)[0].id);
    }
  },
  tiposDosis: function(){
    var tipos =  Tipos.find({tipo: TIPOS_DOSIS}).fetch();
    Session.set('tiposDosis', tipos);
  },
  tiposFrecuencia: function(){
    var tipos =  Tipos.find({tipo: TIPOS_FRECUENCIA}).fetch();
    Session.set('tiposFrecuencia', tipos);
  },
  tiposDuracion: function(){
    var tipos =  Tipos.find({tipo: TIPOS_DURACION}).fetch();
    Session.set('tiposDuracion', tipos);
  },
  cie10: function() {
    var onlyCursor = true;
    return Cie10Search.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      }
    }, onlyCursor);
  },
  paciente: function(){
    var obj = Pacientes.findOne();
    if(obj){
      obj.cie10 = this.cie10()
      this.tiposDosis();
      this.tiposFrecuencia();
      this.tiposDuracion();
      this.consultas();
      this.archivos();
    }
    return obj;
  },
  data: function() {
    return this.paciente();
  },
  archivos: function(){
    var archivos = Archivos.find({"metadata.pacienteId": this.params._id}, {sort: {"metadata.id": -1}, limit: PAGINATION_ARCHIVO_NEXT}).fetch();
    Session.set('archivos', archivos);
    if(archivos.length > 0){
      Session.set('lastArchivo', archivos.slice(-1)[0].metadata.id);
    }
  }
});
