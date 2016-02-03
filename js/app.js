var app=angular.module('app',["ngRoute","ngStorage","ngAudio","firebase","ui.bootstrap","ngSanitize","ngEmbed"]);app.config(['$routeProvider',function($routeProvider){$routeProvider.when('/',{controller:'customersCtrl',templateUrl:'views/main.html'}).when('/about',{controller:'customersCtrl',templateUrl:'views/about.html'}).when('/setting',{controller:'customersCtrl',templateUrl:'views/setting.html'}).otherwise({redirectTo:'/'});}]);app.directive('scrollBot',function(){return{scope:{scrollBot:"="},link:function(scope,element){scope.$watchCollection('scrollBot',function(newValue){if(newValue)
{$(element).scrollTop($(element)[0].scrollHeight);}});}}});app.controller('customersCtrl',function($scope,$http,$localStorage,$timeout,$sce,ngAudio,$firebaseArray,$uibModal,$firebaseObject){$scope.options={linkTarget:'_blank',image:{embed:true},basicVideo:true,twitchtvEmbed:true,dailymotionEmbed:true,tedEmbed:true,dotsubEmbed:true,liveleakEmbed:true,soundCloudEmbed:true,soundCloudOptions:{height:160,themeColor:'f50000',autoPlay:false,hideRelated:false,showComments:true,showUser:true,showReposts:false,visual:false,download:false},gdevAuth:'xxxxxxxx',video:{embed:true,width:null,height:null,ytTheme:'dark',details:false,},tweetEmbed:true,tweetOptions:{maxWidth:550,hideMedia:false,hideThread:false,align:'none',lang:'en'},pdf:{embed:true},audio:{embed:true},}
$scope.$storage=$localStorage;var ref=new Firebase("https://amber-fire-5449.firebaseio.com/");var list=$firebaseArray(ref);var hitList=$firebaseArray(ref.child("hits"));$scope.chat=$firebaseArray(ref.child("chat"));var loginList=$firebaseArray(ref.child("u"));var PageTitleNotification={Vars:{OriginalTitle:document.title,Interval:null},On:function(notification,intervalSpeed){var _this=this;_this.Vars.Interval=setInterval(function(){document.title=(_this.Vars.OriginalTitle==document.title)?notification:_this.Vars.OriginalTitle;},(intervalSpeed)?intervalSpeed:1000);},Off:function(){clearInterval(this.Vars.Interval);document.title=this.Vars.OriginalTitle;}};if($scope.$storage.theme==null)
{$scope.$storage.theme="light";}
if($scope.$storage.clearDate==null)
{var d=new Date(1453072113012);$scope.$storage.clearDate=d.getTime();}
if($scope.$storage.currentSound==null){$scope.$storage.currentSound='default.mp3';}
if($scope.$storage.currVol==null){$scope.$storage.currVol=.5;}
$scope.audio=ngAudio.load('sound/'+$scope.$storage.currentSound);$scope.audio.volume=$scope.$storage.currVol;$scope.soundList=['apple-bite','blop','bubble-pop','cash-register','clinking','default','evil-laugh','fart','fly','hey','I-love-you','kid-laugh','pew','phone-vibrate','pin','pool','rain','reload','suspense','toke'];$scope.dropboxitemselected=function(item){$scope.$storage.currentSound=item+".mp3";$scope.audio=ngAudio.load('sound/'+$scope.$storage.currentSound);$scope.audio.play();};$scope.playSound=function()
{$scope.audio.play();};$scope.saveSlider=function(v)
{$scope.$storage.currVol=v;$scope.audio.volume=$scope.$storage.currVol;};$scope.toggle=1
$scope.getData=function(){$http.get("test.aspx").success(function(response){$scope.$storage.newNames=response;if($scope.$storage.oldNames==null)
{$scope.$storage.oldNames={};}
if($scope.$storage.bSound==null)
{$scope.$storage.bSound=true;}
if(angular.equals($scope.$storage.oldNames.records,$scope.$storage.newNames.records))
{}
else
{$scope.replaceObj($scope.$storage.oldNames,$scope.$storage.newNames);$scope.$storage.fullData=$scope.$storage.newNames.records.concat($scope.$storage.fullData)
if($scope.notify)
{PageTitleNotification.On("New Hit!");$scope.notify=false;if($scope.$storage.bSound)
{$scope.audio=ngAudio.load('sound/'+$scope.$storage.currentSound);$scope.audio.volume=$scope.$storage.currVol;$scope.audio.play();}}}
$scope.cleanNull();$scope.loadLikes();$scope.renderHtmlData();});if($scope.$storage.oldNames!=null)
{$scope.date=$scope.$storage.oldNames.date;}};$scope.cleanNull=function(){if($scope.$storage.fullData!=null&&$scope.$storage.fullData.length>0)
{jQuery.each($scope.$storage.fullData,function(i,val){if(val==null)
{$scope.$storage.fullData.splice(i,1);}});}};$scope.replaceObj=function(oldObj,newObj)
{$scope.$storage.oldNames=new Object();$scope.$storage.oldNames.records=[];for(var i=0;i<newObj.records.length;i++){var v=newObj.records[i];var v1={Post:v.Post,link:v.link};$scope.$storage.oldNames.records.push(v1);}
$scope.$storage.oldNames.date=newObj.date;};$scope.renderHtmlData=function()
{if($scope.$storage.fullData!=null&&$scope.$storage.fullData.length>0)
{for(var i=0;i<$scope.$storage.fullData.length;i++){var v=$scope.$storage.fullData[i];if($scope.$storage.fullData[i].Post.constructor.name!="TrustedValueHolderType"){v.newPost=$scope.renderHtml(v.Post);}}}};$scope.open=function(title,link){var modalInstance=$uibModal.open({templateUrl:'views/Popup.html',controller:'PopupInstanceController',resolve:{title:function(){return title;},hitList:function(){return hitList;},link:function(){return stripForID(link);},ref:function(){return ref;},chat:function(){return $scope.chat;},nickName:function(){return $scope.txtNickname;},linkRaw:function(){return link;},loginList:function(){return loginList;}}});};function stripForID(str){var id=str.replace("https://www.mturk.com/mturk/","");id=id.replace(".","");id=id.replace("#","");id=id.replace("$","");id=id.replace("[","");id=id.replace("]","");id=id.replace("/","");return id;};$scope.getLikes=function(o){var ret=0;var id=stripForID(o);var rec=hitList.$getRecord(id);if(rec!=null){ret=rec.value;}
return ret;};$scope.loadLikes=function(){if($scope.$storage.fullData!=null)
{for(var i=0;i<$scope.$storage.fullData.length;i++){var v=$scope.getLikes($scope.$storage.fullData[i].link);$scope.$storage.fullData[i].likes=v;}}};$scope.updateHit=function(obj,link,bool){var id=stripForID(link);var rec=hitList.$getRecord(id);if(rec==null)
{var child=ref.child("hits").child(id);var num=0;if(bool==true)
{num=1;obj.buttonDisable=true;}
else{num=-1;obj.buttonDisable=false;}
child.set({value:num});}
else{var index=hitList.$indexFor(id);if(bool==true)
{var v=rec.value+1;if(v==0){v=1;}
hitList[index].value=v;obj.buttonDisable=true;}
else
{var v=rec.value-1;if(v==0){v=-1;}
hitList[index].value=v;obj.buttonDisable=false;}
hitList.$save(index).then(function(ref){ref.key()===hitList[index].$id;});}};$scope.loadChat=function(){var ret="";$scope.displayChat=[];for(j=0;j<$scope.chat.length;j++)
{value=$scope.chat[j];var bool=true;if(value.date>$scope.$storage.clearDate)
{var date=new Date(value.date);value.newdate=date.toLocaleString();value.userHtml=getDutyColor(value.user)
value.Msg=value.msg;value.htmlMsg=value.htmlmsg;$scope.displayChat.push(value);}}};$scope.renderHtmlChat=function(user,html_code){var str=getDutyColor(user)+" : "+html_code;return $sce.trustAsHtml(str);};function getDutyColor(user)
{var ret="";var u=stripForID(user.toLowerCase());var rec=loginList.$getRecord(u);if(rec==null)
{ret=user;}
else{var cmts=rec.cmts;var duty=rec.duty;ret=calculateDuty(cmts,duty,user);if(rec.superUser!=null&&rec.superUser==1)
{ret="<font color='red' >"+user+"</font>";}}
return ret;};function calculateDuty(cmts,duty,user)
{var v=cmts+(duty*5);var ret="";if(v<40)
{ret="<font color='#006600' >"+user+"</font>";}
else if(v<80)
{ret="<font color='#000099' >"+user+"</font>";}
else if(v<120)
{ret="<font color='#660065' >"+user+"</font>";}
else if(v<200)
{ret="<font color='#ff6600' >"+user+"</font>";}
else if(v<300)
{ret="<font color='#4db6ff' >"+user+"</font>";}
else if(v<450)
{ret="<font color='#ff66cc' >"+user+"</font>";}
else
{ret="<font color='#e5e600' >"+user+"</font>";}
return ret;};function getUserName()
{var user;var authData=ref.getAuth();if(authData)
{user=authData.password.email
ref.child('u').orderByChild('email').equalTo(user).on("child_added",function(snapshot,prevChildKey){var obj=snapshot.val();user=obj.user});}
else{user="Anonymous";}
return user;};$scope.send=function(){if($scope.txtchat==null||$scope.txtchat=="")
{return false;}
var user=getUserName();var d=new Date();$scope.chat.$add({msg:$scope.txtchat,date:d.getTime(),browser:navigator.userAgent,user:user});incCmt(user);$scope.txtchat="";};$scope.addMessage=function(e){if(e.keyCode===13&&$scope.txtchat){var user=getUserName();var d=new Date();$scope.chat.$add({msg:$scope.txtchat,date:d.getTime(),browser:navigator.userAgent,user:user});incCmt(user);$scope.txtchat="";}};function incCmt(user)
{var ret="";var u=stripForID(user.toLowerCase());var rec=loginList.$getRecord(u);if(rec!=null){var cmts=rec.cmts+1;var index=loginList.$indexFor(u);loginList[index].cmts=cmts;loginList.$save(index).then(function(ref){ref.key()===loginList[index].$id;});}};$scope.clearChat=function()
{$scope.displayChat="";var d=new Date();$scope.$storage.clearDate=d.getTime();};$scope.toggleChat=function()
{$scope.toggle=$scope.toggle*-1;};$scope.renderHtml=function(html_code){return $sce.trustAsHtml(html_code);};$scope.delete=function(o){$scope.$storage.fullData.splice(o,1);};$scope.intervalFunction=function(){$timeout(function(){$scope.getData();$scope.loadChat();$scope.intervalFunction();},5000)};$scope.intervalFunction();$scope.reset=function(){delete $scope.$storage.fullData;$scope.names="";PageTitleNotification.Off();};window.addEventListener("focus",function(event){PageTitleNotification.Off();$scope.notify=true;},false);$scope.loginErrMsg="";$scope.loginSuccMsg="";$scope.currentLoginUserName=getUserName();$scope.loggedIn=ref.getAuth();$scope.singInPane=true;$scope.forgotPwPane=false;$scope.changePwPane=false;$scope.btnLogin=function(){logInto($scope.loginEmail,$scope.loginPassword)};$scope.btnRegistry=function(){if(!checkIfUserExists($scope.loginUsername))
{createUser($scope.loginEmail,$scope.loginPassword,$scope.loginUsername);}
else{$scope.loginErrMsg="User Name is already taken, or invalid characters in User Name";$scope.loginSuccMsg="";}};function createUser(login,password,user){ref.createUser({email:login,password:password},function(error){if(error){var msg;switch(error.code)
{case'EMAIL_TAKEN':msg="This email is already registered";break;case'INVALID_EMAIL':msg="Email is invalid";break;default:msg=error.code;}
$scope.loginErrMsg=msg;$scope.loginSuccMsg="";}else{$scope.loginSuccMsg="Account created successfully.";$scope.loginErrMsg="";logInto(login,password);AddUserToDB(user,login);}});};function AddUserToDB(user,login){ref.onAuth(function(authData){if(authData){var d=new Date();var c=ref.child("u").child(user.toLowerCase());var zero=0;c.set({provider:authData.provider,cmts:zero,duty:zero,email:login,dateCreated:d.getTime(),lastLogin:d.getTime(),user:user,superUser:zero});}});};$scope.logOut=function(){ref.unauth();$scope.loggedIn=false;$scope.loginErrMsg="";$scope.loginSuccMsg="";$scope.currentLoginUserName="";};function logInto(login,password){ref.authWithPassword({email:login,password:password},function(error,authData){if(error){var msg;switch(error.code)
{case'EMAIL_TAKEN':msg="This email is already registered";break;case'INVALID_EMAIL':msg="Email is invalid";break;case'INVALID_PASSWORD':msg="Password is invalid";break;case'INVALID_USER':msg="Email does not exist";break;default:msg=error.code;}
$scope.loginErrMsg=msg;$scope.loginSuccMsg="";}else{$scope.loginSuccMsg=$scope.loginSuccMsg+" Logged in successfully";$scope.loginErrMsg="";$scope.loggedIn=true;var u=getUserName();$scope.currentLoginUserName=u;updateLastLogin(u);}});};function updateLastLogin(user)
{var ret="";var u=stripForID(user.toLowerCase());var rec=loginList.$getRecord(u);if(rec!=null){var d=new Date();var index=loginList.$indexFor(u);loginList[index].lastLogin=d.getTime();loginList.$save(index).then(function(ref){ref.key()===loginList[index].$id;});}};function checkIfUserExists(userId){var ret=true;var rec=loginList.$getRecord(userId.toLowerCase());if(rec==null)
{ret=false;}
if((userId.indexOf(".")>-1)||(userId.indexOf("$")>-1)||(userId.indexOf("[")>-1)||(userId.indexOf("]")>-1)||(userId.indexOf("#")>-1)||(userId.indexOf("/")>-1)){ret=true;}
return ret;};$scope.toggleForgotPW=function(){$scope.forgotPwPane=true;$scope.singInPane=false;$scope.loginErrMsg="";$scope.loginSuccMsg="";$scope.changePwPane=false;};$scope.toggleSignIn=function(){$scope.forgotPwPane=false;$scope.singInPane=true;$scope.loginErrMsg="";$scope.loginSuccMsg="";$scope.changePwPane=false;};$scope.toggleChangePW=function(){$scope.forgotPwPane=false;$scope.singInPane=false;$scope.loginErrMsg="";$scope.loginSuccMsg="";$scope.changePwPane=true;};$scope.sendForgotPW=function(){ref.resetPassword({email:$scope.forgotPwEmail},function(error){if(error){var msg;switch(error.code)
{case'EMAIL_TAKEN':msg="This email is already registered";break;case'INVALID_EMAIL':msg="Email is invalid";break;case'INVALID_PASSWORD':msg="Password is invalid";break;case'INVALID_USER':msg="Email does not exist";break;default:msg=error.code;}
$scope.loginErrMsg=msg;$scope.loginSuccMsg="";}else{$scope.loginSuccMsg="Password reset email sent successfully";$scope.loginErrMsg="";}});}
$scope.sendChangePW=function(){ref.changePassword({email:$scope.changePwEmail,oldPassword:$scope.changePwOld,newPassword:$scope.changePwNew},function(error){if(error){var msg;switch(error.code){case'EMAIL_TAKEN':msg="This email is already registered";break;case'INVALID_EMAIL':msg="Email is invalid";break;case'INVALID_PASSWORD':msg="Password is invalid";break;case'INVALID_USER':msg="Email does not exist";break;default:msg=error.code;}
$scope.loginErrMsg=msg;$scope.loginSuccMsg="";}else{$scope.loginSuccMsg="Password changed successfully";$scope.loginErrMsg="";}});};});app.controller('PopupInstanceController',['$scope','$uibModalInstance','title','hitList','link','$sce','ref','$firebaseArray','chat','nickName','linkRaw','loginList',function($scope,$uibModalInstance,title,hitList,link,$sce,ref,$firebaseArray,chat,nickName,linkRaw,loginList){$scope.title=title;$scope.hitList=hitList
$scope.ref=ref
$scope.link=link
$scope.chat=chat
$scope.nickName=(nickName==null?"":nickName);$scope.linkRaw=linkRaw
$scope.close=function(){$uibModalInstance.dismiss('cancel');};$scope.sendToChat=function(){if($scope.txtcomment==null||$scope.txtcomment=="")
{return false;}
var d=new Date();var u=getUserName();var string="<font size=1>"+$scope.title+"</font>"+" </br> ";$scope.chat.$add({msg:$scope.txtcomment,date:d.getTime(),browser:navigator.userAgent,user:u,htmlmsg:string});$scope.save();$scope.CD=string;};$scope.save=function(){if($scope.txtcomment==null||$scope.txtcomment=="")
{return false;}
var rec=hitList.$getRecord($scope.link);if(rec==null){var uniqueId={id:$scope.link,value:0}
ref.child("hits").child(uniqueId.id).set(uniqueId);ref.child("hits").child(uniqueId.id).child('comments').push({body:$scope.txtcomment});}
else{ref.child("hits").child($scope.link).child('comments').push({body:$scope.txtcomment});}
var u=getUserName();incDuty(u);var recAgain=hitList.$getRecord($scope.link);if(recAgain!=null)$scope.comments=recAgain.comments;$scope.placeholder=$scope.txtcomment;$scope.txtcomment="";};function incDuty(user)
{var ret="";var u=stripForID(user.toLowerCase());var rec=loginList.$getRecord(u);if(rec!=null){var duty=rec.duty+1;var index=loginList.$indexFor(u);loginList[index].duty=duty;loginList.$save(index).then(function(ref){ref.key()===loginList[index].$id;});}};function stripForID(str){var id=str.replace("https://www.mturk.com/mturk/","");id=id.replace(".","");id=id.replace("#","");id=id.replace("$","");id=id.replace("[","");id=id.replace("]","");id=id.replace("/","");return id;};function getUserName()
{var user;var authData=ref.getAuth();if(authData)
{user=authData.password.email
ref.child('u').orderByChild('email').equalTo(user).on("child_added",function(snapshot,prevChildKey){var obj=snapshot.val();user=obj.user});}
else{user="Anonymous";}
return user;};$scope.renderHtml=function(html_code){return $sce.trustAsHtml(html_code);};var ret="";var rec=hitList.$getRecord($scope.link);if(rec!=null){ret=rec.comments;}
$scope.comments=ret;}]);