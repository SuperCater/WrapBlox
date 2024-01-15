export type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Endpoints = "users" | "groups" | "groups2"

export type Params = { [key: string]: string | number | boolean | undefined | string[] | number[] | boolean[] | undefined[] };
export type WrapBloxOptions = {
	debugMode?: boolean,
	useErrors?: boolean,
}
export type SortOrder = "Asc" | "Desc";

// biome-ignore lint/suspicious/noExplicitAny: <Body is any because it's the body of a request>
export type Body = any;