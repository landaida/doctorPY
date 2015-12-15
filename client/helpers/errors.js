// Local (client-only) collection
//si pasamos null no se crea ninguna collection en el db server
Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};
