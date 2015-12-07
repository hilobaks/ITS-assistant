/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers);
        },

        setUpListeners: function () {
            var eventElement = app.eventElement;
            EventUtil.addHandler(eventElement.inputMaskSubNetwork, 'click', this.selectTypeMask);
            EventUtil.addHandler(eventElement.ulApp, 'click', this.checkShowModal);
            EventUtil.addHandler(eventElement.formCalcIP, 'submit', this.ipCalc);
        },
        eventHandlers : {
            checkShowModal: function (event) {
                event = EventUtil.getEvent(event);
                var closeBorderMenu = document.querySelector('.bt-menu-trigger'),
                    triggerEvent = document.createEvent('MouseEvents');
                triggerEvent.initMouseEvent('click', true, true, document.defaultView,
                                            0, 0, 0, 0, 0,false,false,false,false,0,null);
                closeBorderMenu.dispatchEvent(triggerEvent);

                event.preventDefault(event);
                var target = EventUtil.getTarget(event);
                switch(target.id) {
                    case "open-ip-calc":
                        app.helpFunc.showModal('#ip-calc-modal');
                        break;
                    case "open-master-report":
                        app.helpFunc.showModal('#master-report-modal');
                        break;
                    case "open-card-carno":
                        app.helpFunc.showModal('#card-carno-modal');
                        break;
                    case "open-diagram":
                        app.helpFunc.showModal('#diagram-modal');
                        break;
                }
            },
            ipCalc: function (event) {
                event = EventUtil.getEvent(event);
                event.preventDefault(event);
                var helpFunc = app.helpFunc,
                    crossInnerText = helpFunc.crossInnerText,
                    tenToSecond = helpFunc.tenToSecond,
                    secondToTen = helpFunc.secondToTen,
                    getNumberNetwork = helpFunc.getNumberNetwork;
                var inputsIpAddress = document.querySelectorAll('.input-ip-address'),
                    allIpAddress = {
                        firstPartIp : crossInnerText(inputIpAddress[0], 'get'),
                        secondPartIp : crossInnerText(inputIpAddress[1], 'get'),
                        thirdPartIp : crossInnerText(inputIpAddress[2], 'get'),
                        fourthPartIp : crossInnerText(inputIpAddress[3], 'get')
                    };
                var inputMask = document.querySelectorAll('.input-mask-subnetwork'),
                    allMask = {
                        firstPartMask : crossInnerText(inputMask[0], 'get'),
                        secondPartMask : crossInnerText(inputMask[1], 'get'),
                        thirdPartMask : crossInnerText(inputMask[2], 'get'),
                        fourthPartMask : crossInnerText(inputMask[3], 'get')
                    };
                var outputNumberAddress = document.querySelectorAll('.output-ip-address'),
                    allNumberAddress = {
                        firstPartNumberAddress : outputNumberAddress[0],
                        secondPartNumberAddress : outputNumberAddress[1],
                        thirdPartNumberAddress : outputNumberAddress[2],
                        fourthPartNumberAddress : outputNumberAddress[3]
                    };
                var ipTenToSecond = tenToSecond(allIpAddress).join(''),
                    maskTenToSecond = tenToSecond(allMask).join('');
                var numberNetwork = getNumberNetwork(ipTenToSecond, maskTenToSecond),
                    response = secondToTen(numberNetwork.match(/\d{4}/));
                for(var field in allNumberAddress) {
                    crossInnerText(field, 'set', response[0]);
                    response.shift();
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
            }
        },
        eventElement: {
            ulApp : document.querySelector('#open-app-button'),
            formCalcIP : document.querySelector('#form-calc-IP'),
            inputMaskSubNetwork : document.getElementById('mask-sub-network'),
        },
        helpFunc: {
            showModal: function (modalWindow) {
                var CalcModal = document.querySelector(modalWindow);
                $(CalcModal).modal('show');
            },
            tenToSecond: function (valueInTen) {
                var ipAddressInTwo = [];
                for(var field in valueInTen) {
                    ipAddressInTwo.push(valueInTen[field].toString(2));
                }
                return ipAddressInTwo;
            },
            secondToTen: function (valueInSecond) {
                var numberAddress = [];
                for(var field in valueInSecond) {
                    var partNumberAddress = [];
                    partNumberAddress.push(parseInt(valueInSecond[field], 10));
                    numberAddress.push(partNumberAddress);
                }
                return numberAddress;
            },
            getNumberNetwork: function (ipAddress, maskSubNetwork) {
                var numberNetwork = [];
                for(var i = 0; i != ipAddress.length - 1; i++ ) {
                    numberNetwork.push((Number(ipAddress[i]) & Number(maskSubNetwork[i])).toString());
                }
                return numberNetwork;
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
            }
        }
    };
    app.initialize();
}());