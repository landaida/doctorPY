Template.historiaClinica.onCreated(function() {
  Session.set('isMore', true);
  var consultas = Consultas.find({pacienteId: this.data._id}, {sort: {id: -1}, limit: 2}).fetch();
  Session.set('consultas', consultas);
  if(consultas.length > 0)
    Session.set('last', consultas.slice(-1)[0].id);
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
  },
  isMore: function(){
    return Session.get('isMore') == true ? '' : 'disabled';
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
    var consultas = Consultas.find({pacienteId: this._id, id: {$lt: last}}, {limit: 2}).fetch();
    if(consultas.length > 0){
      var last = consultas.slice(-1)[0].id;
      Session.set('last', last);
      consultas = t.__helpers.get('consultas').call().concat(consultas);
      Session.set('consultas', consultas);
      var first_id = Consultas.findOne({},{sort:{id:1}}).id;
      if(first_id == last)
        Session.set('isMore', false);
    }
  }
})
