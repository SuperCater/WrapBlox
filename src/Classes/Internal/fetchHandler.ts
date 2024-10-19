import type { FetchOptions, HttpMethods } from "../../Types/BaseTypes.js"
import CacheManager from "./cacheManager.js";
import FetchError from "./FetchError.js";

export default class FetchHandler {	
	cacheManager = new CacheManager<string, unknown>();

	credentials: {
		cookie?: string;
		CSRFToken?: string;
		APIKey?: string;
	} = { cookie: undefined, CSRFToken: undefined, APIKey: undefined };

	Endpoints = {
		Users: 'https://users.roblox.com/v1',
		Thumbnails: 'https://thumbnails.roblox.com/v1',
		Friends: "https://friends.roblox.com/v1",
		Presence: "https://presence.roblox.com/v1",

		Groups: 'https://groups.roblox.com/v1',
		GroupsV2: 'https://groups.roblox.com/v2',

		Games: "https://games.roblox.com/v1",
		GamesV2: "https://games.roblox.com/v2",

		Badges: "https://badges.roblox.com/v1",
		BadgesV2: "https://badges.roblox.com/v2",

		Inventory: "https://inventory.roblox.com/v1",
		InventoryV2: "https://inventory.roblox.com/v2",

		AccountSettings: "https://accountsettings.roblox.com/v1",
		PremiumFeatures: "https://premiumfeatures.roblox.com/v1",

		Auth: "https://auth.roblox.com/v1",
		AuthV2: "https://auth.roblox.com/v2",
		AuthV3: "https://auth.roblox.com/v3",

		Avatar: "https://avatar.roblox.com/v1",
		AvatarV2: "https://avatar.roblox.com/v2",
		AvatarV3: "https://avatar.roblox.com/v3",
	};

	Services = {};

	constructor(cookie?: string) {
		this.credentials.cookie = cookie;
	}


	clearCache = () => {
		this.cacheManager.clearCache();
	}

	//! Convert to use Promise<unknown>
	// biome-ignore lint/suspicious/noExplicitAny: shut the fuck up
	fetchEndpoint = async (method: HttpMethods, endpoint: keyof typeof this.Endpoints, route: string, opts: FetchOptions = {}): Promise<any> => { // params?: { [key: string | number]: unknown }, body?: { [key: string]: unknown }, usecache = true, cookie? : string) => {
		let RealUrl = this.Endpoints[endpoint] + route;

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
		if (cached && (opts.useCache || opts.useCache === undefined)) return cached;

		const headers = new Headers();

		if (this.credentials.CSRFToken) headers.set("X-Csrf-Token", this.credentials.CSRFToken);
		if (opts.CSRFToken) headers.set("X-Csrf-Token", opts.CSRFToken);
		if (this.credentials.cookie) headers.set("Cookie", `.ROBLOSECURITY=${this.credentials.cookie}`);
		if (opts.cookie) headers.set("Cookie", `.ROBLOSECURITY=${opts.cookie}`);
		headers.set("Content-Type", "application/json");

		const response = await fetch(RealUrl, {
			method: method,
			credentials: 'include',
			headers: headers,
			body: opts.body ? JSON.stringify(opts.body) : undefined,
		})

		if (!this.credentials.CSRFToken && response.headers.get("x-csrf-token")) {
			this.credentials.CSRFToken = response.headers.get("x-csrf-token") as string;
			if (response.status === 403) {
				return await this.fetchEndpoint(method, endpoint, route, opts);
			}
		}

		if (!response.ok) {
			throw new FetchError(`Failed to fetch data: ${response.status} ${response.statusText}`, response);
		}

		if (!response.body) return;
		const json = await response.json();

		if (method === "GET") this.cacheManager.setValues(RealUrl, json);

		return json;
	};

	//! Convert to use Promise<unknown>
	// biome-ignore lint/suspicious/noExplicitAny: shut the fuck up
	fetchEndpointList = async (method: HttpMethods, endpoint: keyof typeof this.Endpoints, route: string, opts: FetchOptions = {}, maxResults = 100): Promise<any> => {
		const data = [];
		let cursor = "";
		while (true) {
			try {
				const response = await this.fetchEndpoint(method, endpoint, `${route}?limit=100${cursor ? `&cursor=${cursor}` : ""}`, opts);
				if (response.data) data.push(...response.data);

				if (!response.nextPageCursor || data.length >= maxResults) {
					break;
				}
				cursor = response.nextPageCursor;
			} catch (e) {
				if (e instanceof FetchError) {
					if (e.response.status === 429) {
						await new Promise((resolve) => setTimeout(resolve, 1000));
						continue;
					}
					throw e; // If it's not a rate limit error, throw it
				}
			}
		}
		return data;
	};
};