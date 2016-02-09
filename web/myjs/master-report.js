/**
 * Created by h_baks on 24.01.16.
 */
;
(function () {
    var app = {
        init : function () {
            this.view();
            this.model();
            this.controller();
        },
        model : function () {
            function MasterReport() {
                Object.defineProperties(this, {

                });
                this.constructor.prototype.sendInfo = function (info) {
                    var sendObjInfo = {};
                    Array.prototype.slice.call(info).forEach(function (item, index, array) {
                        if(info.type != 'button') {
                            sendObjInfo[item.name] = item.value;
                        }
                    });
                    forAllPage.funcS.sendAjaxRequest('/create_report', sendObjInfo)
                        .then(function (response) {
                           alert(response);
                        },
                        function (error) {
                            alert(error.status);
                        },
                        function () {

                        }
                    )
                        .always(function () {

                        });
                }
            }
            this.model.masterReport = new MasterReport();
        },
        controller : function () {
            function MasterReport() {
                Object.defineProperties(this, {

                });
                this.constructor.prototype.init = function (event) {
                    EventUtil.addHandler(this.form, 'submit', function (event) {
                        EventUtil.preventDefault(event);
                        app.model.masterReport.sendInfo(this.elements);
                    });
                };
                //this.init.call(app.view.masterReport);
            }
            this.controller.masterReport = new MasterReport();
        },
        view : function () {
            function MasterReport() {
                Object.defineProperties(this, {
                    _buttonDownload : {
                        value : document.getElementById('download-report')
                    },
                    buttonDownload : {
                        get : function () {
                            return this._buttonDownload;
                        }
                    },

                    _form : {
                        value : document.getElementById('form-master-report')
                    },
                    form : {
                        get : function () {
                            return this._form;
                        }
                    }
                });
            }
            this.view.masterReport = new MasterReport();
        }
    };
    EventUtil.addHandler(window, 'load', function () {
        app.init();
    })
})();