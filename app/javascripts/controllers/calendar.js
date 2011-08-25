(function () {
  var CalendarController = { routes: { '!/calendar'     : 'index' } }

    , Views = Teambox.Views
    , collections = Teambox.collections;

  CalendarController.index = function () {
    jQuery('#view_title').html("Calendar for all tasks");
    jQuery('#content').html("<div id='calendar' style='background: rgba(255, 255, 255, 0.8)'></div>");
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var tasks_with_date = Teambox.collections.tasks.select( function(t) { return t.get('due_on') } );
    var events = _(tasks_with_date).map( function(t) {
      return { title: t.get('name')
             , start: new Date(t.get('due_on'))
             , url: "#!/undefined_for_now" };
    });

    jQuery('#calendar').fullCalendar({
        header: { left: 'title'
                , center: 'prev,today,next'
                , right: 'month,agendaWeek,agendaDay' }
      , editable: true
      , events: [
                { title: 'All Day Event'
                , start: new Date(y, m, 1) }
              , { title: 'Long Event'
                , start: new Date(y, m, d-5)
                , end: new Date(y, m, d-2) }
              , { id: 999
                , title: 'Repeating Event'
                , start: new Date(y, m, d-3, 16, 0)
                , allDay: false }
              ].concat(events)
    });

  };

/*
  TasksController.all_tasks = function () {
    var view = new Views.AllTasks({collection: collections.tasks})
      , filters = new Views.Filters({ task_list: view
                                    , filters: { name: null
                                               , assigned: null
                                               , due_date: null
                                               , status: null }});

    Views.Sidebar.highlightSidebar('all_tasks_link');

    $('content')
      .update(view.render().el)
      .insert({top: filters.render().el});
    $('view_title').update(view.title);
  };

*/

  //exports
  Teambox.Controllers.CalendarController = Teambox.Controllers.BaseController.extend(CalendarController);
}());

