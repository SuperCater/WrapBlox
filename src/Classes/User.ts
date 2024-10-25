import Friend from "./Friend.js";
import factory from "./Internal/factory.js";

import type WrapBlox from "../index.js";
import {
	type AvatarImageFormat,
	type RawUserGroupRoles,
	type RawUserData,
	type AvatarV1,
	type AvatarV2,
	type Avatar3D,
	type FriendMetadata,
	type AvatarBustImageFormat,
	type UserPresence,
	type OwnedAsset,
	type GroupRole,
	type SortOrder,

	AvatarBustImageSize,
	AvatarImageSize,
	ItemTypes,
} from "../index.js";
import Group from "./Group.js";
import Badge from "./Badge.js";
import Universe from "./Universe.js";

export default class User {
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

	/**
	 * Fetches the username history of the user.
	 *
	 * @param {number} [maxResults=100] - The maximum number of results to return.
	 * @param {boolean} [useCache=true] - Whether to use cached data if available.
	 * @returns {Promise<string[]>} A promise that resolves to an array of usernames.
	 */
	async fetchUsernameHistory(maxResults = 100, useCache = true): Promise<string[]> {
		return (await this.client.fetchHandler.fetchEndpointList("GET", "Users", `/users/${this.id}/username-history`,
			{ useCache: useCache },
			{ maxResults: maxResults, perPage: 100 }
		)).map((name: {name: string}) => name.name);
	};

	/*
		Methods related to the Presence API
		Docs: https://presence.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the last online date of the user.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use cached data or not.
	 * @returns {Promise<Date>} A promise that resolves to the last online date of the user.
	 */
	async fetchLastOnlineDate(useCache = true): Promise<Date> {
		return new Date((await this.client.fetchHandler.fetchEndpoint("POST", "Presence", "/presence/last-online", {
			useCache: useCache,
			body: {
				userIds: [this.id]
			}
		})).lastOnlineTimestamps[0].lastOnline);
	};

	/**
	 * Fetches the presence status of the user.
	 *
	 * @param useCache - A boolean indicating whether to use the cache. Defaults to true.
	 * @returns A promise that resolves to the user's presence status.
	 */
	async fetchPresence(useCache = true): Promise<UserPresence> {
		return (await this.client.fetchHandler.fetchEndpoint("POST", "Presence", "/presence/users", {
			useCache: useCache,
			body: {
				userIds: [this.id]
			}
		})).userPresences[0];
	};

	/*
		Methods related to the Games API
		Docs: https://games.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the universes created by the user.
	 *
	 * @param maxResults - The maximum number of results to return. Defaults to 100.
	 * @param accessFilter - The access filter for the universes. Can be "All", "Public", or "Private". Defaults to "All".
	 * @param sortOrder - The order in which to sort the results. Can be "Asc" for ascending or "Desc" for descending. Defaults to "Asc".
	 * @param useCache - Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to an array of Universe objects.
	 */
	async fetchCreatedUniverses(maxResults = 50, accessFilter: "All" | "Public" | "Private" = "All", sortOrder: SortOrder = "Asc", useCache = true): Promise<Universe[]> {
		const returnData = [] as Universe[];
		const rawData = await this.client.fetchHandler.fetchEndpointList("GET", "GamesV2", `/users/${this.id}/games`, {
			useCache: useCache,
			params: {
				//accessFilter: accessFilter,
				// Returns a 501 [Not Implemented]
				sortOrder: sortOrder
			}
		}, { maxResults: maxResults, perPage: 50 });

		for (const data of rawData) {
			const universe = await this.client.fetchUniverse(data.id, useCache);
			returnData.push(universe);
		}

		return returnData;
	};

	/*
		Methods related to the Groups API
		Docs: https://groups.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the raw group roles for the user.
	 *
	 * @param includelocked - Whether to include locked roles in the response. Defaults to `false`.
	 * @param includeNotificationPreferences - Whether to include notification preferences in the response. Defaults to `false`.
	 * @param useCache - Whether to use cached data if available. Defaults to `true`.
	 * @returns A promise that resolves to an array of `RawUserGroupRoles`.
	 */
	private async fetchRawGroupRoles(includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<RawUserGroupRoles[]> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "GroupsV2", `/users/${this.id}/groups/roles`, {
			useCache: useCache,
			params: {
				includeLocked: includelocked,
				includeNotificationPreferences: includeNotificationPreferences,
			}
		})).data
	};

	/**
	 * Checks if the user is in a specified group.
	 *
	 * @param groupId - The ID of the group to check.
	 * @param includelocked - Optional. Whether to include locked groups in the check. Defaults to `false`.
	 * @param includeNotificationPreferences - Optional. Whether to include notification preferences in the check. Defaults to `false`.
	 * @param useCache - Optional. Whether to use cached data for the check. Defaults to `true`.
	 * @returns A promise that resolves to `true` if the user is in the specified group, otherwise `false`.
	 */
	async inGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<boolean> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).some((entry) => entry.group.id === groupId));
	};

	/**
	 * Retrieves the role of the user in a specified group.
	 *
	 * @param groupId - The ID of the group to retrieve the role for.
	 * @param includelocked - Optional. Whether to include locked roles. Defaults to `false`.
	 * @param includeNotificationPreferences - Optional. Whether to include notification preferences. Defaults to `false`.
	 * @param useCache - Optional. Whether to use cached data. Defaults to `true`.
	 * @returns A promise that resolves to the user's role in the specified group, or `undefined` if not found.
	 */
	async getRoleInGroup(groupId: number, includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<GroupRole | undefined> {
		return ((await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache)).find((entry) => entry.group.id === groupId)?.role)
	};

	/**
	 * Fetches the primary group of the user.
	 *
	 * @param useCache - A boolean indicating whether to use the cache. Defaults to true.
	 * @returns A promise that resolves to the primary group of the user, or undefined if no primary group is found.
	 */
	async fetchPrimaryGroup(useCache = true): Promise<Group | undefined> {
		const groupId = (await this.client.fetchHandler.fetchEndpoint("GET", "Groups", `/users/${this.id}/groups/primary/role`))?.group.id;
		if (!groupId) return undefined;

		return await this.client.fetchGroup(groupId, useCache);
	}

	/**
	 * Fetches the groups that the user in.
	 *
	 * @param includelocked - Whether to include locked groups in the fetch.
	 * @param includeNotificationPreferences - Whether to include notification preferences in the fetch.
	 * @param useCache - Whether to use cached data if available.
	 * @returns A promise that resolves to an array of Group objects.
	 */
	async fetchGroups(includelocked = false, includeNotificationPreferences = false, useCache = true): Promise<Group[]> {
		const returnData = [] as Group[];
		const rawData = await this.fetchRawGroupRoles(includelocked, includeNotificationPreferences, useCache);

		for (const data of rawData) returnData.push(await this.client.fetchGroup(data.group.id, useCache));

		return returnData;
	}

	/*
		Methods related to the Badges API
		Docs: https://badges.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the badges for the user.
	 *
	 * @param {number} [maxResults=100] - The maximum number of results to return.
	 * @param {SortOrder} [sortOrder="Asc"] - The order in which to sort the results. Can be "Asc" or "Desc".
	 * @param {boolean} [useCache=true] - Whether to use cached data or not.
	 * @returns {Promise<Badge[]>} A promise that resolves to an array of Badge objects.
	 */
	async fetchBadges(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<Badge[]> {
		const returnData = [] as Badge[];
		const rawData = await this.client.fetchHandler.fetchEndpointList("GET", "Badges", `/users/${this.id}/badges`,
			{ useCache: useCache, params: { sortOrder: sortOrder } },
			{ maxResults: maxResults, perPage: 100 });

		for (const data of rawData) returnData.push(await factory.createBadge(this.client, data));

		return returnData;
	};

	/**
	 * Fetches the award date of a specific badge for the user.
	 *
	 * @param badgeId - The ID of the badge to fetch the award date for.
	 * @param useCache - Optional parameter to determine whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to the award date of the badge as a Date object, or undefined if the date is not found.
	 */
	async fetchBadgeAwardDate(badgeId: number, useCache = true): Promise<Date | undefined> {
		const rawDate = (await this.client.fetchHandler.fetchEndpoint("GET", "Badges", `/users/${this.id}/badges/${badgeId}/awarded-date`, { useCache: useCache }))?.awardedDate
		if (!rawDate) return undefined;

		return new Date(rawDate)
	};
	
	/*
		Methods related to the Inventory API
		Docs: https://inventory.roblox.com/docs/index.html
	*/

	/**
	 * Determines if the user can view the inventory.
	 * 
	 * @param useCache - Optional boolean to specify whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a boolean indicating if the user can view the inventory.
	 */
	async canViewInventory(useCache = true): Promise<boolean> {
		return (await this.client.fetchHandler.fetchEndpoint('GET', 'Inventory', `/users/${this.id}/can-view-inventory`, { useCache: useCache })).canView;
	};

	/**
	 * Retrieves an owned asset for the user.
	 *
	 * @param type - The type of the item to retrieve.
	 * @param id - The ID of the item to retrieve.
	 * @param useCache - Optional. Whether to use the cache for the request. Defaults to true.
	 * @returns A promise that resolves to the owned item if found, or undefined if not found or an error occurs.
	 */
	async getOwnedAsset(type: ItemTypes, id: number, useCache = true): Promise<OwnedAsset | undefined> {
		try {
			return (await this.client.fetchHandler.fetchEndpoint('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`, { useCache: useCache })).data[0];
		} catch {
			return undefined;
		}
	};

	/**
	 * Checks if the user owns a specific asset.
	 *
	 * @param type - The type of the item.
	 * @param assetId - The ID of the asset.
	 * @param useCache - Optional. Whether to use cache for the request. Defaults to true.
	 * @returns A promise that resolves to a boolean indicating whether the user owns the asset.
	 */
	async ownsAsset(type: ItemTypes, assetId: number, useCache = true): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetchEndpoint('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`, { useCache: useCache });
		} catch {
			return false;
		}
	};

	/**
	 * Checks if the user owns a specific badge.
	 *
	 * @param badgeId - The ID of the badge to check.
	 * @param useCache - Optional. Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a boolean indicating whether the user owns the badge.
	 */
	async ownsBadge(badgeId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId, useCache);
	};

	/**
	 * Checks if the user owns a specific gamepass.
	 *
	 * @param gamepassId - The ID of the gamepass to check.
	 * @param useCache - Optional parameter to determine whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a boolean indicating whether the user owns the gamepass.
	 */
	async ownsGamepass(gamepassId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.GamePass, gamepassId, useCache);
	};

	/**
	 * Checks if the user owns a specific bundle.
	 *
	 * @param bundleId - The ID of the bundle to check.
	 * @param useCache - Optional. Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a boolean indicating whether the user owns the bundle.
	 */
	async ownsBundle(bundleId: number, useCache = true): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Bundle, bundleId, useCache)
	};

	/*
		Methods related to the Avatar API
		Docs: https://avatar.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the avatar for the user using the V1 API.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use the cache for the request.
	 * @returns {Promise<AvatarV1>} A promise that resolves to the user's avatar.
	 */
	async fetchAvatarV1(useCache = true): Promise<AvatarV1> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Avatar", `/users/${this.id}/avatar`, { useCache: useCache }))
	};

	/**
	 * Fetches the user's avatar using the AvatarV2 endpoint.
	 * 
	 * @param {boolean} [useCache=true] - Determines whether to use the cache for the request.
	 * @returns {Promise<AvatarV2>} A promise that resolves to the user's AvatarV2 data.
	 */
	async fetchAvatarV2(useCache = true): Promise<AvatarV2> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "AvatarV2", `/avatar/users/${this.id}/avatar`, { useCache: useCache }))
	};

	/*
		Methods related to the Thumbnails API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the avatar thumbnail URL for the user.
	 *
	 * @param size - The desired size of the avatar image. Defaults to `AvatarImageSize["150x150"]`.
	 * @param format - The format of the avatar image. Defaults to `"Png"`.
	 * @param isCircular - Whether the avatar image should be circular. Defaults to `false`.
	 * @param useCache - Whether to use the cache for the request. Defaults to `true`.
	 * @returns A promise that resolves to the URL of the avatar thumbnail image.
	 */
	async fetchAvatarThumbnailUrl(size: AvatarImageSize = AvatarImageSize["150x150"], format: AvatarImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Thumbnails", "/users/avatar", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	};

	/**
	 * Fetches the 3D avatar of the user.
	 *
	 * @param useCache - A boolean indicating whether to use the cache. Defaults to true.
	 * @returns A promise that resolves to an `Avatar3D` object containing the 3D avatar data.
	 */
	async fetchAvatar3D(useCache = true): Promise<Avatar3D> {
		const jsonUrl = (await this.client.fetchHandler.fetchEndpoint("GET", "Thumbnails", "/users/avatar-3d", {
			useCache: useCache,
			params: {
				userId: this.id
			}
		})).imageUrl;

		return (await fetch(jsonUrl, {
			method: "GET"
		})).json()
	};

	/**
	 * Fetches the avatar bust URL for the user.
	 *
	 * @param size - The size of the avatar bust image. Defaults to `AvatarBustImageSize["150x150"]`.
	 * @param format - The format of the avatar bust image. Defaults to `"Png"`.
	 * @param isCircular - Whether the avatar bust image should be circular. Defaults to `false`.
	 * @param useCache - Whether to use the cache for fetching the avatar bust image. Defaults to `true`.
	 * @returns A promise that resolves to the URL of the avatar bust image.
	 */
	async fetchAvatarBustUrl(size: AvatarBustImageSize = AvatarBustImageSize["150x150"], format: AvatarBustImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Thumbnails", "/users/avatar-bust", {
			useCache: useCache,
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
	};

	/**
	 * Fetches the avatar headshot URL for the user.
	 *
	 * @param size - The size of the avatar image. Defaults to "150x150".
	 * @param format - The format of the avatar image. Defaults to "Png".
	 * @param isCircular - Whether the avatar image should be circular. Defaults to false.
	 * @param useCache - Whether to use the cache for the request. Defaults to true.
	 * @returns A promise that resolves to the URL of the avatar headshot image.
	 */
	async fetchAvatarHeadshotUrl(size: AvatarImageSize = AvatarImageSize["150x150"], format: AvatarImageFormat = "Png", isCircular = false, useCache = true): Promise<string> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Thumbnails", "/users/avatar-headshot", {
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

	/**
	 * Fetches the metadata for the user's friends.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use cached data.
	 * @returns {Promise<FriendServiceMetadata>} A promise that resolves to the friends' metadata.
	 */
	async fetchFriendsMetadata(useCache = true): Promise<FriendMetadata> {
		return await this.client.fetchHandler.fetchEndpoint("GET", "Friends", "/metadata", {
			useCache: useCache,
			params: {
				targetUserId: this.id
			}
		})
	};

	//? Friends

	/**
	 * Fetches the list of friends for the user.
	 *
	 * @param {number} [maxResults=100] - The maximum number of friends to return.
	 * @param {boolean} [useCache=true] - Whether to use cached data if available.
	 * @returns {Promise<Friend[]>} A promise that resolves to an array of Friend objects.
	 * @throws {Error} Throws an error if the client is not authenticated.
	 */
	async fetchFriends(maxResults = 100, useCache = true): Promise<Friend[]> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to view someone's friend list.");

		const returnData = [] as Friend[];
		for (const friend of (await this.client.fetchHandler.fetchEndpoint("GET", "Friends", `/users/${this.id}/friends`, { useCache: useCache })).data) {
			returnData.push(await factory.createFriend(this.client, friend, this))
			if (maxResults && returnData.length >= maxResults) break;
		}

		return returnData;
	};

	/**
	 * Fetches the count of friends for the user.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use cached data.
	 * @returns {Promise<number>} - A promise that resolves to the number of friends.
	 */
	async fetchFriendCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Friends", `/users/${this.id}/friends/count`, { useCache: useCache })).count
	};

	//? Followers

	/**
	 * Fetches the followers of the user.
	 *
	 * @param maxResults - The maximum number of results to return. Defaults to 100.
	 * @param sortOrder - The order in which to sort the results. Defaults to "Asc".
	 * @param useCache - Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to an array of User objects representing the followers.
	 */
	async fetchFollowers(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		const rawData = await this.client.fetchHandler.fetchEndpointList("GET", "Friends", `/users/${this.id}/followers`,
			{ useCache: useCache, params: { sortOrder: sortOrder } },
			{ maxResults: maxResults, perPage: 100 });

		for (const data of rawData) returnData.push(await factory.createUser(this.client, data));
		//? Why not use wrapblox.fetchUser() here? Because it would use an unnecessary API request.

		return returnData;
	};


	/**
	 * Fetches the follower count for the user.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use cached data or not.
	 * @returns {Promise<number>} A promise that resolves to the follower count.
	 */
	async fetchFollowerCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Friends", `/users/${this.id}/followers/count`, { useCache: useCache })).count
	};

	//? Followings

	/**
	 * Fetches the list of users that the current user is following.
	 *
	 * @param maxResults - The maximum number of results to return. Defaults to 100.
	 * @param sortOrder - The order in which to sort the results. Defaults to "Asc".
	 * @param useCache - Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to an array of User objects representing the followings.
	 */
	async fetchFollowings(maxResults = 100, sortOrder: SortOrder = "Asc", useCache = true): Promise<User[]> {
		const returnData = [] as User[];
		const rawData = await this.client.fetchHandler.fetchEndpointList("GET", "Friends", `/users/${this.id}/followings`,
			{ useCache: useCache, params: { sortOrder: sortOrder } },
			{ maxResults: maxResults, perPage: 100 });

		for (const data of rawData) returnData.push(await factory.createUser(this.client, data));
		//? Why not use wrapblox.fetchUser() here? Because it would use an unnecessary API request.

		return returnData;
	};

	/**
	 * Fetches the count of followings for the user.
	 *
	 * @param {boolean} [useCache=true] - Determines whether to use cached data.
	 * @returns {Promise<number>} - A promise that resolves to the count of followings.
	 */
	async fetchFollowingsCount(useCache = true): Promise<number> {
		return (await this.client.fetchHandler.fetchEndpoint("GET", "Friends", `/users/${this.id}/followings/count`, { useCache: useCache })).count
	};

	/*
		Methods related to the AccountSettings API
		Docs: https://accountsettings.roblox.com/docs/index.html
	*/

	/**
	 * Blocks the user associated with this instance.
	 * 
	 * @returns {Promise<void>} A promise that resolves when the user has been successfully blocked.
	 * @throws {Error} Throws an error if the client is not authenticated.
	 */
	async block(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to block users.");

		await this.client.fetchHandler.fetchEndpoint("POST", "AccountSettings", `/users/${this.id}/block`)
	};

	/**
	 * Unblocks the user associated with this instance.
	 * 
	 * @returns {Promise<void>} A promise that resolves when the user has been successfully unblocked.
	 * @throws {Error} Throws an error if the client is not authenticated.
	 */
	async unblock(): Promise<void> {
		if (!this.client.isLoggedIn()) throw new Error("You must be authenticated to unblock users.");

		await this.client.fetchHandler.fetchEndpoint("POST", "AccountSettings", `/users/${this.id}/unblock`)
	};

	/*
		Methods related to the PremiumFeatures API
		Docs: https://premiumfeatures.roblox.com/docs/index.html
	*/

	/**
	 * Checks if the user has a premium membership.
	 *
	 * @param {boolean} [useCache=true] - Whether to use cached data or not.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the user has a premium membership.
	 */
	async hasPremium(useCache = true): Promise<boolean> {
		return await this.client.fetchHandler.fetchEndpoint("GET", "PremiumFeatures", `/users/${this.id}/validate-membership`, { useCache: useCache })
	};

	// Miscellaneous

	/**
	 * Returns a string representation of the user.
	 * The format of the returned string is `${this.name}:${this.id}`.
	 *
	 * @returns {string} The formatted string.
	 */
	toString(): string {
		return `${this.name}:${this.id}`
	};
};