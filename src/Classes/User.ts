import type { APIUserGroup, AvatarImageTypes, FriendMetadata, RawFriendData, RawUserData, UserAvatarV1, UserAvatarV2 } from "../Types/UserTypes.js";
import type WrapBlox from "../index.js";
import type { AwardedBadge, OwnedItem, SortOrder } from "../index.js";
// import type Friend from "./Friend.js";
import UserRoleManager from "./UserRoleManager.js";

import Factory from "./Internal/factory.js";
import Friend from "./Friend.js";
import { AvatarSize, ItemTypes } from "../Types/Enums.js";
import factory from "./Internal/factory.js";



class User {
	client: WrapBlox;
	rawData: RawUserData;

	id: number;
	name: string;
	displayName: string;
	description: string;
	hasVerifiedBadge: boolean;
	externalAppDisplayName?: string;
	isBanned : boolean;
	joinDate: Date;

	accountAge: number;

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
		Methods related to the UsersV1 API
		Docs: https://users.roblox.com/docs/index.html
	*/

	async fetchUsernameHistory(maxResults?: number, useCache = true): Promise<string[]> {
		const returnData = [] as string[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Users", `/users/${this.id}/username-history`, {
				usecache: useCache,
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
		Methods related to the GroupsV1 API
		Docs: https://groups.roblox.com/docs/index.html
	*/

	//! To be completed

	/*
		Methods related to the InventoryV1 API
		Docs: https://inventory.roblox.com/docs/index.html
	*/

	async canViewInventory(): Promise<boolean> {
		return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/can-view-inventory`)).canView;
	}

	async getOwnedAsset(type: ItemTypes, id: number): Promise<OwnedItem | undefined> {
		try {
			return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`)).data[0];
		} catch {
			return undefined;
		}
	}

	async ownsAsset(type: ItemTypes, assetId: number): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`);
		} catch {
			return false;
		}
	}

	async ownsBadge(badgeId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId);
	}

	async ownsGamepass(gamepassId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.GamePass, gamepassId);
	}

	async ownsBundle(bundleId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Bundle, bundleId)
	}

	/*
		Methods related to the AvatarV1 & V2 API
		Docs: https://avatar.roblox.com/docs/index.html
	*/

	async fetchAvatarV1(): Promise<UserAvatarV1> {
		return (await this.client.fetchHandler.fetch("GET", "Avatar", `/users/${this.id}/avatar`))
	}

	async fetchAvatarV2(): Promise<UserAvatarV2> {
		return (await this.client.fetchHandler.fetch("GET", "AvatarV2", `/avatar/users/${this.id}/avatar`))
	}

	/*
		Methods related to the ThumbnailsV1 API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

	async fetchUserAvatarThumbnailUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageTypes = "Png", isCircular = false): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar", {
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	}

	async fetchUserHeadshotUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageTypes = "Png", isCircular = false): Promise<string> {
		return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/users/avatar-headshot", {
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	}

	/*
		Methods related to the FriendsV1 API
		Docs: https://friends.roblox.com/docs/index.html
	*/

	async fetchFriendMetadata(): Promise<FriendMetadata> {
		return await this.client.fetchHandler.fetch("GET", "Friends", "/metadata", {
			params: {
				targetUserId: this.id
			}
		})
	}

	//? Friends

	async fetchFriends(maxResults?: number): Promise<Friend[]> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to view someone's friend list.");

		const returnData = [] as Friend[];

		for (const friend of (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends`)).data) {
			returnData.push(await factory.createFriend(this.client, friend, this))
			if (maxResults && returnData.length >= maxResults) break;
		}

		return returnData;
	}


	async fetchFriendCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/friends/count`, {
			usecache: useCache
		})).count
	}

	//? Followers

	async fetchFollowers(sortOrder: SortOrder, maxResults?: number): Promise<User[]> {
		const returnData = [] as User[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followers`, {
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
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followers/count`, {
			usecache: useCache
		})).count
	}

	//? Followings

	async fetchFollowings(sortOrder: SortOrder, maxResults?: number): Promise<User[]> {
		const returnData = [] as User[];
		let nextPageCursor = "NONE";

		loop: while (nextPageCursor) {
			const request = await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followings`, {
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
		return (await this.client.fetchHandler.fetch("GET", "Friends", `/users/${this.id}/followings/count`, {
			usecache: useCache
		})).count
	}

	/*
		Methods related to the AccountSettingsV1 API
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
		Methods related to the PremiumFeaturesV1 API
		Docs: https://premiumfeatures.roblox.com/docs/index.html
	*/

	async hasPremium(useCache = true): Promise<boolean> {
		return await this.client.fetchHandler.fetch("GET", "PremiumFeatures", `/users/${this.id}/validate-membership`, { usecache: useCache })
	}

	// Miscellaneous

	toString(): string {
		return `${this.name}:${this.id}`
	}
}


export default User;