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

$("a.clone_resume").click(function(e) {
    e.preventDefault();
    var resume_id = e.target.getAttribute("data-clone-id");
    $.ajax({
        type: 'POST',
        url: '/resumes/clone/' + resume_id + '/?api=1',
        async: false
    })
    location.reload(true);
});

$("a.default_resume").click(function(e) {
    e.preventDefault();
    var resume_id = e.target.getAttribute("data-edit-id");
    $.ajax({
        type: 'POST',
        url: '/resumes/edit/' + resume_id + '/?api=1',
        data: {'default': e.target.getAttribute("data-default-value")},
        async: false
    })
    location.reload(true);
});

$("a.rename_resume").click(function(e) {
    e.preventDefault();
    var resume_id = e.target.getAttribute("data-edit-id");

    bootbox.prompt("Enter a new name for this resume:", "Cancel", "OK", function(result) {
        if (result) {
            $.ajax({
                type: 'POST',
                url: '/resumes/edit/' + resume_id + '/?api=1',
                data: {'title': result},
                async: false
            })
            location.reload(true);
        }
    }, e.target.getAttribute("data-default-value"));
});

$("a.create_resume").click(function(e) {
    e.preventDefault();
    bootbox.prompt("Enter a new name for this resume:", "Cancel", "OK", function(result) {
        if (result) {
            $.ajax({
                type: 'POST',
                url: '/resumes/?api=1',
                data: {'title': result},
                async: false
            })
            location.reload(true);
        }
    });
});