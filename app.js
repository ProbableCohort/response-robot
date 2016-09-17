(function(angular) {

	angular.module('RobotApp', []);
  
  angular.module('RobotApp')
  .controller('RobotController', RobotController);
  
  RobotController.$inject = [ '$filter' ]
  
  function RobotController($filter) {
  
  	var vm = this;
    var root = {
    	say : say,
      getNumberSuffix : getNumberSuffix,
      shouldRobotRespond : shouldRobotRespond,
      getResponse : getResponse
    }
    angular.extend(vm, root);
    
    //\///////////////
    
    vm.history = [];
    vm.responses = [];
    vm.sentResponses = [];

    function initialize() {
    }

    function say(input) {
    	if (!input)
      	return;
      var historyEntry = {
      	id : vm.history.length + 1,
        value : input,
        count : 1
      }
      var previousEntry = $filter('filter')(vm.history, { value : input }, true)[0];
      if (previousEntry) {
      	previousEntry.count++;
        historyEntry = previousEntry;
      	vm.response = null;
      } else {
        vm.history.push(historyEntry);
        logAsResponse(historyEntry);
      }
      vm.speech = historyEntry;
    }
    
    var bannedWords = [ 'my' ];
    
    function checkForBannedWords(input) {
    	var badWordCount = 0;
    	angular.forEach(bannedWords, function(word) {
      	var regexWordBoundary = "\\b";
      	var regex = new RegExp(regexWordBoundary + word + regexWordBoundary, "i");
      	if (regex.test(input)) {
        	console.log(input + " contained the word: " + word, "and was therefore not added to the robot's responses.")
        	badWordCount++
        }
      })
      return badWordCount > 0;
    }
    
    function logAsResponse(input) {
    	var probability = Math.random();
      if (checkForBannedWords(input.value))
      	return false;
      if (Math.floor(probability * 10) > 5) {
        shouldRobotRespond() ? getResponse() : vm.response = null;
      	vm.responses.push(angular.copy(input));
      } else {
      	vm.response = null;
      }
    }
    
    var totalTimesResponded = 0;
    
    function shouldRobotRespond() {
    	var availableResponseRatio = vm.responses.length / vm.history.length,
      		expectedResponseRatio = 2/3;
    	if (!vm.responses.length || availableResponseRatio > expectedResponseRatio)
      	return false;
    	var responseRatio = totalTimesResponded / vm.responses.length;
      if (responseRatio > expectedResponseRatio)
      	return false;
       
      return true;
    }
    
    function getResponse() {
    	totalTimesResponded++;
    	vm.response = vm.responses[Math.floor(Math.random() * vm.responses.length)];
      vm.response.totalTimesResponded = totalTimesResponded;
      var previousResponse = $filter('filter')(vm.sentResponses, { id : vm.response.id})[0];
      if (!previousResponse) {
      	vm.sentResponses.push(angular.copy(vm.response));
      } else {
      	previousResponse.count++;
      }
    }
    
    function getNumberSuffix(input) {
    	var num = getLastDigits(input, 2);
      if (num > 20) {
      	num = getLastDigits(num, 1);
      }
      var response = "";
      switch(num) {
      	case 1:
        	response = "st";
          break;
        case 2:
        	response = "nd";
          break;
        case 3:
          response = "rd";
          break;
        case 11:
        case 12:
        case 13:
        default:
        	response = "th"
          break;
      }
      return response;
    }
    
    function getLastDigits(input, x) {
    	var factor = Math.pow(10, x);
    	return Math.round(((input / factor - Math.floor(input / factor)) * factor))
    }

    initialize();
    
    //\///////////////
  
  }
  
})(angular);
