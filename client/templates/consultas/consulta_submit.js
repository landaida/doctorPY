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

    return index % 2 == 0 ? 'line-par' : '';
  },
  isOnlyOneDosis: function() {
    return Session.get('isOnlyOneDosis');
  },
  tiposFrecuencia: function() {
    var t = Template.instance();
    return t.view.parentView.parentView._templateInstance.data.tiposFrecuencia;
  },
  tiposDosis: function() {
    var t = Template.instance();
    return t.view.parentView.parentView._templateInstance.data.tiposDosis;
  },
  tiposDuracion: function() {
    var t = Template.instance();
    return t.view.parentView.parentView._templateInstance.data.tiposDuracion;
  },
});

Template.consultaSubmit.events({
  'click #btnCie10': function(e, t) {
    Session.set('isSearchCIE10', true);
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
    console.log('consulta submit', this, template);
    e.preventDefault();

    ///////////////////////////////////
    //INICIO VALIDA CAMPOS DE LA CONSULTA
    ///////////////////////////////////
    var me = this;
    var consulta = {
      motivo: $(e.target).find('[name=motivo]').val(),
      diagnostico: $(e.target).find('[name=diagnostico]').val(),
      tratamiento: $(e.target).find('[name=tratamiento]').val(),
      pacienteId: me._id
    };

    var errors = validateCampos(consulta);
    if (errors.length > 0)
      return Session.set('consultaSubmitErrors', errors);
    debugger
    var recetas = template.view.parentView.parentView._templateInstance.recetas.get(),
      msg = "Por favor complete el campo.";

    if (recetas.length > 0) {
      errors = {}, errors.length = 0;
      var a_recetas = [];
      recetas.forEach(function(item, i) {
        item.medicamento = $(e.target).find('[name=medicamento' + i + ']').val();
        item.dosis = $(e.target).find('[name=dosis' + i + ']').val();
        item.frecuencia = $(e.target).find('[name=frecuencia' + i + ']').val();
        item.duracion = $(e.target).find('[name=duracion' + i + ']').val();

        if (!item.medicamento) {
          errors['medicamento' + i] = msg;
          errors.length++;
        }
        if (!item.dosis) {
          errors['dosis' + i] = msg;
          errors.length++;
        }
        if (!item.frecuencia) {
          errors['frecuencia' + i] = msg;
          errors.length++;
        }
        if (!item.duracion) {
          errors['duracion' + i] = msg;
          errors.length++;
        }
        a_recetas.push({
          medicamento: item.medicamento,
          frecuencia: item.frecuencia,
          duracion: item.duracion
        });
      });
      if (errors.length > 0)
        return Session.set('consultaSubmitErrors', errors);
      consulta.recetas = a_recetas;
      ///////////////////////////////////
      //FIN VALIDA CAMPOS DE LA CONSULTA
      ///////////////////////////////////
    }
  },
  'click #chk-cie10': function(e) {
    var lista = Session.get('diagnosticos');

    if (!lista)
      lista = [];

    lista.push(this);

    Session.set('diagnosticos', lista);
  },
  'click #btnDone': function(e) {
    var v_diagnostico = $('[name="diagnostico"]'),
      str = '',
      lista = Session.get('diagnosticos');
    str = v_diagnostico.val();
    if (str && str.length > 0)
      str += '\n';
    if (lista) {
      lista.forEach(function(cie10) {
        str += cie10.dec10.replace('<b>', '').replace('</b>', '') + '\n';
        console.log(cie10.id10);
      });
      v_diagnostico.val(str);
    }
    Session.set('isSearchCIE10', false);
  },
  'click #btnClear': function(e) {
    Session.set('diagnosticos', undefined);
    $('input[type=checkbox]').each(function(i, cie10) {
      cie10.checked = false;
    })
  },
  'change input[type=checkbox]': function(e) {
    Session.set('isOnlyOneDosis', e.target.checked);
  },
  'change #typeDosis': function(e) {
    Session.set('tipo', TIPOS_DOSIS);
    if (e.target.value == "otros")
      $('#myModal').modal('toggle');
    else
      $('#myModal').modal('hide');
  },
  'change #typeFrecuencia': function(e) {
    Session.set('tipo', TIPOS_FRECUENCIA);
    if (e.target.value == "otros")
      $('#myModal').modal('toggle');
    else
      $('#myModal').modal('hide');
  },
  'change #typeDuracion': function(e) {
    Session.set('tipo', TIPOS_DURACION);
    if (e.target.value == "otros")
      $('#myModal').modal('toggle');
    else
      $('#myModal').modal('hide');
  },
  'click #btnAddNewTipo': function(e) {
    var other = $('#otherText').val();
    var tipo = {descripcion: other, tipo: Session.get('tipo')};
    if (other) {
      Meteor.call('tipoInsert', tipo, function(error, id) {
        if (error){
          throwError(error.reason);
        } else {
          var element;
          if(Session.get('tipo') == TIPOS_DOSIS)
            element = $('#typeDosis');
          else if(Session.get('tipo') == TIPOS_FRECUENCIA)
            element = $('#typeFrecuencia');
          else if(Session.get('tipo') == TIPOS_DURACION)
            element = $('#typeDuracion');

          element.append('<option value="' + id + '" selected="selected">' + other + '</option>');
        }
      });
    }
  }
});
