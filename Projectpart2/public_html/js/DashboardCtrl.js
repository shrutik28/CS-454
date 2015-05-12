app.controller('DashboardCtrl',['$scope','$rootScope','$http','LocationService','$timeout','HistoryService','$q',function($scope,$rootScope,$http,LocationService,$timeout,HistoryService,$q){
	$scope.search = undefined;
	$scope.characters = [];
	var loaded = false;
	var names = "";
	var canceler = $q.defer();
	var initalSearch = ["man","iron","spide","x","wolf","ame","wolv","cy","hulk","black","ace","pika","war","mew"];
	
	$scope.getCharacters = function() {
		return $scope.characters;
	};
	
	$scope.isLoaded = function() {
		if(!loaded) {
			$timeout(function(){loaded = true},500);
			return false;
		}
		
		return true;
	}
	$scope.getCharacterNames = function() {
		var list = [];
		for(var i = 0; i < $scope.characters.length; i++) {
			list.push($scope.characters[i].name.toLowerCase());
		}
		
		return list;
	};
	
	$scope.selectedCharacter = function(Character) {
		LocationService.setCharacterId(Character.id);
	};
	
	$scope.selectedCharacters = function(Characters) {
		$rootScope.$broadcast('characters',Characters);		
	};
	
	var buildCharacterList = function() {
		$scope.selectedCharacters($scope.characters);
	};
	
	$scope.refreshCharacters = function(value,send) {
		if(!send) {
			send = false;
		}
		
		if(value.length > 0) {
			if(send) {
				$rootScope.$broadcast('searching');
				LocationService.setSearch(value);
				LocationService.setIsSearching(true);
				canceler.resolve();
				canceler = $q.defer();
			}				
			
			$http.get('/api/search?name='+value,{timeout: canceler.promise})
			.success(function(data,status,headers,config){
				if(data.success) {
					for(var i = 0; i < data.results.length; i++) {
						var bool = true;
						for(var j = 0; j < $scope.characters.length; j++) {
							if($scope.characters[j].name == data.results[i].name) {
								bool = false;
							}
						}
						
						if(bool) {
							$scope.characters.push(data.results[i]);
						}
						
					}
					if(send) {
						LocationService.setIsSearching(false);
						buildCharacterList();
					} else {
						buildCharacterList();
					}
				} else {
					$rootScope.$broadcast('error',data.message);
				}
				
			})
			.error(function(data,status,headers,config){
				if(data) {
					$rootScope.$broadcast('searchFailed',data);
				}
			});
		} else {
			buildCharacterList();
			if(loaded) {
				LocationService.setSearch(null);
			}
		}
	};
	
	$scope.clear = function() {
		$scope.search = undefined;
		LocationService.setSearch(null);
		LocationService.setCharacterId(null);
		$rootScope.$broadcast('clear');
	};
	
	$scope.$on('clear',function() {
		$scope.search = undefined;
	});
	
	$timeout(function(){
		if(LocationService.getSearch()) {
			$scope.refreshCharacters(LocationService.getSearch(),true);
		} else if(!LocationService.getCharacter()) {
			initalSearch.forEach(function(value) {
				$scope.refreshCharacters(value);
			});
		}
	},500);	
}]);