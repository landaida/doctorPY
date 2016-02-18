PacientePageController = RouteController.extend({
  template: 'pacientePage',
  subscriptions: function() {
     Meteor.subscribe('singlePaciente', this.params._id);
     Meteor.subscribe('consultas', this.params._id);
     Meteor.subscribe('imagenes', this.params._id);
     Meteor.subscribe('tipos');

     //Meteor.subscribe('cie10');
     var texto = '', input_search = $('#search-cie10');
     if(input_search.val())
       texto = input_search.val();
     Cie10Search.search(texto);
  },
  consultas: function(){
    var consultas = Consultas.find({pacienteId: this.params._id}, {sort: {id: -1}, limit: 2}).fetch();
    Session.set('consultas', consultas);
    if(consultas.length > 0){
      Session.set('last', consultas.slice(-1)[0].id);
    }
  },
  tiposDosis: function(){
    return Tipos.find({tipo: TIPOS_DOSIS}).fetch();
  },
  tiposFrecuencia: function(){
    return Tipos.find({tipo: TIPOS_FRECUENCIA}).fetch();
  },
  tiposDuracion: function(){
    return Tipos.find({tipo: TIPOS_DURACION}).fetch();
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
      obj.tiposDosis = this.tiposDosis();
      obj.tiposFrecuencia = this.tiposFrecuencia();
      obj.tiposDuracion = this.tiposDuracion();
      this.consultas();
    }
    return obj;
  },
  data: function() {
    return this.paciente();
  },



});
