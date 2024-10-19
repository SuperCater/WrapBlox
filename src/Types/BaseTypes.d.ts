export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type SortOrder = "Asc" | "Desc";

export type FetchOptions = {
	useCache?: boolean,
	cookie?: string,
	CSRFToken?: string,
	APIKey?: string,
	params?: { [key: string | number]: unknown },
	body?: { [key: string]: unknown },
};

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;