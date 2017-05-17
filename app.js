/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('app', []);

app.controller('ctrl', function ($scope, $interval, $filter) {
$scope.statusMessage = 'Insert Coins';
$scope.currentAmount = 0;
$scope.changeAmount = 0;
$scope.selectedProduct = '';
$scope.isExactChangeOnly = false;
$scope.mode = 'normal';

	//Set of products inside the vending machine
	$scope.products = [
		{Name: 'Cola', Price: 1.00, Quantity:20, Image: 'http://icons.iconarchive.com/icons/michael/coke-pepsi/512/Coca-Cola-Can-icon.png'},
		{Name: 'Chips', Price: .50, Quantity:20, Image: 'http://images.clipartpanda.com/bag-of-potato-chips-clipart-PngMedium-potato-chips-bag-16629.png'},
		{Name: 'Candy', Price: .60, Quantity:20, Image: 'http://iconshow.me/media/images/xmas/christmas-icon11/2/candy-512.png'},
		{Name: 'Chocolate', Price: 2.50, Quantity:0, Image: 'https://cdn.iconscout.com/public/images/icon/free/png-512/chocolate-bar-candy-dairymilk-sweet-dessert-food-emoj-symbol-39cddddcf33bb40e-512x512.png'},
		{Name: 'RedBull', Price: 3.00, Quantity:0, Image: 'http://www.zandh.co.uk/media/catalog/product/cache/1/thumbnail/600x600/9df78eab33525d08d6e5fb8d27136e95/r/e/red_bull.png'}
	];

	//Return inserted coins
   $scope.returnCoins = function(){
   	$scope.changeAmount += $scope.currentAmount;
   		$scope.currentAmount = 0;
       $scope.statusMessage = $filter('currency')($scope.currentAmount, "$", 2)
   }

    //Handle product vending/selection
    $scope.selectProduct = function(product){
        if($scope.currentAmount >= product.Price){
        	//Don't return 'change' if mode is 'Exact Change ONLY'
        	if(!$scope.isExactChangeOnly){
                $scope.changeAmount += $scope.currentAmount - product.Price;
			}
            $scope.currentAmount = 0;
            $scope.selectedProduct = product;
            $scope.statusMessage = 'THANK YOU'
		}else{
            $scope.statusMessage = 'PRICE ' + $filter('currency')(product.Price, "$", 2)
		}
    }

    // Change vending machine mode setting
    $scope.changeMode = function(){
        $scope.isExactChangeOnly = !$scope.isExactChangeOnly;
        $scope.mode = $scope.isExactChangeOnly ? 'Exact Change Only' : "Normal"
    }

    //Handle Action when user insert a coin into the vending machine
    $scope.insertCoin = function(val){
		if(val == .01){ // Reject pennies and put it directly to change amount
			$scope.changeAmount += val;
		}else{
			$scope.currentAmount += val;
			$scope.statusMessage = $filter('currency')($scope.currentAmount, "$", 2)
		}
    }

    //Take all the changes
    $scope.takeChange = function(){
        $scope.changeAmount = 0;
	}

	//Take the product off the vending machine
    $scope.takeProduct = function(){
        $scope.selectedProduct = null;
    }

    //Switch display between the text and the current coin amount inserted into the vending machine
    $interval(function() {
    	if($scope.isExactChangeOnly){
            $scope.statusMessage = $scope.statusMessage == 'Exact Change Only' ? $filter('currency')($scope.currentAmount, "$", 2) : 'Exact Change Only'
		}else{
            $scope.statusMessage = $scope.statusMessage == 'Insert Coins' ? $filter('currency')($scope.currentAmount, "$", 2) : 'Insert Coins'
		}
    }, 3000);

});