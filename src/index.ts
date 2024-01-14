import { RequestResponse } from "./types/bases.js";
import { Endpoints, Methods } from "./types/misc.js";
import { PartialUser, RequestedUser, SearchUsers, User, UserNameHistory } from "./types/users.js";

/*
	* WrapBlox Feature support
	
	* User features
		* Get user
		* Get username history
		* Search users
		* Get user from username
*/



class WrapBlox {
	constructor(cookie? : string, apiKey? : string) {
		this.cookie = cookie;
		this.apiKey = apiKey;
	}
	
	// Properties
	baseURLs = {
		["users"] : "https://users.roblox.com/v1/",
	}
	cookie? : string;
	apiKey? : string;
	
	// Methods
	
	// Core methods
	async setCookie(cookie : string) {
		this.cookie = cookie;
	}
	
	async setAPIKey(apiKey : string) {
		this.apiKey = apiKey;
	}
	
	// Request methods
	async request(endpoint : Endpoints, route : string, method : Methods, params? : {[key : string] : string}, body? : any ) : Promise<RequestResponse> {
		let url = this.baseURLs[endpoint] + route; // The URL to send the request to
		body = body || {};
		params = params || {};
		const headers : {[key : string]: string} = {
			"Content-Type" : "application/json",
		}
		if (this.cookie) headers["Cookie"] = this.cookie;
		
		// Params
		for (const key in params) {
			if (url.includes("?")) url += "&";
			else url += "?";
			url += `${key}=${params[key]}`;
		}
		
		const options = {} as RequestInit;
		
		
		options.method = method;
		options.headers = headers;
		
		if (body && method !== "GET") options.body = JSON.stringify(body);
		
		
		const response = await fetch(url, options);
		

		
		const json = await response.json();
		
		const returnData = {
			status : response.status,
			ok : response.ok,
			body : json,
		}
		
		
		
		
		return returnData;
	}
	
	async get (endpoint : Endpoints, route : string, params? : {[key : string] : string}) {
		return await this.request(endpoint, route, "GET", params);
	}
	
	async post (endpoint : Endpoints, route : string, params? : {[key : string] : string}, body? : any) {
		return await this.request(endpoint, route, "POST", params, body);
	}

	
	// User methods
	
	async getUser(id : number) : Promise<User | undefined> {
		const response = await this.get("users", `users/${id}`);
		if (!response.ok) return undefined;
		
		return response.body; // USer data
	}
	
	async getUsernameHistory(id : number, limit? : number, sortOrder? : "Asc" | "Desc", cursor? : string) : Promise<UserNameHistory | undefined> {
		const params = {} as {[key : string] : string};
		if (limit) params.limit = limit.toString();
		if (sortOrder) params.sortOrder = sortOrder;
		if (cursor) params.cursor = cursor;
		
		const response = await this.get("users", `users/${id}/username-history`, params);
		if (!response.ok) return undefined;
		return response.body;
	}
	
	async searchUsers(keyword : string, limit? : number, cursor? : string) : Promise<SearchUsers | undefined> {
		const params = {} as {[key : string] : string};
		if (limit) params.limit = limit.toString();
		if (cursor) params.cursor = cursor;
		params.keyword = keyword;
		const response = await this.get("users", `users/search`, params);
		if (!response.ok) return undefined;
		return response.body;
	}
	
	async getUserFromUsername(username : string) : Promise<RequestedUser | undefined> {
		const user = await this.post("users", `usernames/users`, {}, {
			usernames : [username],
		});
		if (!user.ok) return undefined;
		return user.body.data[0];
	}
	
	async getCurrentUserRoles() {
		if (!this.cookie) return undefined;
		const response = await this.get("users", "users/authenticated/roles");
		if (!response.ok) return undefined;
		return response.body;
	}
	
	
	
	
}


export default WrapBlox;