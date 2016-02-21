Template.historiaClinica.onCreated(function() {
  Session.set('isMore', true);
});

Template.historiaClinica.onRendered(function(){
});

Template.historiaClinica.helpers({
  consultas: function(){
    return  Session.get('consultas');
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
      lista = Session.get('tiposDosis');
      tipo = this.dosisTipo;
      break;
    case 'FR':
      lista = Session.get('tiposFrecuencia');
      tipo = this.frecuenciaTipo;
      break;
    case 'DU':
      lista = Session.get('tiposDuracion');
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
  },
  imc: function(){
    var currentConsulta = Session.get('currentConsulta'), retorno = 0;
    if(currentConsulta){
      retorno = imc(currentConsulta.peso, currentConsulta.altura);
    }
    return retorno;
  }
})

Template.historiaClinica.events({
  'click .listaConsultas': function (e) {
    e.preventDefault();
    Session.set('currentConsulta', this);
    console.log(this);
  },
  'click .listaConsultasNext': function (e) {
    e.preventDefault();
    var t = Template.instance().view.template;
    var last = Session.get('last');
    var consultas = Consultas.find({pacienteId: this._id, id: {$lt: last}}, {limit: PAGINATION_HISTORIA_NEXT}).fetch();
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
