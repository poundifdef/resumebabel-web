$(document).ready(function(){
    
    $("button.addEducation").click(function(e) {
        e.preventDefault();
        addEducation();
    });

    $("button.addExperience").live('click',function(e) {
        e.preventDefault();

        var expType = $(this).parent().parent().parent().find('.typeName').text();
        addExperience(expType);
    });

    $("button.addExpType").click(function(e) {
        e.preventDefault();
        bootbox.prompt("Type name", "Cancel", "OK", function(result) {
            if (result) {
                addExpType(result);
            }        
        });
    });

    $("button.saveResume").click(function(e){
        e.preventDefault();
        resume.objective = cleanUndefined($("div.objective textarea").val);

        var formName = $("#contactForm div.name input").first.val;
        resume.contact.name = cleanUndefined(formName);

        var formEmail = $("#contactForm div.email input").first.val;
        resume.contact.email = cleanUndefined(formEmail);

        var formPhone = $("#contactForm div.phone input").first.val;
        resume.contact.phone = cleanUndefined(formPhone);

        var formLocation = $("#contactForm div.location input").first.val;
        resume.contact.location = cleanUndefined(formLocation);
    });    
});

var resume = new Object();
var resumeId;
var educationTemplate = $('#educationForms .educationForm:first').clone();
var experienceTemplate = $('#experienceForms .experienceForm:first').clone();
var expTypeTemplate = $('#experienceTypes .experienceType:first').clone();

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
    $('#experienceTypes div.experienceType').remove();
    //$('#experienceForms fieldset.experienceForm').remove();

    var exs = resumeObject.experiences;

    for (var exname in exs){
        if(exs.hasOwnProperty(exname)){            
            var ex = exs[exname];
            for (var i = 0, e; e = ex[i];i++){
                addExperience(exname,e);
            }
        }
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

function addExperience(experienceType, experienceObject){
    var newExperienceForm = experienceTemplate.clone();
             
    if(experienceObject){   
        newExperienceForm.find('div.type select').val(cleanUndefined(experienceType));
        newExperienceForm.find('div.name input').val(cleanUndefined(experienceObject.name));
        newExperienceForm.find('div.location input').val(cleanUndefined(experienceObject.location));
        newExperienceForm.find('div.title input').val(cleanUndefined(experienceObject.title));
        newExperienceForm.find('div.date input').val(cleanUndefined(experienceObject.date));
        newExperienceForm.find('div.description textarea').val(cleanUndefined(experienceObject.description));
    }
    var expTypeNode = $("#experienceInfo .typeName:contains('" + experienceType + "')");

    if(!(expTypeNode.length)){
        addExpType(experienceType);
        expTypeNode = $("#experienceInfo .typeName:contains('" + experienceType + "')");
    }

    expTypeNode.parent().find("#experienceForms").append(newExperienceForm);
}

function addExpType(experienceType){
    if(experienceType){        
        var newExpTypeForm = expTypeTemplate.clone();
        newExpTypeForm.find('.experienceForm').remove();
        newExpTypeForm.find('.typeName').text(experienceType);
        $("#experienceTypes").append(newExpTypeForm);
    }
}