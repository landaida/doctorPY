Meteor.methods({
  getServerTime: function () {
      var _time = moment(new Date).format('HH:mm:ss.SSS');
      return _time;
  },
  getServerDate: function () {
      return moment(new Date).format("YYYY-MM-DD");
  }
});
