import { HttpMethods, ValidUrls } from "../../Types/BaseTypes.js"
import CacheManager from "./cacheManager.js";


class FetchHandler {
	cookie?: string;
	urls = {
		Users: 'https://users.roblox.com/v1',
		Groups: 'https://groups.roblox.com/v1',
		Thumbnails: 'https://thumbnails.roblox.com/v1',
		Friends: "https://friends.roblox.com/v1",
		GamesV2: "https://games.roblox.com/v2",
		Games: "https://games.roblox.com/v1",
	};
	
	cacheManager = new CacheManager<string, unknown>()

	constructor(cookie?: string) {
		this.cookie = cookie;
	}
	
	
	clearCache = () => {
		this.cacheManager.clearCache();
	}

	fetch = async (method: HttpMethods, url: ValidUrls, route: string, params?: { [key: string | number]: unknown }, body?: { [key: string]: unknown }, usecache = true) => {

		let RealUrl = this.urls[url] + route;

		if (params) {
			const query = new URLSearchParams();
			for (const key in params) {
				if (params[key] === undefined) continue;
				query.append(key, params[key] as string);
			}

			if (RealUrl.includes("?")) {
				RealUrl += `&${query.toString()}`
			} else RealUrl += `?${query.toString()}`
		}
		
		const cached = this.cacheManager.getValues(RealUrl);
		if (cached && usecache) return cached;

		const headers = new Headers();

		if (this.cookie) headers.set("Cookie", this.cookie);
		headers.set("Content-Type", "application/json");

		const response = await fetch(RealUrl, {
			method: method,
			credentials: 'include',
			headers: headers,
			body: body ? JSON.stringify(body) : undefined,
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
		}
		
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
			} catch {
				// Retry the request
			}
		}
		return data;
	};


}


export default FetchHandler;