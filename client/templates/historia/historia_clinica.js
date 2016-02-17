Template.historiaClinica.helpers({
  consultas: function(){
    var t = Template.instance();
    return t.view._templateInstance.data.consultas;
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

Template.pacientePage.events({
  'click .listaConsultas': function (e) {
    e.preventDefault();
    Session.set('currentConsulta', this);
  }
})
