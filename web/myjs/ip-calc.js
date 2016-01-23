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
                        wildcard = document.getElementsByClassName('wildcard'),
                        firstHost = document.getElementsByClassName('first-host'),
                        lastHost = document.getElementsByClassName('last-host'),
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
                        },
                        allWildcard = {
                            firstPartBroadcast : wildcard[0],
                            secondPartBroadcast : wildcard[1],
                            thirdPartBroadcast : wildcard[2],
                            fourthPartBroadcast : wildcard[3]
                        },
                        allFirstHost = {
                            firstPartFirstHost : firstHost[0],
                            secondPartFirstHost : firstHost[1],
                            thirdPartFirstHost : firstHost[2],
                            fourthPartFirstHost : firstHost[3]
                        },
                        allLastHost = {
                            firstPartLastHost : lastHost[0],
                            secondPartLastHost : lastHost[1],
                            thirdPartLastHost : lastHost[2],
                            fourthPartLastHost : lastHost[3]
                        };
                    var numberNetwork = app.helpFunc.getNumberNetwork(ipTenToSecond, maskTenToSecond),
                        numberBroadcast = app.helpFunc.getBroadcast(ipTenToSecond, maskTenToSecond),
                        numberWildcard = app.helpFunc.getWildcard(maskTenToSecond),
                        responseNumberNetwork = app.helpFunc.secondToTen(numberNetwork.match(/\d{8}/g)),
                        numberFirstHost = app.helpFunc.getFirstHost(responseNumberNetwork),
                        responseBroadcast = app.helpFunc.secondToTen(numberBroadcast.match(/\d{8}/g)),
                        responseWildcard = app.helpFunc.secondToTen(numberWildcard.match(/\d{8}/g));
                    var addInfo = function (array, response) {
                        for(var field in array) {
                            array[field].value = response[0];
                            response.shift();
                        }
                    };
                    addInfo(allNumberAddress, responseNumberNetwork);
                    addInfo(allBroadcast, responseBroadcast);
                    addInfo(allWildcard, responseWildcard);
                    addInfo(allFirstHost, numberFirstHost);
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('output-ip-addresses'));
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('broadcast'));
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('wildcard'));
                    forAllPage.funcS.animateOpacity(0, 1, document.getElementById('first-host'));
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
            validateInput: function (inputs) {
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
                            item.validationMessage = 'Некоректный ввод. Введите значение в пределах от 0 до 255.';
                            item.setCustomValidity('Некоректный ввод. Введите значение в пределах от 0 до 255.');
                        } else if(parseInt(item.value) > 255) {
                            item.validationMessage = 'Введенное значение больше максимального. Введите значение в пределах от 0 до 255.';
                            item.setCustomValidity('Введенное значение больше максимального. Введите значение в пределах от 0 до 255.');
                        } else if(0 > parseInt(item.value)) {
                            item.validationMessage = 'Введенное значение меньше минимального. Введите значение в пределах от 0 до 255.';
                            item.setCustomValidity('Введенное значение меньше минимального. Введите значение в пределах от 0 до 255.');
                        } else if(item.validity.valueMissing) {
                            item.validationMessage = 'Введите значение в пределах от 0 до 255.';
                            item.setCustomValidity('Введите значение в пределах от 0 до 255.');
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
            focusInput : function (item) {
                var form = document.forms['form-calc-IP'];
                form.elements[item].focus();
            },
            tenToSecond: function (valueInTen) {
                var ipAddressInTwo = [];
                for(var field in valueInTen) {
                    var tempNumber = Number(valueInTen[field]).toString(2);
                    if(tempNumber.length !== 8) {
                        var countZero = '';
                        for(var i = 0; (tempNumber.length + countZero.length) != 8; i++ ) {
                            countZero +=  '0';
                        }
                        tempNumber = countZero + tempNumber;
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
            getMaskSubNetwork : function (form) {
                var inputsMask = document.getElementsByClassName('input-mask-subnetwork');
                for(var index = 0; index < inputsMask.length - 1; index++) {
                    if(!(inputsMask[index].value.length)) {
                        inputsMask = form.elements['number-one-in-mask'];
                        break;
                    } else {
                        inputsMask = Array.prototype.slice.call( inputsMask).slice(0,4);
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
            },
            getWildcard : function (maskSubNetwork) {
                var wildcard = '';
                Array.prototype.slice.call(maskSubNetwork).forEach(function (item, index, array) {
                    if(item == 1) {
                        wildcard += '0';
                    } else if(item == 0) {
                        wildcard += '1';
                    }
                });
                return wildcard;
            },
            getFirstHost : function (numberNetwork) {
                var firstHost = numberNetwork.slice(0,3);
                firstHost.push(1);
                return firstHost;
            },
            getLastHost : function () {
                var lastHost = numberNetwork.slice(0,3);
                lastHost.push(254);
                return lastHost;
            }
        },
        helpVar: {
            validInputsCalc : []
        }
    };
    app.initialize();
}());