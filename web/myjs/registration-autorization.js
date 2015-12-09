/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElement);
        },
        setUpListeners: function (eventElement) {
            //EventUtil.addHandler(eventElement.inputEmailRegistration, 'blur', this.checkUseEmail);
            EventUtil.addHandler(eventElement.formEnterProfile, 'submit', this.checkUser);
            useCross.funcS.addEventOnElements(eventElement.inputRegistration, 'click', this.showStatusInput);
            EventUtil.addHandler(eventElement.divAuthReg, 'click', this.showModalAuthAndReg);
        },
        eventHandlers : {
            checkUseEmail: function (event) {
                var crossEvent = EventUtil.getEvent(event),
                    target = EventUtil.getTarget(crossEvent);
                var parentElement = this.parentNode,
                    attrBefore = this.parentNode.attributes,
                    email = document.getElementById('input-email');
                var helpFunc = app.helpFunc;
                var promise = useCross.funcS.sendAjaxRequest('/check_email', {
                    'email': email.value
                });
                promise
                    .then(
                        function (emailExist) {
                            if(emailExist === false) {
                                helpFunc.checkInputValue(crossEvent);
                            } else {
                                if(emailExist === true) {
                                    useCross.funcS.showFailResponse();
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Пользователь с данным email уже существует. Введите другой email';
                                    email.value = '';
                                    helpFunc.checkInputValue(crossEvent);
                                } else if('error connection database') {
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Ошибка соеденения с базой данных.';
                                }
                            }
                        },
                        function () {
                            useCross.funcS.showErrorConnection();
                        },
                        function () {}
                    )
                    .always(function () {
                        useCross.funcS.showModalWindow();
                    });
            },
            showStatusInput: function (event) {
                var crossEvent = EventUtil.getEvent(event);
                app.helpFunc.checkInputValue(crossEvent);
            },
            checkUser: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault();
                var inputEmail = document.querySelector('#auth-form #input-email'),
                    inputPassword = document.querySelector('#auth-form #input-password'),
                    buttonSubmit = document.querySelector('#login-modal .modal-footer button[type="submit"]');
                useCross.funcS.sendAjaxRequest('/sign_in', {
                    'email' : inputEmail.value,
                    'password' : inputPassword.value
                })
                    .then(
                        function (status) {
                            if(status.message === 'password correct') {
                                EventUtil.removeHandler(this, 'submit', arguments.callee);
                            } else {
                                useCross.funcS.showFailResponse();
                                if(status.message === 'password incorrect') {
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Вы ввели не правильный пароль. У вас осталось ' + status.countTry + ' попыток.';
                                } else if(status.message === 'not_found') {
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Пользователя с таким email не существует.';
                                } else if(status.message === 'blocked') {
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Вы 3-и раха ввели не правильный пароль. Ответьте на вопрос и повторите попытку заново.';
                                }
                            }
                        },
                        function () {
                            useCross.funcS.showErrorConnection();
                        },
                        function () {
                            useCross.funcS.showProgress(buttonSubmit, 'show');
                        }
                    )
                    .always(function () {
                        useCross.funcS.showProgress(buttonSubmit, 'hide');
                        useCross.funcS.showModalWindow();
                    });

            },
            showModalAuthAndReg: function (event) {
                event = EventUtil.getEvent(event);
                switch(EventUtil.getTarget(event).id) {
                    case "login-button":
                        useCross.varS.forModalWindow.idModalWindow = 'login-modal';
                        break;
                    case "registration-button":
                        useCross.varS.forModalWindow.idModalWindow = 'reg-modal';
                        break;
                }
                useCross.funcS.showModalWindow();
            }
        },
        eventElement: {
            inputEmailRegistration: document.querySelector('#registration-form #input-email'),
            formEnterProfile: document.getElementById('auth-form'),
            inputRegistration: document.querySelectorAll('#registration-form input'),
            buttonOpenLogin : document.getElementById('login-button'),
            buttonOpenRegistration : document.getElementById('registration-button'),
            divAuthReg : document.getElementById('div-auth-reg')
        },
        helpFunc: {
            checkInputValue: function (crossEvent) {
                var eventTarget = crossEvent.target,
                    formGroup = eventTarget.parentNode.parentNode,
                    formGlyficon = formGroup.getElementsByClassName('form-control-feedback')[0];
                if(eventTarget.value.length != 0) {
                    if(formGroup.classList.contains('has-error')) {
                        formGroup.classList.remove('has-error');
                    }
                    formGroup.classList.add('has-success');
                    if(formGlyficon.classList.contains('glyphicon-remove')) {
                        formGlyficon.classList.remove('glyphicon-remove');
                    }
                    formGlyficon.classList.add('glyphicon-ok');
                } else {
                    if(formGroup.classList.contains('has-success')) {
                        formGroup.classList.remove('has-success');
                        formGroup.classList.add('has-error');
                    }
                    if(formGlyficon.classList.contains('glyphicon-ok')) {
                        formGlyficon.classList.remove('glyphicon-ok');
                        formGlyficon.classList.add('glyphicon-remove');
                    }
                }
            }
        },
        variable: {

        }
    };
    app.initialize();
}());