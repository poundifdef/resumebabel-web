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
    }

    $scope.removeEducation = function( ed ) {
        $scope.education.splice($scope.education.indexOf(ed), 1);
    };

    $scope.addExperienceType = function( ) {        
        $scope.experiences['HardcodedTestType'] = [];
    }

    $scope.removeExperienceType = function( type ) {
        delete $scope.experiences[type];
    };

    $scope.addExperience = function( type ) {
        $scope.experiences[type].push({
          name: '',
          location: '',
          title: '',
          date: '',
          description: ''
        });
    }

    $scope.removeExperience = function( type, experience ) {
        $scope.experiences[type].splice($scope.experiences[type].indexOf(experience), 1);
    };

    // $scope.saveResume = function() {
    //     $scope.resume.objective = $scope.objective;
    //     $scope.resume.contact = $scope.contact;
    //     $scope.resume.education = $scope.education;
    //     $scope.resume.experiences = $scope.experiences;

    //     $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //     $http.post('/resumes/' + RESUMEIDNUM + '/?api=1', { resume: JSON.stringify($scope.resume)}).success(function(data) {
            
    //     });
    // }
}