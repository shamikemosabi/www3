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
			.success(function(response) {$scope.$storage.newNames = response.records;
			
				// compare new with local old if same then do nothing.
				if(angular.equals($scope.$storage.oldNames, $scope.$storage.newNames)) 
				{
					//console.log("true");
				}
				else //new data
				{
					//console.log("false");
					//set old storage with new
					$scope.$storage.oldNames  = $scope.$storage.newNames
					//set local full storage
					$scope.$storage.fullData = $scope.$storage.newNames.concat($scope.$storage.fullData )											
					
					PageTitleNotification.On("New Hit!");
					$scope.date = Date();

				}
			});				
	};
	 	
	//refresh every 5 seconds
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
		$scope.names = "";
		PageTitleNotification.Off();
	}
	
	//Change title back after getting focus
	window.addEventListener("focus", function(event) {  
			PageTitleNotification.Off();
		}, false);
	
});
