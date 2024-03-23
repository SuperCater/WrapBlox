import { HttpMethods, ValidUrls } from "../Types/BaseTypes.js"


const FetchHandler = {
	urls : {
		Users : 'https://users.roblox.com/v1',
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
		
		
		const response = await fetch(RealUrl, {
			method : method,
			headers : {
				'Content-Type' : 'application/json',
			}
		})
		
		return await response.json();
	}
	
	
}


export default FetchHandler;