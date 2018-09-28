window.onload=function(){
	$$('spLoginStatus').script("http://localhost:3100/transfer"); // Accessible only to logged-in users.
	// $$('spLoginStatus').script("http://hidden-brushlands-4145.herokuapp.com/transfer"); 
};

(function(){
    var myCode=function(obj){
        return new myClass(obj);
    }
 
    var myClass=function(obj){
		this.element=document.getElementById(obj);
    };    
 
    myClass.prototype={
        script:function(url){
			var h=document.getElementsByTagName('head')[0];
			var elem=this.element;
			elem.innerHTML="Checking...";
			
			var s=document.createElement('script'); 
			s.src=url; 
			var onLoadMsg='<div class="alert alert-success">You are currently logged in at Can-Of-Worms!</div>';
			var onErrorMsg='<div class="alert alert-error">You are NOT logged in at Can-Of-Worms</div>';
			s.onload=function(){elem.style.color="green";elem.innerHTML=onLoadMsg; }; 
			s.onerror=function(){elem.style.color="red";elem.innerHTML=onErrorMsg; };
			
			//console.log('s', s);
			
			h.appendChild(s);
            return this;
        },
		img:function(url){
			var elem=this.element;
			elem.innerHTML="Checking...";
			var b=document.body;
			var i=new Image();
			i.src=url;
			i.onload=function(){elem.style.color="green";elem.innerHTML='&#10004;'; /*Tick*/}; 
			i.onerror=function(){elem.style.color="red";elem.innerHTML='&#9587;'; /*Cross*/};
			return this;
		},
        jsonp:function(){
            return this;
        }
    }
    window.$$=myCode;
})();