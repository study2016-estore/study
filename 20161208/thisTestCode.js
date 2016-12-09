// this에 대하여
// 1. 함수 호출
var val = 123;
function abc(){
	this.val = "cyka18";
}

console.log( window.val) 	// ??
abc();
console.log( abc.val ) 		// ?
console.log( window.val ) // ?

// 2. 객체 생성
function abc(){
	this.val = "test";
}

var myTest = new abc();
console.log(myTest.val); 	// ??
console.log(window.val) 	// ??

// 3.객체 프로토타입 접근
function abc(){};
var myTest = new abc();
abc.prototype.setValue = function(v){
	this.val = v;
}

myTest.setValue("cyka");
console.log( myTest.val ); // ??
console.log( window.val ); // ???

// 4.함수 실행 + 선언에 대한 약간 꼬음
function foo(value){
	return this.val = value;
}

var ccc = foo('cyka1818');
console.log(ccc.val); 	 // ??
console.log(window.val); // ??

// 5. 객체 선언형 + apply 를 통한 scope 전환
a = 1;
var test = {
	a : 1000,
  getA : function(){
  	console.log(this.a);
	}
}

test.getA();
test.getA.apply(null)

// 6. 복합문제
var scope = "global";

function scopeCheck() {
	var scope = "outterLocal";
	alert("(1) "+this.scope); // 출력결과 예상

	var object = new Object();
	object.scope = "field";
	object.scopeCheck = function() { alert("(2) "+this.scope); }
	object.scopeCheck(); // 출력결과 예상
		function inner() {
			var scope = "innerLocal";
			alert("(3) "+this.scope);
		}
	inner(); // 출력결과 예상

	var anotherObject = new Object();
	anotherObject.scope = "anotherField";
	anotherObject.scopeCheck = function() { alert("(4) "+this.scope); }
	object.scopeCheck = anotherObject.scopeCheck;

	object.scopeCheck(); // 출력결과 예상
}
scopeCheck();
