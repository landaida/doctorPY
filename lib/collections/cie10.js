Cie10 = new Mongo.Collection('cie10');
if (Meteor.isServer) {
  Cie10._ensureIndex({
    id10: 1,
    dec10: 1
  });
}
