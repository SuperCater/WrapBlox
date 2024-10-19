/*
	This is a factory that creates any classes that are needed
	
	This is used to prevent circular dependencies

*/

import type WrapBlox from "../../index.js";
import type { RawBadgeData, RawFriendData, RawUserData, User } from "../../index.js";
import type AuthedUser from "../AuthedUser.js";


export default {
	async createUser(client: WrapBlox, data: RawUserData) {
		const User = (await import('../User.js')).default;

		return new User(client, data);
	},

	async createFriend(client: WrapBlox, data : RawFriendData, friend : User | AuthedUser) {
		const Friend = (await import('../Friend.js')).default;
		
		return new Friend(client, data, friend);
	},

	async createBadge(client: WrapBlox, data: RawBadgeData) {
		const Badge = (await import("../Badge.js")).default;

		return new Badge(client, data);
	},
};