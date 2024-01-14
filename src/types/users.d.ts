import { BaseCursor } from "./bases.js"

export type User = {
	description: string,
	created : string,
	isBanned : boolean,
	externalAppDisplayName : null, // Need to type this
	hasVerifiedBadge : boolean,
	id : number,
	name : string,
	displayName : string,
}

export type PartialUser = {
	id : number,
	name : string,
	displayName : string,
	hasVerifiedBadge : boolean,
	previousUsernames : string[],
}

export type RequestedUser = {
	requestedUsername : string,
	hasVerifiedBadge : boolean,
	id : number,
	name : string,
	displayName : string,
}

export type UserNameHistory = {
	data : {
		name : string,
	}[],
} & BaseCursor

export type SearchUsers = {
	data : PartialUser[],
} & BaseCursor

export type CurrentRules = {
	roles : string[],
}