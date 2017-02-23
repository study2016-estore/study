// 함수를 객체에 바인딩합니다. 즉, 함수가 호출 될 때마다 이 값이 객체가됩니다.
// 선택적으로 함수에 인수를 전달하여 함수를 미리 채 웁니다 (부분 적용이라고도 함).
// 컨텍스트 바인딩없이 부분적으로 적용하려면 partial을 사용하십시오.

// var func = function(greeting){ return greeting + ': ' + this.name };
// func = _.bind(func, {name: 'moe'}, 'hi');
// func();
// => 'hi: moe'
_.bind = function(func, context) {
    //if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
        // 바운딩할 인수 뒤에 인수들을 복사해서 붙임
        return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
};

// 함수를 생성자로 실행할지 여부를 결정합니다.
// 또는 제공된 인수가있는 일반 함수
//                          바운딩할 함수   바운딩함수    목표객체   불린시점 this     아규먼트
var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
};

// 다른 개체에서 상속되는 새 개체를 만드는 내부 함수입니다.
var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
};

//methodNames로 지정된 객체의 여러 메서드를 호출 할 때마다 해당 객체의 컨텍스트에서 실행되도록 바인딩합니다.
// 이벤트 처리기로 사용될 바인딩 함수에 매우 편리합니다.
// 그렇지 않으면 상당히 쓸모 없게 호출됩니다.
// methodNames는 필수 항목입니다.

// var buttonView = {
//     label  : 'underscore',
//     onClick: function(){ alert('clicked: ' + this.label); },
//     onHover: function(){ console.log('hovering: ' + this.label); }
// };
// _.bindAll(buttonView, 'onClick', 'onHover');
// When the button is clicked, this.label will have the correct value.
// jQuery('#underscore_button').on('click', buttonView.onClick);

_.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
        key = arguments[i];
        obj[key] = _.bind(obj[key], obj);
    }
    return obj;
};

// 동적 인이 값을 변경하지 않고 인수의 개수를 채워서 부분적으로 함수를 적용하십시오.
// 바인딩의 가까운 사촌. 인수 목록에 _를 전달하여 사전에 채워서는 안되지만
// 호출 시간에 제공하도록 여는 인수를 지정할 수 있습니다.

// var subtract = function(a, b) { return b - a; };
// sub5 = _.partial(subtract, 5);
// sub5(20);
// => 15

// Using a placeholder
// subFrom20 = _.partial(subtract, _, 20);
// subFrom20(5);
// => 15
_.partial = function(func) {
    //  바운딩 할 아규먼트
    var boundArgs = slice.call(arguments, 1);
    // 왜 바로 반환을 하지 않고 선언을 하고 밑에서 반환을 하는 가
    var bound = function() {
        var position = 0, length = boundArgs.length;
        var args = Array(length);
        // arg에 새로 인수들을 셋팅
        for (var i = 0; i < length; i++) {
            args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
        }
        // 남는 argumnets도 arg에 할당
        while (position < arguments.length) args.push(arguments[position++]);
        return executeBound(func, bound, this, this, args);
    };
    return bound;
};

// 계산 된 결과를 캐싱하여 주어진 함수를 메모합니다.
// 느리게 실행되는 계산 속도를 높이는 데 유용합니다.
// 선택적 hashFunction을 전달하면 원래 함수에 대한 인수를 기반으로
// 결과를 저장하기위한 해시 키를 계산하는 데 사용됩니다.
// 기본 hashFunction은 memoized 함수의 첫 번째 인수를 키로 사용합니다.
// memoized 값의 캐시는 반환 된 함수의 캐시 속성으로 사용할 수 있습니다.

// var fibonacci = _.memoize(function(n) {
//   return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
// });
_.memoize = function(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
    };
    // 저장 공간
    memoize.cache = {"ㅁ":1};
    return memoize;
};

// setTimeout과 매우 유사하게 wait 밀리 초 후에 함수를 호출합니다.
// 선택적 인수를 전달하면 함수가 호출 될 때 함수에 전달됩니다.

// var log = _.bind(console.log, console);
// _.delay(log, 1000, 'logged later');
// => 'logged later' // Appears after one second.
_.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
        return func.apply(null, args);
    }, wait);
};

// 지연 시간이 0 인 setTimeout을 사용하는 것과 마찬가지로
// 현재 호출 스택이 지워질 때까지 함수를 호출합니다. 지연되는 UI 스레드를 차단하지 않고
// 값 비싼 계산 또는 HTML 렌더링을 청크로 수행하는 데 유용합니다.
// 선택적 인수를 전달하면 함수가 호출 될 때 함수에 전달됩니다.

// _.defer(function(){ alert('deferred'); });
// 경고가 실행되기 전에 함수에서 반환됩니다.

// delay가 1인 함수 반환
_.defer = _.partial(_.delay, _, 1);

// 호출 될 때 최대 한 번만 트리거되는 함수를 반환합니다.
// 주어진 시간 동안. 일반적으로 스로틀 기능이 실행됩니다.
// '대기'기간 당 두 번 이상 가지 않고 가능한 한 많이;
// 최첨단에서 실행을 비활성화하려면 pass
//`{leading : false}`. 트레일 링 에지에서 실행을 비활성화하려면, 위와 같습니다.

// var throttled = _.throttle(updatePosition, 100);
// $(window).scroll(throttled);

// 매 밀리세컨드마다 최대 한 번만 호출될 수 있도록 조정된 함수 반환
// http://jsfiddle.net/missinglink/19e2r2we/
_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        //  남은 시간   = 기다린시간 - (지금시각 - 저번시각)
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 함수 실행 및 타임 초기화
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            // 실제 실행
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        }
        // 지연 후 실행
        else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

// 마지막으로 호출 된 이후 대기 밀리 초가 경과 할 때까지 실행을 연기 할 전달 된 함수의 새로운 디 바운스 버전을 만들어 반환합니다.
// 입력이 멈춘 후에 만 ​​발생해야하는 동작을 구현하는 데 유용합니다. 예를 들어, Markdown 주석의 미리보기 렌더링,
// 창의 크기 조정이 중지 된 후 레이아웃 재 계산 등이 있습니다.

// 대기 간격이 끝나면 함수는 가장 최근에 전달 된 인수를 사용하여 디버깅 된 함수에 호출됩니다.
// 디버깅이 대기 간격의 후행 대신에 앞의 기능을 트리거하게하려면 즉각적인 인수에 대해 true를 전달하십시오.
// "제출"버튼을 우발적으로 두 번 누르는 것을 두 번째로 방지하는 것과 같은 상황에서 유용합니다.

// var lazyLayout = _.debounce(calculateLayout, 300);
// $(window).resize(lazyLayout);

// 반복호출중에는 실행하지 않고 호출이 멈춘 뒤 일정 시간 뒤 실행
_.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;


    var later = function() {
        var last = _.now() - timestamp;

        if (last < wait && last >= 0) {
            //다시 시간 세팅 스텍이 쌓임
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
};

// 한 번만 호출 할 수있는 함수 버전을 만듭니다.
// 수정 된 함수에 대한 반복 호출은 아무 효과가 없으므로 원래 호출의 값을 반환합니다.
// 부울 플래그를 설정하고 나중에 확인하는 대신 초기화 함수에 유용합니다.

// var initialize = _.once(createApplication);
// initialize();
// initialize();
// Application is only created once.
//                 before의 인수로 2를 넘김
_.once = _.partial(_.before, 2);

// 카운트 시간 이후에만 실행될 함수 버전을 생성합니다.
// 진행하기 전에 모든 비동기 호출이 완료되었는지 확인하려는 비동기 응답을 그룹화하는 데 유용합니다.

// var renderNotes = _.after(notes.length, render);
// _.each(notes, function(note) {
//     note.asyncSave({success: renderNotes});
// });
// 모든 노트가 저장되면 renderNotes가 한 번 실행됩니다.
_.after = function(times, func) {
    return function() {
        if (--times < 1) {
            return func.apply(this, arguments);
        }
    };
};