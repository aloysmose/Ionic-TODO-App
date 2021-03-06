angular.module('starter.controllers', [])

 //Catagories factory manages saving and loading projects in localstorage
.factory('Catagories', function() {
  return {
    all: function() {
      var catagoryString = window.localStorage['catagories'];
      //window.localStorage.clear();  //To clear local storage
      if(catagoryString) {
        return angular.fromJson(catagoryString);
      }
      return [];
    },
    save: function(catagories) {
      window.localStorage['catagories'] = angular.toJson(catagories);
    },
    newCatagory: function(catagoryTitle) {
      // Add a new catagory
      return {
        title: catagoryTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveCatagory']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveCatagory'] = index;
    }
  }
})

.controller('tabCtrl', function($scope, $timeout, $ionicModal, Catagories, $ionicSideMenuDelegate, $ionicPopup) { //using modal for hide() & show() 
  // A utility function for creating a new catagory
  // with the given catagoryTitle
  var createCatagory = function(catagoryTitle) {
    var newCatagory = Catagories.newCatagory(catagoryTitle);
    $scope.catagories.push(newCatagory);
    Catagories.save($scope.catagories);
    $scope.selectCatagory(newCatagory, $scope.catagories.length-1);
  }

  // Load or initialize catagories
  $scope.catagories = Catagories.all();

  // Get the last active, or the first catagory
  $scope.activeCatagory = $scope.catagories[Catagories.getLastActiveIndex()];

  // Called to create a new catagory
  $scope.newCatagory = function() {
    var catagoryTitle = prompt('Catagory name');
    if(catagoryTitle) {
      createCatagory(catagoryTitle);
    }
  };

  // Called to select the given catagory
  $scope.selectCatagory = function(catagory, index) {
    $scope.activeCatagory = catagory;
    Catagories.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
    
     // Create the modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeCatagory || !task) {
      return;
    }
    $scope.activeCatagory.tasks.push({
      title: task.title, added: new Date()
    });
    $scope.taskModal.hide();

    // Saves all the catagories
    Catagories.save($scope.catagories);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleCatagories = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
    
    //Need to refresh for it to take effect
    $scope.deleteAll = function(){ 
        var confirmDelete = $ionicPopup.confirm({
           title: 'Delete all catagories',
           template: 'Are you sure?'
        });
        
        confirmDelete.then(function(res){
            if(res){
                window.localStorage.clear('catagories'); //Wipes catagories from localstorage
            } else {
                console.log('Not deleteing catagories');
            }
        });
    };
    
  //Delete single task
  $scope.deleteTask = function(index){ 
      var confirmDeleteTask = $ionicPopup.confirm({
          title: 'Delete this task',
          template:'Are you sure?'                                          
      });
      
      confirmDeleteTask.then(function(res){
          if(res){
              $scope.task.splice(index, 1);
             //console.log('delete');
             } else {
             console.log('Not deleteing task');
             }
      });
   };
    
  // Prompt user to create first catagory if localstorage
  // is empty, using $timeout to delay function and allow
  // everything else to initialise first
  $timeout(function() {
    if($scope.catagories.length == 0) {
      while(true) {
        var catagoryTitle = prompt('Your first catagory title:');
        if(catagoryTitle) {
          createCatagory(catagoryTitle);
          break;
        }
      }
    }
  });

});
