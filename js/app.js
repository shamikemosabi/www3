var app = angular.module('app', ["ngRoute", "ngStorage", "ngAudio", "firebase", "ui.bootstrap"]);


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




app.controller('customersCtrl' ,  function($scope, $http ,$localStorage,  $timeout, $sce, ngAudio, $firebaseArray, $uibModal , $firebaseObject ) {
	
	
	$scope.$storage =  $localStorage;	
	 
	 //inialitze object
		var ref = new Firebase("https://amber-fire-5449.firebaseio.com/");
		var list = $firebaseArray(ref);
		
		
		 var ref2 = new Firebase("https://amber-fire-5449.firebaseio.com/chat/");
		 $scope.chat = $firebaseArray(ref2);
		 
		 //LOCAL
		// var ref3 = new Firebase("https://amber-fire-5449.firebaseio.com/chat2/");
		 //$scope.chat2 = $firebaseArray(ref3);
		 
	

	 //firebase
	 
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
	if($scope.$storage.clearDate==null)
	{
		var d = new Date(0);
		$scope.$storage.clearDate = d.getTime();
	}
	
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
					//$scope.$storage.oldNames  = $scope.$storage.newNames
					$scope.replaceObj($scope.$storage.oldNames,  $scope.$storage.newNames);
					
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
				$scope.loadLikes();
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
	
	
	$scope.replaceObj  = function(oldObj, newObj)
	{
		//	var oldObj = [];
		$scope.$storage.oldNames = new Object();
		$scope.$storage.oldNames.records = [];
		
		for (var i=0; i<newObj.records.length; i++) {
			var v = newObj.records[i];
			var v1 = {Post:v.Post, link:v.link}; // data is referenced so if I changed newName oldName gets changed too automaticall.. so i need to create new obj
			$scope.$storage.oldNames.records.push(v1);
		}
		$scope.$storage.oldNames.date = newObj.date;
		
		//return oldObj;
	}
	
	
	
	$scope.open = function (title, link) {
		var modalInstance = $uibModal.open({
		templateUrl: 'views/Popup.html',
		controller: 'PopupInstanceController',
		resolve: {
			title: function () {
				return title;
			},
			list: function (){
			    return list;
			},
			link: function(){
				return stripForID(link);
			},
			ref: function(){
				return ref;
			},
			chat: function(){
				return $scope.chat; 
			},
			nickName: function(){
				return $scope.txtNickname;
			},
			linkRaw: function(){
				return link;
			}
			
		}
		});
		}

	function stripForID(str){
		var id = str.replace("https://www.mturk.com/mturk/", ""); 
		id = id.replace(".", "");  // cant store . as keys
		id = id.replace("#", "");  // cant store # as keys
		return id;
	}
	
	
	
	$scope.getLikes = function(o){
		var ret = 0;
		var id = stripForID(o);
		
		var rec = list.$getRecord(id);
		if(rec!=null){		
			ret = rec.value;
		}

		return ret;
	}
	
	$scope.loadLikes = function(){
		if($scope.$storage.fullData!=null)
		{
			for (var i=0; i<$scope.$storage.fullData.length; i++) {
				var v = $scope.getLikes($scope.$storage.fullData[i].link);
				$scope.$storage.fullData[i].likes = v;
			}
		}
	}
	
	
	$scope.updateHit = function (obj, link, bool){

		var id = stripForID(link);
		
		var rec = list.$getRecord(id);
		if(rec==null) // if doesn't exist we add
		{
			var child = ref.child(id); 
			var num = 0;
			if(bool==true)
			{
				num = 1;
				obj.buttonDisable = true;
			}
			else{
				num = -1;
				obj.buttonDisable = false;
			}
			child.set(
			{ 
				value: num
			});			
		}
		else{// it exists upvote, or downvote
			
			var index = list.$indexFor(id);
			if(bool==true)//upvote
			{	
				var v = rec.value+1; //make sure to not be 0 after updating it.
				if(v == 0){ v = 1;}
				list[index].value = v;
				obj.buttonDisable = true;
				
			}
			else
			{
				var v = rec.value-1;
				if(v == 0){ v = -1;}
				list[index].value = v;
				obj.buttonDisable = false;
			}
				
			list.$save(index).then(function(ref) {
			  ref.key() === list[index].$id; 
			});
			
		}

	}
	
	

//chat
	
	$scope.loadChat = function (){

		var ret = "";
		 
		 
			for( j = 0; j <$scope.chat.length; j ++ )
			{
				value = $scope.chat[j];
				
				if( $scope.displayChat == null)
				{
				//	 $scope.displayChat = []; //create empty object 
				$scope.displayChat = ""; //create empty object 
				}
				
				var bool=true;
				
				/* nested for loop bad n^n
				for( i = 0 ; i< $scope.displayChat.length ; i ++)
				{
					var blah = $scope.displayChat[i];
					if(blah.msg==value.msg)
					{
						bool = false;
						break;
					}
				}
				*/
				
				if(value.date >  $scope.$storage.clearDate)
				{
					var date = new Date(value.date);

					//$scope.displayChat.push(value);
					ret += "<b>" + date.toLocaleString() + "</br>" +value.user + "</b> : " + value.msg + "</br>" + "</br>";
				}
			
			}
			
			/*
			angular.forEach($scope.displayChat,function(value,index){			
				ret += "- " + value.msg + "\n";
			});
			*/
			
			$scope.displayChat = ret;
		//return ret;
	}	 
		
	 
	 /*
	$scope.loadChat = function() {		 
	     angular.forEach($scope.chat,function(value,index){
            $scope.displaChat += value.msg + "\n\n";
         })
	}
	*/
	
	$scope.send = function(){
		
		if($scope.txtchat == null || $scope.txtchat == "")
		{ 
			return false; 
		}
		var d = new Date();
		 $scope.chat.$add({
             msg: $scope.txtchat,
			  date: d.getTime(),
			  browser: navigator.userAgent,
			  user: $scope.txtNickname
          });
		  
		  $scope.txtchat = "";
	}
	
	$scope.addMessage = function(e) {

		if (e.keyCode === 13 && $scope.txtchat) {
			var d = new Date();
			 $scope.chat.$add({
             msg: $scope.txtchat,
			 date: d.getTime(),
			 browser: navigator.userAgent,
			 user: $scope.txtNickname
          });
		  
		  $scope.txtchat = "";
		}
	
	}
	
	$scope.clearChat = function()
	{
			
	 $scope.displayChat = "";
 	 var d = new Date();
	 $scope.$storage.clearDate = d.getTime();
		
		/*
		  var obj = $firebaseObject(ref2);
			obj.$remove().then(function(ref) {
			    $scope.displayChat = [];
			}, function(error) {
			  console.log("Error:", error);
			});
		*/
			
	}
	
//chat	
	
			

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
			$scope.loadChat();
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


app.controller('PopupInstanceController',
	['$scope','$uibModalInstance', 'title', 'list', 'link', '$sce', 'ref' , '$firebaseArray', 'chat', 'nickName', 'linkRaw',
		function ($scope, $uibModalInstance, title, list, link, $sce, ref,  $firebaseArray, chat, nickName, linkRaw) {
			$scope.title = title;
			$scope.list  = list
			$scope.ref   = ref
			$scope.link  = link // is actually ID
			$scope.chat = chat
			$scope.nickName = (nickName == null ? "" : nickName);	
			$scope.linkRaw = linkRaw
			
			$scope.close = function () {
			$uibModalInstance.dismiss('cancel');
			};
			
			
			$scope.sendToChat = function(){
				if($scope.txtcomment == null || $scope.txtcomment == "")
				{ 
					return false; 
				}
				var d = new Date();
				
				var string = "<font size=1>" + $scope.title  + "</font>" + " </br> " + $scope.txtcomment;
				
				$scope.chat.$add({
					  msg: string,
					  date: d.getTime(),
					  browser: navigator.userAgent,
					  user: $scope.nickName
				 });
		  		  			
				$scope.save();		
				$scope.CD = string;
			}
			
			$scope.save = function(){
				
				if($scope.txtcomment == null || $scope.txtcomment == "")
				{ 
					return false; 
				}
				
				var rec = list.$getRecord($scope.link);
				//making comment without voting first
				if(rec==null) {

					var uniqueId  = {
						id: $scope.link,
						value: 0		
					}
					
					ref.child(uniqueId.id).set(uniqueId);
					ref.child(uniqueId.id).child('comments').push({body: $scope.txtcomment});
				}
				else{ // we already have this in db just need to add comment
					
					ref.child($scope.link).child('comments').push({body: $scope.txtcomment});
					
				}
			
				var recAgain = list.$getRecord($scope.link);
				
				if(recAgain!=null) $scope.comments = recAgain.comments;
				
				$scope.placeholder  = $scope.txtcomment;
				
				$scope.txtcomment = "";
						
			};
			
			
			$scope.renderHtml = function(html_code) {
				return $sce.trustAsHtml(html_code);
			};
	
			// loads comment	
			 var ret = ""; 
		     var rec = list.$getRecord($scope.link);
			 if(rec!=null){		
		     	ret = rec.comments;
			 }
			 $scope.comments = ret;
			
	
		}
	]);