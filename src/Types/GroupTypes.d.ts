import { IntRange } from "./BaseTypes.js"

export type RawShout = {
	body : string,
	poster : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	created : string,
	updated : string,
}

export type Role = {
	id: number,
	name: string,
	rank: IntRange<1, 256>
}