1. Object
   Property & Method
   Property ex )
   var car = function () { } ; // create car object
   car.wheel = 2 ; // create wheel (wheel is property of car)
   var hwangCar = new car () ;
   hwangCar.wheel = car.wheel + 2 ; // car.wheel -> use . access property of car.wheel
   consol.log(hwangCar.wheel)
   > 4 
   Method ex )
   var car = function () { } ;
   car.frontWheel = 2 ;
   car.backWheel = 2 ;
   car.totalWheel = function ( front , back ) 
                       { return front+back } ;
   car.totalWheel(car.frontWheel , car.backWheel) ;
   > 4