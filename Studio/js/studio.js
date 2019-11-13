(function() {
    var index = 2;
    document.getElementById("add_input").addEventListener("click", function (event) {
        addRows(event)
    });
    document.getElementById("add_intents").addEventListener("click", function (event) {
        addIntents(event)
    });
    document.addEventListener("DOMContentLoaded", function () {
        var form_submit_button = document.getElementById("form_submit");
        form_submit_button.addEventListener("click", function (e) {
            var json = toJSONString();
            console.log(json);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState== 4 && this.status == 200){
                    console.log(this.responseText);
                }
            };

            xhttp.open('POST', 'http://127.0.0.1:3200/', true);
            xhttp.setRequestHeader('Content-Type','application/json');
            xhttp.send(JSON.stringify(json));
        }, false);
    });

    function createElement(element,type,classname,name,required) {
        var element = document.createElement(element);
        type?element.type=type:'' ;
        classname? element.className=classname : '';
        name? element.name = name : '';
        required ? element.required = required : '';
        return element;
    }

    function addRows(event) {
        var div = createElement('div','','inputs-container','',true);
        var input1 = createElement('input','text','','inputName',true);
        var input2 = createElement('input','text','','inputValue',true);

        var icondel = createElement('i','','fa fa-minus-circle','',false);
        var iconadd = createElement('i','','fa fa-plus-circle','',false);

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
        var iconadd = createElement('i','','fa fa-plus-circle','',false);
        iconadd.onclick = function (event) {
            addIntents(event);
        }
        previouSibling.appendChild(iconadd);
        delEntries(event);
    }
    function delRows(event){
        var previouSibling= event.target.parentNode.previousElementSibling;
        var iconadd = createElement('i','','fa fa-plus-circle','',false);
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
        var input1 = createElement('input','text','','intent',true);

        var icondel = createElement('i','','fa fa-minus-circle','',false);
        var iconadd = createElement('i','','fa fa-plus-circle','',false);
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

            } if(name === "intent"){
                obj.intents.push(value);
            }
            else {

                obj[name] = value;
            }

        }
        console.log(obj);
        for(var k=0;k<obj.userinputs.length;k++) {
            console.log(obj.userinputs[k].iname);
            console.log(obj.userinputs[k].ivalue);
        }
        return obj;
       // return JSON.stringify(obj);
    }



})();

