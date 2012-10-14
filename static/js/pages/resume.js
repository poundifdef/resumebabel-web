//wait for the entire document to load before loading
$(document).ready(function(){
    
    $("button.addEducation").click(function() {
        addEducation();
        return false;
    });

    $("button.addExperience").click(function() {
        var newExperienceForm = experienceTemplate.clone();
        $("#experienceForms").append(newExperienceForm);
        return false;
    });

    $("button.saveResume").click(function(){
        resume.objective = $("div.objective textarea").val;

        var formName = $("#contactForm div.name input").first.val;
        resume.contact.name = (typeof formName === "undefined") ? "" : formName;

        var formEmail = $("#contactForm div.email input").first.val;
        resume.contact.email = (typeof formEmail === "undefined") ? "" : formEmail;

        var formPhone = $("#contactForm div.phone input").first.val;
        resume.contact.phone = (typeof formPhone === "undefined") ? "" : formPhone;

        var formLocation = $("#contactForm div.location input").first.val;
        resume.contact.location = (typeof formLocation === "undefined") ? "" : formLocation;

        return false;
    });    
});

var resume = new Object();
var resumeId;
var educationTemplate = $('#educationForms .educationForm:first').clone();
var experienceTemplate = $('#experienceForms .experienceForm:first').clone();

function loadObjective(resumeObject){
    var objectiveToLoad = String(resumeObject.objective);
    $("div.objective textarea").val(objectiveToLoad);
}

function loadContact(resumeObject){
    var nameToLoad = String(resumeObject.contact.name);
    $("#contactForm div.name input").val(nameToLoad);

    var emailToLoad = String(resumeObject.contact.email);
    $("#contactForm div.email input").val(emailToLoad);

    var phoneToLoad = String(resumeObject.contact.phone);
    $("#contactForm div.phone input").val(phoneToLoad);

    var locationToLoad = String(resumeObject.contact.location);
    $("#contactForm div.location input").val(locationToLoad);
}

function loadEducation(resumeObject){
    $('#educationForms fieldset.educationForm').remove();
    var educations = resumeObject.education;
    for (var i = 0, ed; ed = educations[i]; i++){
        addEducation(ed);
    }
}

function loadResume(resumeId){
    //$.get("/resumes/" + String(resumeId) + "/resume.json
    $.get("/resumes/" + String(resumeId) + "/?api=1", function(data){
        resume = (typeof data == "string") ? jQuery.parseJSON(data) : data;
        loadObjective(resume);
        loadContact(resume);
        loadEducation(resume);
    });
}

function addEducation(educationObject){
    var newEducationForm = educationTemplate.clone();
    // var nameloc = newEducationForm.find();
    // newEducationForm.find("div.name input").val(educationObject.name);
    $("#educationForms").append(newEducationForm);
}