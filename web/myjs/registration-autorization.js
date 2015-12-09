/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElement);
        },
        setUpListeners: function (eventElement) {
            EventUtil.addHandler(eventElement.inputEmailRegistration, 'blur', this.checkUseEmail);
            EventUtil.addHandler(eventElement.formEnterProfile, 'submit', this.checkUser);
            useCross.funcS.addEventOnElements(eventElement.inputRegistration, 'click', this.showStatusInput);
            EventUtil.addHandler(eventElement.divAuthReg, 'click', this.showModalAuthAndReg);
            EventUtil.addHandler(eventElement.submitRegButton, 'click', this.showModalAuthAndReg);
        },
        eventHandlers : {
            checkUseEmail: function (event) {
                var crossEvent = EventUtil.getEvent(event);
                var buttonSubmit = document.querySelector('button[form="registration-form"]');
                var email = document.getElementById('input-email');
                var promise = useCross.funcS.sendAjaxRequest('/check_email', {
                    'email': email.value
                });
                promise
                    .then(
                        function (emailExist) {
                            if(!emailExist) {
                                app.helpFunc.checkInputsValue(email);
                            } else {
                                if(emailExist === true) {
                                    useCross.funcS.showFailResponse();
                                    useCross.varS.forModalWindow.insertBody.innerHTML = '';
                                    email.value = '';
                                    app.helpFunc.checkInputsValue(email);
                                }
                            }
                        },
                        function (error) {
                            useCross.funcS.showErrorConnection();
                            switch(error.status) {
                                case "500":
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Ошибка соеденения с базой данных.';
                                    break;
                                case "404":
                                    useCross.varS.forModalWindow.insertBody.innerHTML = 'Пользователь с данным email уже существует. Введите другой email';
                                    break;
                            }
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
            checkInputsValue: function (inputs) {
                var valid = true;
                var correct = function (command, elem, message) {
                    var formGroup = elem.parentNode.parentNode,
                        label = formGroup.getElementsByTagName('label')[0],
                        formGlyficon = formGroup.getElementsByClassName('form-control-feedback')[0];
                    if(command === 'error') {
                        $(elem).tooltip({
                            title : message
                        }).tooltip('show');
                        formGroup.classList.remove('has-success');
                        formGroup.classList.add('has-error');
                        formGlyficon.classList.remove('glyphicon-ok');
                        formGlyficon.classList.add('glyphicon-remove');
                    } else if(command === 'success') {
                        formGroup.classList.remove('has-error');
                        formGroup.classList.add('has-success');
                        formGlyficon.classList.remove('glyphicon-remove');
                        formGlyficon.classList.add('glyphicon-ok');
                    }
                };
                for(var i = 0; i < inputs.length; i++) {
                    if(inputs[i].value.length != 0) {
                        switch(inputs[i].attributes.id) {
                            case "input-email" :
                                if((/^.+@.+\..+$/).test(inputs[i].value)) {
                                    correct('success', inputs[i]);
                                    valid = true;
                                } else {
                                    correct('error', inputs[i], 'Некоректный ввод email');
                                    valid = false;
                                }
                                break;
                            case "" :
                                break;
                            default :
                                correct('success', inputs[i]);
                        }

                    } else {
                        correct('error', inputs[i], 'Введите' + label.value);
                        valid = false
                    }
                }

                return valid;
            }
        },
        variable: {

        }
    };
    app.initialize();
}());