// Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calculatePercentage = function(income) {

        if (income > 0) {
            this.percentage = Math.round(this.value / income * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur, idx, arr) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    return {
        addItem: function(type, des, value) {
            var newItem;
            var ID;

            if (data.allItems[type].length === 0) {
                ID = 0;
            } else {
                var idx = data.allItems[type].length - 1;
                ID = data.allItems[type][idx].id + 1;
            }
            
            if (type === 'inc') {
                newItem = new Income(ID, des, value);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
            var ids, pos;
            ids = data.allItems[type].map(function(curr) {
                return curr.id;
            });

            pos = ids.indexOf(id);
            if (pos !== -1) {
                data.allItems[type].splice(pos, 1);
            }
        },
        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            return data.allItems.exp.map(function(cur) {
                return cur.getPercentage() ;
            });
        },
        testing: function() {
            console.log(data);
        }
    };
    

    
})();

// UI Controller
var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetPercentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        budgetMonthTitle: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        /* format rule
           1. two digit after point
           2. decimal
           3. sign
        */
        num = Math.abs(num);
        num = num.toFixed(2);

        splitNum = num.split('.');
        intPart = splitNum[0];
        decPart = splitNum[1];

        if (intPart.length > 3) {
            intPart = intPart.substr(0, intPart.length - 3) + ',' + intPart.substr(-3);
        }

        return (type === 'inc' ? '+' : '-') + ' ' + intPart + '.' + decPart;
    };

    var nodeListForEach = function(list, callback) {
        if(!list) {
            return;
        }
        
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        getDOMStrings: function() {
            return DOMStrings;
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(curr, idx, arr) {
                curr.value = '';
            });

            fieldsArr[0].focus();
        },
        displayBudget: function(obj) {
            var budgetType = obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,  budgetType);
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.budgetExpenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetPercentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetPercentageLabel).textContent = '---';
            }
            
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensePercLabel);

            nodeListForEach(fields, function(curr, idx) {

                if (percentages[idx] > 0) {
                    curr.textContent = percentages[idx] + '%';
                } else {
                    curr.textContent = '---';
                }
                
            });
        },
        deleteListItems: function(itemId) {
            var el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
        },
        addListItems: function(obj, type) {
            var html, newHtml, domList;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
                domList = document.querySelector(DOMStrings.incomeList);
            } else if (type === 'exp') {
                html = '<div class="item clearfix"id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                domList = document.querySelector(DOMStrings.expenseList);
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            domList.insertAdjacentHTML('beforeend', newHtml);
        },
        displayDate: function() {
            var date = new Date();
            var dateArr = date.toDateString().split(' ');
            var month = dateArr[1];
            var year = dateArr[3];
            document.querySelector(DOMStrings.budgetMonthTitle).textContent = month + ' ' + year;
        },
        changeType: function() {
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            var btn = document.querySelector(DOMStrings.inputBtn);
            btn.classList.toggle('red');
        }
    }
    
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMStrings();

    var setupEventListener = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItems);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                crtlAddItems();
            }
        });
        // event delegate
        document.querySelector(DOM.container).addEventListener('click', crtlDeleteItems);
        // optimize UX
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function() {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. read percentage from budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. update the UI with the new percentage
        UICtrl.displayPercentages(percentages);
    };
    
    var crtlAddItems = function() {
        // 1. Get the input
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item into budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItems(newItem, input.type);
            // 4. clear the fields
            UICtrl.clearFields();
            // 5. update budget
            updateBudget();
            // 6. update pencentage
            updatePercentages();
        }
        
    };

    var crtlDeleteItems = function(event) {

        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            var split = itemId.split('-');
            var type = split[0];
            var id = parseInt(split[1]);
            // 1. delete the item from budget
            budgetCtrl.deleteItem(type, id);
            // 2. delete the item from UI
            UICtrl.deleteListItems(itemId);
            // 3. re-calculate the budget and show it
            updateBudget();
            // 4. update percentage
            updatePercentages();
        }
        
    }

    return {
        init: function() {
            console.log('App init');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
        }
    }
    
    
})(budgetController, UIController);

controller.init();
