var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['nombre', 'dni'];

PacientesSearch = new SearchSource('pacientes', fields, options);

Template.searchResult.helpers({
  getPacientes: function() {
    return PacientesSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },

  isLoading: function() {
    return PacientesSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  PacientesSearch.search('');
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PacientesSearch.search(text);
  }, 200)
});
