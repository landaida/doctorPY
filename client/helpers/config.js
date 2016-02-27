Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
  forceEmailLowercase: true,
  extraSignupFields: [{
    fieldName: 'ci',
    fieldLabel: 'Cedúla de identidad',
    inputType: 'number',
    visible: true,
  },{
    fieldName: 'nombre',
    fieldLabel: 'Nombre completo',
    inputType: 'text',
    visible: true,
  }, {
    fieldName: 'rol',
    fieldLabel: 'Rol',
    inputType: 'select',
    showFieldLabel: false,
    empty: 'rol/cargo',
    class: 'form-control',
    data: [{
      id: 1,
      label: 'Doctor/a',
      value: 'doc'
    }, {
      id: 2,
      label: 'Enfermero/a',
      value: 'enf',
    }, {
      id: 3,
      label: 'Residente',
      value: 'res',
    }, {
      id: 4,
      label: 'Estudiante',
      value: 'est',
    }],
    visible: true
  }, {
    fieldName: 'registro',
    fieldLabel: 'Registro profesional',
    inputType: 'text',
    visible: true,
  }]
});
accountsUIBootstrap3.setLanguage('es');
moment.locale('es')

numeral.language('es')
