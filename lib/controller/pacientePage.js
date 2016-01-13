PacientePageController = RouteController.extend({
  template: 'pacientePage',
  subscriptions: function() {
     Meteor.subscribe('singlePaciente', this.params._id);
     Meteor.subscribe('consultas', this.params._id);
     Meteor.subscribe('imagenes', this.params._id);


     //Meteor.subscribe('cie10');
     var texto = '', input_search = $('#search-cie10');
     if(input_search.val())
       texto = input_search.val();
    console.log('subscription ', texto);
     Cie10Search.search(texto);
  },

  cie10: function() {
    var onlyCursor = true;
    console.log('get cie10');
    return Cie10Search.getData({
      transform: function(matchText, regExp) {
        console.log(matchText);
        return matchText.replace(regExp, "<b>$&</b>")
      }
    }, onlyCursor);
  },
  paciente: function(){
    var obj = Pacientes.findOne();
    if(obj)
      obj.cie10 = this.cie10()
    return obj;
  },
  data: function() {
    return this.paciente();
  },



});
