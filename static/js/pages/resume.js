var RESUMEIDNUM;
function loadResume(resumeId){
    RESUMEIDNUM = resumeId;
}

function ResumeCtrl($scope, $http) {
    $http.get('/resumes/' + RESUMEIDNUM + '/resume.json').success(function(data) {
        $scope.resume = data;
        $scope.objective = $scope.resume.objective;
        $scope.contact = $scope.resume.contact;
        $scope.education = $scope.resume.education;
        $scope.experiences = $scope.resume.experiences;
    });

    $scope.addEducation = function() {
        $scope.education.push({
          name: '',
          date: '',
          degree: '',
          description: ''
        });                 
        $scope.saveResume();
    }

    $scope.removeEducation = function( ed ) {
        bootbox.animate(false);
        bootbox.dialog("Are you sure you want to remove this education?",
            [
            {
                "label" : "Remove Education",
                "class" : "btn-danger",
                "callback": function() {
                    $scope.education.splice($scope.education.indexOf(ed), 1);
                    $scope.$apply();
                    $scope.saveResume();
                }
            },
            {
                "label" : "Cancel",
                "class" : "btn"
            }
            ]);
    };

    $scope.addExperienceType = function( ) {      
        bootbox.animate(false);  
        return bootbox.prompt("Enter a new experience type name:", "Cancel", "OK", function(result) {
            if (result) {
                $scope.experiences[String(result)] = [];
                $scope.$apply();                 
                $scope.saveResume();
            }        
        });
    };

    $scope.removeExperienceType = function( type ) {
        bootbox.animate(false);
        bootbox.dialog("Are you sure you want to remove this experience type?",
            [
            {
                "label" : "Remove Experience Type",
                "class" : "btn-danger",
                "callback": function() {
                    delete $scope.experiences[type];
                    $scope.$apply();                    
                    $scope.saveResume();
                }
            },
            {
                "label" : "Cancel",
                "class" : "btn"
            }
            ]);
    };

    $scope.addExperience = function( type ) {
        $scope.experiences[type].push({
          name: '',
          location: '',
          title: '',
          date: '',
          description: ''
        });
        $scope.saveResume();
    }

    $scope.removeExperience = function( type, experience ) {
        bootbox.animate(false);
        bootbox.dialog("Are you sure you want to remove this experience?",
            [
            {
                "label" : "Remove Experience",
                "class" : "btn-danger",
                "callback": function() {
                    $scope.experiences[type].splice($scope.experiences[type].indexOf(experience), 1);
                    $scope.$apply();                                  
                    $scope.saveResume();
                }
            },
            {
                "label" : "Cancel",
                "class" : "btn"
            }
            ]);
    };

    $scope.saveResume = function() {
        $scope.resume.objective = $scope.objective;
        $scope.resume.contact = $scope.contact;
        $scope.resume.education = $scope.education;
        $scope.resume.experiences = $scope.experiences;

        var resumeJSON = angular.toJson($scope.resume);
        $http({
            method: 'POST',
            url: '/resumes/' + RESUMEIDNUM + '/?api=1',
            data: {resume: resumeJSON},
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    }    

    var transform = function(data){
        return $.param(data);
    }
}