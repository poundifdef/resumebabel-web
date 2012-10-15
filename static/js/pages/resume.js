$(document).ready(function(){
    
    $("button.addEducation").click(function() {
        addEducation();
        return false;
    });

    $("button.addExperience").click(function() {
        addExperience();
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

function cleanUndefined(item){
    return (typeof item === "undefined") ? "" : item;
}

function loadObjective(resumeObject){
    $("div.objective textarea").val(cleanUndefined(resumeObject.objective));
}

function loadContact(resumeObject){
    var nameToLoad = cleanUndefined(resumeObject.contact.name);
    $("#contactForm div.name input").val(nameToLoad);

    var emailToLoad = cleanUndefined(resumeObject.contact.email);
    $("#contactForm div.email input").val(emailToLoad);

    var phoneToLoad = cleanUndefined(resumeObject.contact.phone);
    $("#contactForm div.phone input").val(phoneToLoad);

    var locationToLoad = cleanUndefined(resumeObject.contact.location);
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
    if(educationObject){        
        newEducationForm.find('div.name input').val(cleanUndefined(educationObject.name));
        newEducationForm.find('div.date input').val(cleanUndefined(educationObject.date));
        newEducationForm.find('div.degree input').val(cleanUndefined(educationObject.degree));
        newEducationForm.find('div.description textarea').val(cleanUndefined(educationObject.description));
    }
    $("#educationForms").append(newEducationForm);
}

function addExperience(experienceObject, experienceType){
    var newExperienceForm = experienceTemplate.clone();
    if(experienceObject && experienceType){        
        newExperienceForm.find('div.type select').val(cleanUndefined(experienceType));
        newExperienceForm.find('div.name input').val(cleanUndefined(experienceObject.name));
        newExperienceForm.find('div.location input').val(cleanUndefined(experienceObject.location));
        newExperienceForm.find('div.title input').val(cleanUndefined(experienceObject.title));
        newExperienceForm.find('div.date input').val(cleanUndefined(experienceObject.date));
        newExperienceForm.find('div.description textarea').val(cleanUndefined(experienceObject.description));
    }
    $("#experienceForms").append(newExperienceForm);
}