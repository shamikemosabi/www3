var app = angular.module('app', ["ngStorage"]);


app.config(function ($routeProvider) {
	$routeProvider
		.when('/',
		{
			controller: 'customersCtrl',
			templateUrl: 'views/main.html'
		})
		
		//
		.when('/about',
		{
			controller: 'customersCtrl',
			templateUrl: 'views/about.html'

		})
		.when('/stats',
		{
			controller: 'statsCtrl',
			templateUrl: 'views/stats.html'

		})

		
		.otherwise({ redirectTo: '/'});

});


app.controller('customersCtrl', function($scope, $http,  $localStorage,  $timeout) {
	$scope.$storage =  $localStorage;
	
	var PageTitleNotification = {
				Vars:{
					OriginalTitle: document.title,
					Interval: null
				},    
				On: function(notification, intervalSpeed){
					var _this = this;
					_this.Vars.Interval = setInterval(function(){
						 document.title = (_this.Vars.OriginalTitle == document.title)
											 ? notification
											 : _this.Vars.OriginalTitle;
					}, (intervalSpeed) ? intervalSpeed : 1000);
				},
				Off: function(){
					clearInterval(this.Vars.Interval);
					document.title = this.Vars.OriginalTitle;   
				}
	}
		
		
	// fetch new data
	$scope.getData = function(){
		    $http.get("test.aspx")
			.success(function(response) {
				$scope.$storage.newNames = response;
			
				// compare new with local old if same then do nothing.
				if(angular.equals($scope.$storage.oldNames, $scope.$storage.newNames.records)) 
				{
					//console.log("true");
				}
				else //new data
				{
					//console.log("false");
					//set old storage with new
					$scope.$storage.oldNames  = $scope.$storage.newNames.records
					//set local full storage
					$scope.$storage.fullData = $scope.$storage.newNames.records.concat($scope.$storage.fullData )											
					
					PageTitleNotification.On("New Hit!");
					$scope.date = $scope.$storage.newNames.date;
				}
				
				$scope.cleanNull();
				
			});				
	};
	
	// some reason grabbing data always has a trailing null object... lets get rid of it
	$scope.cleanNull = function(){
		if($scope.$storage.fullData != null && $scope.$storage.fullData.length > 0)
		{
			jQuery.each($scope.$storage.fullData, function(i, val) {
				if(val==null)
				{
					$scope.$storage.fullData.splice(i,1);
				}
			});
		}	
	};
	
	$scope.delete = function(o){
	   $scope.$storage.fullData.splice(o,1);
	};
	 	
		//refresh
	$scope.intervalFunction = function(){
		$timeout(function() {
			$scope.getData();
			$scope.intervalFunction();
		}, 5000)
	};
	
	$scope.intervalFunction();
	
	$scope.reset = function(){
		//$localStorage.$reset();
		delete $scope.$storage.fullData;
		//temporary
		//delete $scope.$storage.oldNames;
		//delete $scope.$storage.newNames;
		
		$scope.names = "";
		PageTitleNotification.Off();
	}
	
	//Change title back after getting focus
	window.addEventListener("focus", function(event) {  
			PageTitleNotification.Off();
		}, false);
	
});
