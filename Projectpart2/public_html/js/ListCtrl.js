app.controller('ListCtrl',['$scope','$rootScope','$timeout','$window','LocationService','HistoryService',function($scope,$rootScope,$timeout,$window,LocationService,HistoryService){
	var timeout = null;
	$scope.Characters = [];
	$scope.message = "";
	$scope.search = "";
	$scope.activeCardId = 0;
	$scope.slides = [{
	src: "/images/slides/slide-001.jpg",
		text: "Invisible Woman"
	},{
		src: "/images/slides/slide-002.png",
		text: "Iron Man"
	},{
		src: "/images/slides/slide-003.jpg",
		text: "Captain America"
	},{
		src: "/images/slides/slide-004.jpg",
		text: "Spiderman"
	},{
		src: "/images/slides/slide-005.jpg",
		text: "Wolverine"
	}];
	angular.element('body').ready(function() {
		angular.element('.carousel').carousel({
			interval: 3000,
			pause: 'none'
		});
	});
	$scope.textOffset = 0;
	$scope.textValue = "Searching...";
	
	$scope.loadCard = function(Character) {
		LocationService.setCharacterId(Character.id);
	};
	
	$scope.getImage = function(Character) {
		if(!Character || !Character.image || Character.image.length == 0) {
			return "";
		}
		
		return Character.image.medium_url || Character.image.large_url;
	};
	
	$scope.setActiveCardId = function(id) {
		$scope.activeCardId = id;
	};
	
	$scope.isActiveCard = function(id,first) {
		if(first) {
			$scope.activeCardId = id;
		}
	};
	
	$scope.checkIsSearching = function() {
		return LocationService.getIsSearching();
	}
	
	$scope.hasNoResults = function() {
		for(var j = 0; j< $scope.Characters.length; j++) {
			if($scope.Characters[j].name.toLowerCase().indexOf($scope.search.toLowerCase()) >= 0){
				return false;
			}
		}
		return true;
	};
	
	$scope.clear = function() {
		$scope.Characters = [];
		$rootScope.$broadcast("clear");
	};
	
	$scope.$on('searching',function(event){
		$scope.search = LocationService.getSearch();
	});
	
	$scope.$on('searchFailed',function(event,message){
	});

	$scope.$on('error',function(event,message) {
		$scope.message = message;
	});
	
	$scope.$on('characters',function(event,Characters){
		$scope.Characters = Characters;
		$scope.search = LocationService.getSearch();
		
		if($scope.search.length > 0 && $scope.Characters.length > 0) {
			$timeout(function(){
				var queue = [];
				for(var i = 0; i < $scope.Characters.length; i++) {
					if($scope.Characters[i].name.toLowerCase().indexOf($scope.search.toLowerCase()) >= 0) {
						queue.push($scope.Characters[i]);
					}
				}
				
				HistoryService.setCharacterList(queue);
			},0);
		}
	});
	
	$scope.$on('clear',function() {
		$scope.search = "";
		$window.scrollTo(0,0);
	});
}]);