(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElements);
        },

        setUpListeners: function (eventElements) {
            EventUtil.addHandler(eventElements.inputMaskSubNetwork, 'click', this.selectTypeMask);
            EventUtil.addHandler(eventElements.formCalcIP, 'submit', this.ipCalc);
            forAllPage.funcS.addEventOnElements(eventElements.inputsIpAddress, 'change', this.validInputsCalc);
        },
        eventHandlers : {
            ipCalc: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault(event);
                var inputsIpAddress = this.elements['input-ip-address'];
                var inputsMask = app.helpFunc.getMaskSubNetwork(this);
                if(app.helpVar.validInputsCalc) {
                    var ipTenToSecond = app.helpFunc.tenToSecond({
                        firstPartIp : inputsIpAddress[0].value,
                        secondPartIp : inputsIpAddress[1].value,
                        thirdPartIp : inputsIpAddress[2].value,
                        fourthPartIp : inputsIpAddress[3].value
                    }).join('');
                    var maskTenToSecond = app.helpFunc.getMaskTenToSecond(inputsMask);
                    var outputNumberAddress = this.elements['output-ip-address'],
                        allNumberAddress = {
                            firstPartNumberAddress : outputNumberAddress[0],
                            secondPartNumberAddress : outputNumberAddress[1],
                            thirdPartNumberAddress : outputNumberAddress[2],
                            fourthPartNumberAddress : outputNumberAddress[3]
                        };
                    var numberNetwork = app.helpFunc.getNumberNetwork(ipTenToSecond, maskTenToSecond),
                        response = app.helpFunc.secondToTen(numberNetwork.match(/\d{8}/g));
                    for(var field in allNumberAddress) {
                        allNumberAddress[field].value = response[0];
                        response.shift();
                    }
                    forAllPage.funcS.animateOpacity(0, 1, document.querySelector('#output-ip-addresses'));
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
            validInputsCalc : function () {
                if(app.helpVar.validInputsCalc === null || app.helpVar.validInputsCalc === true) {
                    app.helpVar.validInputsCalc = app.helpFunc.validateInput(this);
                }
            }
        },
        eventElements: {
            formCalcIP : document.getElementById('form-calc-IP'),
            inputMaskSubNetwork : document.getElementById('mask-sub-network'),
            inputsIpAddress : document.forms['form-calc-IP'].elements['input-ip-address']
        },
        helpFunc: {
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
            validateInput: function (inputs) {
                if(inputs instanceof Node) {
                    inputs = [ inputs ];
                }
                var arrayInput = [];
                for(var index in inputs ) {
                    arrayInput.push(inputs[index]);
                }
                var validInput = arrayInput.every(function (item, index, array) {
                    if(!item.validity.valid) {
                        if(item.validity.patternMismatch) {
                            item.validationMessage = 'Некоректный ввод.'
                        } else if(item.validity.rangeOverflow) {
                            item.validationMessage = 'Введенное значение больше максимального.'
                        } else if(item.validity.rangeUnderflow) {
                            item.validationMessage = 'Введенное значение меньше минимального.'
                        } else if(item.validity.valueMissing) {
                            item.validationMessage = 'Введите значение.'
                        }
                        return false;
                    } else {
                        return true;
                    }
                });
                return validInput;
            },
            getMaskSubNetwork : function (form) {
                var inputsMask = form.elements['input-mask-subnetwork'];
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
                        maskTenToSecond = '';
                        if(inputsMask.value != index) {
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
            validInputsCalc : null
        }
    };
    app.initialize();
}());