export default class CacheManager<T, V> {
	cache = new Map<T, {
		value: V,
		time: number,
	}>();
	
	timeout = 1000 * 60 * 5; // How long the cache should last
	
	constructor(values : [T, V][] = []) {
		for (const [key, value] of values) {
			this.setValues(key, value);
		};
	};
	
	setTimeout = (time: number) => {
		this.timeout = time;
	};
	
	setValues = (key: T, value: V) => {
		this.cache.set(key, {
			value: value,
			time: Date.now(),
		});
	};
	
	rawGetValues = (key: T) => {
		const data = this.cache.get(key);
		if (!data) return undefined;
		if (Date.now() - data.time > this.timeout) {
			this.cache.delete(key);
			return undefined;
		}
		return data
	};
	
	getValues = (key: T) => {
		return this.rawGetValues(key)?.value;
	};
	
	deleteValues = (key: T) => {
		return this.cache.delete(key);
	};
	
	clearCache = () => {
		this.cache.clear();
	};	
};