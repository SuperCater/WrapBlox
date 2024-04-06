import { HttpMethods, ValidUrls } from "../Types/BaseTypes.js"


const FetchHandler = {
	cookie : undefined as string | undefined,
	urls : {
		Users : 'https://users.roblox.com/v1',
		Groups : 'https://groups.roblox.com/v1',
	},
	
	fetch : async (method : HttpMethods, url : ValidUrls, route : string, params? : {[key : string | number]: unknown} ) => {
		
		let RealUrl = FetchHandler.urls[url] + route;
		
		if (params) {
			const query = new URLSearchParams();
			for (const key in params) {
				query.append(key, params[key] as string);
			}
			
			RealUrl += `?${query.toString()}`
		}
		
		const headers = new Headers();
		
		if (FetchHandler.cookie) headers.set("Cookie", FetchHandler.cookie);
		headers.set("Content-Type", "application/json");
		
		const response = await fetch(RealUrl, {
			method : method,
			credentials : 'include',
			headers : headers,
		})
		
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
		}
		
		return await response.json();
	},
	
	fetchAll : async (method : HttpMethods, url : ValidUrls, route : string, params? : {[key : string | number]: unknown} ) => {
		const data = [];
		let cursor = "";
		while (true) {
			
			const response = await FetchHandler.fetch(method, url, `${route}?limit=100${cursor ? `&cursor=${cursor}` : ""}`, params);
			data.push(...response.data);
			if (!response.nextPageCursor) {
				break;
			}
			cursor = response.nextPageCursor;
		}
		return data;
	},
	
	
}


export default FetchHandler;