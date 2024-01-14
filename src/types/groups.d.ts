import { BaseCursor } from "./bases"

export type PartialGroup = {
	id: number,
	name: string,
	description: string,
	owner: {
		id: number,
		type: string // maybe can type this better
	},
	created: string,
	hasVerifiedBadge: boolean,
}

export type RoleGroups = {
	group: {
		id: number,
		name: string,
		memberCount: number,
		hasVerifiedBadge: boolean,
	},
	role: {
		id: number,
		name: string,
		rank: number,
	},
}

export type WallPosts = {
	data : {
		id : number,
		poster : {
			user : {
				buildersClubMembershipType : number,
				hasVerifiedBadge : boolean,
				userId : number,
				username : string,
				displayName : string,
			},
			role : {
				id : number,
				name : string,
				rank : number,
				description : string,
				memberCount : number,
			}
		},
		body : string,
		created : string,
		updated : string,
	}[]
} & BaseCursor