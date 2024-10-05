export type ValidUrls = "Users" | "Groups" | "Thumbnails" | "Friends" | "GamesV2" | "Games" | "Badges" | "Inventory"

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type SortOrder = "Asc" | "Desc"

export type FetchOptions = {
	usecache?: boolean,
	cookie?: string,
	CsrfToken?: string,
	params?: { [key: string | number]: unknown },
	body?: { [key: string]: unknown },
}