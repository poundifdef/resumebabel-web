//wait for the entire document to load before loading jquery elements
$(document).ready(function(){
    //upon submitting a list

    var educationTemplate = $('#educationForms .educationForm:first').clone();
    $("#addEducation").click(function() {
            var newEducationForm = educationTemplate.clone();
            $("#educationForms").append(newEducationForm);
            return false;
    });
});