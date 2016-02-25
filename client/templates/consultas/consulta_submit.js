Template.consultaSubmit.onCreated(function() {
  Session.set('consultaSubmitErrors', {});
  Session.set('isSearchCIE10', false);
  Session.set('isOnlyOneDosis', false);
  Session.set('diagnosticos', null);
  Session.set('recetas', [{medicamento:'', unicaDosis: false, dosis:'', dosisTipo: '', frecuencia:'', frecuenciaTipo:'', duracion:'', duracionTipo:''}]);
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
    // var t = Template.instance();
    // return t.view.parentView.parentView._templateInstance.recetas.get();
    return Session.get('recetas');
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
    //var t = Template.instance();
    //return t.view.parentView.parentView._templateInstance.data.tiposFrecuencia;
    return Session.get('tiposFrecuencia');
  },
  tiposDosis: function() {
    return Session.get('tiposDosis');
  },
  tiposDuracion: function() {
    return Session.get('tiposDuracion');
  },
  settings: function() {
    return {
      position: "top",
      limit: 10,
      rules: [{
        token: '',
        collection: Medicamentos,
        field: "descripcion",
        matchAll: true,
        template: Template.autocompleteMedicamentos
      }]
    };
  },
  getMedicamentoId: function() {
    return 'medicamento'+Session.get('index');
  },
  setIndex: function(index){
    Session.set('index', index);
  },
  imc: function(){
    return Session.get('imc');
  },
  haycock: function(){
    return Session.get('haycock');
  },
  boyd: function(){
    return Session.get('boyd');
  },
  mosteller: function(){
    return Session.get('mosteller');
  },
  icc: function(){
    return Session.get('icc');
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
    // var recetas = t.view.parentView.parentView._templateInstance.recetas.get();
    // recetas.push(t.view.parentView.parentView._templateInstance.model.get());
    // t.view.parentView.parentView._templateInstance.recetas.set(recetas)
    var t = Template.instance().view.template;
    var recetas = t.__helpers.get('recetas').call();
    recetas.push({medicamento:'', unicaDosis: false, dosis:'', dosisTipo: '', frecuencia:'', frecuenciaTipo:'', duracion:'', duracionTipo:''});
    Session.set('recetas', recetas);
  },
  'submit form': function(e, template) {
    e.preventDefault();

    ///////////////////////////////////
    //INICIO VALIDA CAMPOS DE LA CONSULTA
    ///////////////////////////////////
    var me = this;
    var consulta = {
      motivo: $(e.target).find('[name=motivo]').val(),
      diagnostico: $(e.target).find('[name=diagnostico]').val(),
      tratamiento: $(e.target).find('[name=tratamiento]').val(),
      pacienteId: me._id,
      peso:parseInt($(e.target).find('[name=peso]').val()),
      altura:parseInt($(e.target).find('[name=altura]').val()),
      perimetroCintura:parseInt($(e.target).find('[name=perimetroCintura]').val()),
      perimetroCadera:parseInt($(e.target).find('[name=perimetroCadera]').val()),
    };
    var onlyRequired = _.omit(consulta,'peso', 'altura', 'perimetroCintura', 'perimetroCadera', 'pacienteId');
    var errors = validateCampos(onlyRequired);
    if (errors.length > 0)
      return Session.set('consultaSubmitErrors', errors);

    //Agrega los cie10 seleccionados
    var lista = Session.get('diagnosticos'), str = '';
    lista.forEach(function(cie10) {
      str += str.length > 0 ? ', ' + cie10.id10 : cie10.id10;
    });
    consulta.cie10List = str;

    // var recetas = template.view.parentView.parentView._templateInstance.recetas.get(),
    var recetas = Session.get('recetas'),
      msg = "Por favor complete: ",
      msgCuerpo = '';

    if (recetas.length > 0) {
      errors = {}, errors.length = 0;
      var a_recetas = [];debugger
      recetas.forEach(function(item, i) {
        item.medicamento = $(e.target).find('[name=medicamento' + i + ']').val();
        item.unicaDosis = $(e.target).find('[name=unicaDosis' + i + ']').prop("checked");
        item.dosis = $(e.target).find('[name=dosis' + i + ']').val();
        item.dosisTipo = $(e.target).find('[name=dosisTipo' + i + ']').val();
        item.frecuencia = $(e.target).find('[name=frecuencia' + i + ']').val();
        item.frecuenciaTipo = $(e.target).find('[name=frecuenciaTipo' + i + ']').val();
        item.duracion = $(e.target).find('[name=duracion' + i + ']').val();
        item.duracionTipo = $(e.target).find('[name=duracionTipo' + i + ']').val();

        if (!item.medicamento) {
          msgCuerpo += msgCuerpo.length == 0 ? 'Medicamento' : ' ,Medicamento';
        }
        if (!item.dosis) {
          msgCuerpo += msgCuerpo.length == 0 ? 'Dosis' : ' ,Dosis';
        }
        if (item.dosisTipo == 'otros') {
          msgCuerpo += msgCuerpo.length == 0 ? 'Tipo de Dosis' : ' ,Tipo de Dosis';
        }

        if (!item.unicaDosis) {
          if (!item.frecuencia) {
            msgCuerpo += msgCuerpo.length == 0 ? 'Frecuencia' : ' ,Frecuencia';
          }
          if (item.frecuenciaTipo == 'otros') {
            msgCuerpo += msgCuerpo.length == 0 ? 'Tipo de Frecuencia' : ' ,Tipo de Frecuencia';
          }
          if (!item.duracion) {
            msgCuerpo += msgCuerpo.length == 0 ? 'Duración' : ' ,Duración';
          }
          if (item.duracionTipo == 'otros') {
            msgCuerpo += msgCuerpo.length == 0 ? 'Tipo de Duracion' : ' ,Tipo de Duracion';
          }
        }
        if (msgCuerpo.length > 0) {
          errors['recetas' + i] = msg + msgCuerpo;
          errors.length++;
        }
        a_recetas.push({
          medicamento: item.medicamento,
          unicaDosis: item.unicaDosis ? 'S' : 'N',
          dosis: item.dosis,
          dosisTipo: item.dosisTipo,
          frecuencia: item.unicaDosis ? null : item.frecuencia,
          frecuenciaTipo: item.unicaDosis ? null : item.frecuenciaTipo,
          duracion: item.unicaDosis ? null : item.duracion,
          duracionTipo: item.unicaDosis ? null : item.duracionTipo
        });
      });
      if (errors.length > 0)
        return Session.set('consultaSubmitErrors', errors);
      consulta.recetas = a_recetas;
      ///////////////////////////////////
      //FIN VALIDA CAMPOS DE LA CONSULTA
      ///////////////////////////////////


      ///////////////////////////////////
      //INICIO INSERT OR UPDATE CONSULTAS
      ///////////////////////////////////

      Meteor.call('consultaInsert', consulta, function(error, consultaId) {

        if (error) {
          throwError(error.reason);
        } else {

        }
        Router.go('pacienteList');
      });

      ///////////////////////////////////
      //FIN INSERT OR UPDATE CONSULTAS
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
  'change select': function(e) {
    Session.set('element', e.target.id);
    if (e.target.id.indexOf('frec') != -1)
      Session.set('tipo', TIPOS_FRECUENCIA);
    else if (e.target.id.indexOf('dura') != -1)
      Session.set('tipo', TIPOS_DURACION);
    else if (e.target.id.indexOf('dosi') != -1)
      Session.set('tipo', TIPOS_DOSIS);

    if (e.target.value == "otros")
      $('#myModal').modal('toggle');
    else
      $('#myModal').modal('hide');
  },
  'click #btnAddNewTipo': function(e) {
    var other = $('#otherText').val();
    var tipo = {
      descripcion: other,
      tipo: Session.get('tipo')
    };
    if (other) {
      Meteor.call('tipoInsert', tipo, function(error, id) {
        if (error) {
          throwError(error.reason);
        } else {
          var element = $('#' + Session.get('element'));
          element.append('<option value="' + id + '" selected="selected">' + other + '</option>');
        }
      });
    }
  },
  'keyup #peso': _.throttle(function(e) {
    var altura = $('#altura').val();
    imc(e.target.value, altura);
  }, 200),
  'keyup #altura': _.throttle(function(e) {
    var peso = $('#peso').val();
    imc(peso, e.target.value);
  }, 200),
  'keyup #perimetroCintura': _.throttle(function(e) {
    var perimetroCadera = $('#perimetroCadera').val();
    Session.set('icc', e.target.value / perimetroCadera)
  }, 200),
  'keyup #perimetroCadera': _.throttle(function(e) {
    var perimetroCintura = $('#perimetroCintura').val();
    Session.set('icc', Math.round((perimetroCintura / e.target.value) * 100)/100)
  }, 200),
  "autocompleteselect input": function(event, template, doc) {

    console.log("selected ", doc, template);
  },
  'click #btnPrint': function(e, t) {
    window.print &&  window.print();
  },
});
