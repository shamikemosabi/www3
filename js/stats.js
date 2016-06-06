
app.controller('betaCtrl' ,  function($scope, $http ,$localStorage,  $timeout, $sce, ngAudio, $firebaseArray, $uibModal , $firebaseObject ) {
	$scope.options = {
		linkTarget       : '_blank',  
	    image    : {
				embed: true                //to allow showing image after the text gif|jpg|jpeg|tiff|png|svg|webp.
				},
		 basicVideo       : true,     //to allow embedding of mp4/ogg format videos 		
		twitchtvEmbed    : true,
		  dailymotionEmbed : true,
		  tedEmbed         : true,
		  dotsubEmbed      : true,
		  liveleakEmbed    : true,
		  soundCloudEmbed  : true,
		  soundCloudOptions: {
			  height      : 160, themeColor: 'f50000',   //Hex Code of the player theme color 
			  autoPlay    : false,
			  hideRelated : false,
			  showComments: true,
			  showUser    : true,
			  showReposts : false,
			  visual      : false,         //Show/hide the big preview image 
			  download    : false          //Show/Hide download buttons 
		  },
		   gdevAuth         :'xxxxxxxx', // Google developer auth key for youtube data api 
		  video            : {
			  embed           : true,    //to allow youtube/vimeo video embedding 
			  width           : null,     //width of embedded player 
			  height          : null,     //height of embedded player 
			  ytTheme         : 'dark',   //youtube player theme (light/dark) 
			  details         : false,    //to show video details (like title, description etc.) 
		  },
		tweetEmbed       : true,
		  tweetOptions     : {
			  //The maximum width of a rendered Tweet in whole pixels. Must be between 220 and 550 inclusive. 
			  maxWidth  : 550,
			  //When set to true or 1 links in a Tweet are not expanded to photo, video, or link previews. 
			  hideMedia : false,
			  //When set to true or 1 a collapsed version of the previous Tweet in a conversation thread 
			  //will not be displayed when the requested Tweet is in reply to another Tweet. 
			  hideThread: false,
			  //Specifies whether the embedded Tweet should be floated left, right, or center in 
			  //the page relative to the parent element.Valid values are left, right, center, and none. 
			  //Defaults to none, meaning no alignment styles are specified for the Tweet. 
			  align     : 'none',
			  //Request returned HTML and a rendered Tweet in the specified. 
			  //Supported Languages listed here (https://dev.twitter.com/web/overview/languages) 
			  lang      : 'en'
		  },
			pdf              : {
				embed: true                 //to show pdf viewer.
			  },
		  audio            : {
			embed: true                 //to allow embedding audio player if link to
		  },			  
	}

  
	$scope.$storage =  $localStorage;	
	 
	 //inialitze object
		var ref = new Firebase("https://amber-fire-5449.firebaseio.com/");
		var list = $firebaseArray(ref);
		
		var hitList = $firebaseArray(ref.child("hits"));
		
		
		// var ref2 = new Firebase("https://amber-fire-5449.firebaseio.com/chat/");
		$scope.chat = $firebaseArray(ref.child("chat")); //local
		 
		var loginList = $firebaseArray(ref.child("u"));
	
	

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
	};
	
	if($scope.$storage.theme==null)
	{
		$scope.$storage.theme = "light";
	}
	//$scope.$storage.oldNamesLive= null
	if($scope.$storage.oldNamesLive == null)
	{
		$scope.$storage.oldNamesLive = new Object();
		$scope.$storage.oldNamesLive.records = {};
		//$scope.$storage.oldNamesLive = new Object();
		//$scope.$storage.oldNamesLive.records = [];
	}

	// load default audio:
	// if null then default
	// if it's not null, but it's an really old date that's more then 1 weeks, then force it to be 1 weeks.
	

	if($scope.$storage.clearDate==null || ( ((new Date().getTime()) - $scope.$storage.clearDate ) > 518400000 ))
	{
		var d = new Date();
		d.setDate(d.getDate()-7);
		$scope.$storage.clearDate = d.getTime();
	}
	
	if ($scope.$storage.currentSound==null){$scope.$storage.currentSound = 'default.mp3'; }
	if ($scope.$storage.currVol==null){$scope.$storage.currVol = .5 ; }
	
	 $scope.audio = ngAudio.load('sound/'+$scope.$storage.currentSound);	 
	 $scope.audio.volume =  $scope.$storage.currVol;

	 
	 $scope.soundList = ['apple-bite', 'blop', 'bubble-pop', 'cash-register','clinking',
			'default','evil-laugh','fart','fly', 'hey','I-love-you', 'kid-laugh','pew','phone-vibrate','pin','pool', 
				'rain','reload','suspense',
				'smb_1-up' , 'smb_coin', 'smb_fireball' , 'smb_jumpsmall', 'smb_pause', 'smb_pipe', 'smb_powerup', 'smb_stomp', 'toke'];
	 
	 $scope.dropboxitemselected = function (item) {		   		   
		   $scope.$storage.currentSound = item+".mp3";		   
		   $scope.audio = ngAudio.load('sound/'+$scope.$storage.currentSound);
		  
		   $scope.audio.play();
	};
	
	$scope.playSound = function()
	{
		$scope.audio.play();
	};
	
	$scope.saveSlider = function(v)
	{
		
		$scope.$storage.currVol = v;
		$scope.audio.volume = $scope.$storage.currVol;
	};
	
// end sound

$scope.toggle = 1
		
	
	// fetch new data
	$scope.getData = function(){
		    $http.get("testLive.aspx")
			.success(function(response) {
				$scope.$storage.newNamesLive = response;
			
				
				// remove hits that exceed a cretain href
				$scope.removeExpiredHits();
				//loop thru $scope.$storage.newNames.records, get rid of the ones we already have.
				$scope.removeDeletedHits();
				
				//$scope.cleanNull();
				$scope.loadLikes();
				$scope.renderHtmlData();
				
				$scope.alertSound();
				
				$scope.date = $scope.$storage.newNamesLive.date;
			});		
		
	};
	
	$scope.alertSound = function(){
		
		if($scope.lengthOfLiveBefore == 0 && $scope.$storage.newNamesLive.records.length > 0) {
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
		
		$scope.lengthOfLiveBefore = $scope.$storage.newNamesLive.records.length;
		
	};
	
	$scope.removeExpiredHits = function()
	{
		for (var key in $scope.$storage.oldNamesLive.records){
		  oldDate = $scope.$storage.oldNamesLive.records[key];
		  currDate = new Date().getTime();		 
		 if ((currDate - oldDate) > 14400000 ) //4 hr 
		 {
			 console.log("removed expired hit");
			 delete $scope.$storage.oldNamesLive.records[key];
			 
		 }

		}
	};
	
	
	$scope.removeDeletedHits = function()
	{
		//traverse backwards
		for(var j = $scope.$storage.newNamesLive.records.length - 1; j >= 0 ; j--){
			
			var link = $scope.$storage.newNamesLive.records[j].link;
			var exist = $scope.$storage.oldNamesLive.records[link];
			
			if(exist!=null)
			{
				//$scope.$storage.newNamesLive.records.pop();
				$scope.$storage.newNamesLive.records.splice(j,1);
			}
		}		
		
	};
	
	$scope.deleteHit = function(o,l){
		//Can't just splice by index anymore. Order by messed up index.
		//$scope.$storage.newNamesLive.records.splice(o,1);
		
		for (var i=0; i< $scope.$storage.newNamesLive.records.length; i++) {
			var v =  $scope.$storage.newNamesLive.records[i];
			var link = v.link;
			
			if(link == l)
			{
				$scope.$storage.newNamesLive.records.splice(i,1);
			}
		}
		  
		//var obj  = {date:new Date(), link:l};
		//$scope.$storage.oldNamesLive.records.push(obj);
		
		$scope.$storage.oldNamesLive.records[l] = new Date().getTime();
		
	};

	

	
	
	$scope.renderHtmlData  = function()
	{
		if($scope.$storage.newNamesLive.records != null && $scope.$storage.newNamesLive.records.length > 0)
		{
			for (var i=0; i< $scope.$storage.newNamesLive.records.length; i++) {
				var v =  $scope.$storage.newNamesLive.records[i];
				if($scope.$storage.newNamesLive.records[i].Post.constructor.name!="TrustedValueHolderType"){
					v.newPost = $scope.renderHtml(v.Post);
				}
				
			}
		}
	};
	
	
	
	$scope.open = function (title, link) {
		var modalInstance = $uibModal.open({
		templateUrl: 'views/Popup.html',
		controller: 'PopupInstanceController',
		resolve: {
			title: function () {
				return title;
			},
			hitList: function (){
			    return hitList;
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
			},
			loginList: function(){
				return loginList;
			}
			
		}
		});
		};

	function stripForID(str){
		var id = str.replace("https://www.mturk.com/mturk/", ""); 
		id = id.replace(".", "");  // cant store . as keys
		id = id.replace("#", "");  // cant store # as keys
		id = id.replace("$", "");
		id = id.replace("[", "");
		id = id.replace("]", "");
		id = id.replace("/", "");
		return id;
	};
	
	
	
	$scope.getLikes = function(o){
		var ret = 0;
		var id = stripForID(o);
		
		var rec = hitList.$getRecord(id);
		if(rec!=null){		
			ret = rec.value;
		}

		return ret;
	};
	
	$scope.loadLikes = function(){
		if($scope.$storage.newNamesLive.records!=null)
		{
			for (var i=0; i<$scope.$storage.newNamesLive.records.length; i++) {
				var v = $scope.getLikes($scope.$storage.newNamesLive.records[i].link);
				$scope.$storage.newNamesLive.records[i].likes = v;
			}
		}
	};
	
	
	$scope.updateHit = function (obj, link, bool){

		var id = stripForID(link);
		
		var rec = hitList.$getRecord(id);
		if(rec==null) // if doesn't exist we add
		{
			var child = ref.child("hits").child(id); 
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
			
			var index = hitList.$indexFor(id);
			if(bool==true)//upvote
			{	
				var v = rec.value+1; //make sure to not be 0 after updating it.
				if(v == 0){ v = 1;}
				hitList[index].value = v;
				obj.buttonDisable = true;
				
			}
			else
			{
				var v = rec.value-1;
				if(v == 0){ v = -1;}
				hitList[index].value = v;
				obj.buttonDisable = false;
			}
				
			hitList.$save(index).then(function(ref) {
			  ref.key() === hitList[index].$id; 
			});
			
		}

	};
	
	

//chat
	
	$scope.loadChat = function (){

		var ret = "";
		 
		 $scope.displayChat = [];
			for( j = 0; j <$scope.chat.length; j ++ )
			{
				value = $scope.chat[j];
				
			//	if( $scope.displayChat == null)
				//{
					// $scope.displayChat = []; //create empty object 
				//$scope.displayChat = ""; //create empty object 
			//	}
				
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
					
					value.newdate = date.toLocaleString();
					
					//value.htmlMsg = $scope.renderHtmlChat(value.user, value.msg);
					value.userHtml = getDutyColor(value.user)
					value.Msg =value.msg;
					value.htmlMsg = value.htmlmsg;
					$scope.displayChat.push(value);
					
					//ret += "<b>" + date.toLocaleString() + "</br>" + getDutyColor(value.user)+ "</b> : " + value.msg + "</br>" + "</br>";
				}
			
			}
			
			/*
			angular.forEach($scope.displayChat,function(value,index){			
				ret += "- " + value.msg + "\n";
			});
			*/
			
			//$scope.displayChat = ret;
		//return ret;
	};
	
	
	
	
	$scope.renderHtmlChat = function(user, html_code) {
		var str = getDutyColor(user) + " : "+ html_code;
		return  $sce.trustAsHtml(str);
	};
	
	

	function getDutyColor(user)
	{
		var ret="";
		var u = stripForID(user.toLowerCase());
		var rec = loginList.$getRecord(u);
		
		if(rec==null)
		{
			ret = user;
		}
		else{
			var cmts = rec.cmts;
			var duty = rec.duty;
			
			ret = calculateDuty(cmts,duty,user);
			
			if(rec.superUser!=null && rec.superUser ==1)
			{
				ret = "<font color='red' >" +user + "</font>";
			}
		}

		
		return ret;

	};	
	
	function calculateDuty(cmts,duty, user)
	{
		var v = cmts + (duty*5);
		var ret ="";
		
		if(v < 40) //green
		{
			ret = "<font color='#006600' >" + user +"</font>";
		}
		else if(v < 80) //blue
		{
			ret = "<font color='#000099' >" + user +"</font>";
		}
		else if(v < 120)//purple
		{
			ret = "<font color='#660065' >" + user +"</font>";
		}	
		else if(v < 200)//orange
		{
			ret = "<font color='#ff6600' >" + user +"</font>";
			
		}		
		else if(v < 300)//light blue
		{
			ret = "<font color='#4db6ff' >" + user +"</font>";
		}
		else if(v < 450) //pink
		{
			ret = "<font color='#ff66cc' >" + user +"</font>";
		}	
		else if(v < 700) //yellow
		{
			ret = "<font color='#e5e600' >" + user +"</font>";
			
		}	
		else if(v < 1200) //light green
		{
			ret = "<font color='#b3ffb3' >" + user +"</font>";
			
		}	
		else if(v < 1500) //light blue
		{
			ret = "<font color='#b3e6ff' >" + user +"</font>";
			
		}
		else if(v < 2000) //light purple
		{
			ret = "<font color='#dab3ff' >" + user +"</font>";
			
		}	
		else if(v < 2500) //light orange
		{
			ret = "<font color='#ffaa80' >" + user +"</font>";
			
		}	
		else if(v < 2500) //light pink
		{
			ret = "<font color='#ffccee' >" + user +"</font>";
			
		}	
		else if(v < 3200) //bronze
		{
			ret = "<font color='#cd7f32' >" + user +"</font>";
			
		}
		else if(v < 4500) //silver
		{
			ret = "<font color='#C0C0C0' >" + user +"</font>";
			
		}	
		else //gold
		{
			ret = "<font color='#ffd700' >" + user +"</font>";
			
		}
		
		return ret;
		
	};
	
		
	 
	 /*
	$scope.loadChat = function() {		 
	     angular.forEach($scope.chat,function(value,index){
            $scope.displaChat += value.msg + "\n\n";
         })
	}
	*/
	
	function getUserName()
	{
		var  user;
		var authData = ref.getAuth();
		if(authData)
		{
			user = authData.password.email
			
			ref.child('u').orderByChild('email').equalTo(user).on("child_added", function(snapshot, prevChildKey) {
				var obj = snapshot.val();
				user =  obj.user
			});	
		}
		else{
			user = "Anonymous";
		}
		
		return user;
	};
	
	$scope.send = function(){
		
		if($scope.txtchat == null || $scope.txtchat == "")
		{ 
			return false; 
		}
		var user = getUserName();
		var d = new Date();
		 $scope.chat.$add({
             msg: $scope.txtchat,
			  date: d.getTime(),
			  browser: navigator.userAgent,
			  user: user
          });
		  incCmt(user);
		  $scope.txtchat = "";
	};
	
	$scope.addMessage = function(e) {

		if (e.keyCode === 13 && $scope.txtchat) {
			var user = getUserName();
			var d = new Date();
			 $scope.chat.$add({
             msg: $scope.txtchat,
			 date: d.getTime(),
			 browser: navigator.userAgent,
			 user: user
          });
		  
		  incCmt(user);
		  $scope.txtchat = "";
		}
	
	};
	
	function incCmt(user)
	{
		var ret="";
		var u = stripForID(user.toLowerCase());
		var rec = loginList.$getRecord(u);
		
		if(rec!=null){
			
			var cmts = rec.cmts + 1;
			
			var index = loginList.$indexFor(u);
			
			loginList[index].cmts = cmts;

			loginList.$save(index).then(function(ref) {
			  ref.key() === loginList[index].$id; 
			});
		}
	};
	
	
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
			
	};
	
	$scope.toggleChat = function()
	{
		$scope.toggle = $scope.toggle * -1;
	};
	
//chat	
	

	$scope.renderHtml = function(html_code) {
		return $sce.trustAsHtml(html_code);
	};
	



	$scope.delete = function(o){
	   $scope.$storage.fullData.splice(o,1);
	};
	 	
		//refresh
	$scope.intervalFunction = function(){
		mytimeout  = $timeout(function() {
			$scope.getData();
			$scope.loadChat();
			$scope.intervalFunction();
		}, 5000)
	};
	
	$scope.$on("$destroy", function (event)  
	{  
		$timeout.cancel(mytimeout);  
	});  
	
	$scope.intervalFunction();
	
	$scope.reset = function(){
		//$localStorage.$reset();
		//delete $scope.$storage.fullData;
		//temporary
		//delete $scope.$storage.oldNamesLive;
		$scope.$storage.oldNamesLive.records = {};
		//delete $scope.$storage.newNames;
		//delete $scope.$storage.bSound;
		
		$scope.names = "";
		PageTitleNotification.Off();
	};
	
	//Change title back after getting focus
	window.addEventListener("focus", function(event) {  
			PageTitleNotification.Off();
			$scope.notify= true;
		//	console.log("focus")
		}, false);
		
		
	
	// login
	$scope.loginErrMsg = "";
	$scope.loginSuccMsg="";
	$scope.currentLoginUserName=getUserName(); //only used as display
	$scope.loggedIn = ref.getAuth();
	//pane
	$scope.singInPane = true;
	$scope.forgotPwPane = false;
	$scope.changePwPane = false;
	
	$scope.btnLogin = function(){
		
		logInto($scope.loginEmail,$scope.loginPassword)
	};

	$scope.btnRegistry = function(){
		
		//first check if handle exists:
		if (!checkIfUserExists($scope.loginUsername))
		{
			createUser($scope.loginEmail, $scope.loginPassword, $scope.loginUsername);
		}
		else{
			$scope.loginErrMsg = "User Name is already taken, or invalid characters in User Name";		
			$scope.loginSuccMsg="";			
		}
		
	};
	
	function createUser(login, password, user){

			ref.createUser({
			  email    : login,
			  password : password
			}, function(error) {
			  if (error) {
				 var msg;
				 switch(error.code)
				 {
					 case 'EMAIL_TAKEN':
						msg = "This email is already registered";
						break;
					 case 'INVALID_EMAIL':	
						msg ="Email is invalid";
						break;
					 default:
						msg = error.code;
				 }				 
				$scope.loginErrMsg = msg;
				$scope.loginSuccMsg ="";
				
				
			  } else { //success
				$scope.loginSuccMsg = "Account created successfully.";
				$scope.loginErrMsg = "";
				
				logInto(login,password);
				AddUserToDB(user,login);
				
			  }
			});
			
		
	};
	
	
	function AddUserToDB (user,login){
		ref.onAuth(function(authData) {
		  if (authData) {
			 var d = new Date(); 
			var c = ref.child("u").child(user.toLowerCase());
			var zero =0;
			
			c.set({
			  provider: authData.provider,
			  cmts: zero,
			  duty: zero,
			  email:login,
			  dateCreated: d.getTime(),
			  lastLogin: d.getTime(),
			  user: user,
			  superUser: zero
			});
		
		  }
		});
		
	};
	
	
	$scope.logOut = function(){
		 ref.unauth();
		 $scope.loggedIn = false;
		 $scope.loginErrMsg = "";
		$scope.loginSuccMsg="";
		$scope.currentLoginUserName="";
	};
	
	function logInto(login, password){
			ref.authWithPassword({
					  email    :login,
					  password : password
					}, function(error, authData) {
					  if (error) {
						var msg;
						switch(error.code)
						{
						 case 'EMAIL_TAKEN':
							msg = "This email is already registered";
							break;
						 case 'INVALID_EMAIL':	
							msg ="Email is invalid";
							break;
						 case 'INVALID_PASSWORD':
							msg = "Password is invalid";
							break;
						case 'INVALID_USER':
							msg="Email does not exist";
							break;
						 default:
							msg = error.code;
						 }
						$scope.loginErrMsg = msg;
						$scope.loginSuccMsg ="";
						 
					  } else {
						 $scope.loginSuccMsg = $scope.loginSuccMsg + " Logged in successfully";
						 $scope.loginErrMsg = "";
						 $scope.loggedIn= true;
						 var u = getUserName();
						 $scope.currentLoginUserName = u;
						 updateLastLogin(u);
					  }
					});	
	};
	
	
	function updateLastLogin(user)
	{
		var ret="";
		var u = stripForID(user.toLowerCase());
		var rec = loginList.$getRecord(u);		

		if(rec!=null){
			var d = new Date();
			var index = loginList.$indexFor(u);
			
			loginList[index].lastLogin = d.getTime();

			loginList.$save(index).then(function(ref) {
			  ref.key() === loginList[index].$id; 
			});
		}
	};
	
	
	function checkIfUserExists(userId) {
		var  ret =true;
		 
		 var rec = loginList.$getRecord(userId.toLowerCase());
		
		if(rec==null)
		{
			ret  = false;
		}
		
		if((userId.indexOf(".") > -1) || (userId.indexOf("$") > -1) || (userId.indexOf("[") > -1) || (userId.indexOf("]") > -1) || (userId.indexOf("#") > -1) || (userId.indexOf("/") > -1)) {
			
			ret = true;
		}
				
		return ret;

	};
	
	
	$scope.toggleForgotPW = function(){	
		$scope.forgotPwPane = true;
		$scope.singInPane = false;
		$scope.loginErrMsg = "";
		$scope.loginSuccMsg="";
		$scope.changePwPane = false;
	};
	
	$scope.toggleSignIn = function(){	
		$scope.forgotPwPane = false;
		$scope.singInPane = true;
		$scope.loginErrMsg = "";
		$scope.loginSuccMsg="";	
		$scope.changePwPane = false;
	};	
	
	$scope.toggleChangePW = function(){
		$scope.forgotPwPane = false;
		$scope.singInPane = false;
		$scope.loginErrMsg = "";
		$scope.loginSuccMsg="";	
		$scope.changePwPane = true;
	};
	
	$scope.sendForgotPW = function(){
		ref.resetPassword({
		  email : $scope.forgotPwEmail
		}, function(error) {
		  if (error) {
				 var msg;
				 switch(error.code)
				 {
					 case 'EMAIL_TAKEN':
						msg = "This email is already registered";
						break;
					case 'INVALID_EMAIL':	
						msg ="Email is invalid";
						break;
					 case 'INVALID_PASSWORD':
						msg = "Password is invalid";
						break;
					case 'INVALID_USER':
						msg="Email does not exist";
						break;
					 default:
						msg = error.code;
				 }				 
				$scope.loginErrMsg = msg;
				$scope.loginSuccMsg ="";
				
				
		  } else {
			$scope.loginSuccMsg = "Password reset email sent successfully";
			$scope.loginErrMsg = "";
		  }
		});
	}

	$scope.sendChangePW = function(){	
		ref.changePassword({
		  email       : $scope.changePwEmail,
		  oldPassword : $scope.changePwOld,
		  newPassword : $scope.changePwNew
		}, function(error) {
		  if (error) {
			 var msg;
			 switch(error.code){
				case 'EMAIL_TAKEN':
					msg = "This email is already registered";
					break;
				case 'INVALID_EMAIL':	
					msg ="Email is invalid";
					break;
				case 'INVALID_PASSWORD':
					msg = "Password is invalid";
					break;
				case 'INVALID_USER':
					msg="Email does not exist";
					break;
				default:
					msg = error.code;
			}				 
			$scope.loginErrMsg = msg;
			$scope.loginSuccMsg ="";
			
		  } else {	  
			$scope.loginSuccMsg = "Password changed successfully";
			$scope.loginErrMsg = "";
			
		  }
		});
	};
	
	//login	


});