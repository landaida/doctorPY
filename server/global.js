buildRegExp = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

SearchSource.defineSource('pacientes', function(searchText, options) {
  if (!options) {
    options = {
      sort: {
        nombre: -1
      },
      limit: 10
    };
  } else if (!options.limit) {
    options.limit = 10;
  } else if (!options.sort) {
    options.sort = {
      nombre: -1
    };
  }

  if (searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [{
        dni: regExp
      }, {
        nombre: regExp
      }]
    };

    return Pacientes.find(selector, options).fetch();
  } else {
    return Pacientes.find({}, options).fetch();
  }
});


SearchSource.defineSource('cie10', function(searchText) {

  var options = {
    sort: {
      dec10: -1
    },
    limit: 10
  };


  if (!searchText) searchText = 'Colera';
  var regExp = buildRegExp(searchText);
  var selector = {
    $or: [{
      id10: regExp
    }, {
      dec10: regExp
    }]
  };

  return Cie10.find(selector, options).fetch();
});
