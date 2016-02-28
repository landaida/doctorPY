Template.historiaClinica.onCreated(function() {
  Session.set('imc-h', 0);
  Session.set('mosteller-h', 0);
  Session.set('boyd-h', 0);
  Session.set('haycock-h', 0);
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
  unicaDosis: function(){
    return this.unicaDosis == 'S';
  },
  isMore: function(){
    return Session.get('isMore');
  }
})

Template.historiaClinica.events({
  'click .listaConsultas': function (e) {
    e.preventDefault();

    this.imc = imc(this.peso, this.altura, true);
    this.haycock = Session.get('haycock-h');
    this.boyd = Session.get('boyd-h');
    this.mosteller = Session.get('mosteller-h');
    this.icc = Math.round((this.perimetroCintura / this.perimetroCadera) * 100)/100;

    this.recetas.forEach(function(receta){
      var lista = Session.get('tiposDosis');
      lista.filter(function(item) {
        if(item._id === receta.dosisTipo)
          receta.dosisDescripcion = item.descripcion;
      });

      lista = Session.get('tiposFrecuencia');
      lista.filter(function(item) {
        if(item._id === receta.frecuenciaTipo)
          receta.frecuenciaDescripcion = item.descripcion;
      });

      lista = Session.get('tiposDuracion');
      lista.filter(function(item) {
        if(item._id === receta.duracionTipo)
          receta.duracionDescripcion = item.descripcion;
      });
    })

    Session.set('currentConsulta', this);
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
        Session.set('isMore', 'disabled');
    }else{
      Session.set('isMore', 'disabled');
    }
  }
})
