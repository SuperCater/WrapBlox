export type ValidUrls = 
 | "Users"
 | "Thumbnails"
 | "Friends"

 | "Groups"
 | "GroupsV2"

 | "Games"
 | "GamesV2"

 | "Badges"
 | "BadgesV2"

 | "Inventory"
 | "InventoryV2"

 | "AccountSettings"
 | "PremiumFeatures"

 | "Auth"
 | "AuthV2"
 | "AuthV3"

 | "APIs"

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type SortOrder = "Asc" | "Desc"

export type FetchOptions = {
	usecache?: boolean,
	cookie?: string,
	CsrfToken?: string,
	params?: { [key: string | number]: unknown },
	body?: { [key: string]: unknown },
}