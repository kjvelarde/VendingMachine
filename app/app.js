/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('app', []);

app.factory('productFactory', function () {
    var pFactory = {},
        _products = [
            {
                Name: 'Cola',
                Price: 1.00,
                Quantity: 20,
                Image: '../assets/img/products/cola.jpg'
        },
            {
                Name: 'Chips',
                Price: .50,
                Quantity: 20,
                Image: '../assets/img/products/chips.jpg'
        },
            {
                Name: 'Candy',
                Price: .60,
                Quantity: 2,
                Image: '../assets/img/products/candy.jpg'
        },
            {
                Name: 'Chocolate',
                Price: 2.50,
                Quantity: 0,
                Image: '../assets/img/products/chocolate.jpg'
        },
            {
                Name: 'RedBull',
                Price: 3.00,
                Quantity: 0,
                Image: '../assets/img/products/redbull.jpg'
        }
	];
    pFactory.get = function () {
        return _products;
    };
    return pFactory;
});

app.factory('coinFactory', function () {
    //src:https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications
    var cFactory = {},
        _coins = [
            {
                Name: 'Penny',
                Value: .01,
                WeightInGrams: 2.5,
                Image: '../assets/img/penny.png',
                Width: 18,
                Height: 18
            },
            {
                Name: 'Nickel',
                Value: .05,
                WeightInGrams: 5,
                Image: '../assets/img/nickel.png',
                Width: 20,
                Height: 20
            },
            {
                Name: 'Dime',
                Value: .10,
                WeightInGrams: 2.268,
                Image: '../assets/img/dime.png',
                Width: 15,
                Height: 15
            },
            {
                Name: 'Quarter',
                Value: .25,
                WeightInGrams: 5.670,
                Image: '../assets/img/quarter.png',
                Width: 30,
                Height: 30
            }

        ];
    cFactory.get = function () {
        return _coins;
    };
    return cFactory;
});

app.controller('ctrl', function ($scope, $interval, $filter, productFactory, coinFactory) {
    $scope.statusMessage = 'Insert Coins';
    $scope.currentAmount = 0;
    $scope.changeAmount = 0;
    $scope.changes = [];
    $scope.selectedProducts = [];
    $scope.isExactChangeOnly = false;
    $scope.mode = 'normal';

    //Set of products inside the vending machine
    $scope.products = productFactory.get();
    $scope.coins = coinFactory.get();

    //Return inserted coins
    $scope.returnCoins = function () {
        $scope.changeAmount += $scope.currentAmount;
        $scope.currentAmount = 0;
        $scope.statusMessage = $filter('currency')($scope.currentAmount, "$", 2)
    };

    //Handle product vending/selection
    $scope.selectProduct = function (product) {
        if ($scope.currentAmount >= product.Price) {
            //Don't return 'change' if mode is 'Exact Change ONLY'
            if (!$scope.isExactChangeOnly) {
                $scope.changeAmount += (($scope.currentAmount * 100 - product.Price * 100) / 100);
            }

            $scope.currentAmount = 0;

            $filter('filter')($scope.products, {
                'Name': product.Name
            }).Quantity = product.Quantity--;

            $scope.selectedProducts.push(angular.copy(product));
            $scope.statusMessage = 'THANK YOU'
        } else {
            $scope.statusMessage = 'PRICE ' + $filter('currency')(product.Price, "$", 2)
        }
    }

    // Change vending machine mode setting
    $scope.changeMode = function () {
        $scope.isExactChangeOnly = !$scope.isExactChangeOnly;
        $scope.mode = $scope.isExactChangeOnly ? 'Exact Change Only' : "Normal"
    }

    //Handle Action when user insert a coin into the vending machine
    $scope.insertCoin = function (coin) {
        //Check weight of coin and determine the value
        var val = $.grep($scope.coins, function (x) {
            return x.WeightInGrams == coin.WeightInGrams;
        });

        if (val[0].Value == .01) { // Reject pennies and put it directly to change amount
            $scope.changeAmount += val[0].Value;
        } else {
            $scope.currentAmount += val[0].Value;
            $scope.statusMessage = $filter('currency')($scope.currentAmount, "$", 2)
        }
    }

    //Take all the changes
    $scope.takeChange = function () {
        $scope.changeAmount = 0;
    }

    //Take the product off the vending machine
    $scope.takeProduct = function () {
        $scope.selectedProducts = [];
    }

    //Switch display between the text and the current coin amount inserted into the vending machine
    $interval(function () {
        if ($scope.isExactChangeOnly) {
            $scope.statusMessage = $scope.statusMessage == 'Exact Change Only' ? $filter('currency')($scope.currentAmount, "$", 2) : 'Exact Change Only'
        } else {
            $scope.statusMessage = $scope.statusMessage == 'Insert Coins' ? $filter('currency')($scope.currentAmount, "$", 2) : 'Insert Coins'
        }
    }, 3000);

    $scope.setBackground = function (imgUrl) {
        return "background: url('" + imgUrl + "') center no-repeat; background-size:cover; height:120px;";
    }

    var coinPush = function (quantity, coin) {
        for (var i = 0; i < quantity; i++) {
            $scope.changes.push(angular.copy(coin));
        }
    }

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
    //check if there's change to convert to coins
    $scope.$watch('changeAmount', function (newVal, oldVal, scope) {
        //convert to coins
        if (newVal > 0) {
            newVal = round(newVal, 2);
            var total = 0;
            var quarters = Math.trunc(newVal / .25);
            total += quarters * .25;
            var dimes = Math.trunc(round((newVal - total), 2) / .10);
            total += dimes * .10;
            var nickels = Math.trunc(round((newVal - total), 2) / .05);
            total += nickels * .05;
            var pennies = Math.trunc(round((newVal - total), 2) / .01);

            if (quarters > 0) {
                var coin = $.grep($scope.coins, function (x) {
                    return x.WeightInGrams == 5.670
                })[0];
                coinPush(quarters, coin)
            }
            if (dimes > 0) {
                var coin = $.grep($scope.coins, function (x) {
                    return x.WeightInGrams == 2.268
                })[0];
                coinPush(dimes, coin)
            }

            if (nickels > 0) {
                var coin = $.grep($scope.coins, function (x) {
                    return x.WeightInGrams == 5
                })[0];
                coinPush(nickels, coin)
            }

            if (pennies > 0) {
                var coin = $.grep($scope.coins, function (x) {
                    return x.WeightInGrams == 2.5
                })[0];
                coinPush(pennies, coin)
            }
        } else {
            $scope.changes = [];
        }
    });


});