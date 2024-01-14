export type BaseCursor = {
	previousPageCursor: string | null,
	nextPageCursor: string | null,
}

export type RequestResponse = {
	status: number,
	ok : boolean,
	body: any,
}