  // 모든 요소가 truth test와 일치하는지 확인한다. (일단? 완료)
  // 사용 가능한 경우, ECMAScript5 네이티브`filter`에 위임한다.
  // 별칭`all`.
  _.every = _.all = function(obj, iterator, context) {
    //iterator가 false이면 iterator 에 함수를 넣음
    /* 디폴트의 Iterator 주위의 고유성을 유지하는 함수.
       _.identity = function(value) {
         return value;
       };  */
    iterator || (iterator = _.identity);
   // obj 값을 체크
    var result = true;
    if (obj == null) return result;
 
   // nativeEvery        = ArrayProto.every,
   // obj 의 값, 또는 값들이 iterator함수의 요건에 충족하는지 확인
   // context callback을 실행할 때 this로서 사용하는 값.
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
 
   //obj 가 Array 가 아니면,
   //  each 는 배열의 요소를 순서대로 확인할 때 사용하는 함수for문이랑 비슷
   // obj < - array,  function(value, index, list) 이하는 obj에서 확인할 내용
   // each에서 obj가 array 인지 확인후 array.prototype.foreach 를 실행시킴
   //value 처리중 요소, index 처리중 키값, list foreach 가 적용되어 있는 배열
    each(obj, function(value, index, list) {
     //1. result 를 봄
     // 2 iterator.call(context, value, index, list) this가 context 를 가르킴
     // 3 result = result result = result ? 의미를 잘 모르겠움
     // 조건이 다 맞으면 Ture -> break 를 하지 않고 다음 배열로 넘어감
     // iterator.call(context, value, index, list) false가 되면
     // result = result가 마지막 연산순위이니까 펄스 넣고 break 가 되는 것..?
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
   //undef 같은 걸 bool 형 false 로 만들어주는 연산자? !!
    return !!result;
  };
 
 
 
  // 객체내의 적어도 하나의 요소가 truth test 와 일치 하는지를 확인한다. (완료)
  // 사용 가능한 경우, ECMAScript5 네이티브`some`에 위임한다.
  // 별칭`any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
   // nativeSome         = ArrayProto.some
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
   // obj 가 Array 가 아니면 실행
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
   //undef 같은 걸 bool 형 false 로 만들어주는 연산자? !!
    return !!result;
  };
 
 
 
  // 배열이나 객체가 지정된 값을 포함하는지 (`===`를 사용하여) 확인한다. (완료)
  // 별칭`include`.
  _.contains = _.include = function(obj, target) {
   // obj 값 유무 확인
    if (obj == null) return false;
   // nativeIndexOf  = ArrayProto.indexOf
   // 문자열에 지정된 값이 처음 나타나는 위치를 반환합니다.
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
   // obj가 Array 객체가 아니면 배열 중에 하나라도 일치하면 true인 some() 을 호출하게 됨
   return any(obj, function(value) {
      return value === target;
    });
  };
 
 
 
  // 컬렉션내의 각 항목의 메서드를 (인수를 붙여) 호출. (완료)
  _.invoke = function(obj, method) {
   //arguments 를 Array로 변경함 [2]번부터
    var args = slice.call(arguments, 2);
   //method 결과값을 배열로 만듬
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };
 
  // 컬렉션의 각 요소에서 프로퍼티를 가져 온다는, (완료)
  // `map`의 일반적인 용도에있어서의 단축 버전.
  _.pluck = function(obj, key) {
   // 해당 키의 값을 배열로 가져옴
   // 예를 들면 사원 테이블에서 키 명을 name으로 하면 사원 이름만 배열로 넘겨주는 느낌
    return _.map(obj, function(value){ return value[key]; });
  };
 
 
 
  // 컬렉션의 각 요소에서`key : value`쌍을 가진 객체 만을 선택하는, (완료)
  // `filter`의 일반적인 용도에있어서의 단축 버전.
  _.where = function(obj, attrs) {
    if (_.isEmpty(attrs)) return [];
   // ._filter 파라메타인 무명함수의 조건에서 OK인 값들만 배열로 넘김
   // 따라서 obj 와 attrs 의 키와 value 값이 같은 값들만 넘김
    return _.filter(obj, function(value) {
      for (var key in attrs) {
       //attrs의 키 값과 배열의 해당 키값이 같은지 확인
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };
 
 
 
  // 요소 또는 요소를 기반으로 한 계산 결과의 최대 값을 돌려 준다. (완료)
  // 요소 수가 65,535보다 긴 배열을 끝까지 검사 할 수 없다.
  // 참조: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
   // iterator 이 false 이고 , obj가 array 이고, +obj[0]가 숫자이고, obj의 크기가   
        65535 미만일때 Array의 함수 max를 이용한다.
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
   // - 무한대 값 Infinity
   //  Infinity (양의 무한대)는 다른 어떤 수보다 더 큽니다. Obj 가 비어 있으면
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
     //두개의 값을 비교하는 조건 iterator이 있으면 호출하게 된다
      var computed = iterator ? iterator.call(context, value, index, list) : value;
     // 이전 값보다 큰지 판단하게 됨. 만약 크다면 result 문을 수행하게됨
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };
 
 
 
  // 요소 또는 요소를 기반으로 한 계산 결과의 최소값을 반환. (완료)
  _.min = function(obj, iterator, context) {
   // max와 동일
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
   // 사용자가 지정한 조건(iterator)이 있을 경우
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
    //작은 경우 result를 실행
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };
 
 
 
  // 배열을 섞는다.. (완료)
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
   //배열 수 만큼 섞음
    each(obj, function(value) {
    // 0부터 index 사이의 값을 랜덤값 가져옴
      rand = _.random(index++);
     // 순서대로 들어오는 value 값을 random index에 넣게됨.
     // 이미 넣을 자리에 값이 있다면 그 있는 값을 제일 뒤 index에 넣은 후 넣음
      shuffled[index - 1] = shuffled[rand];
      shuffled[] = value;
    });
    return shuffled;
  };
 
 
 
  // iterator를 검색하고 생성하기 위해 사용하는 내부 함수. (완료)
  var lookupIterator = function(value) {
   //value가 함수인지 확인, 함수가 아니면 function(obj){ return obj[value]
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };
 
  // iterator가 제공하는 기준에 따라 객체의 값을 정렬한다. (완료)
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
   // 정렬된 값에서 value 만 추출
    return _.pluck(_.map(obj, function(value, index, list) {
     //value, index, 기준값을 가진 배열을 만듬
      return {
        value : value,
        index : index,
      // 기준 사용자가 정의한 기준값을 가짐
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
    // 사용자의 기준값 으로 일치하는지 일치하지 않는지 비교
    //array의 sort함수를 이용
      var a = left.criteria;
      var b = right.criteria;
    if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };