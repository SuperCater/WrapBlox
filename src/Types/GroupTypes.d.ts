import { IntRange } from "./BaseTypes.js";
import { GroupOwnerType } from "./Enums.ts";

export type RawGroupData = {
	id: number;
	name: string;
	description: string;
	owner: {
		id: number;
		type: GroupOwnerType;
		name: string;
	};
	memberCount: number;
	created: string;
	hasVerifiedBadge: boolean;
};

export type GroupRole = {
	id: number;
	name: string;
	rank: IntRange<1, 256>;
};

export type GroupAuditLog = {
	actor: {
		user: {
			buildersClubMembershipType: number;
			hasVerifiedBadge: boolean;
			userId: number;
			username: string;
			displayName: string;
		};
		role: {
			id: number;
			name: string;
			description: string;
			rank: number;
			memberCount: number;
		};
	};
	actionType: GroupActionType;
	description: unknown;
	created: Date;
};

export type GroupActionType =
	| "DeletePost"
	| "RemoveMember"
	| "AcceptJoinRequest"
	| "DeclineJoinRequest"
	| "PostStatus"
	| "ChangeRank"
	| "BuyAd"
	| "SendAllyRequest"
	| "CreateEnemy"
	| "AcceptAllyRequest"
	| "DeclineAllyRequest"
	| "DeleteAlly"
	| "DeleteEnemy"
	| "AddGroupPlace"
	| "RemoveGroupPlace"
	| "CreateItems"
	| "ConfigureItems"
	| "SpendGroupFunds"
	| "ChangeOwner"
	| "Delete"
	| "AdjustCurrencyAmounts"
	| "Abandon"
	| "Claim"
	| "Rename"
	| "ChangeDescription"
	| "InviteToClan"
	| "KickFromClan"
	| "CancelClanInvite"
	| "BuyClan"
	| "CreateGroupAsset"
	| "UpdateGroupAsset"
	| "ConfigureGroupAsset"
	| "RevertGroupAsset"
	| "CreateGroupDeveloperProduct"
	| "ConfigureGroupGame"
	| "CreateGroupDeveloperSubscriptionProduct"
	| "Lock"
	| "Unlock"
	| "CreateGamePass"
	| "CreateBadge"
	| "ConfigureBadge"
	| "SavePlace"
	| "PublishPlace"
	| "UpdateRolesetRank"
	| "UpdateRolesetData"
	| "BanMember"
	| "UnbanMember";
