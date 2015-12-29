Meteor.methods({
  getServerTime: function () {
      var _time = (new Date).toTimeString();
      return _time;
  },
  getServerDate: function () {
      return moment(new Date).format("YYYY-MM-DD");
  }
});
