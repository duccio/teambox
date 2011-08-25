(function() {
  var ProjectList = { filter_placeholder: 'Filter projects...' 
                    , filter_selector: '#filter_projects_by_name'};

  ProjectList.initialize = function(options) {
    jQuery(this.filter_selector).bind("click keyup", 
      _.throttle(_.bind(ProjectList.renderProjects, this), 200));

    Teambox.collections.projects.bind('all', _.bind(function(event, collection) {
      this.renderProjects();
    }, this));

    this.renderProjects();
  };

  ProjectList.renderProjects = function() {
    var projects = this.filterProjects();
    var locals = {projects: _.invoke(projects, "toJSON")};
    var html = Teambox.modules.ViewCompiler('sidebar.project')(locals);
    this.$(".projects_container").html(html);
  };

  ProjectList.filterProjects = function() {
    var s = jQuery(this.filter_selector).val();
    return (s !== '' && s !== this.filter_placeholder) ? 
      Teambox.helpers.projects.filterByStringAttribute("name", s) :
      Teambox.collections.projects.models;
  };

  Teambox.Views.ProjectList = Backbone.View.extend(ProjectList);
}());
