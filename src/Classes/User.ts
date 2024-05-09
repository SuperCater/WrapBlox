import { APIUserGroup, AvatarImageTypes, RawFriendData, RawUserData } from "../Types/UserTypes.js";
import WrapBlox from "../index.js";
// import type Friend from "./Friend.js";
import UserRoleManager from "./UserRoleManager.js";

import Factory from "./Internal/factory.js";
import Friend from "./Friend.js";


export enum AvatarSize {
	"30x30" = "30x30",
	"48x48" = "48x48",
	"60x60" = "60x60",
	"75x75" = "75x75",
	"100x100" = "100x100",
	"110x110" = "110x110",
	"140x140" = "140x140",
	"150x150" = "150x150",
	"150x200" = "150x200",
	"180x180" = "180x180",
	"250x250" = "250x250",
	"352x352" = "352x352",
	"420x420" = "420x420",
	"720x720" = "720x720",
}

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
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/users/${this.id}/roles`, {
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
	
		
	/*
	async fetchFavoriteGames() : Promise<number[]> {
		// WIP
	}
	*/
}

export default User;