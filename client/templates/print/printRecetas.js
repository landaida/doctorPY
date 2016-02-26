Template.printRecetasTemplate.helpers({
  'recetas': function(){
    return Session.get('recetas');
  },
  'labelUnicaDosis': function(){
    return this.unicaDosis ? 'Tomar una única vez.' : '';
  },
  'texto': function(texto){
    if(!this.unicaDosis)
      return texto;
  }
})
