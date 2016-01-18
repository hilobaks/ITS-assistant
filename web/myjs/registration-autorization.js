/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElement);
        },
        setUpListeners: function (eventElement) {
            EventUtil.addHandler(eventElement.inputEmailRegistration, 'change', this.checkUseEmail);
            EventUtil.addHandler(eventElement.formEnterProfile, 'submit', this.checkUser);
            forAllPage.funcS.addEventOnElements(eventElement.inputRegistration, 'blur', this.showStatusInput);
            EventUtil.addHandler(eventElement.buttonOpenLogin, 'click', this.showModalAuthAndReg);
            EventUtil.addHandler(eventElement.buttonOpenRegistration, 'click', this.showModalAuthAndReg);
            EventUtil.addHandler(eventElement.sendAgainButton, 'click', this.showModalAuthAndReg);
            EventUtil.addHandler(eventElement.sendAgainForm, 'submit', this.sendAgainPassword);
        },
        eventHandlers : {
            checkUseEmail: function (event) {
                event = EventUtil.getEvent(event);
                var buttonSubmit = document.querySelector('button[form="registration-form"]');
                var email = document.querySelector('#registration-form #input-email');
                forAllPage.funcS.sendAjaxRequest('/check_email', {
                    'email': this.value
                })
                    .then(
                        function (emailExist) {
                            if(emailExist) {
                                app.helpFunc.showCorrectInput('success', email);
                                forAllPage.varS.forModalWindow.action = false;
                                buttonSubmit.type = 'submit';
                            }
                        },
                        function (error) {
                            app.helpFunc.showCorrectInput('error', email, {
                                text : 'Введите другой email',
                                action: true
                            });
                            forAllPage.funcS.showFailResponse(error, {
                                403: 'Пользователь с данным email уже существует.'
                            });
                            buttonSubmit.type = 'button';
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
                            if(status) {
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
                switch(EventUtil.getCurrentTarget(event).id) {
                    case "login-button":
                        forAllPage.varS.forModalWindow.idModalWindow = 'login-modal';
                        break;
                    case "registration-button":
                        forAllPage.varS.forModalWindow.idModalWindow = 'reg-modal';
                        break;
                    case "send-again-password":
                        forAllPage.varS.forModalWindow.idModalWindow = 'send-again-modal';
                        $('#login-modal').modal('hide');
                        break;
                }
                forAllPage.funcS.showModalWindow();
            },
            sendAgainPassword : function (event) {
                EventUtil.preventDefault(event);
                var that = this;
                forAllPage.funcS.sendAjaxRequest('/send_again', {
                    email : this.elements['email'].value
                })
                    .then(
                        function (response) {
                            $('#send-again-modal').modal('hide');
                            var message = {
                                idModalWin : 'tempModal',
                                title : document.createTextNode('Проверьте Вашу почту'),
                                body : document.createTextNode('Вам на почту было выслано письмо с паролем для входа')
                            };
                            forAllPage.funcS.showSuccessResponse(message);
                        }, function (error) {
                            forAllPage.funcS.showFailResponse(error, {
                                404: 'Пользователь с данным email не найден.'
                            });
                        }, function () {
                            that.elements['submit-send-again'].disable = true;
                            forAllPage.funcS.showProgress(that.elements['submit-send-again'], 'show');
                        }
                    )
                    .always(
                        function () {
                            that.elements['submit-send-again'].disable = false;
                            forAllPage.funcS.showProgress(that.elements['submit-send-again'], 'hide');
                            forAllPage.funcS.showModalWindow();
                        }
                    );
            }
        },
        eventElement: {
            inputEmailRegistration: document.querySelector('#registration-form #input-email'),
            formEnterProfile: document.getElementById('auth-form'),
            inputRegistration: document.querySelectorAll('#registration-form input:not(#input-email)'),
            buttonOpenLogin : document.getElementById('login-button'),
            buttonOpenRegistration : document.getElementById('registration-button'),
            divAuthReg : document.getElementById('div-auth-reg'),
            sendAgainButton : document.getElementById('send-again-password'),
            sendAgainForm : document.forms['send-again-form']
        },
        helpFunc: {
            checkInputsValue: function (elem) {
                var valid = true;
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
                                if((/^.+@.+\..{2,}$/).test(inputs[i].value)) {
                                    app.helpFunc.showCorrectInput('success', inputs[i]);
                                    valid = true;
                                } else {
                                    app.helpFunc.showCorrectInput('error', inputs[i], 'Некоректный ввод');
                                    valid = false;
                                }
                                break;
                            default :
                                if(inputs[i].checkValidity()) {
                                    app.helpFunc.showCorrectInput('success', inputs[i]);
                                } else {
                                    app.helpFunc.showCorrectInput('error', inputs[i]);
                                }
                        }
                    } else {
                        app.helpFunc.showCorrectInput('error', inputs[i]);
                        valid = false
                    }
                }

                return valid;
            },
            showCorrectInput: function (command, elem, message) {
                var formGroup = elem.parentNode.parentNode,
                    label = formGroup.getElementsByTagName('label')[0],
                    formGlyficon = formGroup.getElementsByClassName('form-control-feedback')[0];
                if(command === 'error') {
                    if(message === undefined) {
                        message = 'Введите ' + forAllPage.funcS.crossInnerText(label, 'get');
                    } else {
                        if(message.action) {
                            message =  message.text;
                        } else {
                            message = message + forAllPage.funcS.crossInnerText(label, 'get');
                        }
                    }
                    $(elem).tooltip({
                        title : message
                    }).tooltip('show');
                    formGroup.classList.remove('has-success');
                    formGroup.classList.add('has-error');
                    formGlyficon.classList.remove('glyphicon-ok');
                    formGlyficon.classList.add('glyphicon-remove');
                } else if(command === 'success') {
                    $(elem).tooltip('destroy');
                    formGroup.classList.remove('has-error');
                    formGroup.classList.add('has-success');
                    formGlyficon.classList.remove('glyphicon-remove');
                    formGlyficon.classList.add('glyphicon-ok');
                }
            },
            sendAgainPassword : function (event) {
                var email = this.elements['email'].value;
                forAllPage.funcS.sendAjaxRequest('');
            }
        },
        variable: {

        }
    };
    app.initialize();
}());