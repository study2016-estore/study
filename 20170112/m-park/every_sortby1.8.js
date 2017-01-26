// - every
// - some
// - contains
// - invoke
// - pluck
// - max
// - min
// - sortBy
// ---------------------------------------------------------------------------------------------------------

  // 모든 요소가 조건에 일치하는 지 확인하는 함수, 별칭 all
  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    // 인수의 유형을 판별하는 곳에 넣음, context 가 있으면 this가 실행될 위치ㄷ설정
    predicate = cb(predicate, context);
    // obj가 배열이나 argument객체이면 keys는 undef
    // 아니면 오브젝트의 키값들을 keys에 넣음
    var keys = !isArrayLike(obj) && _.keys(obj),
        // keys가 있거나, obj가 있다면 거기서 길이를 취득함

        length = (keys || obj).length;
    // 반복문으로 모든 요소를 확인함.
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      콜백함수 실행 결과값이 (조건 함수) 일치하지않으면　return false
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };
  // 인수의 유형을 확인하는 함수, context 조건에 따라 설정
  var cb = function(value, context, argCount) {
    // _.iteratee함수가 생성되어 있지 않으면 생성 후 다시 cb를 호출 
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    // null이면 기본 함수를 만들게 됨 
    if (value == null) return _.identity;
    // 펑션인지 확인 후 펑션을 call이나 apply로 this를 지정 리턴 argCount에 따라서 없으면 그냥 실행시킴 
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    // value가 오브젝트이고, 어레이가 아니라면 키값과 밸류값이 있는지 확인 
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

// ---------------------------------------------------------------------------------------------------------

　// 배열이나 객체 중에 조건에 일치하는 요소가 1개라도 있으면 트루 별칭은 any
  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    // 인수의 요소를 확인
    predicate = cb(predicate, context);
    // Array가 아니면 key값들을 리턴
    var keys = !isArrayLike(obj) && _.keys(obj),
        // 전체 요소가 몇개인지 취득
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      // 하나라도 조건을 통과하면 true
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

// ---------------------------------------------------------------------------------------------------------

  // list 중에 value가 하나라도 포함되면 true를 반환합니다. 
  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    // array가 아니면 obj의 값들만 추출
    if (!isArrayLike(obj)) obj = _.values(obj);
    // fromIndex 얘가 숫자가 아니거나 guard가 참이면 
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

  // 
  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    // 함수를 리턴함. 따라서 _.indexOf는 밑의 함수가 되는 것
    // dir는 1 , predicateFind는 _.findIndex sortedIndex는 _.sortedIndex
    // _.indexOf(obj, item, fromIndex) 로 실행했음

    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          //_.contains 에서는 얘가 실행됨, 음수면 최대길이가 i가 됨
          i = idx >= 0 ? idx : Math.max(idx + length, i); 
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        // _.contains 실행안됨
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      // (item !== item) 의미를 잘 모르겠음.
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      // _.contains 실행
      // idx = dir 에서 i = 0 가 들어감. idx는 1씩 더해짐
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          // item 이 있는 키값을 돌려줌
          if (array[idx] === item) return idx;
      }
      // 없으면 -1
      return -1;
    };
  };

// --------------------------------------------------------------------------------------------------------- 

  // obj를 path함수로 평가해서 재구성한 것을 리턴　_.invoke(list, methodName, *arguments) 
  // list의 각 요소에 대해 methodName로 지정된 함수를 실행한다. * arguments는 지정된 함수에 전달된다.
  // _.invoke ( [[ 5, 1, 7 ] , [ 3, 2, 1 ]] , 'sort' );
  // => [ 1, 5, 7 ] , [ 1, 2, 3 ]
  // resArgs 실행 시 invoke에 정의된 무명함수를 파라메타로 넘김. 넘김 받은 무명함수로 함수를 만들어서 넘김
  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArgs( function(obj, path, args) {
    var contextPath, func;
    // path 얘가 펑션인지 확인
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      // array 이면 contextPath는 처음부터 마지막 1번째까지 다 꺼냄, 싹 다 
      contextPath = path.slice(0, -1);
      // path에 마지막 어레이를 집어 넣음
      path = path[path.length - 1];
    }
    // 각 값에 매핑하여 값의 새 배열을 생성 function(context) 이것이 조건.. context는 map에서 넘겨주는 값
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
　　　　　// context의 제일 마지막 값을 넣음
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        // path 메소드 이름임. 배열에 있는 메소드를 넘김
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });
  
  // restArgs의 func으로 위 함수가 넘겨와서 실행됨.
  var restArgs = function(func, startIndex) {
    // startIndex == null임으로 func.length - 1 가 들어감 [ argument 값 -1 ]
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      //func에서 받아온 arguments를 rest에 순서대로 넣음
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      //func 기준을 여기 오브젝트를 기준으로 실행
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      //startIndex가 3이상부터는 func.apply로 실행
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

// ---------------------------------------------------------------------------------------------------------

  // _.map 함수를 이용 key 키값이 오브젝트 속성 중에 있는 지 확인 일치하는 값만 리턴
  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  var property = function(key) {
    실제로 map에는 밑의 리턴되는 함수가 가는 것...!!!! 
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

 +) 추가
    프로펄티의 경우 리턴값이 함수여서 이렇게 사용됨...
    var name = {name: 'A'};
    'A' === _.property('name')(name);

// ---------------------------------------------------------------------------------------------------------

  //조건함수로 비교하여 최대값을 리턴
  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    // Infinity 브라우저가 가지고 있는 최대값
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
   // 인수가 특이 한 경우, 특별히 지정된 조건함수가 없다던지, 오브젝트라던지..
   if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      // 요소를 비교하여 최대값 계산
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    }
    // 보통의 경우
     else {
      // 함수 확인 디스를 여기서 사용할 꺼임.
      iteratee = cb(iteratee, context);
      // _.each each 는 배열의 요소를 순서대로 확인할 때 사용하는 함수for문이랑 비슷 obj를 값 키 목록을 조건함수에 넘김
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        값을 비교해서 저장
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

// ---------------------------------------------------------------------------------------------------------

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

// ---------------------------------------------------------------------------------------------------------

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    // qluck(map[키와 값으로 이루어진]으로 취득한 배열의 sort정렬한 배열 , value); value 즉 정렬된 값들만 취득하겠다. 
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        // 사용자가 임의로 만든 판단하는 함수에 넣은 값
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      // 값을 비교해서 어느쪽이 큰지 알려줌.
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };



// ---------------------------------------------------------------------------------------------------------