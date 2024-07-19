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
	
	async fetchFriends(): Promise<Friend[]> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends`);
		
		return ret.data.map((friend: RawFriendData) => {
			Factory.createFriend(this.client, friend)
		});
	}

	async fetchFriendCount(): Promise<number> {
		return (await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends/count`)).count;
	}

	async fetchNameHistory(): Promise<string[]> {
		return (await this.client.fetchHandler.fetchAll('GET', 'Users', `/users/${this.id}/name-history`)).map((name: { name: string }) => name.name);
	}


	async fetchRawRoles(includelocked = false, includeNotificationPreferences = false): Promise<APIUserGroup[]> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/users/${this.id}/groups/roles`, {
			includeLocked: includelocked,
			includeNotificationPreferences: includeNotificationPreferences,
		});

		return ret.data;

	}
	
	
	async fetchUserAvatarThumbnailUrl(size : AvatarSize = AvatarSize["150x150"], format : AvatarImageTypes = "Png", isCircular = false): Promise<string> {
		const ret = await this.client.fetchHandler.fetch('GET', "Thumbnails", "/users/avatar", {
			userIds: [this.id],
			size: size,
			format: format,
			isCircular: isCircular,
		});
		return ret.data[0].imageUrl;
	}

	async fetchRoles(includelocked = false, includeNotificationPreferences = false): Promise<UserRoleManager> {
		return new UserRoleManager(this.client, await this.fetchRawRoles(includelocked, includeNotificationPreferences));


	}
	
	
	async inGroup(groupId: number): Promise<boolean> {
		return (await this.fetchRawRoles()).some((group) => group.group.id === groupId);
	}
	
	async getOwnedAsset(type : ItemTypes, id : number): Promise<OwnedItem | undefined> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${id}`);
		} catch {
			return undefined;
		}
		
	}
	
	async ownsAsset(type : ItemTypes, assetId: number): Promise<boolean> {
		try {
			return await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/items/${type}/${assetId}/is-owned`);
		} catch {
			return false;
		}
	}
	
	
	async ownsBadge(badgeId: number): Promise<boolean> {
		return await this.ownsAsset(ItemTypes.Badge, badgeId);
	}
	
	
	async getBadgeAwardedDate(badgeId: number): Promise<Date | undefined> {
		const response : AwardedBadge | undefined = await this.client.fetchHandler.fetch('GET', 'Badges', `/users/${this.id}/badges/${badgeId}/awarded-date`)
		if (response) {
			return new Date(response.awardedDate);
		}
		
	}
	
	async canViewInventory(): Promise<boolean> {
		return (await this.client.fetchHandler.fetch('GET', 'Inventory', `/users/${this.id}/can-view-inventory`)).canView;
	}
	
		
	/*
	async fetchFavoriteGames() : Promise<number[]> {
		// WIP
	}
	*/
}

export default User;