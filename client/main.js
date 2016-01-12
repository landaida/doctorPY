var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
}
var fields = ['nombre', 'dni']

PacientesSearch = new SearchSource('pacientes', fields, options);
Cie10Search = new SearchSource('cie10', ['dec10'], options);
