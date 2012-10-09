// TODO: pass name of resume into dialog. somehow.
$("a.delete_resume").click(function(e) {
    e.preventDefault();
    bootbox.dialog("Are you sure you want to delete this resume?",
    [
        {
            "label" : "Delete Resume",
            "class" : "btn-primary",
            "callback": function() {
                console.log("deleted");
            }
        },
        {
            "label" : "Cancel",
            "class" : "btn-danger",
            "callback": function() {
                console.log("cancel");
            }
        }
    ],
    {
        "animate": false
    });
});
