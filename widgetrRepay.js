/**
 * Created by h_baks on 03.02.16.
 */
;
(function () {
    var widgetRepay = {
        init : function () {
            this.model();
            this.view();
            this.controller();
            return this;
        },
        controller : function () {
            if(typeof this.controller === 'function') {
                function Self() {
                    Object.defineProperties(this, {
                        _firstStep : {
                            value : function () {
                                if( typeof this._firstStep == 'undefined' ) {
                                    function FirstStep() {
                                        Object.defineProperties(this, {
                                            _calculator : {
                                                value : function () {

                                                    if(typeof this._calculator == 'undefined') {
                                                        function Calculator() {
                                                            this.actionForInput = function (event) {
                                                                tools.eventUtil.preventDefault(event);
                                                                var money = widgetRepay.view.firstStep.calculator.inputSum.value;
                                                                if(widgetRepay.model.firstStep.calculator.min_sum_pdl <= money && money <= widgetRepay.model.firstStep.calculator.loanLimit ) {
                                                                    widgetRepay.view.firstStep.calculator.showResult(
                                                                        Number(money),
                                                                        Number(widgetRepay.view.firstStep.calculator.inputTerm.value),
                                                                        this
                                                                    );
                                                                }
                                                            };
                                                            this.actionKeydownInput = function (event) {
                                                                if (tools.eventUtil.getCharCode(event) === 13 || event.keyCode === 13) {
                                                                    widgetRepay.controller.firstStep.calculator.actionForInput(event);
                                                                }
                                                            };
                                                            this.actionForClickButton = function (event) {
                                                                tools.eventUtil.preventDefault(event);
                                                                var money = widgetRepay.view.firstStep.calculator.sliderSum.noUiSlider.get(),

                                                                //                   На случай добавление аннуитетного договора
                                                                //term = widgetRepay.view.firstStep.calculator.sliderTerm.noUiSlider.get();

                                                                    term = 15;
                                                                var step = widgetRepay.model.firstStep.calculator.getStepForSlidersByBusiness(money, term);
                                                                switch (this) {
                                                                    case widgetRepay.view.firstStep.calculator.btnAddTerm :
                                                                        term = Number(term) + Number(step.term);
                                                                        break;
                                                                    case widgetRepay.view.firstStep.calculator.btnAddSum :
                                                                        money = Number(money) + Number(step.money);
                                                                        break;
                                                                }
                                                                if(widgetRepay.model.firstStep.calculator.min_sum_pdl <= money && money <= widgetRepay.model.firstStep.calculator.loanLimit ) {
                                                                    widgetRepay.view.firstStep.calculator.showResult(Number(money), Number(term), this);
                                                                }
                                                            };
                                                            this.actionSubmitForm = function (event) {
                                                                tools.eventUtil.preventDefault(event);
                                                            };
                                                            this.init = function (that) {

                                                                // that = widgetRepay.controler.widgetPayment.firstStep.calculator
                                                                // this = widgetRepay.view.firstStep.calculator

                                                                this.showSlider.call(widgetRepay.model.firstStep.calculator);

                                                                // Временное решение
                                                                this.allReturnSum.innerHTML =
                                                                    widgetRepay.model.firstStep.calculator.currentSumReturn =
                                                                    widgetRepay.model.firstStep.calculator.currentSumSelect * 1.3;

                                                                this.inputSum.setAttribute('placeholder', this.allReturnSum.innerHTML);
                                                                this.inputSum.max = widgetRepay.model.firstStep.calculator.currentSumSelect;


                                                                tools.eventUtil.addHandler(this.btnAddSum, 'click', that.actionForClickButton);
                                                                tools.eventUtil.addHandler(this.inputSum, 'change', that.actionForInput);
                                                                tools.eventUtil.addHandler(this.inputSum, 'keydown', that.actionKeydownInput);
                                                                this.sliderSum.noUiSlider.on('change', tools.best.bind(function () {
                                                                    this.showResult(
                                                                        Number(this.sliderSum.noUiSlider.get()),
                                                                        15,
                                                                        //Number(this.sliderTerm.noUiSlider.get()),
                                                                        this
                                                                    );
                                                                }, this));

                                                                //                 Код закоментирован на случай добавления ануитетного договора

                                                                //tools.eventUtil.addHandler(this.btnAddTerm, 'click', that.actionForClickButton);

                                                                //tools.eventUtil.addHandler(this.inputTerm, 'change', that.actionForInput);

                                                                //tools.eventUtil.addHandler(this.inputTerm, 'keydown', that.actionKeydownInput);

                                                                //tools.eventUtil.addHandler(this.form, 'submit', this.actionSubmitForm);

                                                                //widgetRepay.view.firstStep.calculator.sliderTerm.noUiSlider.on('change', function () {
                                                                //    widgetRepay.view.firstStep.calculator.showResult(
                                                                //        Number(widgetRepay.view.firstStep.calculator.sliderSum.noUiSlider.get()),
                                                                //        Number(widgetRepay.view.firstStep.calculator.sliderTerm.noUiSlider.get()),
                                                                //        this
                                                                //    );
                                                                //});
                                                            };
                                                            this.init.call(widgetRepay.view.firstStep.calculator, this);
                                                        }
                                                        this._calculator = new Calculator();
                                                        return this._calculator;
                                                    } else {
                                                        return this._calculator;
                                                    }

                                                }.call(this),
                                                writable : true
                                            },
                                            calculator : {
                                                get : function () {
                                                    return this._calculator;
                                                }
                                            },

                                            _calendar : {
                                                value : function () {

                                                    if(typeof this._calendar == 'undefined') {

                                                        function Calendar() {
                                                            Object.defineProperties(this, {});
                                                            this.constructor.prototype.init = function () {

                                                                (function () {

                                                                    this.showDateInCalendar();

                                                                    tools.eventUtil.addHandlerOnElements(this.dayInCalendar, 'mouseover', tools.best.bind( function (event) {
                                                                        setTimeout(tools.best.bind(function () {
                                                                            this.showLoanPopover(event);
                                                                        }, this), 300);
                                                                    }, this));

                                                                    tools.eventUtil.addHandlerOnElements(this.dayInCalendar, 'mouseout', tools.best.bind(function (event) {
                                                                        setTimeout(tools.best.bind(function () {
                                                                            this.hideLoanPopover(event);
                                                                        }, this), 300);
                                                                    }, this));

                                                                }).call(widgetRepay.view.firstStep.calendar);

                                                            };
                                                            this.init();
                                                        }
                                                        this._calendar = new Calendar();
                                                        return this._calendar;

                                                    } else {
                                                        return this._calendar;
                                                    }

                                                }.call(this),
                                                writable : true
                                            },
                                            calendar : {
                                                get : function () {
                                                    return this._calendar;
                                                }
                                            }
                                        });
                                        this.constructor.prototype.init = function () {

                                            this.calendar;
                                            this.calculator;

                                            (function () {

                                                tools.eventUtil.addHandler(this.selectAnotherSum, 'click', tools.best.bind(function (event) {
                                                    tools.eventUtil.preventDefault(event);
                                                    setTimeout(tools.best.bind(function () {
                                                        this.changeTypeSelectSum();
                                                    }, this), 300);
                                                }, this));

                                                tools.eventUtil.addHandler(this.transferByCard, 'click', tools.best.bind(function (event) {
                                                    this.checkCanTakeOnline(
                                                        tools.ajax.sendAjaxRequest('/can_take_online', {}, 'GET'),
                                                        arguments.callee,
                                                        this.transferByCard,
                                                        event.type
                                                    );
                                                }, this));

                                                tools.eventUtil.addHandler(this.transferByCash, 'click', function () {
                                                    tools.modalWindow.addDOM(
                                                        'continue',
                                                        'Данная функция времено не доступна.'
                                                    );
                                                    tools.modalWindow.show();
                                                });

                                                tools.eventUtil.addHandler(document.querySelectorAll('#loan-calendar tr > td'), 'mouseover', tools.best.bind(function (event) {
                                                    this.calcCreditForCalendar(tools.eventUtil.getCurrentTarget(event));
                                                }, this));

                                            }).call(widgetRepay.view.firstStep);
                                        };
                                        this.constructor.prototype.actionSelectedCard = function (selectedCard) {

                                            tools.eventUtil.addHandlerOnElements(selectedCard, 'click', tools.best.bind(function (event) {
                                                app.cabinet.model.myCard.idSelectCard = parseInt(tools.eventUtil.getCurrentTarget(event).parentNode.getAttribute('id'));
                                                this.hide();
                                                widgetRepay.view.secondStep.show();
                                                widgetRepay.controller.secondStep;
                                            }, this));

                                        };
                                        this.constructor.prototype.actionWinSelectCard = function (verifiedCards) {

                                            tools.eventUtil.addHandler(document.body, 'click', function (event) {
                                                tools.animate.opacity(1, 0, verifiedCards);
                                                tools.eventUtil.removeHandler(tools.eventUtil.getCurrentTarget(event), event.type, arguments.callee);
                                            });

                                        };
                                        this.init();
                                    }
                                    this._firstStep = new FirstStep();
                                    return this._firstStep;
                                } else {
                                    return this._firstStep;
                                }
                            }.call(this),
                            writable : true
                        },
                        firstStep : {
                            get : function () {
                                return this._firstStep;
                            }
                        },

                        _secondStep : {
                            value : function () {
                                if(typeof this._secondStep == 'undefined') {
                                    function SecondStep() {
                                        Object.defineProperties(this, {});
                                        this.constructor.prototype.init = function () {
                                            (function () {

                                                this.setSumAndTermLoan();

                                                tools.eventUtil.addHandler(this.buttonGoToThirdStep, 'click', tools.best.bind(function (event) {
                                                    if( this.agreeContract.checked ) {
                                                        var promise = (function () {
                                                            return tools.ajax.sendAjaxRequest(
                                                                '/contracts',
                                                                {
                                                                    'loan-amount': this.currentSumReturn,
                                                                    'loan-term': this.currentTermSelect,
                                                                    'agreement': true,
                                                                    'customer_bank_card_id': app.cabinet.model.myCard.idSelectCard
                                                                }
                                                            );
                                                        }).call(widgetRepay.model.firstStep.calculator);
                                                        this.responseCreateContract(promise, arguments.callee, event.type, tools.eventUtil.getCurrentTarget(event));
                                                    } else {
                                                        tools.modalWindow.addDOM(
                                                            'continue',
                                                            'Подвердите условия договора.'
                                                        )
                                                        tools.modalWindow.show();
                                                    }
                                                }, this));

                                                tools.eventUtil.addHandler(this.buttonGoToFirstStep, 'click', tools.best.bind(function () {
                                                    this.goToFirstStep();
                                                }, this));

                                            }).call(widgetRepay.view.secondStep);
                                        };
                                        this.init();
                                    }
                                    this._secondStep = new SecondStep();
                                    return this._secondStep;
                                } else {
                                    return this._secondStep
                                }
                            }.call(this),
                            writable : true
                        },
                        secondStep : {
                            get : function () {
                                return this._secondStep;
                            }
                        }
                    });
                    this.constructor.prototype.init = function () {
                        this.firstStep;
                    };
                    this.init()
                }
                this.controller = new Self();
                return this.controller;
            } else {
                return this.controller;
            }
        },
        model: function () {
            if(typeof this.model === 'function') {
                function Self() {
                    Object.defineProperties(this, {
                        _firstStep : {
                            value : function () {
                                if( typeof this._firstStep == 'undefined' ) {
                                    function FirstStep() {
                                        Object.defineProperties(this, {
                                            _calculator: {
                                                value: function () {
                                                    if(typeof this._calculator == 'undefined') {
                                                        function Calculator() {
                                                            Object.defineProperties(this, {
                                                                _MIN_TERM_PDL: {
                                                                    value: 1,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                min_term_pdl: {
                                                                    get: function () {
                                                                        return this._MIN_TERM_PDL
                                                                    }
                                                                },

                                                                _MAX_TERM_PDL: {
                                                                    value: 15,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                max_term_pdl: {
                                                                    get: function () {
                                                                        return this._MAX_TERM_PDL
                                                                    }
                                                                },

                                                                _STEP_TERM_TERM_PDL: {
                                                                    value: 1,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                step_add_term_pdl: {
                                                                    get: function () {
                                                                        return this._STEP_TERM_TERM_PDL;
                                                                    }
                                                                },

                                                                _MIN_SUM_PDL: {
                                                                    value: 200,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                min_sum_pdl: {
                                                                    get: function () {
                                                                        return this._MIN_SUM_PDL
                                                                    }
                                                                },

                                                                _MAX_SUM_PDL: {
                                                                    value: 3000,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                max_sum_pdl: {
                                                                    get: function () {
                                                                        return this._MAX_SUM_PDL
                                                                    }
                                                                },

                                                                _STEP_ADD_SUM_PDL: {
                                                                    value: 100,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                step_add_sum_pdl: {
                                                                    get: function () {
                                                                        return this._STEP_ADD_SUM_PDL;
                                                                    }
                                                                },

                                                                _PROGRAM_CREDIT: {
                                                                    value: {
                                                                        _STANDARD: {
                                                                            value: {
                                                                                _SUM_MIN: {
                                                                                    value: 200
                                                                                },
                                                                                sum_min: {
                                                                                    get: function () {
                                                                                        return this._SUM_MIN;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _SUM_MAX: {
                                                                                    value: 3001
                                                                                },
                                                                                sum_max: {
                                                                                    get: function () {
                                                                                        return this._SUM_MAX;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _PERCENT: {
                                                                                    value: 0.02
                                                                                },
                                                                                percent: {
                                                                                    get: function () {
                                                                                        return this._PERCENT
                                                                                    }
                                                                                },

                                                                                _COMMISSIONS: {
                                                                                    value: 0
                                                                                },
                                                                                commissions: {
                                                                                    get: function () {
                                                                                        return this._COMMISSIONS
                                                                                    }
                                                                                },

                                                                                _TYPE: {
                                                                                    value: 'PDL'
                                                                                },
                                                                                type: {
                                                                                    get: function () {
                                                                                        return this._TYPE
                                                                                    }
                                                                                }
                                                                            },
                                                                            enumerable: false,
                                                                            configurable: false
                                                                        },
                                                                        standard: {
                                                                            get: function () {
                                                                                return [
                                                                                    this._STANDARD._SUM_MIN,
                                                                                    this._STANDARD._SUM_MAX,
                                                                                    this._STANDARD._PERCENT,
                                                                                    this._STANDARD._COMMISSIONS,
                                                                                    this._STANDARD._TYPE
                                                                                ];
                                                                            }
                                                                        },

                                                                        _LOYAL: {
                                                                            value: {
                                                                                _SUM_MIN: {
                                                                                    value: 3000
                                                                                },
                                                                                sum_min: {
                                                                                    get: function () {
                                                                                        return this._SUM_MIN;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _SUM_MAX: {
                                                                                    value: 6000
                                                                                },
                                                                                sum_max: {
                                                                                    get: function () {
                                                                                        return this._SUM_MAX;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _PERCENT: {
                                                                                    value: 0.0175
                                                                                },
                                                                                percent: {
                                                                                    get: function () {
                                                                                        return this._PERCENT
                                                                                    }
                                                                                },

                                                                                _COMMISSIONS: {
                                                                                    value: 35
                                                                                },
                                                                                commissions: {
                                                                                    get: function () {
                                                                                        return this._COMMISSIONS
                                                                                    }
                                                                                },

                                                                                _TYPE: {
                                                                                    value: 'ANNUITY '
                                                                                },
                                                                                type: {
                                                                                    get: function () {
                                                                                        return this._TYPE
                                                                                    }
                                                                                }
                                                                            },
                                                                            enumerable: false,
                                                                            configurable: false
                                                                        },
                                                                        loyal: {
                                                                            get: function () {
                                                                                return [
                                                                                    this._LOYAL._SUM_MIN,
                                                                                    this._LOYAL._SUM_MAX,
                                                                                    this._LOYAL._PERCENT,
                                                                                    this._LOYAL._COMMISSIONS,
                                                                                    this._LOYAL._TYPE
                                                                                ];
                                                                            }
                                                                        },

                                                                        _COMFORTABLE_SMALL: {
                                                                            value: {
                                                                                _SUM_MIN: {
                                                                                    value: 6000
                                                                                },
                                                                                sum_min: {
                                                                                    get: function () {
                                                                                        return this._SUM_MIN;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _SUM_MAX: {
                                                                                    value: 8000
                                                                                },
                                                                                sum_max: {
                                                                                    get: function () {
                                                                                        return this._SUM_MAX;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _PERCENT: {
                                                                                    value: 0.0107
                                                                                },
                                                                                percent: {
                                                                                    get: function () {
                                                                                        return this._PERCENT
                                                                                    }
                                                                                },

                                                                                _COMMISSIONS: {
                                                                                    value: 50
                                                                                },
                                                                                commissions: {
                                                                                    get: function () {
                                                                                        return this._COMMISSIONS
                                                                                    }
                                                                                },

                                                                                _TYPE: {
                                                                                    value: 'ANNUITY '
                                                                                },
                                                                                type: {
                                                                                    get: function () {
                                                                                        return this._TYPE
                                                                                    }
                                                                                }
                                                                            },
                                                                            enumerable: false,
                                                                            configurable: false
                                                                        },
                                                                        comfortable_small: {
                                                                            get: function () {
                                                                                return [
                                                                                    this._COMFORTABLE_SMALL._SUM_MIN,
                                                                                    this._COMFORTABLE_SMALL._SUM_MAX,
                                                                                    this._COMFORTABLE_SMALL._PERCENT,
                                                                                    this._COMFORTABLE_SMALL._COMMISSIONS,
                                                                                    this._COMFORTABLE_SMALL._TYPE
                                                                                ];

                                                                            }
                                                                        },

                                                                        _COMFORTABLE_BIG: {
                                                                            value: {
                                                                                _SUM_MIN: {
                                                                                    value: 8000
                                                                                },
                                                                                sum_min: {
                                                                                    get: function () {
                                                                                        return this._SUM_MIN;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _SUM_MAX: {
                                                                                    value: 10001
                                                                                },
                                                                                sum_max: {
                                                                                    get: function () {
                                                                                        return this._SUM_MAX;
                                                                                    },
                                                                                    enumerable: false
                                                                                },

                                                                                _PERCENT: {
                                                                                    value: 0.0082
                                                                                },
                                                                                percent: {
                                                                                    get: function () {
                                                                                        return this._PERCENT
                                                                                    }
                                                                                },

                                                                                _COMMISSIONS: {
                                                                                    value: 100
                                                                                },
                                                                                commissions: {
                                                                                    get: function () {
                                                                                        return this._COMMISSIONS
                                                                                    }
                                                                                },

                                                                                _TYPE: {
                                                                                    value: 'ANNUITY '
                                                                                },
                                                                                type: {
                                                                                    get: function () {
                                                                                        return this._TYPE
                                                                                    }
                                                                                }
                                                                            },
                                                                            enumerable: false,
                                                                            configurable: false
                                                                        },
                                                                        comfortable_big: {
                                                                            get: function () {
                                                                                return [
                                                                                    this._COMFORTABLE_BIG._SUM_MIN,
                                                                                    this._COMFORTABLE_BIG._SUM_MAX,
                                                                                    this._COMFORTABLE_BIG._PERCENT,
                                                                                    this._COMFORTABLE_BIG._COMMISSIONS,
                                                                                    this._COMFORTABLE_BIG._TYPE
                                                                                ];
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                programs_credit: {
                                                                    get: function () {
                                                                        return [
                                                                            this._PROGRAM_CREDIT._COMFORTABLE_BIG,
                                                                            this._PROGRAM_CREDIT._COMFORTABLE_SMALL,
                                                                            this._PROGRAM_CREDIT._LOYAL,
                                                                            this._PROGRAM_CREDIT._STANDARD
                                                                        ];
                                                                    }
                                                                },

                                                                _MIN_TERM_ANNUITY: {
                                                                    value: 15,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                min_term_annuity: {
                                                                    get: function () {
                                                                        return this._MIN_TERM_ANNUITY
                                                                    }
                                                                },

                                                                _STEP_ADD_SUM_ANNUITY: {
                                                                    value: 500,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                step_add_sum_annuity: {
                                                                    get: function () {
                                                                        return this._STEP_ADD_SUM_ANNUITY;
                                                                    }
                                                                },

                                                                _STEP_ADD_TERM_ANNUITY: {
                                                                    value: 15,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                step_add_term_annuity: {
                                                                    get: function () {
                                                                        return this._STEP_ADD_TERM_ANNUITY;
                                                                    }
                                                                },

                                                                _MAX_TERM_ANNUITY: {
                                                                    value: 180,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                max_term_annuity: {
                                                                    get: function () {
                                                                        return this._MAX_TERM_ANNUITY
                                                                    }
                                                                },

                                                                _MIN_SUM_ANNUITY: {
                                                                    value: 3000,
                                                                    enumerable: false,
                                                                    writable: false,
                                                                    configurable: false
                                                                },
                                                                min_sum_annuity: {
                                                                    get: function () {
                                                                        return this._MIN_SUM_ANNUITY
                                                                    }
                                                                },

                                                                _MAX_SUM_ANNUITY: {
                                                                    value: 10000
                                                                },
                                                                max_sum_annuity: {
                                                                    get: function () {
                                                                        return this._MAX_SUM_ANNUITY
                                                                    }
                                                                },

                                                                _currentSumSelect: {
                                                                    value: 1000,
                                                                    writable: true
                                                                },
                                                                currentSumSelect: {
                                                                    get: function () {
                                                                        return this._currentSumSelect;
                                                                    },
                                                                    set: function (currentMoneySelect) {
                                                                        this._currentSumSelect = currentMoneySelect
                                                                    }
                                                                },

                                                                _currentSumReturn: {
                                                                    value: 1139,
                                                                    writable: true
                                                                },
                                                                currentSumReturn: {
                                                                    get: function () {
                                                                        return this._currentSumReturn;
                                                                    },
                                                                    set: function (currentMoneyReturn) {
                                                                        this._currentSumReturn = currentMoneyReturn;
                                                                    }
                                                                },

                                                                _currentTermSelect: {
                                                                    value: 15,
                                                                    enumerable: false,
                                                                    writable: true,
                                                                    configurable: false
                                                                },
                                                                currentTermSelect: {
                                                                    get: function () {
                                                                        return this._currentTermSelect;
                                                                    },
                                                                    set: function (currentDateSelect) {
                                                                        this._currentTermSelect = currentDateSelect
                                                                    }
                                                                },

                                                                _loanLimit : {
                                                                    value : 0,
                                                                    writable : true
                                                                },
                                                                loanLimit : {
                                                                    get : function () {
                                                                        return this._loanLimit;
                                                                    },
                                                                    set : function (loanLimit) {
                                                                        this._loanLimit = loanLimit;
                                                                    }
                                                                }
                                                            });
                                                            this.getTypeContract = function (newValue, idSlider) {
                                                                var typeContract = '';
                                                                if (idSlider === 'slider-sum') {
                                                                    if (newValue <= widgetRepay.model.firstStep.calculator.max_sum_pdl) {
                                                                        typeContract = 'PDL';
                                                                    } else {
                                                                        typeContract = 'ANNUITY';
                                                                    }
                                                                } else if (idSlider === 'slider-date') {
                                                                    if (widgetRepay.model.firstStep.calculator.currentSumSelect <= widgetRepay.model.firstStep.calculator.max_sum_pdl) {
                                                                        typeContract = 'PDL';
                                                                    } else {
                                                                        typeContract = 'ANNUITY';
                                                                    }
                                                                }

                                                                return typeContract;
                                                            };
                                                            this.getFullDateByDay = function (day) {
                                                                var currentDate = new Date(),
                                                                    currentDayInMonth = currentDate.getDate();
                                                                currentDate.setDate(Number(currentDayInMonth + day));
                                                                var numberDay = currentDate.getDate(),
                                                                    numberMonth = currentDate.getMonth(),
                                                                    numberYear = currentDate.getFullYear();
                                                                if (numberDay < 10) {
                                                                    numberDay = '0' + numberDay;
                                                                }
                                                                if ((numberMonth + 1) < 10) {
                                                                    numberMonth = '0' + (numberMonth + 1);
                                                                }
                                                                return numberDay + '.' + numberMonth + '.' + currentDate.getFullYear();
                                                            };
                                                            this.getStepForSlidersByBusiness = function (money, term) {
                                                                var step = {};
                                                                if (money >= this.max_sum_pdl) {
                                                                    step['money'] = this.step_add_sum_annuity;
                                                                } else {
                                                                    step['money'] = this.step_add_sum_pdl;
                                                                }
                                                                if (term >= this.max_term_pdl) {
                                                                    step['term'] = this.step_add_term_annuity;
                                                                } else {
                                                                    step['term'] = this.step_add_term_pdl;
                                                                }
                                                                return step;
                                                            };
                                                            this.foundInfoContractByMoney = function (money) {
                                                                var programs_credit = widgetRepay.model.firstStep.calculator.programs_credit,
                                                                    select_program = null;
                                                                for (var program in programs_credit) {
                                                                    if (programs_credit[program].value._SUM_MIN.value <= money && money < programs_credit[program].value._SUM_MAX.value) {
                                                                        select_program = programs_credit[program];
                                                                    }
                                                                }
                                                                var response = {};
                                                                for (var field in select_program.value) {
                                                                    if ((/^_.+/).test(field)) {
                                                                        response[field] = select_program.value[field].value
                                                                    }
                                                                }
                                                                return response;
                                                            };
                                                            this.calculationMoney = function (money, term) {
                                                                var program = widgetRepay.model.firstStep.calculator.foundInfoContractByMoney(money);
                                                                if (money != 0) {
                                                                    var loan_amount = money + program._COMMISSIONS,
                                                                        interest_amount = 0;
                                                                    if (money <= widgetRepay.model.firstStep.calculator.max_sum_pdl) {
                                                                        interest_amount = Math.round(loan_amount * program._PERCENT * 100) / 100 * term;
                                                                    } else {
                                                                        var credit_period_interval = widgetRepay.model.firstStep.calculator.max_term_pdl,
                                                                            period_count = Math.ceil(term / credit_period_interval),
                                                                            period_interest_rate = program._PERCENT * credit_period_interval,
                                                                            period_total_amount = 0,
                                                                            period_body_amount = 0,
                                                                            period_interest_amount = 0,
                                                                            current_body_amount = loan_amount;

                                                                        if (period_count != 1) {
                                                                            var exp = Math.pow(1 + period_interest_rate, period_count - 1);
                                                                            period_total_amount = Math.floor(loan_amount * period_interest_rate * exp / (exp - 1) * 100) / 100;
                                                                        } else {
                                                                            period_total_amount = Math.round(loan_amount * (1 + period_interest_rate) * 100) / 100;
                                                                        }
                                                                        var payments = [];
                                                                        for (var n = 1; n <= period_count; ++n) {
                                                                            period_interest_amount = Math.round(current_body_amount * period_interest_rate * 100) / 100;

                                                                            if (n !== 1 && n !== period_count) {
                                                                                period_body_amount = Math.round((period_total_amount - period_interest_amount) * 100) / 100;
                                                                            } else if (n === period_count) {
                                                                                period_body_amount = Math.round(current_body_amount)
                                                                            } else {
                                                                                period_body_amount = 0;
                                                                            }

                                                                            interest_amount = Math.round((interest_amount + period_interest_amount) * 100) / 100;
                                                                            payments[n - 1] = Math.round((period_interest_amount + period_body_amount) * 100) / 100;
                                                                            current_body_amount = Math.round((current_body_amount - period_body_amount) * 100) / 100;
                                                                        }
                                                                    }
                                                                    if (money > 3000) {
                                                                        return {
                                                                            payments: payments
                                                                        }
                                                                    } else {
                                                                        return {
                                                                            money: Math.round(loan_amount + interest_amount)
                                                                        }
                                                                    }
                                                                } else {
                                                                    return {
                                                                        money: 0
                                                                    }
                                                                }

                                                            };
                                                            this.getCorrectValue = function (money, term) {
                                                                var stepSlider = widgetRepay.model.firstStep.calculator.getStepForSlidersByBusiness(money, term);
                                                                var response = {};
                                                                var setCorrectValue = function (obj) {
                                                                    if (obj.value % stepSlider[obj.type] === 0) {
                                                                        response[obj.type] = obj.value;
                                                                    } else {
                                                                        response[obj.type] = obj.value - (obj.value % stepSlider[obj.type]);
                                                                    }
                                                                };
                                                                setCorrectValue({
                                                                    value: money,
                                                                    type: 'money'
                                                                });
                                                                setCorrectValue({
                                                                    value: term,
                                                                    type: 'term'
                                                                });
                                                                return response;
                                                            };
                                                        }
                                                        this._calculator = new Calculator();
                                                        return this._calculator;
                                                    } else {
                                                        return this._calculator;
                                                    }
                                                }.call(this),
                                                writable: true
                                            },
                                            calculator: {
                                                get: function () {
                                                    return this._calculator;
                                                }
                                            },

                                            _calendar : {
                                                value : function () {
                                                    if(typeof this._calendar == 'undefined') {
                                                        function Calendar() {
                                                            Object.defineProperties(this, {

                                                                _startDayLoan : {
                                                                    value : null,
                                                                    writable : true
                                                                },
                                                                startDayLoan : {
                                                                    get : function () {
                                                                        return this._startDayLoan;
                                                                    }
                                                                },

                                                                _endDayLoan : {
                                                                    value : null,
                                                                    writable : true
                                                                },
                                                                endDayLoan : {
                                                                    get : function () {
                                                                        return this._endDayLoan;
                                                                    }
                                                                }

                                                            });
                                                        }
                                                        this._calendar = new Calendar();
                                                        return this._calendar;
                                                    } else {
                                                        return this._calendar;
                                                    }
                                                }.call(this),
                                                writable : true
                                            },
                                            calendar : {
                                                get : function () {
                                                    return this._calendar;
                                                }
                                            }
                                        });
                                    }
                                    this._firstStep = new FirstStep();
                                    return this._firstStep;
                                } else {
                                    return this._firstStep;
                                }
                            }.call(this),
                            writable : true
                        },
                        firstStep : {
                            get : function () {
                                return this._firstStep;
                            }
                        }
                    });
                }
                this.model = new Self();
                return this.model;
            } else {
                return this.model;
            }
        },
        view : function () {
            if(typeof this.view === 'function') {
                function Self() {
                    Object.defineProperties(this, {
                        _firstStep : {
                            value : function () {
                                if( typeof this._firstStep == 'undefined' ) {
                                    function FirstStep() {
                                        View.call(this);
                                        Object.defineProperties(this, {
                                            _selectAnotherSum : {
                                                value : document.getElementById('select-another-sum')
                                            },
                                            selectAnotherSum : {
                                                get : function () {
                                                    return this._selectAnotherSum
                                                }
                                            },

                                            _sliderSum : {
                                                value : document.getElementById('slider-sum')
                                            },
                                            sliderSum : {
                                                get : function () {
                                                    return this._sliderSum
                                                }
                                            },

                                            _loanLimit : {
                                                value : document.getElementById('loan-limit')
                                            },
                                            loanLimit : {
                                                get : function () {
                                                    return this._loanLimit;
                                                }
                                            },

                                            _transferByCard : {
                                                value : document.getElementById('transfer-by-card')
                                            },
                                            transferByCard : {
                                                get : function () {
                                                    return this._transferByCard
                                                }
                                            },

                                            _transferByCash : {
                                                value : document.getElementById('transfer-by-cash')
                                            },
                                            transferByCash : {
                                                get : function () {
                                                    return this._transferByCash;
                                                }
                                            },

                                            _calculator : {
                                                value : function () {
                                                    if(typeof this._calculator == 'undefined') {
                                                        function Calculator() {
                                                            Object.defineProperties(this, {
                                                                _sliderSum: {
                                                                    value: document.getElementById('slider-sum')
                                                                },
                                                                sliderSum: {
                                                                    get: function () {
                                                                        return this._sliderSum
                                                                    },
                                                                    set: function () {

                                                                    }
                                                                },

                                                                _btnAddSum: {
                                                                    value: document.getElementById('add-value-slider-sum')
                                                                },
                                                                btnAddSum: {
                                                                    get: function () {
                                                                        return this._btnAddSum;
                                                                    },
                                                                    set: function () {

                                                                    }
                                                                },

                                                                _inputSum: {
                                                                    value: document.getElementById('gives__sum')  || document.forms['first-part-worksheet'].elements['input-sum']
                                                                },
                                                                inputSum: {
                                                                    get: function () {
                                                                        return this._inputSum
                                                                    },
                                                                    set: function (inputMoney) {
                                                                        this._inputSum = inputMoney;
                                                                    }
                                                                },

                                                                _allReturnSum: {
                                                                    value: document.getElementById('current-sum-return')
                                                                },
                                                                allReturnSum: {
                                                                    get: function () {
                                                                        return this._allReturnSum;
                                                                    },
                                                                    set: function (allReturnMoney) {
                                                                        this._allReturnSum = allReturnMoney;
                                                                    }
                                                                },

                                                                _textReturnSum: {
                                                                    value: document.getElementById('return')
                                                                },
                                                                textReturnSum: {
                                                                    get: function () {
                                                                        return this._textReturnSum;
                                                                    },
                                                                    set: function (textReturnMoney) {
                                                                        this._textReturnSum = textReturnMoney
                                                                    }
                                                                },

                                                                _sliderTerm: {
                                                                    value: null
                                                                },
                                                                sliderTerm: {
                                                                    get: function () {
                                                                        return this._sliderTerm;
                                                                    },
                                                                    set: function () {

                                                                    }
                                                                },

                                                                _btnAddTerm: {
                                                                    value: null
                                                                },
                                                                btnAddTerm: {
                                                                    get: function () {
                                                                        return this._btnAddTerm;
                                                                    },
                                                                    set: function () {

                                                                    }
                                                                },

                                                                _inputTerm: {
                                                                    value: document.getElementById('gives__term')
                                                                },
                                                                inputTerm: {
                                                                    get: function () {
                                                                        return this._inputTerm
                                                                    },
                                                                    set: function (inputDate) {
                                                                        this._inputTerm.value = inputDate;
                                                                    }
                                                                },

                                                                _allReturnTerm: {
                                                                    value: document.getElementById('current-term-return')
                                                                },
                                                                allReturnTerm: {
                                                                    get: function () {
                                                                        return this._allReturnTerm;
                                                                    },
                                                                    set: function (allReturnTerm) {
                                                                        this._allReturnTerm = allReturnTerm;
                                                                    }
                                                                },

                                                                _textReturnTerm: {
                                                                    value: document.getElementById('period')
                                                                },
                                                                textReturnTerm: {
                                                                    get: function () {
                                                                        return this._textReturnTerm;
                                                                    },
                                                                    set: function (textReturnTerm) {
                                                                        this._textReturnTerm = textReturnTerm;
                                                                    }
                                                                },

                                                                _form: {
                                                                    value: document.forms['first-part-worksheet']
                                                                },
                                                                form: {
                                                                    get: function () {
                                                                        return this._form;
                                                                    },
                                                                    set: function (form) {
                                                                        this._form = form;
                                                                    }
                                                                },

                                                                _limitToolTip : {
                                                                    value : document.getElementById('limitTooltip')
                                                                },
                                                                limitToolTip : {
                                                                    get : function () {
                                                                        return this._limitToolTip;
                                                                    }
                                                                }
                                                            });
                                                            if (typeof this.showSlider != 'function') {
                                                                var that = this;
                                                                this.constructor.prototype.showSlider = function () {

                                                                    // На случай добавление аннуитетного договора

                                                                    //noUiSlider.create(that.sliderTerm, {
                                                                    //    start: this.currentTermSelect,
                                                                    //    orientation: 'horizontal',
                                                                    //    connect: 'lower',
                                                                    //    range: {
                                                                    //        'min': this.min_term_pdl,
                                                                    //        'max': this.max_term_annuity
                                                                    //    },
                                                                    //    step: this.step_add_term_pdl
                                                                    //});
                                                                    this.loanLimit = parseInt(widgetRepay.view.firstStep.loanLimit.innerHTML);
                                                                    this.currentSumSelect = this.loanLimit;
                                                                    noUiSlider.create(that.sliderSum, {
                                                                        start: this.currentSumSelect,
                                                                        orientation: 'horizontal',
                                                                        connect: 'lower',
                                                                        range: {
                                                                            'min': this.min_sum_pdl,
                                                                            'max': this.currentSumSelect
                                                                        },
                                                                        step: this.step_add_sum_pdl
                                                                    });
                                                                }
                                                            }
                                                            this.getTextNode = function (elem) {
                                                                var textElements = elem.cloneNode(true),
                                                                    arrayText = [];
                                                                for (var index = 0, countNodes = textElements.childNodes.length; index < countNodes; index++) {
                                                                    if (elem.childNodes[index].nodeType === 3) {
                                                                        arrayText.push(elem.childNodes[index]);
                                                                    }
                                                                }
                                                                return arrayText;
                                                            };
                                                            this.correctingValueSlider = function (money, term, typeContractByMoney) {
                                                                var response = widgetRepay.model.firstStep.calculator.getCorrectValue(money, term);
                                                                //Вот здесь ошибка, доделай!!!

                                                                if (typeContractByMoney === 'PDL') {
                                                                    if (response['term'] > widgetRepay.model.firstStep.calculator.max_term_pdl) {
                                                                        response['term'] = widgetRepay.model.firstStep.calculator.max_term_pdl
                                                                    }
                                                                }
                                                                if (response['money'] > widgetRepay.model.firstStep.calculator.max_sum_annuity) {
                                                                    response['money'] = widgetRepay.model.firstStep.calculator.max_sum_annuity
                                                                }
                                                                if (response['term'] > widgetRepay.model.firstStep.calculator.max_term_annuity) {
                                                                    response['term'] = widgetRepay.model.firstStep.calculator.max_term_annuity;
                                                                }
                                                                var forBusiness = widgetRepay.model.firstStep.calculator.calculationMoney(Number(response['money']), Number(response['term']));

                                                                if (Object.keys(forBusiness).indexOf('money') != -1) {
                                                                    widgetRepay.model.firstStep.calculator.currentSumReturn = forBusiness.money;
                                                                } else if (Object.keys(forBusiness).indexOf('payments') != -1) {
                                                                    widgetRepay.model.firstStep.calculator.currentSumReturn = forBusiness.payments;
                                                                }
                                                                return response;
                                                            }
                                                            this.changeByTypeContract = function (typeContractByMoney, newValue) {
                                                                if (typeContractByMoney === 'PDL') {
                                                                    widgetRepay.view.firstStep.calculator.updateMoneyInForm(newValue.money, typeContractByMoney);
                                                                    if (newValue.term >= widgetRepay.model.firstStep.calculator.max_term_pdl) {
                                                                        widgetRepay.view.firstStep.calculator.updateTermInForm(widgetRepay.model.firstStep.calculator.max_term_pdl, typeContractByMoney);
                                                                    } else {
                                                                        widgetRepay.view.firstStep.calculator.updateTermInForm(newValue.term, typeContractByMoney);
                                                                    }
                                                                } else if (typeContractByMoney === 'ANNUITY') {
                                                                    widgetRepay.view.firstStep.calculator.updateMoneyInForm(newValue.money, typeContractByMoney);
                                                                    if (newValue.term <= widgetRepay.model.firstStep.calculator.min_term_annuity) {
                                                                        widgetRepay.view.firstStep.calculator.updateTermInForm(widgetRepay.model.firstStep.calculator.min_term_annuity, typeContractByMoney, newValue.money);
                                                                    } else {
                                                                        widgetRepay.view.firstStep.calculator.updateTermInForm(newValue.term, typeContractByMoney, newValue.money);
                                                                    }
                                                                }
                                                            };
                                                            this.getNewValue = function (money, term, typeContractByMoney) {
                                                                var forSlider = this.correctingValueSlider(money, term, typeContractByMoney);
                                                                return {
                                                                    money: forSlider.money,
                                                                    term: forSlider.term
                                                                };
                                                            };
                                                            this.updateMoneyInForm = function (countMoney, typeContract) {
                                                                var arrayTextElement = widgetRepay.view.firstStep.calculator.getTextNode(this.textReturnSum, 'array'),
                                                                    textDescription = arrayTextElement[0],
                                                                    wordGrn = arrayTextElement[1];
                                                                if (typeContract === 'PDL') {
                                                                    if (countMoney >= 3000) {
                                                                        widgetRepay.view.firstStep.calculator.inputSum.step = '500';
                                                                    } else {
                                                                        widgetRepay.view.firstStep.calculator.inputSum.step = '100';
                                                                    }
                                                                    textDescription.nodeValue = 'Всего к возврату : ';
                                                                    this.allReturnSum.innerHTML = widgetRepay.model.firstStep.calculator.currentSumReturn;
                                                                    wordGrn.nodeValue = ' грн';
                                                                } else if (typeContract === 'ANNUITY') {
                                                                    wordGrn.nodeValue = '';
                                                                    widgetRepay.view.firstStep.calculator.inputSum.step = '500';
                                                                    textDescription.nodeValue = 'Первый платеж : ' + widgetRepay.model.firstStep.calculator.currentSumReturn[0] + ' грн до ';
                                                                    var newFullDate = widgetRepay.model.firstStep.calculator.getFullDateByDay(14);
                                                                    this.allReturnSum.innerHTML = newFullDate;
                                                                }
                                                                widgetRepay.model.firstStep.calculator.currentSumSelect = countMoney;
                                                                this.sliderSum.noUiSlider.set([countMoney]);
                                                                this.inputSum.value = countMoney;
                                                            };
                                                            this.updateTermInForm = function (countDay, typeContract) {
                                                                var textDescription = widgetRepay.view.firstStep.calculator.getTextNode(this.textReturnTerm, 'array')[0];
                                                                var newFullDate = widgetRepay.model.firstStep.calculator.getFullDateByDay(countDay);
                                                                if (typeContract === 'PDL') {
                                                                    if (widgetRepay.model.firstStep.calculator.currentSumSelect >= 3000) {
                                                                        widgetRepay.view.firstStep.calculator.inputTerm.step = '15';
                                                                        widgetRepay.view.firstStep.calculator.inputTerm.min = '0';
                                                                    } else {
                                                                        widgetRepay.view.firstStep.calculator.inputTerm.step = '1';
                                                                        widgetRepay.view.firstStep.calculator.inputTerm.min = '1';
                                                                    }
                                                                    textDescription.nodeValue = 'Оплатить до : ';
                                                                } else if (typeContract === 'ANNUITY') {
                                                                    widgetRepay.view.firstStep.calculator.inputTerm.step = '15';
                                                                    widgetRepay.view.firstStep.calculator.inputTerm.min = '0';

                                                                    var countPayments = parseInt(countDay / 15),
                                                                        textShow = '';
                                                                    if(countPayments == 1) {
                                                                        textShow = parseInt(countDay / 15) + ' платеж по ' ;
                                                                    } else if(1 < countPayments && countPayments <= 4) {
                                                                        textShow = parseInt(countDay / 15) + ' платежа по ' ;
                                                                    } else  {
                                                                        textShow = parseInt(countDay / 15) + ' платежей по ' ;
                                                                    }
                                                                    textDescription.nodeValue = 'Всего : ' + textShow +
                                                                        widgetRepay.model.firstStep.calculator.currentSumReturn[widgetRepay.model.firstStep.calculator.currentSumReturn.length - 1] +
                                                                        ' до ';
                                                                }
                                                                this.allReturnTerm.innerHTML = newFullDate;
                                                                widgetRepay.model.firstStep.calculator.currentTermSelect = countDay;
                                                                //this.sliderTerm.noUiSlider.set([countDay]);
                                                                this.inputTerm.value = countDay;
                                                            };
                                                            this.showResult = function (money, term) {
                                                                var correctValue = widgetRepay.model.firstStep.calculator.getCorrectValue(money, term);
                                                                //if (
                                                                //    correctValue.money < widgetRepay.model.firstStep.calculator.max_sum_pdl &&
                                                                //    correctValue.term > widgetRepay.model.firstStep.calculator.min_term_annuity
                                                                //) {
                                                                //    this.limitToolTip.classList.add('js-showTooltipRed')
                                                                //} else {
                                                                //    if(this.limitToolTip.classList.contains('js-showTooltipRed')) {
                                                                //        this.limitToolTip.classList.remove('js-showTooltipRed')
                                                                //    }
                                                                //}
                                                                var typeContractByMoney = widgetRepay.model.firstStep.calculator.getTypeContract(
                                                                    correctValue.money,
                                                                    this.sliderSum.getAttribute('id')
                                                                );
                                                                var newValue = this.getNewValue(correctValue.money, correctValue.term, typeContractByMoney);
                                                                this.changeByTypeContract(typeContractByMoney, newValue);
                                                            }
                                                        }
                                                        this._calculator = new Calculator();
                                                        return this._calculator;
                                                    } else {
                                                        return this._calculator;
                                                    }
                                                }.call(this),
                                                writable : true
                                            },
                                            calculator : {
                                                get : function () {
                                                    return this._calculator;
                                                }
                                            },

                                            _calendar : {
                                                value : function () {
                                                    if(typeof this._calendar == 'undefined') {
                                                        function Calendar() {
                                                            Object.defineProperties(this, {

                                                                _loanCalendar : {
                                                                    value : document.getElementById('loan-calendar')
                                                                },
                                                                loanCalendar : {
                                                                    get : function () {
                                                                        return this._loanCalendar;
                                                                    }
                                                                },

                                                                _startDayLoan : {
                                                                    value : document.getElementById('start-day-loan')
                                                                },
                                                                startDayLoan : {
                                                                    get : function () {
                                                                        return this._startDayLoan;
                                                                    }
                                                                },

                                                                _toolTipCalendar : {
                                                                    value : function () {
                                                                        if(typeof this._toolTipCalendar === 'undefined') {

                                                                            function TooltipCalendar() {
                                                                                Object.defineProperties(this, {

                                                                                    _self : {
                                                                                        value : document.querySelector('.calendar__tooltip')
                                                                                    },
                                                                                    self : {
                                                                                        get: function () {
                                                                                            return this._self;
                                                                                        }
                                                                                    },

                                                                                    _day : {
                                                                                        value : document.querySelector('.tooltip__day')
                                                                                    },
                                                                                    day : {
                                                                                        get : function () {
                                                                                            return this._day
                                                                                        }
                                                                                    },

                                                                                    _date : {
                                                                                        value : document.querySelector('.tooltip__date')
                                                                                    },
                                                                                    date : {
                                                                                        get : function () {
                                                                                            return this._date;
                                                                                        }
                                                                                    },

                                                                                    _percent : {
                                                                                        value : document.querySelector('.tooltip__percent')
                                                                                    },
                                                                                    percent : {
                                                                                        get : function () {
                                                                                            return this._percent;
                                                                                        }
                                                                                    },

                                                                                    _returnSum : {
                                                                                        value : document.querySelector('.tooltip__return-sum')
                                                                                    },
                                                                                    returnSum : {
                                                                                        get : function () {
                                                                                            return this._returnSum;
                                                                                        }
                                                                                    }

                                                                                });
                                                                            }
                                                                            this._toolTipCalendar = new TooltipCalendar();
                                                                            return this._toolTipCalendar;
                                                                        } else {
                                                                            return tools.best.checkObj.call(this, '_toolTipCalendar');
                                                                        }
                                                                    }.call(this),
                                                                    writable : true
                                                                },
                                                                toolTipCalendar : {
                                                                    get : function () {
                                                                        return this._toolTipCalendar;
                                                                    }
                                                                },

                                                                _dayInCalendar : {
                                                                    value : document.querySelectorAll('#loan-calendar td > div:first-child span')
                                                                },
                                                                dayInCalendar : {
                                                                    get : function () {
                                                                        return this._dayInCalendar;
                                                                    }
                                                                },

                                                            });

                                                            this.constructor.prototype.showDateInCalendar = function () {
                                                                var new_date = new Date(),
                                                                    month = new_date.getMonth() + 1,
                                                                    day = new_date.getDate(),
                                                                    countDayInWeek = new_date.getDay(),
                                                                    weekday = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                                                                if(month < 9) {
                                                                    month = '0' + month;
                                                                }
                                                                var ifGo = new_date.daysInMonth();
                                                                for(var i = 1, k = 0; i != 3; i++) {
                                                                    for(var j = 1, l = 0; j != 8; j++, l++) {
                                                                        if(i == 4 && j > 2) {
                                                                            break;
                                                                        }
                                                                        if((countDayInWeek + l) >= 7) {
                                                                            l = 0;
                                                                            countDayInWeek = 0;
                                                                        }
                                                                        this.loanCalendar.querySelector("tr:nth-child("+i+") > td:nth-child("+j+") > div:first-child > span").innerHTML = weekday[countDayInWeek + l];
                                                                        this.loanCalendar.querySelector("tr:nth-child("+i+") > td:nth-child("+j+") > div:last-child > span").innerHTML = day + k + '.'+ month;
                                                                        if((day + k) >= ifGo) {
                                                                            if(month < 12) {
                                                                                month += 1;
                                                                                k = 0;
                                                                                day = 1;
                                                                            } else {
                                                                                month = 1;
                                                                                k = 0;
                                                                                day = 1;
                                                                            }
                                                                        } else {
                                                                            ++k;
                                                                        }
                                                                    }
                                                                }
                                                                var endDate = this.loanCalendar.querySelector("tr:nth-child(2) td:last-child > div:last-child > span").innerHTML + '.' + new_date.getFullYear();
                                                                widgetRepay.view.firstStep.endDateLoan.innerHTML = endDate;
                                                            };

                                                            this.constructor.prototype.showLoanPopover = function (event) {

                                                                var infoCredit = this.calcCreditForCalendar(event);

                                                                this.toolTipCalendar.day.innerHTML = infoCredit.nameEndDay;
                                                                this.toolTipCalendar.date.innerHTML = infoCredit.endDate;
                                                                this.toolTipCalendar.percent.innerHTML = infoCredit.procentCreditForPeriod;
                                                                this.toolTipCalendar.returnSum.innerHTML = '&#8372; ' + infoCredit.allCreditForPeriod;

                                                                var topElem = tools.eventUtil.getPageY(event),
                                                                    leftElem = tools.eventUtil.getPageX(event);

                                                                var widthElem = 160;

                                                                var screenX = tools.propertiesDOM.screenSize('width'),
                                                                    screenY = tools.propertiesDOM.screenSize('height');

                                                                tools.animate.opacity(0, 1, this.toolTipCalendar.self);

                                                                this.toolTipCalendar.self.style.top = (topElem + 20) + 'px';
                                                                this.toolTipCalendar.self.style.left = (leftElem - widthElem) + 'px';
                                                            };

                                                            this.constructor.prototype.hideLoanPopover = function () {
                                                                tools.animate.opacity(1, 0, this.toolTipCalendar.self);
                                                            };

                                                            this.constructor.prototype.calcCreditForCalendar = function(event) {

                                                                var currentTarget = tools.eventUtil.getCurrentTarget(event);
                                                                    // Дата отсчета кредита
                                                                var startDate = this.startDayLoan.innerHTML,
                                                                    // День отсчета
                                                                    startDay = startDate.split('.')[0],
                                                                    // Месяц отсчета
                                                                    startMonth = startDate.split('.')[1];

                                                                widgetRepay.model.firstStep.calendar.startDayLoan = startDay;


                                                                // Текущая дата
                                                                var currentDate = new Date();

                                                                    // Елемент ( интересует только дата )на котором сработал обработщик события
                                                                var eventDate = currentTarget.parentNode.parentNode.querySelector('div:last-child > span').innerHTML,
                                                                    // День завершения отсчета
                                                                    endDay = eventDate.split('.')[0],
                                                                    // Месяц завершения отсчета
                                                                    endMonth = eventDate.split('.')[1],
                                                                    // День недели
                                                                    nameEndDay = currentTarget.parentNode.parentNode.querySelector('div:first-child > span').innerHTML;

                                                                var countDayLoan = 0;
                                                                if(startMonth != endMonth) {
                                                                    var countDayBeforeEndMonth = currentDate.daysInMonth() -  startDay;
                                                                    countDayLoan = Number(countDayBeforeEndMonth) + Number(endDay) + 1;
                                                                } else {
                                                                    countDayLoan = endDay - startDay + 1;
                                                                }

                                                                var procentCreditForPeriod = parseInt(widgetRepay.model.firstStep.calculator.currentSumSelect * 0.02 * countDayLoan),
                                                                    allCreditForPeriod =  parseInt(widgetRepay.model.firstStep.calculator.currentSumSelect * ( 1 + 0.02 * countDayLoan));

                                                                return  {
                                                                    endDate : eventDate + '.' + currentDate.getFullYear(),
                                                                    nameEndDay : nameEndDay,
                                                                    procentCreditForPeriod : procentCreditForPeriod,
                                                                    allCreditForPeriod : allCreditForPeriod
                                                                };

                                                                //var startDay = $("#widget-repayment .table tr:nth-child(2) td:nth-child(1) span:last").text().split('.')[0],
                                                                //    startMonth = $("#widget-repayment .table tr:nth-child(2) td:nth-child(1) span:last").text().split('.')[1],
                                                                //    currentDate = new Date(),
                                                                //    currentYear = currentDate.getFullYear(),
                                                                //    tempEndDate = $(event.currentTarget.parentNode.parentNode).find('span:last'),
                                                                //    endDay = tempEndDate.text().split('.')[0],
                                                                //    endDate = tempEndDate.text(),
                                                                //    nameEndDay = $(event.currentTarget.parentNode.parentNode).find('span:first').text(),
                                                                //    endMonth = $(event.currentTarget.parentNode.parentNode).find('span:last').text().split('.')[1],
                                                                //    sizeMoneyAutolimit = $('#widget-repayment div:nth-child(1) strong:first').text();
                                                                //if(startMonth != endMonth) {
                                                                //    var countDayBeforeEndMonth = currentDate.daysInMonth() -  startDay;
                                                                //    var N = Number(countDayBeforeEndMonth) + Number(endDay) + 1;
                                                                //} else {
                                                                //    N = endDay - startDay + 1;
                                                                //}
                                                                //var procentCreditForPeriod = parseInt(sizeMoneyAutolimit*0.02 * N),
                                                                //    allCreditForPeriod =  parseInt(sizeMoneyAutolimit*(1+0.02*N));
                                                                //var contentTooltip = ["<div style='width:100%'><div class='col-lg-6 text-left' style='height:50px'>" +
                                                                //"<span>"+nameEndDay+"</span></br>" +
                                                                //"<span>"+endDate+'.'+currentYear+"</span></br>" +
                                                                //"</div>" +
                                                                //"<div class='col-lg-6 text-right' style='height:50px'>" +
                                                                //"<span>₴"+procentCreditForPeriod+"</span></br>" +
                                                                //"<span>₴"+allCreditForPeriod+"</span>" +
                                                                //"</div></div>"].join(' ');
                                                                //var x = event.pageX,
                                                                //    position = 'right';
                                                                //if(x > (forAllPage.funcS.screenSize('width') - 150)) {
                                                                //    position = 'top'
                                                                //}
                                                                //$(event.currentTarget.parentNode).popover({
                                                                //    placement: position,
                                                                //    html: true,
                                                                //    content:contentTooltip
                                                                //}).popover('show');
                                                            };

                                                        }
                                                        this._calendar = new Calendar();
                                                        return this._calendar;
                                                    } else {
                                                        return this._calendar;
                                                    }
                                                }.call(this),
                                                writable : true
                                            },
                                            calendar : {
                                                get : function () {
                                                    return this._calendar;
                                                }
                                            },

                                            _endDateLoan : {
                                                value : document.getElementById('end-date')
                                            },
                                            endDateLoan : {
                                                get : function () {
                                                    return this._endDateLoan;
                                                }
                                            },

                                            _self : {
                                                value : document.getElementById('repay-first-step')
                                            },
                                            self : {
                                                get : function () {
                                                    return this._self;
                                                }
                                            }
                                        });
                                        this.constructor.prototype.changeTypeSelectSum = function () {
                                            if(this.selectAnotherSum.classList.contains('active-slider')) {

                                                this.selectAnotherSum.classList.add('active-calendar');
                                                this.selectAnotherSum.classList.remove('active-slider');
                                                this.selectAnotherSum.innerHTML = 'Выбрать другую сумму';
                                                tools.animate.opacity(0, 1, this.calendar.loanCalendar.parentNode);
                                                tools.animate.opacity(1, 0, this.calculator.sliderSum.parentNode);

                                            } else {

                                                this.selectAnotherSum.classList.add('active-slider');
                                                this.selectAnotherSum.classList.remove('active-calendar');
                                                this.selectAnotherSum.innerHTML = 'Выбрать рекомендованую сумму';
                                                tools.animate.opacity(1, 0, this.calendar.loanCalendar.parentNode);
                                                tools.animate.opacity(0, 1, this.calculator.sliderSum.parentNode);

                                            }
                                        };
                                        this.constructor.prototype.checkCanTakeOnline = function (promise, eventHandler, eventElement, typeEvent) {
                                            var that = this;
                                            promise
                                                .then(
                                                function (response) {
                                                    var div = document.createElement('div');
                                                    div.innerHTML = response;
                                                    if(div.querySelector('.card')) {
                                                        that.showWinSelectCard(div);
                                                    } else {
                                                        tools.modalWindow.addDOM(
                                                            'go-to-tab-cards',
                                                            'Добавьте новую карту или активируйте существующую'
                                                        );
                                                        tools.modalWindow.show();
                                                    }
                                                },
                                                function (error) {
                                                    if(error.status === 403) {
                                                        tools.modalWindow.addDOM(
                                                            'can-not-loan-online',
                                                            'На текущий момент Вы не можете получить кредит на карту. Вам необходимо подписать новую форму оферты в отделении.'
                                                        )
                                                    } else if(error.status === 500) {
                                                        tools.modalWindow.addDOM(
                                                            'continue',
                                                            'Произошла внутреняя ошибка. Повторите попытку позже.'
                                                        )
                                                    }
                                                    tools.modalWindow.show();
                                                },
                                                function () {
                                                    tools.eventUtil.removeHandler(eventElement, typeEvent, eventHandler);
                                                    that.transferByCard.parentNode.classList.add('js-showSpinnerBtn');
                                                }
                                            )
                                                .always(
                                                    function () {
                                                        tools.eventUtil.addHandler(eventElement, typeEvent, eventHandler);
                                                        that.transferByCard.parentNode.classList.remove('js-showSpinnerBtn');
                                                    }
                                                );
                                        };
                                        this.constructor.prototype.showWinSelectCard = function (div) {

                                            document.body.appendChild(div);
                                            var verifiedCards = div.querySelector('#verified-cards'),
                                                selectedCard = div.querySelectorAll('.selected-card');
                                            tools.animate.opacity(0, 1, verifiedCards);

                                            //        Обработчик события скрытия всех карт для выбора
                                            widgetRepay.controller.firstStep.actionWinSelectCard.call(this, verifiedCards);
                                            //

                                            //        Обработчик события выбора карты
                                            widgetRepay.controller.firstStep.actionSelectedCard.call(this, selectedCard);
                                            //

                                        };
                                        this.constructor.prototype.showWinDoNotLoanOnline = function () {

                                        };

                                    }
                                    tools.best.inheritPrototype(FirstStep, View);
                                    this._firstStep = new FirstStep();
                                    return this._firstStep;
                                } else {
                                    return this._firstStep;
                                }
                            }.call(this),
                            writable : true
                        },
                        firstStep : {
                            get : function () {
                                return this._firstStep;
                            }
                        },

                        _secondStep : {
                            value : function () {
                                if(typeof this._secondStep == 'undefined') {
                                    function SecondStep() {
                                        View.call(this);
                                        Object.defineProperties(this, {
                                            _self : {
                                                value : document.getElementById('repay-second-step')
                                            },
                                            self : {
                                                get : function () {
                                                    return this._self;
                                                }
                                            },

                                            _moneySelect : {
                                                value : document.getElementById('select-sum-loan')
                                            },
                                            moneySelect : {
                                                get : function () {
                                                    return this._moneySelect;
                                                }
                                            },

                                            _moneyReturn : {
                                                value : document.getElementById('return-sum-loan')
                                            },
                                            moneyReturn : {
                                                get : function () {
                                                    return this._moneyReturn;
                                                }
                                            },

                                            _termReturn : {
                                                value : document.getElementById('return-term-loan')
                                            },
                                            termReturn : {
                                                get : function () {
                                                    return this._termReturn;
                                                }
                                            },

                                            _agreeContract : {
                                                value : document.getElementById('agreeConditions')
                                            },
                                            agreeContract : {
                                                get : function () {
                                                    return this._agreeContract;
                                                }
                                            },

                                            _buttonGoToThirdStep : {
                                                value : document.getElementById('go-to-third-step')
                                            },
                                            buttonGoToThirdStep : {
                                                get : function () {
                                                    return this._buttonGoToThirdStep;
                                                }
                                            },

                                            _buttonGoToFirstStep : {
                                                value : document.getElementById('button-to-first-step')
                                            },
                                            buttonGoToFirstStep : {
                                                get : function () {
                                                    return this._buttonGoToFirstStep;
                                                }
                                            },
                                        });

                                        this.constructor.prototype.setSumAndTermLoan = function () {
                                            this.moneySelect.innerHTML = widgetRepay.model.firstStep.calculator.currentSumSelect;
                                            this.moneyReturn.innerHTML = widgetRepay.model.firstStep.calculator.currentSumReturn;
                                            this.termReturn.innerHTML = widgetRepay.model.firstStep.calculator.getFullDateByDay(15);
                                        };

                                        this.constructor.prototype.goToFirstStep = function () {
                                            this.hide();
                                            widgetRepay.view.firstStep.show();
                                        };

                                        this.constructor.prototype.goToThirdStep = function () {
                                            this.hide();
                                            widgetRepay.view.thirdStep.show();
                                        };

                                        this.constructor.prototype.responseCreateContract = function (promise, eventHandle, typeEvent, eventElem) {
                                            var that = this;
                                            promise
                                                .then(
                                                    function (response) {
                                                        that.goToThirdStep();
                                                    },
                                                    function (error) {
                                                        if(error.status === 403) {
                                                            tools.modalWindow.addDOM(
                                                                'can-not-loan-online',
                                                                'Данная функция не доступна. Повторите попытку позже.'
                                                            )
                                                        } else if(error.status === 500) {
                                                            tools.modalWindow.addDOM(
                                                                'continue',
                                                                'Произошла внутреняя ошибка. Повторите попытку позже.'
                                                            )
                                                        }
                                                        tools.modalWindow.show();
                                                    },
                                                    function () {
                                                        tools.eventUtil.removeHandler(eventHandle, typeEvent, eventElem);
                                                    }
                                                )
                                                .always(
                                                    function () {
                                                        tools.eventUtil.addHandler(eventHandle, typeEvent, eventElem);
                                                    }
                                                );
                                        };
                                    }
                                    tools.best.inheritPrototype(SecondStep, View);
                                    this._secondStep = new SecondStep();
                                    return this._secondStep;
                                } else {
                                    return this._secondStep
                                }
                            }.call(this),
                            writable : true
                        },
                        secondStep : {
                            get : function () {
                                return this._secondStep;
                            }
                        },

                        _thirdStep : {
                            value : function () {
                                if(typeof this._thirdStep == 'undefined') {
                                    function ThirdStep() {

                                        Object.defineProperties(this, {
                                            _self : {
                                                value : document.getElementById('repay-second-step')
                                            },
                                            self : {
                                                get : function () {
                                                    return this._self;
                                                }
                                            }
                                        });
                                    }
                                    this._thirdStep = new ThirdStep();
                                    return this._thirdStep
                                }
                            }.call(this),
                            writable : true
                        },
                        thirdStep : {
                            get : function () {
                                return this.thirdStep;
                            }
                        }
                    });
                    this.constructor.prototype.init = function () {
                        this.firstStep;
                    };
                    this.init.call(this);
                }
                this.view = new Self();
                return this.view;
            } else {
                return this.view;
            }
        }
    };
    function View() {
        Object.defineProperties(this, {});
        this.constructor.prototype.show = function (obj) {
            if(obj == undefined) {
                obj = this.self;
            }
            tools.animate.opacity(0, 1, obj);
            obj.classList.add('js-showWidget');
        };
        this.constructor.prototype.hide = function (obj) {
            if(obj == undefined) {
                obj = this.self;
            }
            tools.animate.opacity(1, 0, obj);
            obj.classList.remove('js-showWidget');
        };
    }
    tools.eventUtil.addHandler(window, 'DOMContentLoaded', function () {
        if(window.app === undefined) {
            window.app = {};
            window.app['widgetRepay'] = widgetRepay.init();
        } else {
            window.app['widgetRepay'] = widgetRepay.init();
        }
    });
})();