self.signal = function (initial) {
	const subscribers = new Set();
	return {
		get value() {
			return initial;
		},
		set value(v) {
			initial = v;
			subscribers.forEach((fn) => fn(v));
		},
		subscribe(fn) {
			subscribers.add(fn);
			fn(initial);
		},
	};
};