function _curry(fn) {
  return function (a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
}

function _curryr(fn) {
  return function (a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
}

var _get = _curryr(function (obj, key) {
  return obj == null ? undefined : obj[key];
});

var _length = _get('length');

function _each(list, iter) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
}

function _filter(list, predi) {
  var new_list = [];
  _each(list, function (val) {
    if (predi(val)) new_list.push(val);
  });
  return new_list;
}
function _map(list, mapper) {
  var new_list = [];
  _each(list, function (val, key) {
    new_list.push(mapper(val, key));
  });
  return new_list;
}

var _pairs = _map((val, key) => [key, val]);

function _is_object(obj) {
  return typeof obj == 'object' && !!obj;
}

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

var _map = _curryr(_map),
  _each = _curryr(_each),
  _filter = _curryr(_filter);

var _pairs = _map(function (val, key) {
  return [key, val];
});

var slice = Array.prototype.slice;
function _rest(list, num) {
  return slice.call(list, num || 1);
}

function _reduce(list, iter, memo) {
  if (arguments.length == 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function (val) {
    memo = iter(memo, val);
  });
  return memo;
}

// _pipe, _go 안에서 쓰이는 함수는 _curryr 처리가 되어 있어야 한다.
function _pipe() {
  var fns = arguments;
  return function (arg) {
    return _reduce(
      fns,
      function (arg, fn) {
        return fn(arg);
      },
      arg,
    );
  };
}

function _go(arg) {
  var fns = _rest(arguments);
  return _pipe.apply(null, fns)(arg);
}

function _identity(val) {
  return val;
}

// TODO 1. 수집하기 - map

var _values = _map(_identity);

function _pluck(data, key) {
  return _map(data, _get(key));
}

// TODO 2. 거르기 - filter

function _negate(func) {
  return function (val) {
    return !func(val);
  };
}

// filter의 반대
var _reject = _curryr(function (data, predi) {
  return _filter(data, _negate(predi));
});

// js의 falce 값들은 제외하고 반환
var _compact = _filter(_identity);

// TODO 3. 찾아내기 - find

var _find = _curryr(function (list, predi) {
  var keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    var val = list[keys[i]];
    if (predi(val)) return val;
  }
});

var _find_index = _curryr(function (list, predi) {
  var keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    if (predi(list[keys[i]])) return i;
  }
  return -1;
});

function _some(data, predi) {
  return _find_index(data, predi || _identity) !== -1;
}

function _every(data, predi) {
  return _find_index(data, _negate(predi || _identity)) === -1;
}

// TODO 4. 접기 - reduce
// reduce는 순서와 관계 없이 a, b 가지고 어떤 로직을 구현할 것인지에 집중
// ( a, b 중 무엇을 남길 것인가. 어떻게 접어갈 것인가.)
// for loop을 대체한다고 생각해선 안됨

function _min(data) {
  return _reduce(data, function (a, b) {
    return a < b ? a : b;
  });
}

function _max(data) {
  return _reduce(data, function (a, b) {
    return a < b ? b : a;
  });
}

var _min_by = _curryr(function (data, iter) {
  return _reduce(data, function (a, b) {
    return iter(a) < iter(b) ? a : b;
  });
});

var _max_by = _curryr(function (data, iter) {
  return _reduce(data, function (a, b) {
    return iter(a) < iter(b) ? b : a;
  });
});

function _push(obj, key, val) {
  // 객체의 속성이 있다면, 그 속성에 push / 없다면, 빈 배열을 갖는 속성을 만들고 push
  (obj[key] = obj[key] || []).push(val);
  return obj;
}

var _group_by = _curryr(function (data, iter) {
  return _reduce(
    data,
    function (grouped, val) {
      return _push(grouped, iter(val), val);
    },
    {},
  );
});

var _head = function (list) {
  return list[0];
};

var _inc = function (count, key) {
  count[key] ? count[key]++ : (count[key] = 1);
  return count;
};

var _count_by = _curryr(function (data, iter) {
  return _reduce(
    data,
    function (count, val) {
      return _inc(count, iter(val));
    },
    {},
  );
});
