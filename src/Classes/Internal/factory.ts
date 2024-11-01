/*
	This is a factory that creates any classes that are needed
	
	This is used to prevent circular dependencies

*/

import type WrapBlox from "../../index.js";
import type { RawBadgeData, RawFriendData, RawUniverseData, RawUserData } from "../../index.js";
import AuthedUser from "../AuthedUser.js";
import User from "../User.js";


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

	async createUniverse(client: WrapBlox, data: RawUniverseData) {
		const Universe = (await import("../Universe.js")).default;

		return new Universe(client, data);
	}
};