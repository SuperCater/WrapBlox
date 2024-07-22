import { FetchOptions, HttpMethods, ValidUrls } from "../../Types/BaseTypes.js"
import CacheManager from "./cacheManager.js";
import FetchError from "./FetchError.js";


class FetchHandler {
	cookie?: string;
	CsrfToken?: string;
	urls = {
		Users: 'https://users.roblox.com/v1',
		Groups: 'https://groups.roblox.com/v1',
		Thumbnails: 'https://thumbnails.roblox.com/v1',
		Friends: "https://friends.roblox.com/v1",
		GamesV2: "https://games.roblox.com/v2",
		Games: "https://games.roblox.com/v1",
		Badges: "https://badges.roblox.com/v1",
		Inventory: "https://inventory.roblox.com/v1",
	};

	cacheManager = new CacheManager<string, unknown>()

	constructor(cookie?: string) {
		this.cookie = cookie;
	}


	clearCache = () => {
		this.cacheManager.clearCache();
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
fetch  = async (method: HttpMethods, url: ValidUrls, route: string, opts : FetchOptions = {}) : Promise<any> => { // params?: { [key: string | number]: unknown }, body?: { [key: string]: unknown }, usecache = true, cookie? : string) => {

		let RealUrl = this.urls[url] + route;

		if (opts.params) {
			const query = new URLSearchParams();
			for (const key in opts.params) {
				if (opts.params[key] === undefined) continue;
				query.append(key, opts.params[key] as string);
			}

			if (RealUrl.includes("?")) {
				RealUrl += `&${query.toString()}`
			} else RealUrl += `?${query.toString()}`
		}

		const cached = this.cacheManager.getValues(RealUrl);
		if (cached && opts.usecache) return cached;

		const headers = new Headers();
		
		if (this.CsrfToken) headers.set("X-Csrf-Token", this.CsrfToken);
		if (this.cookie) headers.set("Cookie", `.ROBLOSECURITY=${this.cookie}`); // If the cookie is passed as a parameter, use that instead of the default cookie
		if (opts.cookie) headers.set("Cookie", `.ROBLOSECURITY=${opts.cookie}`); // If the cookie is passed as a parameter, use that instead of the default cookie
		headers.set("Content-Type", "application/json");

		const response = await fetch(RealUrl, {
			method: method,
			credentials: 'include',
			headers: headers,
			body: opts.body ? JSON.stringify(opts.body) : undefined,
		})
		
		if (!this.CsrfToken && response.headers.get("x-csrf-token")) {
			this.CsrfToken = response.headers.get("x-csrf-token") as string;
			if (response.status === 403) {
				return await this.fetch(method, url, route, opts);
			}
		}

		if (!response.ok) {
			throw new FetchError(`Failed to fetch data: ${response.status} ${response.statusText}`, response.status, response);
		}

		if (!response.body) return;
		const json = await response.json();

		if (method === "GET") this.cacheManager.setValues(RealUrl, json);

		return json;
	};

	fetchAll = async (method: HttpMethods, url: ValidUrls, route: string, params?: { [key: string | number]: unknown }) => {
		const data = [];
		let cursor = "";
		while (true) {
			try {
				const response = await this.fetch(method, url, `${route}?limit=100${cursor ? `&cursor=${cursor}` : ""}`, params);
				data.push(...response.data);
				if (!response.nextPageCursor) {
					break;
				}
				cursor = response.nextPageCursor;
			} catch (e) {
				if (e instanceof FetchError) {
					if (e.code === 429) {
						await new Promise((resolve) => setTimeout(resolve, 1000));
						continue;
					}
					throw e; // If it's not a rate limit error, throw it
				}
			}
		}
		return data;
	};


}


export default FetchHandler;