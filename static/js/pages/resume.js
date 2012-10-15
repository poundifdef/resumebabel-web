$(document).ready(function(){
    
    $("button.addEducation").click(function() {
        var newEducationForm = educationTemplate.clone();
        $("#educationForms").append(newEducationForm);
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

function loadExperience(resumeObject){
    $('#experienceForms fieldset.experienceForm').remove();
    var proexperiences = resumeObject.experiences['Professional Experience'];
    for (var i = 0, ex; ex = proexperiences[i]; i++){
        addExperience(ex, 'Professional Experience');
    }

    var openexperiences = resumeObject.experiences['Open Source'];
    for (var i = 0, ex; ex = openexperiences[i]; i++){
        addExperience(ex, 'Open Source');
    }

    var resexperiences = resumeObject.experiences['Research and Projects'];
    for (var i = 0, ex; ex = resexperiences[i]; i++){
        addExperience(ex, 'Research and Projects');
    }

    var honexperiences = resumeObject.experiences['Awards and Honors'];
    for (var i = 0, ex; ex = honexperiences[i]; i++){
        addExperience(ex, 'Awards and Honors');
    }

    var tchexperiences = resumeObject.experiences['Teaching and Service'];
    for (var i = 0, ex; ex = tchexperiences[i]; i++){
        addExperience(ex, 'Teaching and Service');
    }

}

function loadResume(resumeId){
    $.get("/resumes/" + String(resumeId) + "/resume.json", function(data){
        resume = (typeof data == "string") ? jQuery.parseJSON(data) : data;
        loadObjective(resume);
        loadContact(resume);
        loadEducation(resume);
        loadExperience(resume);
    });
}

function addEducation(educationObject){
    var newEducationForm = educationTemplate.clone();
    newEducationForm.find('div.name input').val(educationObject.name);
    newEducationForm.find('div.date input').val(educationObject.date);
    newEducationForm.find('div.degree input').val(educationObject.degree);
    newEducationForm.find('div.description textarea').val(educationObject.description);
    $("#educationForms").append(newEducationForm);
}

function addExperience(experienceObject, experienceType){
    var newExperienceForm = experienceTemplate.clone();
    newExperienceForm.find('div.type select').val(experienceType);
    newExperienceForm.find('div.name input').val(experienceObject.name);
    newExperienceForm.find('div.location input').val(experienceObject.location);
    newExperienceForm.find('div.title input').val(experienceObject.title);
    newExperienceForm.find('div.date input').val(experienceObject.date);
    newExperienceForm.find('div.description textarea').val(experienceObject.description);
    $("#experienceForms").append(newExperienceForm);
}