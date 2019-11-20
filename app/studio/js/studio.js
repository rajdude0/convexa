
(function() {
    var index = 2;
    var add_input=document.getElementById("add_input");
    var reset=document.getElementById("form_reset");
    if(reset) {
        reset.addEventListener("click", function (event) {
            resetForm();
        });
    }
    if(add_input) {
        add_input.addEventListener("click", function (event) {
            addRows(event);
        });
    }
    var add_intent=document.getElementById("add_intents");
    if(add_intent) {
        add_intent.addEventListener("click", function (event) {
            addIntents(event);
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
        if(reset) {
            resetForm();
        }
        var xhttp2 = new XMLHttpRequest();
        xhttp2.responseType = 'json';
        if(window.location.href.indexOf("details") > 0) {
            xhttp2.open('GET', `../api/allRecords`, true);
            xhttp2.onload  = function() {
                var arrayResponse = xhttp2.response;
                console.log(arrayResponse);
                showCards(arrayResponse);
                // do something with jsonResponse
            };
            xhttp2.send(null);
        }

    });

    function showCards(arr){
        for (var i =0;i<arr.length;i++){
            var div = createElement('div','','card','','','');
            div.id = "card"+i;
            var apilabel = createElement('span','','api-label','','','API:');
            var projectlabel = createElement('span','','project-label','','','Project:');
            var intentlabel = createElement('span','','intent-label','','','Intent:');
            var methodlabel = createElement('span','','method-label','','','Method:');

            var api = createElement('span','','api','','');
            var project = createElement('span','','project','','','');
            var intent = createElement('span','','intent','','','');
            var method = createElement('span','','method','','','');
            api.innerText = arr[i].api;
            project.innerText = arr[i].project;
            intent.innerText = arr[i].intent;
            method.innerText= arr[i].method;
            document.querySelector("#card").appendChild(div);
            var currentdiv=document.querySelector('#card'+i);

            currentdiv.appendChild(apilabel).appendChild(api);
            currentdiv.appendChild(projectlabel).appendChild(project)
            currentdiv.appendChild(intentlabel).appendChild(intent);
            currentdiv.appendChild(methodlabel).appendChild(method);
        }
    }

    function resetForm(){
        var elements = document.querySelectorAll("input[type='text'], select, textarea");
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            element.value="";
        }
    }

    function createElement(element,type,classname,name,required,innertext) {
        var element = document.createElement(element);
        type?element.type=type:'' ;
        classname? element.className=classname : '';
        name? element.name = name : '';
        required ? element.required = required : '';
        innertext?element.innerText=innertext:'';
        return element;
    }

    function addRows(event) {
        var div = createElement('div','','inputs-container','',true,'');
        var input1 = createElement('input','text','','inputName',false,'');
        var input2 = createElement('input','text','','inputValue',false,'');

        var icondel = createElement('i','','fa fa-minus-circle','',false,'');
        var iconadd = createElement('i','','fa fa-plus-circle','',false,'');

        document.querySelector('#inputs_div #inputs').appendChild(div);
        var targetElement = event.target.parentNode.nextElementSibling;
        input1.id = 'input' + (++index);
        input2.id = 'input' + (++index);
        targetElement.appendChild(input1);
        targetElement.appendChild(input2);

        targetElement.appendChild(icondel);
        icondel.onclick = function (event) {
            delRows(event);
        }
        targetElement.appendChild(iconadd);
        iconadd.onclick = function (event) {
            addRows(event);
        }
        event.target.parentNode.removeChild(event.target);

    }
    function delIntents(event){
        var previouSibling= event.target.parentNode.previousElementSibling;
        var iconadd = createElement('i','','fa fa-plus-circle','',false,'');
        iconadd.onclick = function (event) {
            addIntents(event);
        }
        previouSibling.appendChild(iconadd);
        delEntries(event);
    }
    function delRows(event){
        var previouSibling= event.target.parentNode.previousElementSibling;
        var iconadd = createElement('i','','fa fa-plus-circle','',false,'');
        iconadd.onclick = function (event) {
            addRows(event);
        }
        previouSibling.appendChild(iconadd);
        delEntries(event);
    }

    function delEntries(event) {
        var targetElementTobeDeleted = event.target.parentNode;
        var tobeDeletedFrom = event.target.parentNode.parentNode;
        tobeDeletedFrom.removeChild(targetElementTobeDeleted);
    }

    function addIntents(event) {
        var div = createElement('div','','','',true);
        document.querySelector('#intents').appendChild(div);
        var targetElement = event.target.parentNode.nextElementSibling;
        var input1 = createElement('input','text','','intents',true,'');

        var icondel = createElement('i','','fa fa-minus-circle','',false,'');
        var iconadd = createElement('i','','fa fa-plus-circle','',false,'');
        targetElement.appendChild(input1);
        targetElement.appendChild(icondel);
        icondel.onclick = function (event) {
            delIntents(event);
        }

        targetElement.appendChild(iconadd);
        iconadd.onclick = function (event) {
            addIntents(event);
        }
        event.target.parentNode.removeChild(event.target);
    }

})();
function toJSONString() {
    var obj = {
        "userinputs" :[],
        "intents":[]
    };

    var inputsObj = {};
    var elements = document.querySelectorAll("input[type='text'], select, textarea");
    var j=1;
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;
        if (name === "inputName" || name === "inputValue") {
            if(name === "inputName")inputsObj["iname"] = value;
            if(name === "inputValue")inputsObj["ivalue"] = value
            if(j%2 == 0) {
                obj["userinputs"].push(inputsObj);
                inputsObj={};
            }
            j++;

        } if(name === "intents"){
            obj.intents.push(value);
        }
        else {

            obj[name] = value;
        }

    }

    return obj;
    // return JSON.stringify(obj);
}
window.submitForm = function(){
    var json = toJSONString();
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            window.location.assign("http://localhost:4001/studio/details.html");

        }
    };

    xhttp.open('POST', `../api/save`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(json));
    return false;
}

