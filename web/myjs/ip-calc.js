(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElements);
        },

        setUpListeners: function (eventElements) {
            EventUtil.addHandler(eventElements.inputMaskSubNetwork, 'click', this.selectTypeMask);
            EventUtil.addHandler(eventElements.formCalcIP, 'submit', this.ipCalc);
        },
        eventHandlers : {
            ipCalc: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault(event);
                var inputsIpAddress = this.elements['input-ip-address'],
                    allIpAddress = {
                        firstPartIp : inputsIpAddress[0].value,
                        secondPartIp : inputsIpAddress[1].value,
                        thirdPartIp : inputsIpAddress[2].value,
                        fourthPartIp : inputsIpAddress[3].value
                    };
                var inputsMask = this.elements['input-mask-subnetwork'],
                    allMask = {
                        firstPartMask : inputsMask[0].value,
                        secondPartMask : inputsMask[1].value,
                        thirdPartMask : inputsMask[2].value,
                        fourthPartMask : inputsMask[3].value
                    };
                var outputNumberAddress = this.elements['output-ip-address'],
                    allNumberAddress = {
                        firstPartNumberAddress : outputNumberAddress[0],
                        secondPartNumberAddress : outputNumberAddress[1],
                        thirdPartNumberAddress : outputNumberAddress[2],
                        fourthPartNumberAddress : outputNumberAddress[3]
                    };
                var ipTenToSecond = app.helpFunc.tenToSecond(allIpAddress).join(''),
                    maskTenToSecond = app.helpFunc.tenToSecond(allMask).join('');
                var numberNetwork = app.helpFunc.getNumberNetwork(ipTenToSecond, maskTenToSecond),
                    response = app.helpFunc.secondToTen(numberNetwork.match(/\d{8}/g));
                for(var field in allNumberAddress) {
                    allNumberAddress[field].value = response[0];
                    response.shift();
                }
                forAllPage.funcS.animateOpacity(0, 1, document.querySelector('#output-ip-addresses'));
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
            }
        },
        eventElements: {
            formCalcIP : document.querySelector('#form-calc-IP'),
            inputMaskSubNetwork : document.getElementById('mask-sub-network')
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
            }
        },
        helpVar: {

        }
    };
    app.initialize();
}());