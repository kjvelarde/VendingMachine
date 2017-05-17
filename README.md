# VendingMachine
kata
=============================
#### Demo Page:

[Demo] (http://htmlpreview.github.io/?https://github.com/kjvelarde/VendingMachine/blob/master/app/index.html)

#### Features:
Quick - Raw ng1 implementation
Direct $scope injection
Straightforward vending machine simulator UI

#### Dependencies:
Bootstrap 3.x
Jquery 2.x
Angular 1.x

#### Functions: 
* changeMode: change mode between 'Normal' and 'Exact Change Only'
* returnCoins: Retrieve inserted coins when running on normal mode
* selectProduct(arg:product): handle product vending
* insertCoin: handle coin insertion (reject pennies)
* takeChange: take change out of the vending machine
* takeProduct: take product off the vending machine

#### Testing:
npm install -g karma  
npm install -g jasmine-core  
npm install --- To install dependencies  

 execute 'karma start' to execute test cases inside js files in test folder

##### License

MIT, see [LICENSE.md](./LICENSE.md).

