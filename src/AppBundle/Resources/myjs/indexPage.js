/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {

        initialize : function () {
            this.setUpListeners.call(this.eventHandlers);
        },

        setUpListeners: function () {
            var ulApp = document.querySelector('#open-app-button'),
                calcIP = document.querySelector('#calc-IP');
            EventUtil.addHandler(ulApp, 'click', this.checkShowModal);
            EventUtil.addHandler(calcIP, 'click', this.ipCalc);
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
            ipCalc: function () {
                var inputIpAddress = document.querySelectorAll('.input-ip-address'),
                    helpFunc = app.helpFunc,
                    crossInnerText = helpFunc.crossInnerText,
                    tenToSecond = helpFunc.tenToSecond(),
                    firstPart = crossInnerText(inputIpAddress[0]),
                    secondPart = crossInnerText(inputIpAddress[1]),
                    thirdPart = crossInnerText(inputIpAddress[2]),
                    fourthPart = crossInnerText(inputIpAddress[3]);
                tenToSecond([firstPart, secondPart, thirdPart, fourthPart]);
            }
        },
        constant: {

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
            crossInnerText: function (elem) {
                return elem.innerText || elem.textContent;
            }
        }
    };
    app.initialize();
}());