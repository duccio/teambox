(function() {

  var QuickConversation = {
      id: 'quick_conversation'
    , template: Teambox.modules.ViewCompiler('partials.quick_conversation')
  };

  QuickConversation.events = {
      'click .close'            : 'close'
    , 'submit form'             : 'submit'
    , 'change #select_project'  : 'updatePeople'
    , 'click .btn_lock'         : 'togglePrivacy'
    , 'click .btn_attach'       : 'toggleUpload'
  };

  QuickConversation.initialize =  function(options) {
    _.bindAll(this, 'render', 'close', 'updatePeople', 'togglePrivacy', 'toggleUpload', 'successSaving');

    // Element in the DOM? this will be false after this.remove()
    this.exists = true;

    this.to_id = 'to';
    this.privacy_id = 'privacy';
  };

  QuickConversation.render =  function() {
    var self = this;
    // Get basic info from all projects
    var projects = _.map(Teambox.collections.projects.models, function(project) {
      var p = {
        permalink: project.get('permalink')
      , name: project.get('name')
      , id: project.id
      };
      return p;
    });

    // Show element
    jQuery(this.el)
      .hide()
      .html(this.template({ projects: projects }))
      .fadeIn(100);

    // Use Chosen where needed (doesn't work without defer)
    _.defer(function() {
      jQuery('.chzn-select').chosen();
    });

    // Bind clicks outside the element
    var mouse_hover = false;
    jQuery(this.el).hover(function() {
      mouse_hover = true;
    }, function() {
      mouse_hover = false;
    });

    jQuery(document).bind('mouseup.quick_conv', function() {
      if(!mouse_hover) self.close();
    });

    return this;
  };

  // People array changes for every project
  QuickConversation.updatePeople = function(event) {
    // Get people in selected project
    var project_id = jQuery('#select_project').val();
    var people = Teambox.collections.projects.get(project_id).get('people');

    // Save references
    var $to_section = jQuery(this.el).find('.section.to');
    var $privacy_section = jQuery(this.el).find('.section.privacy');

    // Generate html for selects
    var selects = '';
    people.each( function(person) {
      var u = person.get('user');
      if (u.id !== Teambox.models.user.id) {
        selects += '<option value="' + u.id + '">'
                +   u.first_name + ' ' + u.last_name
                +  '</option>';
      }
    });

    // Update the DOM
    $to_section.find('#select_' + this.to_id)
      .html(selects)
      .trigger('liszt:updated');
    $privacy_section.find('#select_' + this.privacy_id)
      .html(selects)
      .trigger('liszt:updated');
  };

  // Remove element from the DOM
  QuickConversation.close = function() {
    jQuery(document).unbind('mouseup.quick_conv');
    jQuery(this.el).fadeOut(100, function() {this.remove()});
    this.exists = false;
  };

  // Save the element
  QuickConversation.submit =  function(event) {
    event.preventDefault();

    var data = _.deparam(this.el.down('form').serialize(), true);

    // Create a new conversation and save it
    var conv = new Teambox.Models.Conversation(data);
    conv.save({}, {
      success: this.successSaving
    , error: this.showError
    , url: conv.postUrl()
    });
    // Url not woeking properly
  };

  // TODO: Show error in the DOM
  QuickConversation.showError = function(res) {
    console.log(res);
  };

  // When success saving
  QuickConversation.successSaving = function(m, res) {
    Teambox.collections.conversations.add(res);
    this.close();
  };

  // Show or hide privacy input
  QuickConversation.togglePrivacy = function() {
    var $privacy_section = jQuery(this.el).find('.section.privacy')
      , self = this;

    if ($privacy_section.is(':visible')) {
      $privacy_section.hide();
    } else {
      $privacy_section.show();
    }
  };

  // TODO: Show or hide privacy input
  QuickConversation.toggleUpload = function() {
    console.log('ShowUpload');
  };

  // exports
  Teambox.Views.QuickConversation = Backbone.View.extend(QuickConversation);
}());
