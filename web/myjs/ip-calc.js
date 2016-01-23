(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElements);
        },

        setUpListeners: function (eventElements) {
            EventUtil.addHandler(eventElements.inputMaskSubNetwork, 'click', this.selectTypeMask);
            EventUtil.addHandler(eventElements.formCalcIP, 'submit', this.ipCalc);
            forAllPage.funcS.addEventOnElements(eventElements.formCalcIP.elements, 'change', this.validInputsCalc);
        },
        eventHandlers : {
            ipCalc: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault(event);
                var inputsIpAddress = document.getElementsByClassName('input-ip-address');
                var inputsMask = app.helpFunc.getMaskSubNetwork(this);
                if(app.helpVar.validInputsCalc) {
                    var ipTenToSecond = app.helpFunc.tenToSecond({
                        firstPartIp : inputsIpAddress[0].value,
                        secondPartIp : inputsIpAddress[1].value,
                        thirdPartIp : inputsIpAddress[2].value,
                        fourthPartIp : inputsIpAddress[3].value
                    }).join('');
                    var maskTenToSecond = app.helpFunc.getMaskTenToSecond(inputsMask);
                    var outputNumberAddress = document.getElementsByClassName('output-ip-address'),
                        broadcast = document.getElementsByClassName('broadcast'),
                        allNumberAddress = {
                            firstPartNumberAddress : outputNumberAddress[0],
                            secondPartNumberAddress : outputNumberAddress[1],
                            thirdPartNumberAddress : outputNumberAddress[2],
                            fourthPartNumberAddress : outputNumberAddress[3]
                        },
                        allBroadcast = {
                            firstPartBroadcast : broadcast[0],
                            secondPartBroadcast : broadcast[1],
                            thirdPartBroadcast : broadcast[2],
                            fourthPartBroadcast : broadcast[3]
                        };
                    var numberNetwork = app.helpFunc.getNumberNetwork(ipTenToSecond, maskTenToSecond),
                        responseNumberNetwork = app.helpFunc.secondToTen(numberNetwork.match(/\d{8}/g)),
                        numberBroadcast = app.helpFunc.getBroadcast(ipTenToSecond, maskTenToSecond),
                        responseBroadcast = app.helpFunc.secondToTen(numberBroadcast.match(/\d{8}/g));
                    var addInfo = function (array, response) {
                        for(var field in array) {
                            array[field].value = response[0];
                            response.shift();
                        }
                    };
                    addInfo(allNumberAddress, responseNumberNetwork);
                    addInfo(allBroadcast, responseBroadcast);
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('output-ip-addresses'));
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('broadcast'));
                } else {

                }
            },
            selectTypeMask: function (event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);
                if(target.classList.contains('input-mask-subnetwork')) {
                    var inputMaskSubNetwork = document.querySelectorAll('.input-mask-subnetwork'),
                        idNumberOneInMask = 'number-one-in-mask',
                        numberOneInMask = document.getElementById(idNumberOneInMask),
                        addRequiredForElement = function (boolValue) {
                            //inputMaskSubnetwork.length - 2 - все кроме последнего
                            for(var i = 0; i <= inputMaskSubNetwork.length - 2; i++) {
                                inputMaskSubNetwork[i].required = boolValue;
                            }
                        };
                    if(target.getAttribute('id') === idNumberOneInMask) {
                        target.required = true;
                        addRequiredForElement(false);
                    } else {
                        addRequiredForElement(true);
                        numberOneInMask.required = false;
                    }
                }
            },
            validInputsCalc : function (event) {
                app.helpFunc.validateInput(this, event);
            }
        },
        eventElements: {
            formCalcIP : document.forms['form-calc-IP'],
            inputMaskSubNetwork : document.getElementById('mask-sub-network')
        },
        helpFunc: {
            focusInput : function (item) {
                var form = document.forms['form-calc-IP'];
                form.elements[item].focus();
            },
            tenToSecond: function (valueInTen) {
                var ipAddressInTwo = [];
                for(var field in valueInTen) {
                    var tempNumber = Number(valueInTen[field]).toString(2);
                    if(tempNumber.length !== 8) {
                        for(var i = 0; tempNumber.length != 8; i++ ) tempNumber +=  '0';
                    }
                    ipAddressInTwo.push(tempNumber);
                }
                return ipAddressInTwo;
            },
            secondToTen: function (valueInSecond) {
                var numberAddress = [];
                for(var field in valueInSecond) {
                    var partNumberAddress = [];
                    partNumberAddress.push(parseInt(valueInSecond[field], 2));
                    numberAddress.push(partNumberAddress);
                }
                return numberAddress;
            },
            getNumberNetwork: function (ipAddress, maskSubNetwork) {
                var numberNetwork = [];
                for(var i = 0; i < ipAddress.length ; i++ ) {
                    numberNetwork.push((Number(ipAddress[i]) & Number(maskSubNetwork[i])).toString());
                }
                return numberNetwork.join('');
            },
            getBroadcast : function (ipAddress, maskSubNetwork) {
                var broadcast = [];
                for(var i = 0; i < ipAddress.length ; i++ ) {
                    if(i >= 24) {
                        broadcast.push(11111111);
                        break;
                    } else {
                        broadcast.push((Number(ipAddress[i]) & Number(maskSubNetwork[i])).toString());
                    }
                }
                return broadcast.join('');
            },
            validateInput: function (inputs, event) {
                if(inputs instanceof Node) {
                    inputs = [ inputs ];
                }
                var arrayInput = inputs.concat();
                var validInput = arrayInput.every(function (item, index, array) {
                    if(item.validity.customError) {
                        item.setCustomValidity('');
                    }
                    if(!item.validity.valid || (0 > parseInt(item.value) || parseInt(item.value) > 255)) {
                        if(item.validity.patternMismatch) {
                            item.validationMessage = 'Некоректный ввод.';
                            item.setCustomValidity('Некоректный ввод.');
                        } else if(parseInt(item.value) > 255) {
                            item.validationMessage = 'Введенное значение больше максимального.';
                            item.setCustomValidity('Введенное значение больше максимального.');
                        } else if(0 > parseInt(item.value)) {
                            item.validationMessage = 'Введенное значение меньше минимального.';
                            item.setCustomValidity('Введенное значение меньше минимального.');
                        } else if(item.validity.valueMissing) {
                            item.validationMessage = 'Введите значение.';
                            item.setCustomValidity('Введите значение.');
                        }
                        setTimeout(function () {
                            item.checkValidity();
                            app.helpVar.validInputsCalc[item.name] = false;
                            forAllPage.funcS.trigger.mouse(document.getElementById('calc-IP'), 'click');
                            setTimeout(function () {
                                item.focus();
                            }, 100);
                        }, 100);
                        return false;
                    } else {
                        app.helpFunc.focusInput(index + 1);
                        return true;
                    }
                });
                return validInput;
            },
            getMaskSubNetwork : function (form) {
                var inputsMask = document.getElementsByClassName('input-mask-subnetwork');
                for(var index = 0; index < inputsMask.length; index++) {
                    if(!(inputsMask[index].value.length)) {
                        inputsMask = form.elements['number-one-in-mask'];
                        break;
                    }
                }
                return inputsMask;
            },
            getMaskTenToSecond : function (inputsMask) {
                var maskTenToSecond = '';
                if(inputsMask instanceof Array) {
                    maskTenToSecond = app.helpFunc.tenToSecond({
                        firstPartMask : inputsMask[0].value,
                        secondPartMask : inputsMask[1].value,
                        thirdPartMask : inputsMask[2].value,
                        fourthPartMask : inputsMask[3].value
                    }).join('');
                } else {
                    var COUNT_BIT_IN_MASK = 32;
                    for(index = 0; index != COUNT_BIT_IN_MASK; index++) {
                        if(inputsMask.value > index) {
                            maskTenToSecond += '1';
                        } else {
                            maskTenToSecond += '0';
                        }
                    }
                }
                return maskTenToSecond;
            }
        },
        helpVar: {
            validInputsCalc : []
        }
    };
    app.initialize();
}());