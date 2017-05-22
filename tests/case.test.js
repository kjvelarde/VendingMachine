describe('Testing Product Factory',
    function () {
        beforeEach(function () {
            module('app');
            inject(function ($injector) {
                pFactory = $injector.get('productFactory');
                cFactory = $injector.get('coinFactory');
            });
        });

        it('should return all products', function () {
            var q = pFactory.get();
            var products = q.map(function (product) {
                return product.Name;
            });

            expect(products).toContain('Cola');
            expect(products).toContain('Chips');
            expect(products).toContain('Candy');
            //            expect(products).toContain('Chocolate'); -not required by kata
            //            expect(products).toContain('RedBull'); -not required by kata
            expect(products.length).toEqual(5);
        });

        it('should return major types of USD coins', function () {
            var q = cFactory.get();
            var coins = q.map(function (coin) {
                return coin.Name;
            });

            expect(coins).toContain('Quarter');
            expect(coins).toContain('Dime');
            expect(coins).toContain('Nickel');
            expect(coins).toContain('Penny');
            expect(coins.length).toEqual(4);
        });
    });

describe('Testing Vending Machine Functions', function () {
    var $controller;
    var $rootScope;
    beforeEach(function () {
        module('app');
        inject(function (_$rootScope_, _$controller_, $injector) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            pFactory = $injector.get('productFactory');
            cFactory = $injector.get('coinFactory');
        });
    });

    it('should start as "Normal" mode',
        function () {
            var $scope = $rootScope.$new();
            var controller = $controller('ctrl', {
                $scope: $scope
            });

            expect($scope.mode).toEqual('normal');
        });

    it('should reject pennies',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Penny';
            })[0];

            $scope.insertCoin(coin) //insert penny

            expect($scope.currentAmount).toEqual(0);
        });

    it('should accept coins higher than a penny',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Dime';
            })[0];

            $scope.insertCoin(coin) //insert dime
            expect($scope.currentAmount).toEqual(.10);
        });

    it('should dispense product if amount is correct',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Quarter';
            })[0];

            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter

            //should be able to afford chips for .50 cents         

            var products = $scope.products.filter(function (product) {
                return product.Name == 'Chips';
            });

            $scope.selectProduct(products[0])

            expect($scope.selectedProducts[0]).toEqual(products[0]);
        });

    it('should return change if mode is normal',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Quarter';
            })[0];

            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter

            //should be able to afford chips for .50 cents         

            var products = $scope.products.filter(function (product) {
                return product.Name == 'Chips';
            });

            $scope.selectProduct(products[0])

            expect($scope.changeAmount).toEqual(.25);
        });

    it('should not return change if mode is not normal',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Quarter';
            })[0];

            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter

            //change mode to EXACT CHANGE ONLY
            $scope.changeMode();

            //should be able to afford chips for .50 cents         
            var products = $scope.products.filter(function (product) {
                return product.Name == 'Chips';
            });

            $scope.selectProduct(products[0])

            //SHOULD NOT RETURN CHANGE
            expect($scope.changeAmount).toEqual(0);
        });

    it('should return change if return coins button is click',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.Name == 'Quarter';
            })[0];

            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter
            $scope.insertCoin(coin) //insert quarter    

            $scope.returnCoins();

            //return inserted coins
            expect($scope.changeAmount).toEqual(.75);
        });


    it('should check inserted coin by weight',
        function () {
            var $scope = $rootScope.$new();

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            var coin = $scope.coins.filter(function (coin) {
                return coin.WeightInGrams == 5; //should return coin 5g == nickel
            })[0];

            //return inserted coins
            expect(coin.Name).toEqual('Nickel');
            expect(coin.Value).toEqual(.05);
        });

});