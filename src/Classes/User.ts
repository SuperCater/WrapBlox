import type { AvatarImageType, FriendMetadata, RawUserGroupRoles, RawUserData, UserAvatarV1, UserAvatarV2 } from "../Types/UserTypes.js";
import type WrapBlox from "../index.js";
import type { OwnedItem, Role, SortOrder } from "../index.js";

import Friend from "./Friend.js";
import { AvatarSize, ItemTypes } from "../Types/Enums.js";
import factory from "./Internal/factory.js";

class User {
	readonly client: WrapBlox;
	readonly rawData: RawUserData;

	readonly id: number;
	readonly name: string;
	readonly displayName: string;
	readonly description: string;
	readonly hasVerifiedBadge: boolean;
	readonly externalAppDisplayName?: string;
	readonly isBanned : boolean;
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

		this.accountAge = Math.ceil(Math.abs(new Date().getTime() - new Date(rawData.created).getTime()) / (1000 * 60 * 60 * 24));
	}

	/*
		Methods related to the Users API
		Docs: https://users.roblox.com/docs/index.html
	*/

	async fetchUsernameHistory(maxResults?: number, useCache = true): Promise<string[]> {
		const returnData = [] as string[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Users", `/users/${this.id}/username-history`, {
				useCache: useCache,
				params: {
					limit: 100,
					cursor: nextPageCursor !== "NONE" && nextPageCursor || undefined,
				}
			})

			for (const entry of request.data) {
				returnData.push(entry.name);

				if (maxResults && returnData.length >= maxResults) {
					break loop;
				}
			}

			nextPageCursor = request.nextPageCursor
		}

		return returnData;
	}

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
	}

	async inGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<boolean> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).some((entry) => entry.group.id === groupId));
	}

	async getRoleInGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<Role | undefined> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).find((entry) => entry.group.id === groupId)?.role)
	}
	
	/*
		Methods related to the Inventory API
		Docs: https://inventory.roblox.com/docs/index.html
	*/

	async canViewInventory(useCache = true): Promise<boolean> {
		return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/can-view-inventory`, { useCache: useCache })).canView;
	}

	async getOwnedAsset(type: ItemTypes, id: number, useCache = true): Promise<OwnedItem | undefined> {
		try {
			return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`, { useCache: useCache })).data[0];
		} catch {
			return undefined;
		}
	}

	async ownsAsset(type: ItemTypes, assetId: number, useCache = true): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`, { useCache: useCache });
		} catch {
			return false;
		}
	}

	async ownsBadge(badgeId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId, useCache);
	}

	async ownsGamepass(gamepassId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.GamePass, gamepassId, useCache);
	}

	async ownsBundle(bundleId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Bundle, bundleId, useCache)
	}

	/*
		Methods related to the Avatar API
		Docs: https://avatar.roblox.com/docs/index.html
	*/

	async fetchAvatarV1(useCache = true): Promise<UserAvatarV1> {
		return (await this.client.fetchHandler.fetch("GET", "Avatar", `/users/${this.id}/avatar`, { useCache: useCache }))
	}

	async fetchAvatarV2(useCache = true): Promise<UserAvatarV2> {
		return (await this.client.fetchHandler.fetch("GET", "AvatarV2", `/avatar/users/${this.id}/avatar`, { useCache: useCache }))
	}

	/*
		Methods related to the Thumbnails API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

	async fetchUserAvatarThumbnailUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageType = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	}

	async fetchUserHeadshotUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageType = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar-headshot", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	}

	/*
		Methods related to the Friends API
		Docs: https://friends.roblox.com/docs/index.html
	*/

	async fetchFriendMetadata(useCache = true): Promise<FriendMetadata> {
		return await this.client.fetchHandler.fetch("GET", "Friends", "/metadata", {
			useCache: useCache,
			params: {
				targetUserId: this.id
			}
		})
	}

	//? Friends

	//TODO: Rewrite to use fetchAll
	async fetchFriends(maxResults?: number, useCache = true): Promise<Friend[]> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to view someone's friend list.");

		const returnData = [] as Friend[];

		for (const friend of (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends`, { useCache: useCache })).data) {
			returnData.push(await factory.createFriend(this.client, friend, this))
			if (maxResults && returnData.length >= maxResults) break;
		}

		return returnData;
	}

	async fetchFriendCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends/count`, { useCache: useCache })).count
	}

	//? Followers

	//TODO: Rewrite to use fetchAll
	async fetchFollowers(sortOrder: SortOrder, maxResults?: number, useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followers`, {
				useCache: useCache,
				params: {
					limit: 100,
					cursor: nextPageCursor !== "NONE" && nextPageCursor || undefined,
					sortOrder: sortOrder
				}
			})

			for (const user of request.data) {
				returnData.push(await factory.createUser(this.client, user));

				if (maxResults &&  returnData.length >= maxResults) {
					break loop;
				}
			}

			nextPageCursor = request.nextPageCursor
		}

		return returnData;
	}


	async fetchFollowerCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followers/count`, { useCache: useCache })).count
	}

	//? Followings

	//TODO: Rewrite to use fetchAll
	async fetchFollowings(sortOrder: SortOrder, maxResults?: number, useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followings`, {
				useCache: useCache,
				params: {
					limit: 100,
					cursor: nextPageCursor !== "NONE" && nextPageCursor || undefined,
					sortOrder: sortOrder
				}
			})

			for (const user of request.data) {
				returnData.push(await factory.createUser(this.client, user));

				if (maxResults && returnData.length >= maxResults) {
					break loop;
				}
			}

			nextPageCursor = request.nextPageCursor
		}

		return returnData;
	}

	async fetchFollowingsCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followings/count`, { useCache: useCache })).count
	}

	/*
		Methods related to the AccountSettings API
		Docs: https://accountsettings.roblox.com/docs/index.html
	*/

	async block(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to block users.");

		await this.client.fetchHandler.fetch("POST", "AccountSettings", `/users/${this.id}/block`)
	}

	async unblock(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to unblock users.");

		await this.client.fetchHandler.fetch("POST", "AccountSettings", `/users/${this.id}/unblock`)
	}

	/*
		Methods related to the PremiumFeatures API
		Docs: https://premiumfeatures.roblox.com/docs/index.html
	*/

	async hasPremium(useCache = true): Promise<boolean> {
		return await this.client.fetchHandler.fetch("GET", "PremiumFeatures", `/users/${this.id}/validate-membership`, { useCache: useCache })
	}

	// Miscellaneous

	toString(): string {
		return `${this.name}:${this.id}`
	}
}


export default User;