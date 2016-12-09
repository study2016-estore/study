###일급객체 조건
	• 변수에 담을 수 있음
	• 인자에 담을 수 있음
	• 반환값으로 전달 할 수 있음
	
###일급함수 조건
	• 일급객체 조건 포함
	• 런타임 생성
	• 익명으로 생성

###함수 표현식
```
// 기명 함수표현식(named function expression) 
var company = function company() {  
    /* 실행코드 */
}; 
// 익명 함수표현식(anonymous function expression)
var company = function() {  
    /* 실행코드 */
};
// 기명 즉시실행함수(named immediately-invoked function expression)
(function company() {
    /* 실행코드 */
}());
// 익명 즉시실행함수(immediately-invoked function expression)
// Javascript 대가이신 더글라스 클락포트의 권장 표기법
(function() {
    /* 실행코드 */
}());
// 익명 즉시실행함수(immediately-invoked function expression)
(function() {
    /* 실행코드 */
})();
```

###람다함수
```
(function (){
 실행문;
})();

###닫힌 람다식(Closed expression) 과 열린 람다식(Open expression)
	•람다 표현식에서 사용하는 변수들이 모두 묶인 변수일 때 닫힌 람다식이라고 부른다. 
         그리고 람다 표현식에서 사용하는 변수들 중 하나라도 자유 변수가 있을 때 열린 람다식이라고 부른다.