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
    var last;
    if(consultas.length > 0){
      last = consultas.slice(-1)[0].id;
      Session.set('last', last);
    }

    var consultasLast = Consultas.find({pacienteId: this.params._id, id: {$lt: last}}, {limit: PAGINATION_HISTORIA_NEXT}).fetch();
    if(consultasLast.length == 0)
      Session.set('isMore', 'disabled');

  },
  tiposDosis: function(){
    var tipos =  Tipos.find({tipo: TIPOS_DOSIS}, {sort:{submitted:1}}).fetch();
    Session.set('tiposDosis', tipos);
  },
  tiposFrecuencia: function(){
    var tipos =  Tipos.find({tipo: TIPOS_FRECUENCIA}, {sort:{submitted:1}}).fetch();
    Session.set('tiposFrecuencia', tipos);
  },
  tiposDuracion: function(){
    var tipos =  Tipos.find({tipo: TIPOS_DURACION}, {sort:{submitted:1}}).fetch();
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
    Session.set('isMoreArchivo', '');
    var archivos = Archivos.find({"metadata.pacienteId": this.params._id}, {sort: {"metadata.id": -1}, limit: PAGINATION_ARCHIVO_NEXT}).fetch();
    Session.set('archivos', archivos);
    var lastArchivo;
    if(archivos.length > 0){
      lastArchivo = archivos.slice(-1)[0].metadata.id;
      Session.set('lastArchivo', lastArchivo);
    }
    var lista = Archivos.find({"metadata.pacienteId": this.params._id, "metadata.id": {$lt: lastArchivo}}, {limit: PAGINATION_ARCHIVO_NEXT, sort:{'metadata.id':-1}}).fetch();
    if(lista.length == 0){
      Session.set('isMoreArchivo', 'disabled');
    }
  }
});
