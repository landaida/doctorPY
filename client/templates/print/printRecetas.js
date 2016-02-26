// Template.printRecetasTemplate.onCreated(function() {
//   var recetas = [];
//   recetas.push({medicamentoId: 'medicamento0', medicamento:'Aspirina', unicaDosis: false, dosis:'40', dosisTipo: 'KrtjDg3arhgnn68Xp', frecuencia:'6', frecuenciaTipo:'fmk4k94viYchzY7jo', duracion:'5', duracionTipo:'KRbdxjjYx2KJNPzQs'});
//   recetas.push({medicamentoId: 'medicamento1', medicamento:'Dolanet', unicaDosis: true, dosis:'100', dosisTipo: 'KrtjDg3arhgnn68Xp', frecuencia:'', frecuenciaTipo:'', duracion:'', duracionTipo:''});
//   recetas.push({medicamentoId: 'medicamento2', medicamento:'Paracetamol', unicaDosis: false, dosis:'10', dosisTipo: 'KrtjDg3arhgnn68Xp', frecuencia:'6', frecuenciaTipo:'fmk4k94viYchzY7jo', duracion:'8', duracionTipo:'KRbdxjjYx2KJNPzQs'});
//   Session.set('recetas', recetas);
// })
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
