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
  }
})

Template.pacientePage.events({
  'click tr': function (e) {
    Session.set('currentConsulta', this);
  }
})
