Template.archivos.onCreated(function() {
  Session.set('isMoreArchivo', true);
  Session.set('foto', '../img/user_profile_photo.png');
});

Template.archivos.onRendered(function(){
  $('#archivo').cropper({
    aspectRatio: 16 / 9,
    autoCropArea: 0.65,
    strict: true,
    guides: true,
    highlight: true,
    dragCrop: true,
    cropBoxMovable: true,
    cropBoxResizable: true
  });

});

Template.archivos.helpers({
  archivos: function(){
    return  Session.get('archivos');
  },
  current: function(){
    return Session.get('current');
  },
  isMore: function(){
    return Session.get('isMoreArchivo') == true ? '' : 'disabled';
  },
  foto: function(){
    return Session.get('foto');
  }
})

Template.archivos.events({
  'click .paginationList': function (e) {
    e.preventDefault();
    Session.set('current', this);

    if(this){
      var file = new FS.File(this);
      Session.set('foto', file.url());
    }

  },
  'click .paginationListNext': function (e) {
    e.preventDefault();
    var t = Template.instance().view.template;
    var last = Session.get('last');
    var lista = Archivos.find({"metadata.pacienteId": this._id, "metadata.id": {$lt: last}}, {limit: 2}).fetch();
    if(lista.length > 0){
      var last = lista.slice(-1)[0].id;
      Session.set('lastArchivo', last);
      lista = t.__helpers.get('archivos').call().concat(lista);
      Session.set('archivos', lista);
      var first_id = Archivos.findOne({"metadata.pacienteId": this._id},{sort:{"metadata.id":1}}).id;
      if(first_id == last)
        Session.set('isMoreArchivo', false);
    }
  },
  'click #btnNew': function(e){
    e.preventDefault();
    $('#archivo-up').click();
  },
  'change #archivo-up' : function(event, template) {
    event.preventDefault();
    var file = event.target.files[0];

    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(file);
    $('#archivo').attr('src', imageUrl);
    var me = this;
    FS.Utility.eachFile(event, function(file) {
      var attributes = {'file': file, 'pacienteId': me._id}

      var last = Archivos.find({"metadata.pacienteId": attributes.pacienteId},{sort:{"metadata.id":-1}}).fetch();
      var currentId = 0;
      if(last.length > 0)
        currentId = last.id;
      attributes.id = currentId + 1;

      var user = Meteor.user();
      var file = new FS.File(attributes.file);
      file.metadata = {
        pacienteId: attributes.pacienteId,
        userId: user._id,
        author: user.username,
        id: attributes.id,
        submitted: new Date()
      };

      Archivos.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          //var userId = Meteor.userId();
        }
      });

      // Meteor.call('archivoInsert', archivo, function(error, id) {
      //
      //   if (error) {
      //     throwError(error.reason);
      //   } else {
      //
      //   }
      // });
    });
  }
})
