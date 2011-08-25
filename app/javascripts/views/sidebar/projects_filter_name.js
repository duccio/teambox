(function () {
  var ProjectsFilterName = {placeholder: 'Filter projects...'};

  ProjectsFilterName.initialize = function(options) {
    var el = $(this.el);
    jQuery(el).bind("click keyup", _.throttle(_.bind(ProjectsFilterName.filterProjects, this), 200));
  };

  ProjectsFilterName.filterProjects = function() {
    var el = jQuery(this.el);
    var has_value = (el.val() !== '' && el.val() !== this.placeholder);
    var projects = has_value ? 
      Teambox.helpers.projects.filterByAttribute("name", el.val()) :
      Teambox.collections.projects.models 
    var template = Teambox.modules.ViewCompiler('sidebar.project');
    var html = template({projects: _.invoke(projects, "toJSON")});
    jQuery(".projects_container").html(html);    
  };

  Teambox.Views.ProjectsFilterName = Backbone.View.extend(ProjectsFilterName);
}());
