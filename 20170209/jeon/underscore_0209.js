// defaults ~ property 이해 및 공부내용 한글 코멘트 작성

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// var iceCream = {flavor: "chocolate"};
// _.defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"});
// => {flavor: "chocolate", sprinkles: "lots"}
// 다음 기본 오브젝트에 있는 내용을 첫 번째 인수 오브젝트의 정의되지 않은 부분을 채움.
_.defaults = createAssigner(_.allKeys, true);

// 할당자 함수를 만들기 위한 내부 함수
// keysFunc에 설정된 내용대로 오브젝트의 요소를 할당함
var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
        // 인수의 갯수
        var length = arguments.length;
        // 첫번째 인자로 오브 젝트를 만듬
        // var obj = new Object();
        // var obj = Object();
        // var obj = {};
        if (defaults) obj = Object(obj);

        if (length < 2 || obj == null) return obj;

        // 두번째 인자부터 탐색하여 오브젝트에 없는 값을 할당함
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
                var key = keys[i];
                // 키값에 아무것도 설정 되어있지 않을 경우
                // defaults가 true일 경우 obj 선언되지 않는 값만 할당함
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
};

// Retrieve all the property names of an object.
_.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
};

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
// toString은 dontEnum 속성 https://www23.atwiki.jp/sevenlives/pages/1700.html
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');

// 제공된 일반 객체의 복제본을 만듬.
// 중첩 된 객체 또는 배열은 복제되지 않고 참조로 복사 됨.
// _.clone({name: 'moe'});
// => {name: 'moe'};
_.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
                            // 배열 복사      // 객체 복사
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};

// Extend a given object with all the properties in passed-in object(s).
_.extend = createAssigner(_.allKeys);

// obj로 인터셉터를 호출 한 다음 obj를 반환.
// 이 메소드의 주요 목적은 메소드 체인을 "탭"(도청)하는 것
// 체인 내의 중간 결과에 연산을 수행하도록 명령.
// _.chain([1,2,3,200])
// .filter(function(num) { return num % 2 == 0; })
//     .tap(alert)
//     .map(function(num) { return num * num })
//     .value();
// => // [2, 200] (alerted)
// => [4, 40000]
_.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
};

// 객체가 주어진 속성을 직접 가지고 있는지 확인하기위한 (hasOwn을 대신함)바로 가기 기능
// _.has({a: 1, b: 2, c: 3}, "b");
// => true
_.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

// 전달 된 객체가 attrs에있는 모든 키 / 값 속성을 포함하는지 알려주는 함수를 반환합.
// var ready = _.matcher({selected: true, visible: true});
// var readyToGoList = _.filter(list, ready);
_.matcher = _.matches = function(attrs) {
    // attrs 복제한 새로운 오브젝트 생성
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
        return _.isMatch(obj, attrs);
    };
};

// 전달 된 객체의 키 속성을 반환하는 함수를 반환.
// var stooge = {name: 'moe'};
// 'moe' === _.property('name')(stooge);
// => true
_.property = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};

// _.property의 반대기능. 객체를 가져 와서 제공된 속성의 값을 반환하는 함수를 반환.
// var stooge = {name: 'moe'};
// _.propertyOf(stooge)('name');
// => 'moe'
_.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
        return obj[key];
    };
};