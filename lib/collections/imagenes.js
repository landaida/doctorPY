var imageStore = new FS.Store.GridFS("imagenes",{
  transformWrite: resizeImageStream({
    width: 64,
    height: 64,
    format: 'image/jpeg',
    quality: 50
  })
});

Imagenes = new FS.Collection("imagenes", {
  stores: [imageStore]
});


Imagenes.deny({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  },
  download: function() {
    return false;
  }
});

Imagenes.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});
