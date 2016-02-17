Template.historiaClinica.onCreated(function() {
  var consultas = Consultas.find({pacienteId: this.data._id}, {sort: {submitted: -1}, limit: 2}).fetch();
  Session.set('consultas', consultas);
  if(consultas.length > 0){
    Session.set('first', consultas[0].submitted);
    Session.set('last', consultas.slice(-1)[0].submitted);
  }
});

Template.historiaClinica.helpers({
  consultas: function(){
    return Session.get('consultas');
  },
  getTableClass: function(index) {
    var retorno = 'success';
    if(index % 2 == 0)
      retorno = 'active';
    return retorno;
  },
  submitted: function() {
    return moment(this.submitted).format('LLL');
  },
  currentConsulta: function(){
    return Session.get('currentConsulta');
  },
  getDescription: function(type){
    var t = Template.instance();
    var lista = [], tipo = '';
    switch(type) {
    case 'DO':
      lista = t.view._templateInstance.data.tiposDosis;
      tipo = this.dosisTipo;
      break;
    case 'FR':
      lista = t.view._templateInstance.data.tiposFrecuencia;
      tipo = this.frecuenciaTipo;
      break;
    case 'DU':
      lista = t.view._templateInstance.data.tiposDuracion;
      tipo = this.duracionTipo;
      break;
    }
    var obj = lista.filter(function(item) {
      if(item._id === tipo)
        return item;
    })[0];
    if(obj)
      return obj.descripcion;
  },
  unicaDosis: function(){
    return this.unicaDosis == 'S';
  }
})

Template.historiaClinica.events({
  'click .listaConsultas': function (e) {
    e.preventDefault();
    Session.set('currentConsulta', this);
  },
  'click .listaConsultasNext': function (e) {
    e.preventDefault();
    var t = Template.instance().view.template;
    var last = Session.get('last');
    var consultas = Consultas.find({pacienteId: this._id, submitted: {$lt: last}}, {limit: 2}).fetch();
    consultas = t.__helpers.get('consultas').call().concat(consultas);
    Session.set('consultas', consultas);
    console.log(consultas);
  },
  'click .listaConsultasBack': function (e) {
    e.preventDefault();
    // var consultas = Session.get('consultas');
    // consultas = consultas.concat(Consultas.find({pacienteId: this._id}, {sort: {submitted: -1}, limit: limit ? limit : 2}).fetch());
    // //Session.set('consultas', consultas);
    // console.log(Session.get('consultas'));
  }
})
