describe('Testing Product Factory',
    function () {
        beforeEach(function () {
            module('app');
            inject(function ($injector) {
                pFactory = $injector.get('productFactory');
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
    });

describe('Testing Vending Machine Functions', function () {
    var $controller;
    beforeEach(function () {
        module('app');
        inject(function (_$controller_, $injector) {
            $controller = _$controller_;
            pFactory = $injector.get('productFactory');
        });
    });

    it('should start as "Normal" mode',
        function () {
            var $scope = {};
            var controller = $controller('ctrl', {
                $scope: $scope
            });
            expect($scope.mode).toEqual('normal');
        });

    it('should reject pennies',
        function () {
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.01) //insert penny
            expect($scope.currentAmount).toEqual(0);
        });

    it('should accept coins higher than a penny',
        function () {
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.10) //insert dime
            expect($scope.currentAmount).toEqual(.10);
        });

    it('should dispense product if amount is correct',
        function () {
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter

            //should be able to afford chips for .50 cents         

            var products = $scope.products.filter(function (product) {
                return product.Name == 'Chips';
            });

            $scope.selectProduct(products[0])

            expect($scope.selectedProduct).toEqual(products[0]);
        });

    it('should return change if mode is normal',
        function () {
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter

            //should be able to afford chips for .50 cents         

            var products = $scope.products.filter(function (product) {
                return product.Name == 'Chips';
            });

            $scope.selectProduct(products[0])

            expect($scope.changeAmount).toEqual(.25);
        });

    it('should not return change if mode is not normal',
        function () {
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter

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
            var $scope = {};

            var controller = $controller('ctrl', {
                $scope: $scope
            });

            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter
            $scope.insertCoin(.25) //insert quarter      

            $scope.returnCoins();

            //return inserted coins
            expect($scope.changeAmount).toEqual(.75);
        });

});