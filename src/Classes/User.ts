import type { AvatarImageFormat, RawUserGroupRoles, RawUserData, UserAvatarV1, UserAvatarV2, FriendServiceMetadata, AvatarBustImageFormat, Avatar3D } from "../Types/UserTypes.js";
import type WrapBlox from "../index.js";
import { AvatarBustImageSize, OwnedItem, Role, SortOrder } from "../index.js";

import Friend from "./Friend.js";
import { AvatarImageSize, ItemTypes } from "../Types/Enums.js";
import factory from "./Internal/factory.js";
import AwardedBadge from "./AwardedBadge.js";
import Group from "./Group.js";

class User {
	readonly client: WrapBlox;
	readonly rawData: RawUserData;

	readonly id: number;
	readonly name: string;
	readonly displayName: string;
	readonly description: string;
	readonly hasVerifiedBadge: boolean;
	readonly externalAppDisplayName?: string;
	readonly isBanned: boolean;
	readonly joinDate: Date;

	readonly accountAge: number;

	constructor(client: WrapBlox, rawData: RawUserData) {
		this.client = client;
		this.rawData = rawData;

		this.id = rawData.id;
		this.name = rawData.name;
		this.displayName = rawData.displayName;
		this.description = rawData.description;
		this.hasVerifiedBadge = rawData.hasVerifiedBadge;
		this.externalAppDisplayName = rawData.externalAppDisplayName;
		this.isBanned = rawData.isBanned;
		this.joinDate = new Date(rawData.created);

		this.accountAge = Math.ceil(Math.abs(new Date().getTime() - this.joinDate.getTime()) / (1000 * 60 * 60 * 24));
	};

	/*
		Methods related to the Users API
		Docs: https://users.roblox.com/docs/index.html
	*/

	async fetchUsernameHistory(maxResults = 100, useCache = true): Promise<string[]> {
		return (await this.client.fetchHandler.fetchList("GET", "Users", `/users/${this.id}/username-history`, { useCache: useCache }, maxResults)).map((name: {name: string}) => name.name);
	};

	/*
		Methods related to the Groups API
		Docs: https://groups.roblox.com/docs/index.html
	*/

	private async fetchRawGroupRoles(includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<RawUserGroupRoles[]> {
		return (await this.client.fetchHandler.fetch("GET", "GroupsV2", `/users/${this.id}/groups/roles`, {
			useCache: useCache,
			params: {
				includeLocked: includelocked,
				includeNotificationPreferences: includeNotificationPreferences,
			}
		})).data
	};

	async inGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<boolean> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).some((entry) => entry.group.id === groupId));
	};

	async getRoleInGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<Role | undefined> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).find((entry) => entry.group.id === groupId)?.role)
	};

	async fetchPrimaryGroup(useCache = true): Promise<Group | undefined> {
		const groupId = (await this.client.fetchHandler.fetch("GET", "Groups", `/users/${this.id}/groups/primary/role`))?.group.id;
		if (!groupId) return undefined;

		return await this.client.fetchGroup(groupId, useCache);
	}

	async fetchGroups(includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<Group[]> {
		const returnData = [] as Group[];
		const rawData = await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache);

		for (const data of rawData) {
			returnData.push(await this.client.fetchGroup(data.group.id, useCache));
		}

		return returnData;
	}

	/*
		Methods related to the Badges API
		Docs: https://badges.roblox.com/docs/index.html
	*/

	async fetchBadges(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<AwardedBadge[]> {
		const returnData = [] as AwardedBadge[];
		const rawData = await this.client.fetchHandler.fetchList("GET", "Badges", `/users/${this.id}/badges`, { useCache: useCache, params: { sortOrder: sortOrder } }, maxResults)

		for (const data of rawData) returnData.push(await factory.createAwardedBadge(this.client, data, this));

		return returnData;
	};

	async fetchBadgeAwardDate(badgeId: number, useCache = true): Promise<Date | undefined> {
		const rawDate = (await this.client.fetchHandler.fetch("GET", "Badges", `/users/${this.id}/badges/${badgeId}/awarded-date`, { useCache: useCache }))?.awardedDate
		if (!rawDate) return undefined;

		return new Date(rawDate)
	};
	
	/*
		Methods related to the Inventory API
		Docs: https://inventory.roblox.com/docs/index.html
	*/

	async canViewInventory(useCache = true): Promise<boolean> {
		return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/can-view-inventory`, { useCache: useCache })).canView;
	};

	async getOwnedAsset(type: ItemTypes, id: number, useCache = true): Promise<OwnedItem | undefined> {
		try {
			return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`, { useCache: useCache })).data[0];
		} catch {
			return undefined;
		}
	};

	async ownsAsset(type: ItemTypes, assetId: number, useCache = true): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`, { useCache: useCache });
		} catch {
			return false;
		}
	};

	async ownsBadge(badgeId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId, useCache);
	};

	async ownsGamepass(gamepassId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.GamePass, gamepassId, useCache);
	};

	async ownsBundle(bundleId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Bundle, bundleId, useCache)
	};

	/*
		Methods related to the Avatar API
		Docs: https://avatar.roblox.com/docs/index.html
	*/

	async fetchAvatarV1(useCache = true): Promise<UserAvatarV1> {
		return (await this.client.fetchHandler.fetch("GET", "Avatar", `/users/${this.id}/avatar`, { useCache: useCache }))
	};

	async fetchAvatarV2(useCache = true): Promise<UserAvatarV2> {
		return (await this.client.fetchHandler.fetch("GET", "AvatarV2", `/avatar/users/${this.id}/avatar`, { useCache: useCache }))
	};

	/*
		Methods related to the Thumbnails API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

	async fetchAvatarThumbnailUrl(size: AvatarImageSize = AvatarImageSize["150x150"], format: AvatarImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	};

	async fetchAvatar3D(useCache = true): Promise<Avatar3D> {
		const jsonUrl = (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar-3d", {
			useCache: useCache,
			params: {
				userId: this.id
			}
		})).imageUrl;

		return (await fetch(jsonUrl, {
			method: "GET"
		})).json()
	};

	async fetchAvatarBustUrl(size: AvatarBustImageSize = AvatarBustImageSize["150x150"], format: AvatarBustImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar-bust", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	};

	async fetchAvatarHeadshotUrl(size: AvatarImageSize = AvatarImageSize["150x150"], format: AvatarImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar-headshot", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	};

	/*
		Methods related to the Friends API
		Docs: https://friends.roblox.com/docs/index.html
	*/

	async fetchFriendsMetadata(useCache = true): Promise<FriendServiceMetadata> {
		return await this.client.fetchHandler.fetch("GET", "Friends", "/metadata", {
			useCache: useCache,
			params: {
				targetUserId: this.id
			}
		})
	};

	//? Friends

	async fetchFriends(maxResults = 100, useCache = true): Promise<Friend[]> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to view someone's friend list.");

		const returnData = [] as Friend[];
		for (const friend of (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends`, { useCache: useCache })).data) {
			returnData.push(await factory.createFriend(this.client, friend, this))
			if (maxResults && returnData.length >= maxResults) break;
		}

		return returnData;
	};

	async fetchFriendCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends/count`, { useCache: useCache })).count
	};

	//? Followers

	async fetchFollowers(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		const rawData = await this.client.fetchHandler.fetchList("GET", "Friends", `/users/${this.id}/followers`, { useCache: useCache, params: { sortOrder: sortOrder } }, maxResults)

		for (const data of rawData) returnData.push(await factory.createUser(this.client, data));

		return returnData;
	};


	async fetchFollowerCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followers/count`, { useCache: useCache })).count
	};

	//? Followings

	async fetchFollowings(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		const rawData = await this.client.fetchHandler.fetchList("GET", "Friends", `/users/${this.id}/followings`, { useCache: useCache, params: { sortOrder: sortOrder } }, maxResults)

		for (const data of rawData) returnData.push(await factory.createUser(this.client, data));

		return returnData;
	};

	async fetchFollowingsCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followings/count`, { useCache: useCache })).count
	};

	/*
		Methods related to the AccountSettings API
		Docs: https://accountsettings.roblox.com/docs/index.html
	*/

	async block(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to block users.");

		await this.client.fetchHandler.fetch("POST", "AccountSettings", `/users/${this.id}/block`)
	};

	async unblock(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to unblock users.");

		await this.client.fetchHandler.fetch("POST", "AccountSettings", `/users/${this.id}/unblock`)
	};

	/*
		Methods related to the PremiumFeatures API
		Docs: https://premiumfeatures.roblox.com/docs/index.html
	*/

	async hasPremium(useCache = true): Promise<boolean> {
		return await this.client.fetchHandler.fetch("GET", "PremiumFeatures", `/users/${this.id}/validate-membership`, { useCache: useCache })
	};

	// Miscellaneous

	toString(): string {
		return `${this.name}:${this.id}`
	};
};

export default User;