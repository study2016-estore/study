참고사이트 http://www.nextree.co.kr/p7363/
1. Scope(영역, 범위)
 ·변수와 매개변수(Parameter)의 접근성과 생존기간
  Global Scope(전역) : 스크립트 전체에서 참조됨 (스크립트 어느 곳에서든 사용 가능)
  Local Scope(지역) : 정의된 function 안에서만 사용가능
  예제)
  var global_scope = "globalScope" ;
  function ScopeTest1( param_scope ) {
     var local_scope_1 = "localScope1";
     function ScopeTest2(){
        var local_scope_2 = "localScope2";
           function ScopeTest3(){
              var local_scope_3 = "localScope3";
           }
       }
   }
   global_scope의 scope -> 전체 어디서든 사용 가능
   param_scope ,local_scope_1의 scope -> ScopeTest1 {} 안에서 사용가능
   local_scope_2의 scope -> ScopeTest2 {} 안에서 사용가능
   local_scope_3의 scope -> ScopeTest3 {} 안에서 사용가능

  ·Scope의 특징
  JavaScript에서 Scope는 함수 단위
  변수의 중복 허용
  var 키워드 생략(전역)
  렉시컬 특성
  
  <JavaScript에서 Scope는 함수 단위>
  function scopeTest() {  
    var a = 0;
    if (true) {
        var b = 0;
        for (var c = 0; c < 5; c++) {
            console.log("c=" + c);
         }
         console.log("c=" + c);
    }
    console.log("b=" + b);
  }
  scopeTest();  
  /*
  c = 0  
  c = 1  
  c = 2  
  c = 3  
  c = 4  
  c = 5 
  b = 0  
  */
  다른 프로그래밍 언어들은 블록 단위로 변수의 scope가 정의된다.
  하지만 자바스크립트에서는 function범위로 변수의 scope가 정의된다.
  즉  a, b, c가 모두 같은 유효범위를 가지고 있다.

