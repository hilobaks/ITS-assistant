/**
 * Created by h_baks on 02.12.15.
 */
var forAllPage = {
    funcS : {
        submitForm: function (e) {
            var formGroup = $(e.currentTarget).find('.form-group:first-child');
            if(formGroup.hasClass('has-warning')) {
                formGroup.removeClass('has-warning');
                formGroup.find('.form-control-feedback').removeClass('glyphicon-warning-sign');
            }
            e.preventDefault();
            var form = $(this);
            var textInputs = {};
            if (forAllPage.validateForm(form, textInputs) === false) {
                return false;
            } else {
                function tempPartCalcShow(Object) {
                    Object.css('opacity', '0').removeClass('hidden').animate(
                        {
                            opacity: 1
                        },
                        {
                            duration: 1000,
                            specialEasing: {
                                opacity: 'swing'
                            }

                        }
                    );
                    Object.removeClass('hidden');
                }
                function tempPartCalcHide(Object) {
                    Object.css('opacity', '1').animate(
                        {
                            opacity: 0
                        },
                        {
                            duration: 1000,
                            specialEasing: {
                                opacity: 'swing'
                            }

                        }
                    );
                    Object.addClass('hidden');
                }
                switch ($(this).attr('id')) {
                    case 'firstPartCalc':
                        window.infoFirstPartCalc = textInputs;
                        if(forAllPage.screenSize('width') < 768) {
                            window.infoFirstPartCalc.amountCash = $('#MvalueAmount').text();
                            window.infoFirstPartCalc.amountDate = $('#MvalueDate').text();
                        } else {
                            window.infoFirstPartCalc.amountCash = $('#valueAmount').text();
                            window.infoFirstPartCalc.amountDate = $('#valueDate').text();
                        }
                        if((/\d+\s{0,1}[а-я]{1,6}/).test(window.infoFirstPartCalc.amountDate)) {
                            window.infoFirstPartCalc.anurietet = true;
                        } else {
                            window.infoFirstPartCalc.anurietet = false;
                        }
                        forAllPage.submitForm.actTrueFirstPartCalc = function () {
                            tempPartCalcHide($('#calculator'));
                            tempPartCalcShow($('#contactInformation'));
                            worksheet.copyValueCalc();
                            worksheet.copyName();
                        };
                        forAllPage.submitForm.actFalseFirstPartCalc = function () {
                            var formGroup = $(e.currentTarget).find('.form-group:first-child');
                            formGroup.removeClass('has-success').addClass('has-warning');
                            formGroup.find('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-warning-sign');
                            $('#phone').val($('#calculator #inputNumber').val());
                        };
                        var response = worksheet.checkActiveContract(e);
                        break;
                    case 'secondPartCalc':
                        window.infoSecondPartCalc = textInputs;
                        tempPartCalcHide($('#contactInformation'));
                        tempPartCalcShow($('#sourceIncome'));
                        break;
                    case 'thirdPartCalc':
                        var thirdPartCalc = textInputs;
                        thirdPartCalc.socialStatus = $('#typeSocialStatus').text();
                        thirdPartCalc.branch = $('#typeBranch').text();
                        thirdPartCalc.sizeSalary = $('#sizeRevenue').text();
                        delete window.infoSecondPartCalc['link-agree-statement'];
                        var textInputs = {
                            'firstPartCalc' : window.infoFirstPartCalc,
                            'secondPartCalc' : window.infoSecondPartCalc,
                            'thirdPartCalc' : thirdPartCalc
                        };
                        var namesField = {
                                firstPartCalc : ['number', 'e_mail', 'all_back_money', 'all_period', 'anurietet'],
                                secondPartCalc : ['fio', 'birthday', 'city_live', 'address_live'],
                                thirdPartCalc : ['fio_lead', 'contact_number', 'social_status', 'branch', 'size_salary' ]
                            },
                            resultArray = [];
                        for(var object in textInputs) {
                            var objectNamesFields = '',
                                i = 0;
                            if(object === 'firstPartCalc') {
                                objectNamesFields = namesField.firstPartCalc;
                            } else if(object === 'secondPartCalc') {
                                objectNamesFields = namesField.secondPartCalc;
                            } else if(object === 'thirdPartCalc') {
                                objectNamesFields = namesField.thirdPartCalc;
                            }
                            for(var field in textInputs[object]) {
                                var name = objectNamesFields[i],
                                    temp = {};
                                temp[name] = textInputs[object][field];
                                resultArray.push(temp);
                                ++i;
                            }
                        }
                        $.ajax({
                            url: '/save_info',
                            type: "POST",
                            data: {'textInputs' : JSON.stringify(resultArray)},
                            success: function (Response_success) {
                                alert(Response_success);
                                if(window.location) {
                                    window.location.reload();
                                } else {
                                    location.reload();
                                }
                            },
                            error: function (Response_error) {
                                alert('Ошибка соеденения.');
                            }
                        });
                        delete firstPartCalc;
                        delete secondPartCalc;
                        break;
                    //Этот case вынесен в pageIndexMyKf.js
                    case 'formEnterProfile':
                        if(window.countSendRequest === undefined) {
                            window.countSendRequest = 0;
                        } else {
                            window.countSendRequest = 1;
                        }
                        var ajaxResponse = function (insertElement, title) {
                            $('#tempModalWindow .modal-body').empty().append(insertElement);
                            $('#titleTempModalWindow').text(title);
                            $('#tempModalWindow').modal('show');
                            setTimeout(function () {
                                $('#tempModalWindow').modal('hide');
                                $('#tempModalWindow .modal-body').empty();
                                $('#titleTempModalWindow').text('');
                            }, 3000);
                        };
                        var data = {},
                            url = '',
                            inputNumber = $('#formEnterProfile #inputNumber'),
                            inputPassword = $('#formEnterProfile #inputPassword'),
                            buttonEnterProfile = $('#buttonEnterProfile');
                        if(window.countSendRequest === 0) {
                            window.countSendRequest ++;
                            url = '/otp';
                            data = {
                                'phone_number' : inputNumber.val()
                            };
                        } else {
                            url = '/login';
                            data = {
                                'inputNumber' : inputNumber.val(),
                                'inputPassword' : inputPassword.val()
                            };
                        }
                        var countData = 0;
                        for(var prop in data) { countData++; }
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: data,
                            beforeSend: function () {
                                buttonEnterProfile.prop('disabled', true);
                            },
                            success: function(Response_success) {
                                if(countData == 1) {
                                    ajaxResponse('<span> Ожидайте смс с паролем на ваш мобильный телефон! </span>' , 'Проверьте ваш телефон');
                                    app.appObject.pageIndexMyKf.showInputPass();
                                } else {
                                    //Так как большинство из разобранных случаев это ошибка, имеет смысл
                                    //инициализировать переменную текстовым узлом с текстом "Ошибка"
                                    var titleText = document.createTextNode('Ошибка'),
                                        bodyText =  document.createTextNode('');
                                    function showErrorInInput() {
                                        var formGroup = document.querySelector('label[for="inputPassword"]').parentNode;
                                        if(formGroup.classList.contains('has-success')) {
                                            formGroup.classList.remove('has-success');
                                            formGroup.classList.add('has-error');
                                            inputPassword.next('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                                        }
                                    }
                                    function exeptionError(textError) {
                                        showErrorInInput();
                                        bodyText =  document.createTextNode(textError);
                                        app.appObject.pageAll.tempModalWindow(titleText, bodyText);
                                        setTimeout(function () {location.reload();}, 3500);
                                    }
                                    if(Response_success === 'term expired password') {
                                        exeptionError('Срок действия вашего пароля истёк.\n Запросите новый.');
                                    } else if (Response_success === 'password used') {
                                        exeptionError('Вы уже использовали этот пароль.\n Запросите новый.');
                                    } else if(Response_success === 'password wrong') {
                                        showErrorInInput();
                                        bodyText =  document.createTextNode('Вы ввели неправильный пароль.\n Повторите попытку');
                                        app.appObject.pageAll.tempModalWindow(titleText, bodyText);
                                        inputPassword.val('');
                                    } else if(Response_success === 'password send less third attempt') {
                                        exeptionError('Вы ввели три раза неправильный пароль. \n Повторите процедуру авторизации заново.');
                                    } else if(Response_success === 'password correct') {
                                        titleText = document.createTextNode('Успех');
                                        bodyText =  document.createTextNode('Добро пожаловать');
                                        app.appObject.pageAll.tempModalWindow(titleText, bodyText);
                                        var formEnterProfile = document.getElementById('formEnterProfile');
                                        formEnterProfile.removeEventListener('submit', app.appObject.pageAll.submitForm);
                                        formEnterProfile.removeEventListener('keydown', app.appObject.pageAll.removeError);
                                        formEnterProfile.submit();
                                    }
                                }
                            },
                            error: function (Response_error) {
                                ajaxResponse('<strong> Ошибка соеденения! </strong>','Ошибка');
                                console.log(Response_error);
                                buttonEnterProfile.prop('disabled', false);
                            },
                            complete: function () {
                                buttonEnterProfile.prop('disabled', false);
                            }
                        });
                        break;
                }
                $('button[name="buttonCallback"]').on('click', function () {
                    sendWebToLeadDataRequest();
                    $('#callbackModal').modal('hide');
                });
            }
        },
        validateForm: function (form , textInputs) {
            var inputs = form.find('input'),
                valid = true;
            inputs.tooltip('destroy');

            $.each(inputs, function (index, val) {
                if (($(val).attr('type') === 'checkbox') && !($(val).hasClass("link-agree-statement")) || $(val).hasClass('hidden')) {
                    return true;
                }
                var input = $(val),
                    val = input.val(),
                    formGroup = input.parents('.form-group'),
                    formGlyficon = input.next('span'),
                    label = formGroup.find('label').text().toLowerCase(),
                    textError = 'Введите ' + label;
                if (val.length === 0) { //сравниваем на пустоту значение input, так как input date всегда не пустой, нужно проверять не является ли дата текущей
                    textInputs[input.attr('name')] = val;
                    if(input.attr('name') === 'inputNameNachallnika' || input.attr('name') === 'inputNumberNachallnika') {
                        if(sessionStorage.getItem('notCheckInput')) {;
                            return true;
                        }
                    }
                    if ((input.attr('name') === 'inputEmail')) {
                        if (input.parents('#callbackModal').length === 0) {
                            return true;
                        }
                    }
                    formGroup.addClass('has-error').removeClass('has-success');
                    formGlyficon.removeClass('glyphicon-ok').addClass('glyphicon-remove');
                    var position = '',
                        sreenSize = app.appObject.pageAll.screenSize;
                    if(sreenSize('width') < 768) {
                        position = 'bottom';
                    } else {
                        position = 'right';
                    }
                    input.tooltip({
                        trigger: 'manual',
                        placement: position,
                        title: textError
                    }).tooltip('show');
                    valid = false;
                    return true;
                } else {
                    var correct = true,
                        check = true,
                        textError = 'Некоректный ввод данных';
                    switch (input.attr('name')) {
                        case "link-agree-statement":
                            correct = check = input.prop('checked');
                            textError = 'Сначала подтвердите условия кредитирования';
                            break;
                        case 'inputBirthday':
                            var date = val.split('.'),
                                currentDate = new Date(),
                                year = currentDate.getFullYear() - date[2],
                                month = date[1],
                                day = date[0];
                            if (!(year >= 18 && year <= 65) || !(month <= 12) || !(day <= 31)) {
                                correct = false;
                                if (year < 18) {
                                    textError = 'Вам нет 18-ти лет';
                                } else if(month > 12) {
                                    textError = 'Введите правильную дату';
                                } else if(day > 31) {
                                    textError = 'Введите правильную дату';
                                }
                            }
                            break;
                        case 'inputNameNachallnika':
                        case 'inputName':
                            var pos = val.indexOf(' ');
                            for (var countSpaceSumbol = Boolean(pos); val.indexOf(' ', pos + 1) != -1; ++countSpaceSumbol) {
                                pos = val.indexOf(' ', pos + 1);
                            }
                            if ((countSpaceSumbol < 2) || app.checkLanguage(val) || (/\.+/).test(val) || (/\W{0,2}\s+\W{0,2}\s+\W{0,2}/).test(val)) correct = false;
                            textError = 'Введите полностью Фамилию Имя и Отчество';
                            break;
                        case 'inputEmail':
                            var domenEmail = val.split('.'),
                                correctDomenEmail = ['ua', 'net', 'com', 'ru'],
                                adr_pattern = /.+@.+\..+/i;
                            check = adr_pattern.test(val);
                            if (check) {
                                for (var i = 0; i != domenEmail.length - 1; i++) {
                                    if (/@/.test(domenEmail[i])) {
                                        var partEmail = domenEmail[i].split('@');
                                        for (var j = 0; check != false && j != partEmail.length - 1; j++) {
                                            check = app.checkLanguage(partEmail[j]);
                                        }
                                    } else {
                                        check = app.checkLanguage(domenEmail[i]);
                                    }
                                }
                            }
                            if ((correctDomenEmail.indexOf(domenEmail[domenEmail.length - 1]) === -1)) correct = false;
                            break;
                        case 'inputNumber':
                        case 'inputNumberNachallnika' :
                            var correctСodeNumber = ['073', '039', '050', '063', '066', '067', '068', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
                            var temp = val.split('(');
                            temp = temp[1].split(')');
                            check = true;
                            if ((correctСodeNumber.indexOf(temp[0]) === -1)) correct = false;
                            break;
                        case 'inputAddressHome':
                        case 'inputAddressRegistration' :
                        case 'inputPassword' :
                            break;
                        default :
                            if (app.checkLanguage(val)) {
                                textError = 'Вводите данные на кирилице';
                                correct = false;
                            }
                            break;
                    }
                    if (!(check && correct)) {
                        formGroup.addClass('has-error').removeClass('has-success');
                        formGlyficon.removeClass('glyphicon-ok').addClass('glyphicon-remove');
                        input.tooltip({
                            trigger: 'manual',
                            placement: 'right',
                            title: textError
                        }).tooltip('show');
                        setTimeout(function () {
                            input.tooltip('hide');
                        }, 5000);
                        valid = false;
                        return true;
                    }
                    if (valid != false) {
                        textInputs[input.attr('name')] = val;
                        formGroup.addClass('has-success').removeClass('has-error');
                        formGlyficon.removeClass('glyphicon-remove').addClass('glyphicon-ok');
                    }
                }
            });
            return valid;
        },
        removeError: function () {
            $(this).tooltip('destroy').parent('.formGroup').removeClass('has-error');
        },
        animateOpacity: function (valueBefore, valueAfter, object) {
            if(valueBefore === 0 ) {
                object.classList.remove('hidden');
            } else if(valueBefore === 1) {
                object.classList.add('hidden');
            }
            object.style.opacity = valueBefore;
            $(object).animate(
                {opacity: valueAfter},
                {
                    duration: 1000,
                    specialEasing: {opacity: 'easeOutQuint'}
                }
            );
            setTimeout(function () {
                if(valueAfter === 0 ) {
                    object.classList.add('hidden');
                } else if(valueAfter === 1) {
                    object.classList.remove('hidden');
                }
                object.style.opacity = valueAfter;
            },1000);
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
        },
        showModalWindow: function () {
            var helpFunc = forAllPage.funcS,
                variable = forAllPage.varS.forModalWindow,
                modalWindow = document.getElementById(variable.idModalWindow);
            if(variable.action) {
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
            } else {
                variable.action = true;
            }
        },
        showSuccessResponse : function (message) {

            var variable = forAllPage.varS.forModalWindow;
                variable.insertBody.innerHTML = '';
                variable.insertTitle.innerHTML = '';
            variable.idModalWindow = message.idModalWin;
            variable.insertTitle.appendChild(message.title);
            variable.insertBody.appendChild(message.body);

        },
        showFailResponse : function (error, messages) {
            var variable = forAllPage.varS.forModalWindow;
            variable.insertTitle.nodeValue = 'Ошибка';
            variable.idModalWindow = 'tempModal';
            var showMessage = {};
            if(messages !== undefined) {
                for(var message in variable.defaultError) {
                    if(messages[message] !== undefined) {
                        showMessage[message] = messages[message];
                    } else {
                        showMessage[message] = variable.defaultError[message];
                    }
                }
            }
            if(showMessage) {
                if(showMessage[error.status]) {
                    variable.insertBody.innerHTML = showMessage[error.status];
                } else {
                    variable.insertBody.innerHTML = showMessage['default'];
                }
            } else {
                if(variable.defaultError[error.status]) {
                    variable.insertBody.innerHTML = variable.defaultError[error.status];
                } else {
                    variable.insertBody.innerHTML = variable.defaultError['default'];
                }
            }
            if(error.statusText === 'error') {
                variable.insertBody.innerHTML = 'Ошибка отправки запроса.';
            } else if(error === '') {
                variable.insertBody.innerHTML = 'Произошла внутренняя ошибка. Повторите попытку через несколько минут.';
            }
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
        },
        crossGetStyle: function (elem) {
            return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
        },
        downloadScript: function (src) {
            var script = document.createElement('script');
            EventUtil.addHandler(script, 'readystatechange', function (event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);
                if (target.readyState == 'loaded' || target.readyState == 'complete') {
                    EventUtil.removeHandler(target, 'readystatechange', arguments.callee);
                }
            });
            script.type = 'text/javascript';
            script.src = src;
            document.body.appendChild(script);
        },
        adaptiveBootstrap: function () {
            var addAndDeleteClass = function (inputs, addingClass, removeClass) {
                var inputClass = '';
                for(var i = 0; i < inputs.length; i++) {
                    inputClass = inputs[i].classList;
                    inputClass.add(addingClass);
                    inputClass.remove(removeClass[0], removeClass[1], removeClass[2]);
                }
            };
            var inputs = document.querySelectorAll('input:not([type="checkbox"])'),
                inputsGroup = document.querySelectorAll('.input-group'),
                buttons = document.querySelectorAll('.btn:not(.btn-group');
            if (forAllPage.funcS.screenSize('width') > 1366) {
                addAndDeleteClass( inputs, 'input-lg', ['input-md', 'input-xs', 'input-sm']);
                addAndDeleteClass( inputsGroup, 'input-group-lg', ['input-group-xs', 'input-group-sm', 'input-group-md']);
                addAndDeleteClass( buttons, 'btn-lg', ['btn-xs', 'btn-md', 'btn-sm']);
            } else if (forAllPage.funcS.screenSize('width') > 992) {
                addAndDeleteClass( inputs, 'input-md', ['input-lg', 'input-xs', 'input-sm']);
                addAndDeleteClass( inputsGroup, 'input-group-md', ['input-group-xs', 'input-group-sm', 'input-group-lg']);
                addAndDeleteClass( buttons, 'btn-md', ['btn-xs', 'btn-lg', 'btn-sm']);
            } else if (forAllPage.funcS.screenSize('width') > 768) {
                addAndDeleteClass( inputs, 'input-sm', ['input-lg', 'input-xs', 'input-md']);
                addAndDeleteClass( inputsGroup, 'input-group-sm', ['input-group-xs', 'input-group-md', 'input-group-lg']);
                addAndDeleteClass( buttons, 'btn-sm', ['btn-xs', 'btn-lg', 'btn-md']);
            } else if (forAllPage.funcS.screenSize('width') < 768) {
                addAndDeleteClass( inputs, 'input-xs', ['input-lg', 'input-sm', 'input-md']);
                addAndDeleteClass( inputsGroup, 'input-group-xs', ['input-group-sm', 'input-group-md', 'input-group-lg']);
                addAndDeleteClass( buttons, 'btn-xs', ['btn-sm', 'btn-lg', 'btn-md']);
            }
        },
        trigger : {
            mouse : function (element, typeEvent) {
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent(typeEvent, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(event);
            }
        },
    },
    varS : {
        forModalWindow: {
            insertTitle : document.createTextNode('Ошибка'),
            insertBody : document.createElement('div'),
            idModalWindow : 'tempModal',
            defaultError: {
                403: 'Доступ запрещен.',
                404: 'По данному запросу нечего не найдено.',
                422: 'Произошла внутренняя ошибка. Повторите попытку через несколько минут.',
                423: 'Доступ заблокирован.',
                500: 'Произошла внутренняя ошибка. Повторите попытку через несколько минут.',
                default: 'Проверьте ваше подлючение к Интернету.'
            },
            action: true
        }
    }
};