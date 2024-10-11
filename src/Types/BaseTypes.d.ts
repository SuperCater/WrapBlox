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

 | "Avatar"
 | "AvatarV2"
 | "AvatarV3"

 | "APIs"

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type SortOrder = "Asc" | "Desc"

export type FetchOptions = {
	useCache?: boolean,
	cookie?: string,
	CsrfToken?: string,
	params?: { [key: string | number]: unknown },
	body?: { [key: string]: unknown },
}

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>