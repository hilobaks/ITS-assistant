/**
 * Created by h_baks on 02.12.15.
 */
var useCross = {
    funcS : {
        sendAjaxRequest: function (url, data, method) {
            var methodSend = 'POST';
            if(method !== undefined) {
                methodSend = method;
            }
            var defObj = $.Deferred();
            $.ajax({
                url: url,
                data: data,
                type: methodSend,
                beforeSend : function () {
                    defObj.notify();
                },
                success: function (Response_success) {
                    defObj.resolve(Response_success);
                },
                error: function (Response_error) {
                    console.log(Response_error);
                    defObj.reject();
                }
            });
            return defObj.promise();
        },
        showErrorConnection : function () {
            this.showFailResponse();
            useCross.varS.forModalWindow.insertBody = document.createTextNode('Проверьте ваше подлючение к Интернету');
        },
        showFailResponse: function () {
            useCross.varS.forModalWindow.idModalWindow = 'tempModal';
            useCross.varS.forModalWindow.insertTitle.nodeValue = 'Ошибка';
        },
        showModalWindow: function () {
            var helpFunc = useCross.funcS,
                variable = useCross.varS.forModalWindow,
                modalWindow = document.getElementById(variable.idModalWindow);
            if(variable.insertTitle.nodeValue != "" && variable.insertBody.innerHTML != "") {
                var title = document.querySelector('#' + variable.idModalWindow + ' .modal-title'),
                    body = document.querySelector('#' + variable.idModalWindow + ' .modal-body');
                helpFunc.crossInnerText(title, 'set', '');
                helpFunc.crossInnerText(body, 'set', '');
                title.appendChild(variable.insertTitle.cloneNode(true));
                body.appendChild(variable.insertBody.cloneNode(true));
                variable.insertBody = this.removeAllChild(variable.insertBody);
            }
            $(modalWindow).modal('show');
        },
        removeAllChild: function (elem) {
            return elem.cloneNode(false);
        },
        screenSize: function (returnValue) {
            var pageWidth = window.innerWidth,
                pageHeight = window.innerHeight;
            if (typeof pageWidth != 'number') {
                if (document.compatMode == 'CSS1Compat') {
                    pageWidth = document.documentElement.clientWidth;
                    pageHeight = document.documentElement.clientHeight;
                } else {
                    pageWidth = document.body.clientWidth;
                    pageHeight = document.body.clientHeight;
                }
            }
            switch (returnValue) {
                case 'width':
                    return pageWidth;
                    break;
                case "height" :
                    return pageHeight;
                    break;
            }
        },
        crossInnerText: function (elem, action, text) {
            if(action === 'set') {
                if(elem.innerText) {
                    elem.innerText = text;
                } else if(elem.textContent) {
                    elem.textContent = text;
                }
            } else if(action === 'get') {
                return elem.innerText || elem.textContent;
            }
        },
        addEventOnElements: function (elements, typeEvent, handler) {
            for(var i = 0; i < elements.length ; i++ ) {
                EventUtil.addHandler(elements[i], typeEvent, handler);
            }
            for(var element in elements) {
                EventUtil.addHandler(element, typeEvent, handler);
            }
        },
        crossGetStyle: function (elem, style) {
            return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
        },
        showProgress: function (target, actionForSpinner) {
            var actionForAnother = 'show';
            target.disabled = false;
            if(actionForSpinner === 'show') {
                actionForAnother = 'hide';
                target.disabled = true;
            }
            var doAction = function (elem, action) {
                if(action === 'show') {
                    elem.classList.remove('hidden')
                } else if(action === 'hide') {
                    elem.classList.add('hidden')
                }
            };
            doAction(target.getElementsByTagName('div')[0], actionForAnother);
            doAction(target.getElementsByTagName('div')[1], actionForSpinner);
        }
    },
    varS: {
        forModalWindow: {
            //Так как 2 из 3 случаев - не пропускают пользователя на следующик шаг, имеет смысл
            //паременную insertTitle инициировать узлом с текстом "Ошибка"
            insertTitle : document.createTextNode('Ошибка'),
            insertBody : document.createElement('div'),
            idModalWindow : 'tempModal'
        }
    }
};