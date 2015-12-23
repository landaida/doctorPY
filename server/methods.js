Meteor.methods({
  getServerTime: function () {
      var _time = (new Date).toTimeString();
      return _time;
  },
  getServerDate: function () {
      var _time = new Date;
      return _time;
  }
});
