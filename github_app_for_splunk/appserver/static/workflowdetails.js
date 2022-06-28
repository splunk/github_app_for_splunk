require([
    "underscore",
    "splunkjs/mvc",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/tableview",
    "splunkjs/mvc/simplexml/ready!"
], function(
   _,
   mvc,
   SearchManager,
   TableView
) {

    // Set up search managers
    var search2 = new SearchManager({
        id: "workflow_details",
        preview: true,
        cache: true,
        search: mvc.tokenSafe("`github_webhooks` eventtype=\"GitHub::Workflow\" \"workflow_job.run_id\"=$workflow_id$| fields * | eval queued=if(action==\"queued\",_time,null), started=if(action==\"in_progress\",_time,null), completed=if(action==\"completed\",_time,null) | stats latest(workflow_job.conclusion) as status, latest(workflow_job.name) as Name, latest(queued) as queued, latest(started) as started, latest(completed) as completed by workflow_job.id | eval queueTime=toString(round(started-queued),\"Duration\"), runTime=toString(round(completed-started),\"Duration\"), totalTime=toString(round(completed-queued),\"Duration\"), status=if(status==\"null\",\"in_progress\",status) | rename workflow_job.id AS JobID | fields status, Name, JobID, queueTime, runTime, totalTime"),
        earliest_time: mvc.tokenSafe("timeTkn.earliest$"),
        latest_time: mvc.tokenSafe("timeTkn.latest$")
    });

    // Create a table for a custom row expander
    var mycustomrowtable = new TableView({
        id: "table-customrow",
        managerid: "workflow_details",
        drilldown: "none",
        drilldownRedirect: false,
        el: $("#table-customrow")
    });

    // Define icons for the custom table cell
    var ICONS = {
        failure: "error",
        in_progress: "question-circle",
        success: "check-circle"
    };

    // Use the BaseCellRenderer class to create a custom table cell renderer
    var CustomCellRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cellData) {
            // This method returns "true" for the "range" field
            return cellData.field === "status";
        },

        // This render function only works when canRender returns "true"
        render: function($td, cellData) {
            console.log("cellData: ", cellData);

            var icon = "question";
            if(ICONS.hasOwnProperty(cellData.value)) {
                icon = ICONS[cellData.value];
            }
            $td.addClass("icon").html(_.template('<i class="icon-<%-icon%> <%- status %>" title="<%- status %>"></i>', {
                icon: icon,
                status: cellData.value
            }));
        }
    });

    // Use the BasicRowRenderer class to create a custom table row renderer
    var CustomRowRenderer = TableView.BaseRowExpansionRenderer.extend({
        canRender: function(rowData) {
            console.log("RowData: ", rowData);
            return true;
        },

        initialize: function(args){
             this._searchManager = new SearchManager({
                 id: 'details-search-manager',
                 preview: false
             });
             this._TableView = new TableView({
                 id: 'ResultsTable',
                 managerid: 'details-search-manager',
                 drilldown: "all",
                 drilldownRedirect: true
            });
        },

        render: function($container, rowData) {
        // Print the rowData object to the console
        // console.log("RowData: ", rowData);

        var repoNameCell = _(rowData.cells).find(function (cell) {
            return cell.field === 'Repository Name';
        });


        var workflowName = _(rowData.cells).find(function (cell) {
            return cell.field === 'Workflow Name';
        });

        var workflowIDCell = _(rowData.cells).find(function (cell) {
            return cell.field === 'Run ID';
        });

        this._searchManager.set({ search: '`github_webhooks` (workflow_run.id='+workflowIDCell.value+' OR workflow_job.run_id='+workflowIDCell.value+') | eval started=if(action=="requested", _time, null), completed=if(action=="completed", _time,null) | stats latest(workflow_run.conclusion) as Status, earliest(started) as Started, latest(completed) as Completed, latest(workflow_run.head_branch) as Branch, latest(workflow_run.event) as Trigger | eval Duration=tostring(Completed-Started, "Duration") | fields Status, Duration, Branch, Trigger | eval Details="Click here for Workflow Details" | transpose|rename column AS Details| rename "row 1" AS values'});
                // $container is the jquery object where we can put out content.
                // In this case we will render our chart and add it to the $container
                $container.append(this._TableView.render().el);
        }
    });

    // Create an instance of the custom cell renderer,
    // add it to the table, and render the table
    var myCellRenderer = new CustomCellRenderer();
    mycustomrowtable.addCellRenderer(myCellRenderer);
    mycustomrowtable.render();

    // Create an instance of the custom row renderer,
    // add it to the table, and render the table
    var myRowRenderer = new CustomRowRenderer();
    mycustomrowtable.render();


});
