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
            forAllPage.funcS.addEventOnElements(eventElement.inputRegistration, 'click', this.showStatusInput);
            EventUtil.addHandler(eventElement.divAuthReg, 'click', this.showModalAuthAndReg);
        },
        eventHandlers : {
            checkUseEmail: function (event) {
                event = EventUtil.getEvent(event);
                var buttonSubmit = document.querySelector('button[form="registration-form"]');
                var email = document.getElementById('input-email');
                forAllPage.funcS.sendAjaxRequest('/check_email', {
                    'email': email.value
                })
                    .then(
                        function (emailExist) {
                            if(emailExist) {
                                if(app.helpFunc.checkInputsValue(email)) {
                                    forAllPage.varS.forModalWindow.action = false;
                                } else {
                                    document.forms['reg-form'].elements['email'].reset();
                                }
                            }
                        },
                        function (error) {
                            forAllPage.funcS.showFailResponse(error);
                        },
                        function () {
                            forAllPage.funcS.showProgress(buttonSubmit, 'show');
                        }
                    )
                    .always(function () {
                        forAllPage.funcS.showProgress(buttonSubmit, 'hide');
                        forAllPage.funcS.showModalWindow();
                    });
            },
            showStatusInput: function (event) {
                event = EventUtil.getEvent(event);
                app.helpFunc.checkInputsValue(EventUtil.getCurrentTarget(event));
            },
            checkUser: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault();
                var inputEmail = document.querySelector('#auth-form #input-email'),
                    inputPassword = document.querySelector('#auth-form #input-password'),
                    buttonSubmit = document.querySelector('#login-modal .modal-footer button[type="submit"]');
                forAllPage.funcS.sendAjaxRequest('/sign_in', {
                    'email' : inputEmail.value,
                    'password' : inputPassword.value
                })
                    .then(
                        function (status) {
                            if(status === 'ok') {
                                app.eventElement.formEnterProfile.submit();
                                //EventUtil.removeHandler(this, 'submit', arguments.callee);
                            } else if(status === '') {
                                forAllPage.funcS.showFailResponse('');
                            }
                        },
                        function (error) {
                            var messages = {
                                404: 'Пользователь с данным email не найден.',
                                403: 'Вы ввели неправильный пароль.',
                                423: "Вы три раза ввели неправильный пароль. Ответьте на вопрос перед тем как потворить попытку."
                            };
                            forAllPage.funcS.showFailResponse(error, messages);
                        },
                        function () {
                            forAllPage.funcS.showProgress(buttonSubmit, 'show');
                        }
                    )
                    .always(function () {
                        forAllPage.funcS.showProgress(buttonSubmit, 'hide');
                        forAllPage.funcS.showModalWindow();
                    });

            },
            showModalAuthAndReg: function (event) {
                event = EventUtil.getEvent(event);
                switch(EventUtil.getTarget(event).id) {
                    case "login-button":
                        forAllPage.varS.forModalWindow.idModalWindow = 'login-modal';
                        break;
                    case "registration-button":
                        forAllPage.varS.forModalWindow.idModalWindow = 'reg-modal';
                        break;
                }
                forAllPage.funcS.showModalWindow();
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
            checkInputsValue: function (elem) {
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
                var inputs = [];
                if(!elem.length) {
                    inputs.push(elem);
                } else {
                    inputs = elem;
                }
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