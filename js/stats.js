
app.controller('statsCtrl', function($scope, $http, $timeout) {
		
	// fetch new data
	$scope.getData = function(){
		    $http.get("stats.aspx")
			.success(function(response) {
				$scope.data = response.stats;
				
				//$scope.cleanNull();
				
			});				
	};
	
	// some reason grabbing data always has a trailing null object... lets get rid of it
	$scope.cleanNull = function(){
		if($scope.$storage.fullData.length > 0)
		{
			jQuery.each($scope.$storage.fullData, function(i, val) {
				if(val==null)
				{
					$scope.$storage.fullData.splice(i,1);
				}
			});
		}	
	};
	

	 	
		//refresh
	$scope.intervalFunction = function(){
		$timeout(function() {
			$scope.getData();
			$scope.intervalFunction();
		}, 5000)
	};
	
	$scope.intervalFunction();
	

});