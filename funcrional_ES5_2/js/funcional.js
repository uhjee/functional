function _each(list, iter) {
  for (let i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
}

function _filter(list, predi) {
  let result = [];
  _each(list, function (val) {
    if (predi(val)) {
      result.push(val);
    }
  });
  return result;
}

function _map(list, mapper) {
  let result = [];
  _each(list, (val) => {
    result.push(mapper(val));
  });
  return result;
}

function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
}

function _curryR(fn) {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
}

let _get = _curryR(function (obj, key) {
  return obj == null ? undefined : obj[key];
});

function _rest(arrLike, num) {
  return Array.prototype.slice.call(arrLike, num || 1);
}

function _reduce(list, iter, memo) {
  if (arguments.length === 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, (val) => {
    memo = iter(memo, val);
  });
  return memo;
}

// pipline 만들기
// 함수를 인자로 받아 순차적으로 실행시키는 상태로 만들어 갖고 있는 함수
function _pipe() {
  const fns = arguments;

  return (arg) => {
    return _reduce(fns, (arg, fn) => fn(arg), arg);
  };
}

// go : pipe 의 즉시 실행 버전
function _go(arg) {
  const fns = _rest(arguments);
  //  fns 는 배열 자체로 넘겨줘야하기 때문에 apply 사용, call과 비교
  // fns 안의 fn들을 각각 하나의 인자로 넘겨주게 된다.
  // pipe(fn,fn,fn,fn,)
  return _pipe.apply(null, fns)(arg);
}
