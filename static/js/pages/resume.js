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
        saveResume(RESUMEIDNUM);
    });    
});

var resume = new Object();
var RESUMEIDNUM;
var educationTemplate = $('#educationForms .educationForm:first').clone();
var experienceTemplate = $('#experienceForms .experienceForm:first').clone();
var expTypeTemplate = $('#experienceTypes .experienceType:first').clone();

function cleanUndefined(item){
    return (typeof item === "undefined") ? "" : item;
}

function loadResume(resumeId){
    RESUMEIDNUM = resumeId;
    $.get("/resumes/" + String(resumeId) + "/resume.json", function(data){
        resume = (typeof data == "string") ? jQuery.parseJSON(data) : data;
        loadObjective(resume);
        loadContact(resume);
        loadEducation(resume);
        loadExperiences(resume);
    });
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

function loadExperiences(resumeObject){
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

function addExpType(experienceType){
    if(experienceType){        
        var newExpTypeForm = expTypeTemplate.clone();
        newExpTypeForm.find('.experienceForm').remove();
        newExpTypeForm.find('.typeName').text(experienceType);
        $("#experienceTypes").append(newExpTypeForm);
    }
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

function saveResume(resumeId){
    saveObjective();
    saveContact();    
    saveEducation();
    saveExperiences();

    $.post("/resumes/" + String(resumeId) + "/?api=1", resume, function(data){
        var box = bootbox.alert("Resume Saved");
        setTimeout(function() {
            box.modal('hide');
        }, 2000);
    });
}

function saveObjective(){
    resume.objective = cleanUndefined($("div.objective textarea").val());
}

function saveContact(){
    var formName = $("#contactForm div.name input").val();
    resume.contact.name = cleanUndefined(formName);

    var formEmail = $("#contactForm div.email input").val();
    resume.contact.email = cleanUndefined(formEmail);

    var formPhone = $("#contactForm div.phone input").val();
    resume.contact.phone = cleanUndefined(formPhone);

    var formLocation = $("#contactForm div.location input").val();
    resume.contact.location = cleanUndefined(formLocation);
}

function saveEducation(){
    var edList = [];
    $("#educationForms .educationForm").each(function(index){
        var ed = new Object();

        var formName = $(this).find("div.name input").val();
        ed.name = cleanUndefined(formName);

        var formDate = $(this).find("div.date input").val();
        ed.date = cleanUndefined(formDate);

        var formDegree = $(this).find("div.degree input").val();
        ed.degree = cleanUndefined(formDegree);

        var formDescription = $(this).find("div.description textarea").val();
        ed.description = cleanUndefined(formDescription);

        edList.push(ed);
    });

    resume.education = edList;
}

function saveExperiences(){
    var exTypeList = [];

    $("#experienceTypes .experienceType").each(function(index){
        var exList = [];
        var exTypeName = $(this).find('.typeName').text();

        $(this).find("#experienceForms .experienceForm").each(function(index){
            var ex = new Object();

            var formName = $(this).find("div.name input").val();
            ex.name = cleanUndefined(formName);

            var formDate = $(this).find("div.date input").val();
            ex.date = cleanUndefined(formDate);

            var formLocation = $(this).find("div.location input").val();
            ex.location = cleanUndefined(formLocation);

            var formTitle = $(this).find("div.title input").val();
            ex.title = cleanUndefined(formTitle);

            var formDescription = $(this).find("div.description textarea").val();
            ex.description = cleanUndefined(formDescription);

            exList.push(ex);
        });

        exTypeList[exTypeName] = exList;
    });

    resume.experiences = exTypeList;
}