Meteor.startup(function() {
  if (Cie10.find().count() === 0) {
    var docs = [];
    var records = [];

    debugger

    var cie10 = JSON.parse(Assets.getText('data/cie10.json'));

    console.log('Inicio de insercion CIE10', new Date);
    var i = 0;
    _.each(cie10, function(item) {
      Cie10.insert(item);
      i++;
      if (i > 14483)
      console.log('Fin de insercion CIE10', new Date);
    });
  }
});
