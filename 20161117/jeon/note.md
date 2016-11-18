#Object

###javascript에서의 object
 * 자바스크립트는 객체 기반의 언어
 * 데이터와 그 데이터에 관련되는 동작을 모두 포함
 * 객체의 구성요소 `Property`, `Method`
 * 곧 배열

###객체의 종류
 * Built-in object(자바스크립트 내장 객체)  
  : `Global`,`Object`, `String`, `Number`, `Boolean`, `Date`, `Array`, `Math`, `RegExp`, `Error`  
   자바스크립트 엔진이 구성하는 기본객체
   엔진이 구동되는 시점에서 바로 제공되기 때문에 따로 생성필요 없음
 * Native object(브라우져 내장 객체)
  : `BOM`, `DOM`
  자바스크립트 엔진을 구동하는 브라우저에게서 빌드되는 객체  
  브라우져마다 구성이 다른 경우가 있음
 * Host Object(사용자 정의 객체)
  : 사용자 정의 객체

###객체 선언방법 2가지
   ```
/* function declaration */
function sayYeah() {   
    console.log("Yeah");
};
sayYeah();

/* function expression */
var sayHo = function () {     
   console.log("Ho");
};
sayHo();
```

###Object 객체
 * built-In객체로서 최상위 레벨의 객체
 * 모든 객체는 `Object` 객체로부터 파생 됨 


#Prototype

###prototype?
 * 객체가 만들어지기 위한 원형
 * 객체의 `__prototype__`라는 `property`에 `prototype`의 주소가 있음

###prototype property? 
 * 모든 함수 객체의 `Constructor`가 가지는 `property`
 * `prototype`을 통해 만들어질 개체들의 원형으로 사용할 객체


#Prototype Chain

###prototype Chain?
 * 하위 객체에서 프로토타입의 프로퍼티와 메소드를 공유함. 동일한 이름의 프로퍼티와  
     메소드를 재정의 하지 않는 이상 상위에서 정의한 내용을 그대로 공유. 
 * 객체 생성 당시 정의된 프로퍼티는 공유가 아닌 상속이 됨.

---

http://unikys.tistory.com/316  
http://insanehong.kr/post/javascript-prototype/