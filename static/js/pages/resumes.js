$("a.delete_resume").click(function(e) {
    e.preventDefault();
    bootbox.dialog("Are you sure you want to delete this resume?",
    [
        {
            "label" : "Delete Resume",
            "class" : "btn-primary",
            "callback": function() {
                // TODO: error handling?
                var resume_id = e.target.getAttribute("data-delete-id");
                $.ajax({
                    type: 'POST',
                    url: '/resumes/delete/' + resume_id + '/?api=1',
                    async: false
                })
                location.reload(true);
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
