###THIS
메소드를 호출하는 것
점 앞에 있는 것
Method를 호출한 당시의 객체가 저장되어 있는 property

###THIS의 결정
1. Function.call 이나 Function.apply 를 통해 function call 을 하게 되면, call() 이나 apply() 의 첫번쨰 argument 가 this 가 된다. 만약 Function.call 이나 Function,apply 의 첫번째 argument 로 null 이나 undefined 가 들어왔다면 this는 global object 를 참조한다.
2. 만약 Function.bind 를 통해 function call 이 일어나면 this 는 bind() 의 첫번째 인자를 가르킨다.
3. 만약 function 이 object 의 method 로서 불렸다면 this 는 해당 object 를 가르킨다.
4. function 이 standalone function 이라면, this 는 global object 를 가르킨다.

###apply를 사용할 경우
```
a = 1;
var test = {
	a : 1000,
    getA : function(){
  		console.log(this.a);
	}
}

test.getA();
test.getA.apply(null); // this는 global이 된다

```

###this 문제
```
function foo(value){
	return this.val = value;
}

var ccc = foo('cyka1818'); // 함수가 실행되었지만 객체가 생성된 것은 아님 this는 global이 되고 global의 val이 cyka1818를 가지게 됨
console.log(ccc);          // 반환받은 global의 val cyka1818
console.log(ccc.val);      // ccc는 val을 가지고 있지 않기 때문에 undefind 
console.log(window.val);   // global의 val을 출력 cyka1818
```

#fiddleJS사용시 주의 !!!!!!!