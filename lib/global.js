savePaciente = function(e, template) {
  //poner siempre, previene back or
  e.preventDefault();

  ///////////////////////////////////
  //INICIO VALIDA CAMPOS DEL PACIENTE
  ///////////////////////////////////
  var paciente = {
    dni: $(e.target).find('[name=dni]').val(),
    nombre: $(e.target).find('[name=nombre]').val(),
    fechaNacimiento: $(e.target).find('[name=fechaNacimiento]').val(),
    sexo: $(e.target).find('[name=sexo]').val(),
    estadoCivil: $(e.target).find('[name=estadoCivil]').val(),
    domicilio: $(e.target).find('[name=domicilio]').val(),
    email: $(e.target).find('[name=email]').val(),
    aseguradora: $(e.target).find('[name=aseguradora]').val(),
    telefono1: $(e.target).find('[name=telefono1]').val(),
    telefono2: $(e.target).find('[name=telefono2]').val(),
    telefono3: $(e.target).find('[name=telefono3]').val(),
    otrosDatos: $(e.target).find('[name=otrosDatos]').val(),
    grupoSanguineo: $(e.target).find('[name=grupoSanguineo]').val(),
  };

  var onlyRequired = _.omit(paciente,'telefono2', 'telefono3', 'otrosDatos');
  //valida que hay title and url del lado server
  var errors = validateCampos(onlyRequired);
  if (errors.length > 0)
    return Session.set('pacienteSubmitErrors', errors);

  ///////////////////////////////////
  //FIN VALIDA CAMPOS DEL PACIENTE
  ///////////////////////////////////

  if (!this._id) {
    /*************************************************/
    /***INICIO INSERT PACIENTES***/
    /*************************************************/

    Meteor.call('pacienteInsert', paciente, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.pacienteExists)
        throwError('Este paciente ya existe');

      if (template.fotoFile.get()) {
        var file = new FS.File(template.fotoFile.get());
        file.metadata = {
          pacienteId: result._id,
          userId: Meteor.userId()
        };

        Imagenes.insert(file, function(err, fileObj) {
          if (err) {
            // handle error
          } else {
            //var userId = Meteor.userId();
          }
        });
      }
      Router.go('pacientePage', {
        _id: result._id
      });
    });

  } else {
    /*************************************************/
    /***INICIO UPDATE PACIENTES OR ADD NEW CONSULTA***/
    /*************************************************/

    me.fotos = Imagenes.find({"metadata.pacienteId": this._id}).fetch();
    Meteor.call('pacienteUpdate', this._id, paciente, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      if (template.fotoFile.get()) {

        var file = new FS.File(template.fotoFile.get());
        file.metadata = {
          pacienteId: me._id,
          userId: Meteor.userId()
        };

        if (Session.get('photoIsChanged')) {
          me.fotos.forEach(function(item){
            Imagenes.remove({
              _id: item._id
            }, function(err, result) {
              if (!err) {
                console.log("Remove success");
              }
            })
          });
        }
        Imagenes.insert(file, function(err, fileObj) {
          if (err) {
            // handle error
          } else {
            //var userId = Meteor.userId();
          }
        });

      }




    })
  }

}


validateCampos = function(object) {
  var errors = {};
  errors.length = 0;
  for (var key in object) {
    if (!object[key] || (object[key] == NINGUNA && key == 'grupoSanguineo')) {
      errors[key] = "Por favor complete el campo.";
      errors.length++;
    }
  }
  return errors;
}


inputFileProfile = function(event, template) {
  event.preventDefault();

  var file = event.target.files[0];

  Resizer.resize(file, {
    width: 64,
    height: 64,
    cropSquare: true
  }, function(err, file) {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(file);
    $('#foto').attr('src', imageUrl);
  });

  // Rudimentary check that we're dealing with an image
  // var reader = new FileReader();
  // if (file && file.type.substring(0,6) === 'image/') {
  //     reader.onload = function() {
  //       //$('#foto').attr('src', reader.result);
  //       //$('#div-thumbnail').show();
  //     }
  // }
  //  reader.readAsDataURL(file);

  FS.Utility.eachFile(event, function(file) {
    if (Session.get('editing')) {
      Session.set('photoIsChanged', true);
    } else {
      Session.set('photoIsChanged', false);
    }
    template.fotoFile.set(file);
  });
}

imc = function(peso, altura){
  var alturaMetros = 0, imc = 0, mosteller = 0, boyd = 0, haycock = 0, punto = altura.indexOf('.'), comma = altura.indexOf(',');
  if(peso && altura){
    //Si uno de los dos es diferente a -1 es porque es un decimal
    if(punto != -1 || comma != -1){
      alturaMetros = altura;
      altura = altura * 100;
    }else{
      alturaMetros = altura / 100;
    }
    imc = Math.round((peso / Math.pow(alturaMetros, 2)) * 100) / 100;
    haycock = Math.round((Math.pow(peso, 0.5378) * Math.pow(altura, 0.3974) * 0.024265) * 100) / 100;
    mosteller = Math.round((Math.pow((peso*altura), 0.5) / 60) * 100) / 100;
    var pesoKG = peso * 1000;
    //boyd = Math.round((Math.pow(pesoKG, (0.7285-0.0188 * Math.log(pesoKG))) * Math.pow(altura, 0.3)*0.0003207) * 100) / 100;
    // Peso ^(0.7285-0.0188 log peso)*Altura^(0.3)*0.0003207
    boyd = Math.round((0.0003207 * Math.pow(altura, 0.3) * Math.pow(pesoKG, (0.7285 - 0.0188 * Math.log(pesoKG) / Math.LN10))) * 100) / 100;
    //  3.207 x P(0.7825 – 0.01188 Log P) x T0.3
  }
  Session.set('imc', imc);
  Session.set('mosteller', mosteller);
  Session.set('boyd', boyd);
  Session.set('haycock', haycock);

  return imc;
}
