/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {

        initialize : function () {
            this.setUpListeners.call(this.eventHandlers);
        },

        setUpListeners: function () {
            var ulApp = document.querySelector('#open-app-button');
            EventUtil.addHandler(ulApp, 'click', this.checkShowModal);
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
                var target = EventUtil.getTarget(event),
                    that = app.eventHandlers;
                switch(target.id) {
                    case "open-ip-calc":
                        that.showModalCalc();
                        break;
                    case "open-master-report":
                        that.showModalReport();
                        break;
                    case "open-card-carno":
                        that.showModalCardCarno();
                        break;
                    case "open-diagram":
                        that.showModalDiagrams();
                        break;
                }
            },
            showModalCalc : function (event) {
                var numberOneInMask = document.querySelector('#number-one-in-mask');
                $(numberOneInMask).mask('/9?99');
                var CalcModal = document.querySelector('#ip-calc-modal');
                $(CalcModal).modal('show');
            },
            showModalReport: function (event) {
                //event.preventDefault();
                var CalcModal = document.querySelector('#master-report-modal');
                $(CalcModal).modal('show');
            },
            showModalCardCarno: function (event) {
                //event.preventDefault();
                var CalcModal = document.querySelector('#card-carno-modal');
                $(CalcModal).modal('show');
            },
            showModalDiagrams: function (event) {
                //event.preventDefault();
                var CalcModal = document.querySelector('#card-carno-modal');
                $(CalcModal).modal('show');
            }
        },
        constant: {

        }
    };
    app.initialize();
}());