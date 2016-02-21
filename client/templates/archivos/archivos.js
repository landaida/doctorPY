Template.archivos.onCreated(function() {
  Session.set('isMoreArchivo', true);
  Session.set('foto', '');
});

Template.archivos.onRendered(function(){
  $('#archivo').cropper({
    dragMode:'move',
    minContainerWidth: '100%',
    minCanvasWidth: '100%'
  });
  setTimeout(function(){
    $('#archivo').cropper('clear')
    $('#archivo').cropper('clear')
  },50);
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
      hiddenCrop(file.url());
    }

  },
  'click .paginationListNext': function (e) {
    e.preventDefault();
    var t = Template.instance().view.template;
    var last = Session.get('lastArchivo');
    var lista = Archivos.find({"metadata.pacienteId": this._id, "metadata.id": {$lt: last}}, {limit: PAGINATION_ARCHIVO_NEXT, sort:{'metadata.id':-1}}).fetch();
    if(lista.length > 0){
      var last = lista.slice(-1)[0].metadata.id;
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
    hiddenCrop(imageUrl);
    var me = this;
    FS.Utility.eachFile(event, function(file) {
      var attributes = {'file': file, 'pacienteId': me._id}
      var last = Archivos.find({"metadata.pacienteId": attributes.pacienteId},{sort:{"metadata.id":-1}, limit: PAGINATION_ARCHIVO_NEXT}).fetch();
      var currentId = 0;
      if(last.length > 0)
        currentId = last[0].metadata.id;
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
    });
  },
  'click #btnRotateLeft': function(e){
    e.preventDefault();
    $('#archivo').cropper('rotate', '-90')
  },
  'click #btnRotateRight': function(e){
    e.preventDefault();
    $('#archivo').cropper('rotate', '90')
  }
})

hiddenCrop = function(img){
  $('#archivo').attr('src', img);
  $('#archivo').cropper('replace', img)
  setTimeout(function(){
    $('#archivo').cropper('clear')
  },50);
}
