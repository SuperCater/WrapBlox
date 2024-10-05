/*
	This is a factory that creates any classes that are needed
	
	This is used to prevent circular dependencies

*/

import type WrapBlox from "../../index.js";
import type { RawFriendData, User } from "../../index.js";
import type AuthedUser from "../AuthedUser.js";


export default {
	
	async createFriend(client : WrapBlox, data : RawFriendData, friend : User | AuthedUser) {
		const Friend = (await import('../Friend.js')).default;
		
		return new Friend(client, data, friend);
	}
}