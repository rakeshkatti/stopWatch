  // stopwatch is MODULE
  var stopwatch = angular.module("stopwatch",[]); 

 // define appController
 stopwatch.controller("appController", function controller($scope, $timeout) { 
  $scope.laps = [];
  $scope.splits = [];  
  $scope.identity = angular.identity;
  // Object Initialization
  init(); 
  function init() {
    $scope.timer = {
      hours : 0,
      minutes : 0,
      seconds : 0,
      ms : 0
    }; 
  };
  var interval, startTime = 0, timeElapsed, pause = -999,splitindex = 0 ,lapindex = 0;
  var time = {};
  $("#start").on("click",function(){
    $("#start,#stop").toggle();
    $("#lap,#split").removeClass("disabled");
    $("#reset").addClass("disabled");
  })
  // Start Function
  $scope.startTimer = function() {
    // Check if it is running for the first time
    if(!($scope.timer.ms || $scope.timer.seconds || $scope.timer.ms)) {               
      startTime = Date.now();                  //Assign startTime the current date and time in Milliseconds 
    } else if (pause) {                     // Check if the stopwatch is paused
      startTime = Date.now() + startTime - pause; // If it is paused subtract the pause time from current time and add the startTime
    } else {
      return; // Else no action to be taken when Start is pressed
    };
    pause = 0;  // Reset pause to zero as the stopwatch is not paused now

    // Repeat the following steps for every Millisecond
    interval = setInterval(function(){
      $scope.$apply(function() {
        timeElapsed = Date.now() - startTime; // store current time - startTime in a variable timeElapsed

        //Time Elapsed in Milliseconds, Seconds, Minutes and Hours
        // Binding the timer object with $scope
        $scope.timer = {
          ms : timeElapsed%1000, 
          seconds : (Math.floor(timeElapsed/1000))%60, 
          minutes : 0 ? (this.seconds < 59) : (Math.floor((timeElapsed/1000)/60))%60,
          hours : 0 ? (this.minutes < 59) : (Math.floor(((timeElapsed/1000)/60)/60))%60
        };
      });
    }, 1); 
  }; 
  //Stop Function
  $scope.stopTimer = function() {
    $("#start,#stop").toggle();
    $("#reset").removeClass("disabled");
    $("#lap,#split").addClass("disabled");
    if ($scope.splits.length > 0) { // Check if there is already a split timer
      time = {
        splitindex : splitindex++,
        hours : $scope.timer.hours,
        minutes : $scope.timer.minutes,
        seconds : $scope.timer.seconds,
        ms : $scope.timer.ms,
      }; 
      $scope.splits.push(time);
      //$scope.splits.reverse();
    }
    if ($scope.laps.length > 0) { // Check if there is already a lap timer
      var lap = [];
      if ($scope.splits.length > 0) {
        for (var i = 0; i < $scope.splits.length; i++) {
          lap.push($scope.splits[i]);
        };
      }
      $scope.splits = [];
      time = {
        splitindex : splitindex++,
        hours : $scope.timer.hours,
        minutes : $scope.timer.minutes,
        seconds : $scope.timer.seconds,
        ms : $scope.timer.ms,
      }; 
      lap.push(time);
      $scope.laps.push(lap);
    }
    clearInterval(interval);  // Stop the iterating setInterval function
    pause = Date.now();   // Note the pause time
  };

  //Reset Timer Function
  $scope.resetTimer = function() {
    if(pause) { // Reset only when it is Stopped
      $scope.laps = [];
      $scope.splits = [];
      init(); // Call the initialization function
    };
  };

  //Lap Timer Function
  $scope.lapTimer = function() {
    if(pause === 0) {
    var lap = [];
    if ($scope.splits.length > 0) {
      for (var i = 0; i < $scope.splits.length; i++) {
        lap.push($scope.splits[i]);
      };
    }
    $scope.splits = [];
    time = {
      lapindex : splitindex++,
      hours : $scope.timer.hours,
      minutes : $scope.timer.minutes,
      seconds : $scope.timer.seconds,
      ms : $scope.timer.ms,
    }; 
    lap.push(time);
    $scope.laps.push(lap);
    console.log($scope.laps);
    clearInterval(interval); // Stop the iterating setInterval function
    init(); // Call the initialization function
    $scope.startTimer(); // Start the timer
  }
  }; 

  //Split Timer Function
  $scope.splitTimer = function() {
    if(pause === 0) {
      time = {
        splitindex : splitindex++,
        hours : $scope.timer.hours,
        minutes : $scope.timer.minutes,
        seconds : $scope.timer.seconds,
        ms : $scope.timer.ms,
      }; 
      $scope.splits.push(time);
      console.log($scope.splits);
      // $scope.splits.push($scope.timer.minutes+":"+$scope.timer.seconds+":"+$scope.timer.ms);
      //console.log("Splits :"+$scope.splits);
    };
  }; 
});
  stopwatch.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field]);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  });


