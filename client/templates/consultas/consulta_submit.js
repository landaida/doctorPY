Template.consultaSubmit.onCreated(function() {
  Session.set('consultaSubmitErrors', {});
  Session.set('isSearchCIE10', false);
  console.log('create consultaSubmit');
});

Template.consultaSubmit.helpers({
  errorMessage: function(field, index) {
    if (typeof(index) == 'number')
      return Session.get('consultaSubmitErrors')[field + index];
    else
      return Session.get('consultaSubmitErrors')[field];
  },
  errorClass: function(field, index) {
    if (typeof(index) == 'number')
      return !!Session.get('consultaSubmitErrors')[field + index] ? 'has-error' : '';
    else
      return !!Session.get('consultaSubmitErrors')[field] ? 'has-error' : '';
  },
  isEditing: function() {
    return this._id != null;
  },
  recetas: function() {
    var t = Template.instance();
    return t.view.parentView.parentView._templateInstance.recetas.get();
  },
  isSearchCIE10: function(group) {
    var retorno = '';
    if (Session.get('isSearchCIE10') == true) {
      if (group == 0)
        retorno = 'hidden'
      else
        retorno = '';
    } else {
      if (group == 0)
        retorno = '';
      else
        retorno = 'hidden'
    }

    return retorno;
  },
  // cie17: function() {
  //   var t = Template.instance();
  //   return t.view.parentView.parentView._templateInstance.recetas.get();
  // },
  cie10Class: function(index) {

    return index % 2 == 0 ? 'line-par' : '' ;
  },
});

Template.consultaSubmit.events({
  'click #btnCie10': function(e, t) {
    Session.set('isSearchCIE10', true);
    Session.set('diagnosticos', undefined);
  },
  'click #btnBack': function(e, t) {
    Session.set('isSearchCIE10', false);
  },
  'click #btnAdd': function(e, t) {
    var recetas = t.view.parentView.parentView._templateInstance.recetas.get();
    recetas.push(t.view.parentView.parentView._templateInstance.model.get());
    t.view.parentView.parentView._templateInstance.recetas.set(recetas)
  },
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var consulta = {
      body: $body.val(),
      pacienteId: template.data._id
    };

    var errors = {};
    if (!consulta.body) {
      errors.body = "Por favor completa el contenido";
      return Session.set('consultaSubmitErrors', errors);
    }

    Meteor.call('consultaInsert', consulta, function(error, consultaId) {
      if (error) {
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  },
  'click #chk-cie10': function(e){
    var str = '';
    if(Session.get('diagnosticos'))
      str = Session.get('diagnosticos');

    str += this.dec10 + '\n';

    Session.set('diagnosticos', str);
  },
  'click #btnDone': function(e){
    var v_diagnostico = $('[name="diagnostico"]'), str = '';
    str = v_diagnostico.val() + '\n' + Session.get('diagnosticos');
    v_diagnostico.val(str);
    Session.set('isSearchCIE10', false);
  }
});
