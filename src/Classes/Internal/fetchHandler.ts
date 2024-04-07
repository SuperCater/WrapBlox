import { HttpMethods, ValidUrls } from "../../Types/BaseTypes.js"


class FetchHandler {
	cookie? : string;
	urls = {
		Users : 'https://users.roblox.com/v1',
		Groups : 'https://groups.roblox.com/v1',
		Thumbnails: 'https://thumbnails.roblox.com/v1',
	};
	
	constructor(cookie? : string) {
		this.cookie = cookie;
	}
	
	fetch = async (method : HttpMethods, url : ValidUrls, route : string, params? : {[key : string | number]: unknown}, body? : {[key : string]: unknown} ) => {
		
		let RealUrl = this.urls[url] + route;
		
		if (params) {
			const query = new URLSearchParams();
			for (const key in params) {
				query.append(key, params[key] as string);
			}
			
			if (RealUrl.includes("?")) {
				RealUrl += `&${query.toString()}`
			} else RealUrl += `?${query.toString()}`
		}
		
		const headers = new Headers();
		
		if (this.cookie) headers.set("Cookie", this.cookie);
		headers.set("Content-Type", "application/json");
		
		const response = await fetch(RealUrl, {
			method : method,
			credentials : 'include',
			headers : headers,
			body : body ? JSON.stringify(body) : undefined,
		})
		
		if (!response.ok) {
			console.log(RealUrl)
			throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
		}
		
		return await response.json();
	};
	
	fetchAll = async (method : HttpMethods, url : ValidUrls, route : string, params? : {[key : string | number]: unknown} ) => {
		const data = [];
		let cursor = "";
		while (true) {
			
			const response = await this.fetch(method, url, `${route}?limit=100${cursor ? `&cursor=${cursor}` : ""}`, params);
			data.push(...response.data);
			if (!response.nextPageCursor) {
				break;
			}
			cursor = response.nextPageCursor;
		}
		return data;
	};
	
	
}


export default FetchHandler;