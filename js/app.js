var app = angular.module('app', ["ngRoute", "ngStorage", "ngAudio"]);


app.config( ['$routeProvider', function($routeProvider) {
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
		.when('/setting',
		{
			controller: 'customersCtrl',
			templateUrl: 'views/setting.html'

		})

		
		.otherwise({ redirectTo: '/'});

}]);


app.controller('customersCtrl', function($scope, $http,  $localStorage,  $timeout, $sce, ngAudio) {
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
		
	// load default audio:
	// if null then default
	if ($scope.$storage.currentSound==null){$scope.$storage.currentSound = 'default.mp3'; }
	if ($scope.$storage.currVol==null){$scope.$storage.currVol = .5 ; }
	
	 $scope.audio = ngAudio.load('sound/'+$scope.$storage.currentSound);	 
	 $scope.audio.volume =  $scope.$storage.currVol;

	 
	 $scope.soundList = ['apple-bite', 'blop', 'bubble-pop', 'cash-register','clinking','default','evil-laugh','fart','fly', 'hey','I-love-you', 'kid-laugh','pew','phone-vibrate','pin','pool', 'rain','reload','suspense','toke'];
	 
	 $scope.dropboxitemselected = function (item) {		   		   
		   $scope.$storage.currentSound = item+".mp3";		   
		   $scope.audio = ngAudio.load('sound/'+$scope.$storage.currentSound);
		  
		   $scope.audio.play();
	}
	
	$scope.playSound = function()
	{
		$scope.audio.play();
	}
	
	$scope.saveSlider = function(v)
	{
		
		$scope.$storage.currVol = v;
		$scope.audio.volume = $scope.$storage.currVol;
	}
	
// end sound

		
	
	// fetch new data
	$scope.getData = function(){
		    $http.get("test.aspx")
			.success(function(response) {
				$scope.$storage.newNames = response;
			
				
				if($scope.$storage.oldNames==null)
				{
					$scope.$storage.oldNames = {};
				}
				if($scope.$storage.bSound==null)
				{					
					//console.log("sound null");
					$scope.$storage.bSound = true;
				}		
			
				// compare new with local old if same then do nothing.
				// OR if oldName hasn't been initiazed
				if(angular.equals($scope.$storage.oldNames.records, $scope.$storage.newNames.records)) 
				{
					//console.log("true");
				}
				else //new data
				{
					//console.log("false");
					//set old storage with new
					$scope.$storage.oldNames  = $scope.$storage.newNames
					//set local full storage
					$scope.$storage.fullData = $scope.$storage.newNames.records.concat($scope.$storage.fullData )											
					
					if($scope.notify)
					{	
						PageTitleNotification.On("New Hit!");
						//console.log("new hit");
						$scope.notify= false;
						
						if($scope.$storage.bSound)
						{	
							// some reason this may be old audio object lets force create object again with new sound
							$scope.audio = ngAudio.load('sound/'+$scope.$storage.currentSound);	 
							$scope.audio.volume =  $scope.$storage.currVol;						
							$scope.audio.play(); 
							
							//console.log($scope.$storage.currentSound);
							//console.log( $scope.audio);
						}
						
					}
				}
				
				$scope.cleanNull();
				
			});		
		
		if($scope.$storage.oldNames!=null)
		{
			$scope.date = $scope.$storage.oldNames.date;
		}
		
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
	
	
	$scope.renderHtml = function(html_code) {
		return $sce.trustAsHtml(html_code);
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
		//delete $scope.$storage.bSound;
		
		$scope.names = "";
		PageTitleNotification.Off();
	}
	
	//Change title back after getting focus
	window.addEventListener("focus", function(event) {  
			PageTitleNotification.Off();
			$scope.notify= true;
		//	console.log("focus")
		}, false);
	
});
