import { APIUserGroup, AvatarImageTypes, RawFriendData, RawUserData } from "../Types/UserTypes.js";
import WrapBlox, { AwardedBadge, OwnedItem } from "../index.js";
// import type Friend from "./Friend.js";
import UserRoleManager from "./UserRoleManager.js";

import Factory from "./Internal/factory.js";
import Friend from "./Friend.js";
import { AvatarSize, ItemTypes } from "../Types/Enums.js";



class User {
	rawData: RawUserData;
	id: number;
	name: string;
	displayName: string;
	description: string;
	client: WrapBlox;


	constructor(client: WrapBlox, rawdata: RawUserData) {
		this.rawData = rawdata;
		this.id = rawdata.id;
		this.name = rawdata.name;
		this.displayName = rawdata.displayName;
		this.description = rawdata.description;
		this.client = client;
		
		
	}

	/**
	 * Fetches the user's friends
	 * @throws {Error} You can only fetch friends if the user is authenticated
	 * @returns {Promise<Friend[]>} An array of friends
	 */
	async fetchFriends(): Promise<Friend[]> {
		if (!this.client.isLoggedIn()) throw new Error("You can only fetch friends if the user is authenticated");

		const ret = await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends`);

		return ret.data.map((friend: RawFriendData) => {
			Factory.createFriend(this.client, friend, this);
		});
	}

	/**
	 * Fetches the user's friend count
	 * @throws {Error} You can only fetch friends if the user is authenticated
	 * @returns {Promise<number>} The user's friend count
	 */
	async fetchFriendCount(): Promise<number> {
		if (!this.client.isLoggedIn()) throw new Error("You can only fetch friends if the user is authenticated");

		return (await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends/count`)).count;
	}

	/**
	 * Fetches the user's previous usernames
	 * @returns {Promise<string[]>} An array of the user's previous usernames
	 */
	async fetchNameHistory(): Promise<string[]> {
		return (await this.client.fetchHandler.fetchAll('GET', 'Users', `/users/${this.id}/name-history`)).map((name: { name: string }) => name.name);
	}

	/**
	 * Checks if the user is in a group
	 * @param {number} groupId - The Id of the group to check
	 * @returns {Promise<boolean>} Whether the user is in the group
	 */
	async inGroup(groupId: number): Promise<boolean> {
		return (await this.fetchRawRoles()).some((group) => group.group.id === groupId);
	}

	/**
	 * Fetches the user's raw roles for all of the groups they are in
	 * @param {boolean} includelocked - Whether to include locked groups
	 * @param {boolean} includeNotificationPreferences - Whether to include notification preferences
	 * @returns {Promise<APIUserGroup[]>} An array of the raw roles
	 */
	async fetchRawRoles(includelocked: boolean = false, includeNotificationPreferences: boolean = false): Promise<APIUserGroup[]> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/users/${this.id}/groups/roles`, {
			params: {
				includeLocked: includelocked,
				includeNotificationPreferences: includeNotificationPreferences,
			}
		});

		return ret.data;

	}

	/**
	 * Fetches the user's roles for all of the groups they are in
	 * @param {boolean} includelocked - Whether to include locked groups
	 * @param {boolean} includeNotificationPreferences - Whether to include notification preferences
	 * @returns {Promise<APIUserGroup[]>} An array of the roles
	 */
	async fetchRoles(includelocked: boolean = false, includeNotificationPreferences: boolean = false): Promise<UserRoleManager> {
		return new UserRoleManager(this.client, await this.fetchRawRoles(includelocked, includeNotificationPreferences));
	}

	/**
	 * Fetches the user's avatar thumbnail url
	 * @param {AvatarSize} size - The size of the thumb=nail 
	 * @param {AvatarImageTypes} format - The format of the thumbnail 
	 * @param {boolean} isCircular - Whether the thumbnail should be circular 
	 * @returns {Promise<string>} The URL of the thumbnail
	 */
	async fetchUserAvatarThumbnailUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageTypes = "Png", isCircular: boolean = false): Promise<string> {
		const ret = await this.client.fetchHandler.fetch('GET', "Thumbnails", "/users/avatar", {
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		});
		return ret.data[0].imageUrl;
	}
	
	/**
	 * Fetches the user's headshot thumbnail url
	 * @param {AvatarSize} size - The size of the thumbnail 
	 * @param {AvatarImageTypes} format - The format of the thumbnail 
	 * @param {boolean} isCircular - Whether the thumbnail should be circular 
	 * @returns {Promise<string>} The URL of the thumbnail
	 */
	async fetchUserHeadshotUrl(size: AvatarSize = AvatarSize["150x150"], format: AvatarImageTypes = "Png", isCircular: boolean = false): Promise<string> {
		const ret = await this.client.fetchHandler.fetch('GET', "Thumbnails", "/users/avatar-headshot", {
			params: {
				userIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		});
		return ret.data[0].imageUrl;
	}

	/**
	 * Checks if we can view the user's inventory
	 * @returns {Promise<boolean>} Whether we can view their inventory
	 */
	async canViewInventory(): Promise<boolean> {
		return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/can-view-inventory`)).canView;
	}

	/**
	 * Gets owned items of the specified item type
	 * @param {ItemTypes} type - The type of asset to fetch
	 * @param {number} id - The id of the asset to fetch
	 * @returns {Promise<OwnedItem | undefined>}
	 */
	async getOwnedAsset(type: ItemTypes, id: number): Promise<OwnedItem | undefined> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`);
		} catch {
			return undefined;
		}

	}

	/**
	 * Checks if the user owns an asset of the specified type
	 * @param {ItemTypes} type - The type of asset to check
	 * @param {number} assetId - The id of the asset to check
	 * @returns {Promise<boolean>} Whether the user owns the asset
	 */
	async ownsAsset(type: ItemTypes, assetId: number): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`);
		} catch {
			return false;
		}
	}

	/**
	 * Checks if the user owns a badge
	 * @param badgeId - The id of the badge to check
	 * @returns {Promise<boolean>}
	 */
	async ownsBadge(badgeId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId);
	}

	/**
	 * Checks if the user owns a gamepass
	 * @param gamePassId - The id of the gamepass to check
	 * @returns {Promise<boolean>}
	 */
	async ownsGamePass(gamePassId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.GamePass, gamePassId);
	}

	/**
	 * Gets the date the user was awarded a badge
	 * @param badgeId - The id of the badge to check
	 * @returns {Promise<Date | undefined>}
	 */
	async getBadgeAwardedDate(badgeId: number): Promise<Date | undefined> {
		const response: AwardedBadge | undefined = await this.client.fetchHandler.fetch('GET', 'Badges', `/users/${this.id}/badges/${badgeId}/awarded-date`)
		if (response) {
			return new Date(response.awardedDate);
		}
	}


	/*
	async fetchFavoriteGames() : Promise<number[]> {
		// WIP
	}
	*/
	
	/**
	 * @returns {string} The user's name - If the user has a display name which is not the same as their username, it will return "{DisplayName} (@{Username}), otherwise it will return the username
	 */
	toString(): string {
		if (this.name === this.displayName) return this.name;
		return `${this.displayName} (@${this.name})`;
	}
}


export default User;