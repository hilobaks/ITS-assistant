/**
 * Created by h_baks on 19.11.15.
 */
(function() {
    var app = {
        initialize : function () {
            this.setUpListeners.call(this.eventHandlers, this.eventElement);
        },
        setUpListeners: function (eventElement) {
            EventUtil.addHandler(eventElement.ulApp, 'click', this.checkShowModal);
            EventUtil.addHandler(eventElement.logoutButton, 'click', this.logout);
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
                        $('#ip-calc-modal').modal('show');
                        break;
                    case "open-master-report":
                        $('#master-report-modal').modal('show');
                        break;
                    case "open-card-carno":
                        $('#card-carno-modal').modal('show');
                        break;
                    case "open-diagram":
                        $('#diagram-modal').modal('show');
                        break;
                }
            },
            logout : function (event) {
                EventUtil.preventDefault(event);
                forAllPage.funcS.sendAjaxRequest('/logout', {})
                    .then(
                    function (response) {
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    },
                    function (error) {
                        forAllPage.funcS.showFailResponse(error);
                        forAllPage.funcS.showModalWindow();
                    },
                    function () {

                    }
                )
                    .always(
                    function () {

                    });
            }
        },
        eventElement: {
            ulApp : document.querySelector('#open-app-button'),
            logoutButton : document.getElementById('logout')
        },
        helpFunc: {

        }
    };
    app.initialize();
}());