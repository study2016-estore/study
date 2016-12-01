#Scope

###javascript에서의 scope
 * 변수의 이름이 겹치지 않게하기 위한
 * 접근성, 생존기간
 * Global, local
 * function, block(es6 도입이후) 

###특성
 * 렉시컬 특성  
  : 선언되었던 당시에 접근 가능했던 변수에 접근이 가능하게 함
 * hoisting  
  : 변수가 함수내에서 정의되었을 경우 선언이 함수의 최상위로, 함수 바깥에서 정의되었을 경우는 전역 컨텍스트의 최상위로 변경
 * 스코프 체인
  : [[scope]]는 함수객체가 생성되는 시점과 관련된 Object Reference 정보를 가지고 있으며 이 Object Reference 정보들을 Scope Chain 
  
```
var value=30;  
function hoistingExam(){  
    console.log("value="+value); 
    var value =10; 
    console.log("value="+value); 
}
hoistingExam();  
//실행결과 
/* 
value= undefined  
value= 10  
*/
```

#Closure

###Clousure
 * 외부참조를 도와주는 함수
 * 함수 + 렉시컬
 * 중복된 돔의 탐색이나 생성에 유용
 * private 개념적용가능
 * 효율적으로 사용하지 않을 경우 불필요한 스코프가 메모리를 차지하고 있게됨
 
###example 1

```
function outer () {
    var count = 0;    1
    var inner = function () {    
        return ++count;
    };
    return inner;    
}
var increase = outer();    /

increase();    // === 1    
increase();    // === 2
```
```
function outer () {
    var count = 0;
    return {    
        increase: function () {
            return ++count;
        },
        decrease: function () {
            return --count;
        }
    };
}
var counter = outer();    
counter.increase();    // === 1
counter.increase();    // === 2
counter.decrease();    // === 1

 var counter2 = outer();
counter.increase();    // === 1
```
---
