Cie10 = new Mongo.Collection('cie10');
if (Meteor.isServer) {
  Cie10._ensureIndex({
    dec10: 1
  });
}
