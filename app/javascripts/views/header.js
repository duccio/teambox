(function() {
  var Header = {};

  Header.events = {
      'click .conv .button_img' : 'showQuickConversation'
    , 'click .task .button_img' : 'showQuickTask'
  };

  Header.initialize = function(options) {
    _.bindAll(this, 'render', 'showQuickConversation');

    // Insert search box
    this.search_view = new Teambox.Views.Search();
    $$('.header h1')[0].insert({after: this.search_view.render().el}); 

  };

  Header.render = function() {
    return this;
  };

  // Show or hide quick conversation pane
  Header.showQuickConversation = function(event) {
    event.preventDefault();
    if (!this.quick_conv || !this.quick_conv.exists) {
      this.quick_conv = new Teambox.Views.QuickConversation();
      this.el.down('.quick_add_btn.conv').insert({ bottom: this.quick_conv.render().el });
    }
  };

  // Show or hide quick task pane
  Header.showQuickTask = function(event) {
    event.preventDefault();
    console.log('Quick Task');
  };

  // exports
  Teambox.Views.Header = Backbone.View.extend(Header);
}());
