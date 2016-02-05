
savePaciente = function(e, template) {
  console.log('savePaciente')
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

  var errors = validateCampos(paciente);
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


validateCampos = function(paciente) {
  var errors = {};
  errors.length = 0;

  for (var name in paciente) {
    if (name == 'telefono2' || name == 'telefono3') continue;
    if (!paciente[name] || (paciente[name] == NINGUNA && name == 'grupoSanguineo')) {
      errors[name] = "Por favor complete el campo.";
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
