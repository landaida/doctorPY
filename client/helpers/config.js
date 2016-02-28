Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
  forceEmailLowercase: true,
  extraSignupFields: [{
    fieldName: 'ci',
    fieldLabel: 'Cedúla de identidad',
    inputType: 'number',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Complete Cedúla de identidad.");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'nombre',
    fieldLabel: 'Nombre completo',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Complete su nombre completo.");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'rol',
    fieldLabel: 'Rol o Cargo',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Complete su rol o cargo en el hospital.");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'registro',
    fieldLabel: 'Registro profesional',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Complete su registro profesinal, sino lo posee use 0000.");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'sexo',
    showFieldLabel: false, // If true, fieldLabel will be shown before radio group
    fieldLabel: 'Sexo',
    inputType: 'radio',
    radioLayout: 'vertical', // It can be 'inline' or 'vertical'
    data: [{ // Array of radio options, all properties are required
      id: 1, // id suffix of the radio element
      label: 'Masculino', // label for the radio element
      value: 'm', // value of the radio element, this will be saved.
      checked: 'checked'
    }, {
      id: 2,
      label: 'Female',
      value: 'f'
    }],
    visible: true
  }]
});
accountsUIBootstrap3.setLanguage('es');


FlashMessages.configure({
  autoHide: true,
  hideDelay: 10000,
  autoScroll: true
});


moment.locale('es')

numeral.language('es')
