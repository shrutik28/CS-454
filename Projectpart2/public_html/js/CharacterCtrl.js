app.controller('CharacterCtrl',['$scope','$rootScope','$timeout','$window','$routeParams','$http','LocationService','HistoryService',function($scope,$rootScope,$timeout,$window,$routeParams,$http,LocationService,HistoryService){
	$scope.message = null;
	$scope.Character = null;
	$scope.Characters = [];
	$scope.searching = false;
	
	var init = function() {
		if($routeParams.id) {
			$scope.searching = true;
			$scope.Characters = HistoryService.getCharacterList();
			$scope.Character = HistoryService.getCharacter($routeParams.id);
			if(!$scope.Character) {
				$http.get('/api/character/'+$routeParams.id)
				.success(function(data,status,headers,config){
					if(data.success) {
						$scope.Character = data.character;
						HistoryService.addToCharacters($scope.Character);
					} else {
						$scope.Character = null;					
						$scope.message = data.message
					}
					$scope.searching = false;
					$timeout(function() {
						angular.element('.character-tabs a:first').tab('show') // Select first tab
						$('.character-tabs a').click(function (e) {
							e.preventDefault()
							angular.element(this).tab('show')
						})
					}, 1000);
				})
				.error(function(data,status,headers,config){
					if(data) {
						$rootScope.$broadcast('searchFailed',data);
					}
				});	
			} else {
				$timeout(function() {
					angular.element('.character-tabs a:first').tab('show') // Select first tab
					$('.character-tabs a').click(function (e) {
						e.preventDefault()
						angular.element(this).tab('show')
					})
				}, 1000);
			}
		}
	};
	
	$scope.filterLinks = function(string) {
		if(typeof(string) == "string") {
			return string.replace(/\<a[^\>]+\>|\<\/a\>/g,"");
		}
		return "";
	};
	
	$scope.asyncImagePull = function(Character) {
		$http.get('/api/character/'+Character.id)
		.success(function(data,status,headers,config){
			if(data.success) {
				Characterr = data.character;
				HistoryService.addToCharacters(data.character);
			}
		});	
	}
	
	$scope.loadCharacter = function(Character) {
		LocationService.setCharacterId(Character.id);
	};
	
	$scope.getImage = function(Character) {
		if(!Character || !Character.image || Character.image.length == 0) {
			return "";
		}
		
		return Character.image.medium_url || Character.image.large_url;
	};
	
	$scope.getSmallImage = function(Character) {
		if(!Character || !Character.image || Character.image.length == 0) {
			return "";
		}
		
		return Character.image.icon_url || Character.image.small_url;
	};
	
	$scope.getDate = function() {
		var date = new Date($scope.Character.date_last_updated);
		return date.getMonth() +"/"+(date.getDate() < 10 ? "0"+date.getDate() : date.getDate()) +"/"+date.getFullYear()
	};
	
	$scope.hasNoResults = function() {
		for(var i = 0; i < $scope.Characters.length; i++) {
			if($scope.Characters[i].name.indexOf($scope.search) >= 0){
				return false;
			}
		}
		return true;
	};
	
	$scope.clear = function() {
		$scope.Character = null;
		$scope.Characters = [];
		$rootScope.$broadcast("clear");
	};
	
	init();
	
	$scope.$on('clear',function() {
		
	});
}]);