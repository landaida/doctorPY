Template.consultaItem.helpers({
  submitted: function() {
    return moment(this.submitted).format('LLL');
  }
});
