/**
 * Created by h_baks on 28.12.15.
 */
var tools = {
    ajax : {
        addURLParam : function (urlObj) {
            var url = urlObj.address + '?';
            for(var key in urlObj.parameters) {
                url += encodeURIComponent(key) + '=' + encodeURIComponent(urlObj.parameters[key]);
            }
            return url;
        },
        showErrorStatus : function (error, messages) {
            forAllPage.varS.forModalWindow.insertTitle.nodeValue = 'Ошибка';
            forAllPage.varS.forModalWindow.idModalWindow = 'tempModal';
            if(messages !== undefined) {
                var showMessage = {};
                for(var message in forAllPage.varS.defaultError) {
                    if(messages[message] !== undefined) {
                        showMessage[message] = messages[message];
                    } else {
                        showMessage[message] = forAllPage.varS.defaultError[message];
                    }
                }
            }
            if(showMessage) {
                if(showMessage[error.status]) {
                    forAllPage.varS.forModalWindow.insertBody.innerHTML = showMessage[error.status];
                } else {
                    forAllPage.varS.forModalWindow.insertBody.innerHTML = showMessage['default'];
                }
            } else {
                if(forAllPage.varS.defaultError[error.status]) {
                    forAllPage.varS.forModalWindow.insertBody.innerHTML = forAllPage.varS.defaultError[error.status];
                } else {
                    forAllPage.varS.forModalWindow.insertBody.innerHTML = forAllPage.varS.defaultError['default'];
                }
            }
            if(error.statusText === 'error') {
                forAllPage.varS.forModalWindow.insertBody.innerHTML = 'Ошибка отправки запроса.';
            } else if(error === '') {
                forAllPage.varS.forModalWindow.insertBody.innerHTML = 'Произошла внутренняя ошибка. Повторите попытку через несколько минут.';
            }
        },
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
                    defObj.reject(Response_error);
                }
            });
            return defObj.promise();
        }
    },
    validate : {
        check: function (inputs) {
            if (!(inputs instanceof HTMLFormControlsCollection)) {
                inputs = [inputs];
            }
            var valid = true,
                textError = 'Ошибка ввода';
            for (var index = 0; index < inputs.length; index++) {
                if (this.notValidate(inputs[index])) {
                    if(inputs[index].type != 'email') {
                        inputs[index].value = this.removeSpace(inputs[index]);
                    }
                    this.removeStatusInput(inputs[index]);
                    var error = function (text) {
                        textError = text;
                        valid = false;
                    };
                    switch (inputs[index].getAttribute('id')) {
                        case 'agree':
                            if(inputs[index].checked === false) {
                                error('Чтобы продолжить установите этот флажок');
                            }
                            break;
                        case 'phone':
                        case 'phoneCabinet' :
                            if ((/_/).test(inputs[index].value) || (inputs[index].value === "+38(0__) ___-__-__") || (inputs[index].value === "")) {
                                valid = false;
                                textError = 'Введите номер телефона';
                                break;
                            }
                            var correctOperatorCode = ['073', '039', '050', '063', '066', '067', '068', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
                            var code = inputs[index].value.match(/(\d{3})/);
                            if ((!code || correctOperatorCode.indexOf(code[0]) === -1)) {
                                valid = false;
                                textError = 'Код оператора неверный';
                                break;
                            }
                            break;
                        case 'step3Phone' :
                            if('+38-______-__-__' == inputs[index].value || inputs[index].value == '') {
                                error('Введите номер телефона');
                            }
                            break;
                        case "email" :
                            var correctEmailsDomen = ['ua', 'net', 'com', 'ru'],
                                parseEmail = (inputs[index].value).match(/(.+\.)(.+)/g);
                            try {
                                var domenEmail = parseEmail[parseEmail.length - 1];
                            } catch (error) {
                                valid = false;
                                textError = 'Введите корректный email адресс';
                                break;
                            }
                            if ((correctEmailsDomen.indexOf(domenEmail[domenEmail.length - 1]) === -1)) {
                            } else if ((/.+@.+\..+/).test(inputs[index].value)) {
                                valid = false;
                                textError = 'Некоректный ввод еmail адреса';
                            }
                            break;
                        case 'fullName':
                        case 'employer'  :
                            var checkValue = {
                                'empty': inputs[index].value,
                                'full': (inputs[index].value).match(/[А-ЯІа-яі]+-?[А-ЯІа-яі]*/g),
                                'capitalLetter': (inputs[index].value).match(/[А-ЯІ]/g),
                                'langEng': (/[A-Za-z]/).test(inputs[index].value),
                                'number' : (/\d+/).test(inputs[index].value)
                            };
                            if (!checkValue.empty) {
                                error('Введите Фамилию Имя и Отчество');
                            } else if (checkValue.langEng) {
                                error('Пожалуйста измените язык ввода');
                            } else if (!checkValue.full || checkValue.full.length != 3) {
                                error('Введите полностью Фамилию Имя и Отчество');
                            } else if (!checkValue.capitalLetter || checkValue.capitalLetter.length < 3) {
                                error('Введите Фамилию Имя и Отчество с заглавной буквы');
                            } else if(checkValue.number) {
                                error('Введите корректно Фамилию Имя и Отчество');
                            }
                            break;
                        case 'birthday':
                            if (inputs[index].value === '') {
                                textError = 'Введите Дату рождения';
                                valid = false;
                            } else {
                                var date = inputs[index].value.split('.'),
                                    currentDate = new Date(),
                                    year = currentDate.getFullYear() - date[2],
                                    month = date[1],
                                    day = date[0];
                                if (!(year >= 18 && year <= 100) || !(month <= 12) || !(day <= 31)) {
                                    valid = false;
                                    if ((18 > year) && (year > 0)) {
                                        textError = 'Вам нет 18-ти лет';
                                    } else if( (0 > year) || (year >= 100) ) {
                                        textError = 'Введите правильную дату';
                                    } else if (month > 12 || day > 31) {
                                        textError = 'Введите правильную дату';
                                    }
                                }
                            }
                            break;
                        case 'address':
                            if (inputs[index].value === '') {
                                error('Введите Адрес проживания');
                            } else if ((/[A-Za-z]/).test(inputs[index].value)) {
                                error('Пожалуйста измените язык ввода');
                            } else if(!((/[А-ЯІа-яі]+-?[А-ЯІа-яі]*/g).test(inputs[index].value)) || ((/[0-9]{4,}/).test(inputs[index].value)) ) {
                                error('Введите корректно Ваш адресс проживания');
                            }
                            break;
                        case 'city':
                            if (inputs[index].value === '') {
                                error('Введите Город проживания');
                            } else if ((/[A-Za-z]/).test(inputs[index].value)) {
                                error('Пожалуйста измените язык ввода');
                            } else if((/\d+/).test(inputs[index].value)) {
                                error('Введите корректно название города в котором Вы проживаете');
                            }
                            break;
                        case 'socialStatus' :
                            if (inputs[index].selectedIndex <= 0) {
                                if (!window.selectedOptionSocialStatus) {
                                    textError = 'Выберите Ваш социальный статус';
                                    valid = false;
                                }
                            }
                            break;
                        case 'field' :
                            if (inputs[index].selectedIndex == 0 || inputs[index].value == '') {
                                if (!window.selectedOptionField) {
                                    textError = 'Выберите отрасль';
                                    valid = false;
                                }
                            }
                            break;
                        case 'income' :
                            if (inputs[index].selectedIndex == 0 || inputs[index].value == '') {
                                if (!window.selectedOptionIncome) {
                                    textError = 'Выберите Ваш размер дохода';
                                    valid = false;
                                }
                            }
                            break;
                        default :
                            valid = 'Key is not defined';
                    }
                    if (valid == false) {
                        this.addErrorStatus(inputs[index], textError);
                        break;
                    } else {
                        this.addSuccessStatus(inputs[index], textError);
                    }
                }
            }
            return valid;
        },
        removeStatusInput: function (input) {
            input.classList.remove('js-showRedBorder');
            input.classList.remove('js-showGreenBorder');
            if(tools.propertiesDOM.screenSize('width') > 1023) {
                if (input.type === 'select-one') {
                    input.nextElementSibling.classList.remove('js-showTooltipRed');
                    input.nextElementSibling.classList.remove('js-showTooltipGreen');
                } else {
                    input.parentNode.nextElementSibling.classList.remove('js-showTooltipRed');
                    input.parentNode.nextElementSibling.classList.remove('js-showTooltipGreen');
                }
            }
        },
        addSuccessStatus: function (input, textError) {
            input.classList.add('js-showGreenBorder');
            input.classList.remove('js-showRedBorder');
            if(tools.propertiesDOM.screenSize('width') > 1023) {
                if ((textError != undefined) && (this.addSuccessStatus.caller != tools.validate.check)) {
                    if (input.type === 'select-one') {
                        input.parentNode.nextElementSibling.innerHTML = textError;
                        input.parentNode.nextElementSibling.classList.add('js-showTooltipGreen');
                    } else {
                        input.parentNode.nextElementSibling.innerHTML = textError;
                        input.parentNode.nextElementSibling.classList.add('js-showTooltipGreen');
                    }
                }
            }
        },
        addErrorStatus: function (input, textError) {
            input.classList.add('js-showRedBorder');
            input.classList.remove('js-showGreenBorder');
            if(tools.propertiesDOM.screenSize('width') > 1023) {
                if (input.type === 'select-one') {
                    input.nextElementSibling.innerHTML = textError;
                    input.nextElementSibling.classList.add('js-showTooltipRed');
                } else {
                    input.parentNode.nextElementSibling.innerHTML = textError;
                    input.parentNode.nextElementSibling.classList.add('js-showTooltipRed');
                }
            }
        },
        notValidate: function (input) {
            if (!this.notValidate.add) {
                this.notValidate.add = {};
            }
            switch (input.getAttribute('id')) {
                case 'sum':
                case 'term':
                case 'go-to-second-step':
                case 'go-to-third-step':
                case 'button-send-new-worksheet' :
                case 'field' :
                case 'socialStatus' :
                case 'income':
                    return false;
                case 'employer' :
                    if (this.notValidate.add['employer'] === undefined) {
                        return true;
                    } else {
                        return this.notValidate.add['employer'];
                    }
                    break;
                case 'step3Phone' :
                    if (this.notValidate.add['step3Phone'] === undefined) {
                        return true;
                    } else {
                        return this.notValidate.add['step3Phone'];
                    }
                    break;
                case 'email':
                    return input.value;
                    break;
                default :
                    return true;
            }
        },
        removeSpace: function (input) {
            var arraysWord = (input.value).match(/[А-ЯІа-яі\.0-9]{2,}-?[А-ЯІа-яі]*/g),
                response = input.value;
            switch(input.id)
            {
                case 'phone':
                case 'step3Phone' :
                case 'phoneCabinet' :
                    break;
                default :
                    if (arraysWord) {
                        response = arraysWord.join(' ');
                    }
            }
            return response;
        }
    },
    found : {
        getNeighbor : function(elem, criterion) {
            var parent = elem.parentNode;
            try {
                if(parent.nodeType === 1) {
                    if(parent.getElementsByTagName(criterion)) {
                        return parent.getElementsByTagName;
                    } else {
                        return parent.getElementById;
                    }
                } else if(criterion.nodeType === 3) {
                    document.getElementsByTagName;
                }
            } catch(error) {
                if(document.getElementsByClassName(criterion)) {
                    return document.getElementsByClassName;
                } else if(document.querySelectorAll(criterion)) {
                    return document.querySelector;
                }
            }
            if(criterion) {
                var neighborElem = parent.getElementsByClassName(classNameNeighbor);
                if(neighborElem) {
                    return neighborElem;
                } else {
                    return null;
                }
            } else {
                return elem.nextSubling;
            }
        },
        getParent : function(className, elem) {
            //var methodFound = this.getMethodFound(criterion);
            if(elem.classList.contains(className)) {
                return elem;
            } else if(elem.parentNode.classList.contains(className)) {
                return elem.parentNode;
            } else {
                if(elem instanceof HTMLBodyElement) {
                    return null;
                }
                return this.getParent(className, elem.parentNode);
            }
        },
        getMethodFound : function(criterion) {
            try {
                if(criterion.nodeType === 1) {
                    if(document.getElementsByTagName(criterion)) {
                        return document.getElementsByTagName;
                    } else {
                        return document.getElementById;
                    }
                } else if(criterion.nodeType === 3) {
                    document.getElementsByTagName;
                }
            } catch(error) {
                if(document.getElementsByClassName(criterion)) {
                    return document.getElementsByClassName;
                } else if(document.querySelectorAll(criterion)) {
                    return document.querySelector;
                }
            }
        }
    },
    eventUtil : {
        addHandler: function (element, type, handler) {
            if(!element) {
                throw new Error('element is null \n type event : ' + type + '\n handler : ' + handler + '\n caller : ' + arguments.callee.caller);
            }
            if(element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if(element.attachEvent) {
                element.attachEvent('on' + type, handler);
            } else {
                element['on' + type] = handler;
            }
        },
        removeHandler : function (element, type, handler) {
            if(element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if(element.detachEvent) {
                element.detachEvent('on' + type, handler);
            } else {
                element['on' + type] = null;
            }
        },
        getEvent: function (event) {
            return event ? event: window.event;
        },
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        preventDefault : function (event) {
            if(event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        stopPropagation: function (event) {
            if(event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        getRelatedTarget: function (event) {
            if(event.relatedTarget) {
                return event.relatedTarget;
            } else if(event.toElement) {
                return event.toElement;
            } else if(event.fromElement) {
                return event.fromElement;
            } else {
                return null;
            }
        },
        getButton: function (event) {
            if(document.implementation.hasFeature('MouseEvents', '2.0')) {
                return event.button;
            } else {
                switch(event.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        },
        getWheelDelta: function (event) {
            if(event.wheelDelta) {
                return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
            } else {
                return -event.detail * 40;
            }
        },
        getCharCode : function (event) {
            if(typeof event.charCode == 'number') {
                return event.charCode;
            } else {
                return event.keyCode;
            }
        },
        getCurrentTarget : function (event) {
            if(!(event.currentTarget || event.srcElement)) {
                return EventUtil.getTarget(event);
            } else {
                return event.currentTarget || event.srcElement;
            }

        },
        getPageX : function (event) {

            event = this.getEvent(event);

            var pageX = event.pageX;

            if(pageX === undefined) {
                pageX = event.clientX + (document.body.scrollLeft ||
                        document.documentElement.scrollLeft);
            }



            return pageX
        },
        getPageY : function (event) {

            event = this.getEvent(event);

            var pageY = event.pageY;

            if(pageY === undefined) {
                pageY = event.clientY + (document.body.scrollTop ||
                    document.documentElement.scrollTop);
            }

            return pageY;
        },
        getClipboardText : function (event) {
            var clipboardData = (event.clipboardData || window.clipboardData);
            return clipboardData.getData("text");
        },
        setClipboardText : function (event, value) {
            if(event.clipboardData) {
                return event.clipboardData.setData('text/plain', value);
            } else if (window.clipboardData) {
                return window.clipboardData.setData('text', value);
            }
        },
        addHandlerOnElements: function (elements, typeEvent, handler) {
            for(var i = 0; i < elements.length ; i++ ) {
                tools.eventUtil.addHandler(elements[i], typeEvent, handler);
            }
            for(var element in elements) {
                tools.eventUtil.addHandler(element, typeEvent, handler);
            }
        },
        removeHandlerOnElements : function (elements, typeEvent, handler) {
            for(var i = 0; i < elements.length ; i++ ) {
                tools.eventUtil.removeHandler(elements[i], typeEvent, handler);
            }
            for(var element in elements) {
                tools.eventUtil.removeHandler(element, typeEvent, handler);
            }
        }
    },
    client: function () {
        //визуализатор
        var engine = {
                ie : 0,
                gecko : 0,
                webkit : 0,
                khtml : 0,
                opera : 0,
                // конкретная версия
                ver : null
            },
        //браузеры
            browser = {
                ie : 0,
                firefox : 0,
                safari : 0,
                konq: 0,
                opera : 0,
                chrome : 0,
                // конкретная версия
                ver : null
            },
        //платформа/устройство/ОС
            system = {
                win : false,
                mac : false,
                x11 : false,
                //мобильные устройства
                iphone : false,
                ipod : false,
                ipad : false,
                ios: false,

                android : false,
                nokiaN : false,
                winMobile : false,
                //игровые системы
                wii : false,
                ps : false
            };

        //распознавание визуализаторов/браузеров
        var ua = navigator.userAgent;
        if(window.opera) {
            engine.ver = browser.ver = window.opera.version();
            engine.opera = browser.opera = parseFloat(engine.ver);
        } else if (/AppleWebKit\/(\S+)/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.webkit = parseFloat(engine.ver);

            //это Chrome или Safari?
            if(/Chrome\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.chrome = parseFloat(browser.ver);
            } else if (/Version\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.safari = parseFloat(browser.ver);
            } else {
                //примерочная версия
                var safariVersion = 1;
                if(engine.webkit < 100) {
                    safariVersion = 1;
                } else if (engine.webkit < 312) {
                    safariVersion = 1.2;
                } else if(engine.webkit > 412) {
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }

                browser.safari = browser.ver = safariVersion;
            }
        } else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
            engine.ver = browser.ver = RegExp["$1"];
            engine.khtml = browser.konq = parseFloat(engine.ver);
        } else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
            engine.ver = RegExp['$1'];
            engine.gecko = parseFloat(engine.ver);

            //это Firefox?
            if(/Firefox\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.firefox = parseFloat(browser.ver);
            }
        } else if(/MSIE ([^;]+)/.test(ua)) {
            engine.ver = RegExp['$1'];
            engine.ie = browser.ver = RegExp["$1"];
        }

        //распознавание браузеров
        browser.ie = engine.ie;
        browser.opera = engine.opera;

        //распознавание платформы
        var p = navigator.platform;
        system.win = p.indexOf('Win') == 0;
        system.mac = p.indexOf('Mac') == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

        //распознавание операционных систем Windows
        if(system.win) {
            if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                if(RegExp["$1"] == "NT") {
                    switch(RegExp["$2"]) {
                        case "5.0" :
                            system.win = "2000";
                            break;
                        case "5.1" :
                            system.win = "XP";
                            break;
                        case "6.0" :
                            system.win = "Vista";
                            break;
                        case "6.1" :
                            system.win = '7';
                            break;
                        case "5.0" :
                            break;
                        default:
                            system.win = "NT";
                            break;
                    }
                } else if (RegExp["$1"] == '9x') {
                    system.win = "ME";
                } else {
                    system.win = RegExp["$1"];
                }
            }
        }


        //мобильные устройства
        system.iphone = ua.indexOf("iPhone") > -1;
        system.ipod = ua.indexOf("iPod") > -1;
        system.ipad = ua.indexOf('iPad') > -1;
        system.nokiaN = ua.indexOf('NokiaN') > -1;

        //Windows Mobile
        if(system.win == "CE") {
            system.winMobile = system.win;
        } else if( system.win == 'Ph') {
            if(/Windows Phone OS (\d+.\d+)/.test(ua)) {
                system.win = 'Phone';
                system.winMobile = parseFloat(RegExp["$1"]);
            }
        }

        //определение версии IOS

        if(system.mac && ua.indexOf("Mobile") > -1) {
            if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                system.ios = parseFloat(RegExp.$1.replace('_', '.'));
            } else {
                system.ios = 2; // не возможно определить, по этому просто предполагаем
            }
        }

        //определение версии Android
        if(/Android (\d+\.\d+)/.test(ua)) {
            system.android = parseFloat(RegExp.$1);
        }

        //игровые системы
        system.wii = ua.indexOf("Wii") > -1;
        system.ps = /playstation/i.test(ua);

        //возращение данных
        return {
            engine : engine,
            browser : browser,
            system : system
        };
    }(),
    animate: {
        opacity: function (valueBefore, valueAfter, object) {
            if(valueBefore === 0 ) {
                object.style.display = 'block';
            } else if(valueBefore === 1) {
                object.style.display = 'none';
            }
            object.style.opacity = valueBefore;
            $(object).animate(
                {opacity: valueAfter},
                {
                    duration: 250,
                    specialEasing: {opacity: 'linear'}
                }
            );
            setTimeout(function () {
                if(valueAfter === 0 ) {
                    object.style.display = 'none';
                } else if(valueAfter === 1) {
                    object.style.display = 'block';
                }
                object.style.opacity = valueAfter;
            }, 300);
        }
    },
    addTempDOM : {
        toModal : function (id, text, self) {
            if(!self) {
                self = this.DOM.popup;
            }
            self.innerHTML = '';
            var insertDiv = document.createElement('div'),
                insertButton = document.createElement('button'),
                insertText = document.createTextNode(text);

            insertButton.innerHTML = 'Продолжить';
            insertButton.setAttribute('id', id);
            insertButton.style.margin = '10px';

            insertDiv.appendChild(insertText);
            insertDiv.appendChild(document.createElement('br'));
            insertDiv.appendChild(insertButton);

            self.appendChild(insertDiv);
        },
        DOM : {
            popup : document.querySelector('.popup'),
            modalWindow : document.querySelector('.popup').parentNode
        }
    },
    modalWindow : {
        show : function () {
            this.DOM.self.classList.add('js-showPopup');
        },
        showNoFoundCustomer : function () {
            var parentDiv = document.createElement('div'),
                buttonRepeat = document.createElement('button'),
                title = document.createElement('h1'),
                textBody = document.createElement('p'),
                linkReg = document.createElement('a');

            title.innerHTML = 'Номер не найден';
            textBody.innerHTML = 'Клиент с данным номером не найден или телефон указан неверно';
            buttonRepeat.innerHTML = 'Продолжить';
            linkReg.innerHTML = 'Зарегистрироваться';
            buttonRepeat.id = 'repeat-enter-number';

            var url = location.hostname.split('.');
                //my.new.kf.ua
                //new.kf.ua
            if(url[0] === 'my') {
                if(url[1] === 'site') {
                    linkReg.href = 'http://site.dev' ;
                } else {
                    linkReg.href = 'http://new.kf.ua' ;
                }
            } else if('kf'=== url[0]  || url[1] === 'kf') {
                linkReg.href = '/';
            }
            linkReg.id = 'go-to-worksheet';

            parentDiv.appendChild(title);
            parentDiv.appendChild(textBody);
            parentDiv.appendChild(document.createElement('br'));
            parentDiv.appendChild(buttonRepeat);
            parentDiv.appendChild(document.createElement('br'));
            parentDiv.appendChild(linkReg);

            tools.modalWindow.addAllDOM(parentDiv);
        },
        showErrorConnection : function () {

        },
        addDOM : function (idButton, text) {
            this.DOM.popup.innerHTML = '';
            var insertDiv = document.createElement('div'),
                insertButton = document.createElement('button'),
                insertText = document.createTextNode(text);

            insertButton.innerHTML = 'Продолжить';
            insertButton.setAttribute('id', idButton);
            insertButton.style.margin = '10px';

            insertDiv.appendChild(insertText);
            insertDiv.appendChild(document.createElement('br'));
            insertDiv.appendChild(insertButton);
            this.DOM.popup.appendChild(insertDiv);
        },
        addAllDOM : function (DOM) {
            this.DOM.popup.innerHTML = '';
            this.DOM.popup.appendChild(DOM);
        },
        DOM : {
            popup : document.querySelector('.popup'),
            self : document.querySelector('.popup').parentNode
        }
    },
    progressBar : {
        change : function (form, self) {
            var progressBar = null,
                startPosition = null,
                startPercent = null,
                COUNT_ADD_PERCENT = null,
                NUMBER_START_PERCENT = null;
            if( this.form ) {
                form = this.form;
            }
            if( form ) {
                switch(form.getAttribute('name')) {
                    case 'second-part-worksheet' :
                        startPosition = -550;
                        startPercent = 30;
                        progressBar = document.querySelector('.step2__progressBar');
                        COUNT_ADD_PERCENT = 5;
                        NUMBER_START_PERCENT = 25;
                        break;
                    case 'third-part-worksheet' :
                        startPosition = -325;
                        startPercent = 55;
                        progressBar = document.querySelector('.step3__progressBar');
                        COUNT_ADD_PERCENT = 5;
                        NUMBER_START_PERCENT = 50;
                        break;
                }
                for(var countField = 0, countEnterFields = 0; countField < form.elements.length; countField++) {
                    if(tools.validate.check(form.elements[countField])) {
                        if((form.elements[countField].type == 'select-one')) {
                            if(form.elements[countField].selectedIndex > 0) {
                                if(form.elements[countField].name == 'socialStatus') {
                                    delete window.selectedOptionSocialStatus;
                                } else if(form.elements[countField].name == 'field') {
                                    delete window.selectedOptionField;
                                } else if(form.elements[countField].name == 'income') {
                                    delete window.selectedOptionIncome;
                                }
                                ++countEnterFields;
                            } else {
                                if (window.selectedOptionSocialStatus) {
                                    ++countEnterFields;
                                    delete window.selectedOptionSocialStatus;
                                } else if (window.selectedOptionField) {
                                    ++countEnterFields;
                                    delete window.selectedOptionField;
                                } else if (window.selectedOptionIncome) {
                                    ++countEnterFields;
                                    delete window.selectedOptionIncome;
                                }
                            }
                        } else if((form.elements[countField].type != 'submit' && form.elements[countField].type != 'checkbox')) {
                            if(form.elements[countField].value != '') {
                                ++countEnterFields;
                            }
                        }
                    } else {
                        if(form.elements[countField] !== self && self.type != 'submit') {
                            if(form.elements[countField].type != 'submit') {
                                tools.validate.removeStatusInput(form.elements[countField]);
                            }
                        }
                    }
                }
                var currentPosition = parseInt(progressBar.style.backgroundPositionX);
                if(!currentPosition && countEnterFields) {
                    if(progressBar.classList.contains('step2__progressBar')) {
                        progressBar.style.backgroundPositionX = currentPosition = '-500px';
                        progressBar.querySelector('span').innerHTML = startPercent + '%';
                    } else if(progressBar.classList.contains('step3__progressBar')) {
                        progressBar.style.backgroundPositionX = currentPosition = '-275px';
                        progressBar.querySelector('span').innerHTML = startPercent + '%';
                    }
                    return false;
                }
                if(parseInt(currentPosition) >= startPosition) {
                    var newPosition = startPosition + (countEnterFields * 50);
                    progressBar.style.backgroundPositionX = newPosition + 'px';

                    progressBar.querySelector('span').innerHTML = (NUMBER_START_PERCENT + (countEnterFields * COUNT_ADD_PERCENT)) + '%';
                }
            }
        }
    },
    propertiesDOM : {
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
        selectText : function (textbox, startIndex, stopIndex) {
            if(textbox.setSelectionRange) {
                textbox.setSelectionRange(startIndex, stopIndex);
            } else if (textbox.createTextRange) {
                var range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart('character', startIndex);
                range.moveEnd('character', stopIndex - startIndex);
                range.select();
            }
            textbox.focus();
        },
        removeAllChild: function (elem) {
            return elem.cloneNode(false);
        },
        clearSelectBox : function (selectBox) {
            for(var i = 0, len = selectBox.options.length; i < len; i++) {
                selectBox.options[0].remove();
            }
        },
        disabledInputs : function (form, status) {
            var countElements = null;
            if(form instanceof  HTMLFormElement) {
                countElements = form.elements.length;
            } else {
                if(countElements.length) {
                    countElements = form.length;
                } else {
                    countElements = 1;
                }

            }
            for( var index = 0; index < countElements; index++ ) {
                form.elements[index].disabled = status;
            }
        },
        cutPhoneNumber : function (phone) {
            return phone.match(/[0-9]+/g).join('').slice(3);
        }
    },
    trigger : {
        mouse : function (element, typeEvent) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent(typeEvent, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(event);
        }
    },
    best : {
        chunk : function (array, process, context) {
            setTimeout(function () {
                var item = array.shift();
                process.call(context, item);

                if(array.length > 0) {
                    setTimeout(arguments.callee, 100);
                }
            }, 100);
        },
        curry : function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                var innerArgs = Array.prototype.slice.call(arguments),
                    finalArgs = args.concat(innerArgs);
                return fn.apply(null, finalArgs)
            }
        },
        bind : function (fn, context) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function () {
                var innerArgs = Array.prototype.slice.call(arguments),
                    finalArgs = args.concat(innerArgs);
                return fn.apply(context, finalArgs)
            }
        },
        once: function (fn, context) {
            var result;

            return function () {
                if(fn) {
                    result = fn.apply(context || this, arguments);
                    fn = null;
                }

                return result;
            }
        },
        inheritPrototype : function(subType, superType) {
            var prototype = this.object(superType.prototype);
            prototype.constructor = subType;
            subType.prototype = prototype;
        },
        object : function(o) {
            function F(){}
            F.prototype = o;
            return new F();
        },
        checkObj : function (nameObj) {
            if(typeof this[nameObj] == 'function') {
                return this[nameObj]();
            } else {
                return this[nameObj];
            }
        },
        throttle : function (method, context) {
            clearTimeout(method.tId);
            method.tId = setTimeout(function () {
                method.call(context);
            }, 100);
        },
        dayInMonth: function () {
            Date.prototype.daysInMonth = function() {
                return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
            };
        },
    },
    add : {
        script : function (src) {
            if(!((typeof src == "object") && (src instanceof Array))) {
                src = [ src ];
            }
            for(var index = 0; index < src.length; index++ ) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src[index];
                document.body.appendChild(script);
            }
        }
    }
};

tools.best.dayInMonth();