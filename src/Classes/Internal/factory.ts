/*
	This is a factory that creates any classes that are needed
	
	This is used to prevent circular dependencies

*/

import WrapBlox, { RawFriendData, User } from "../../index.js";
import AuthedUser from "../AuthedUser.js";


export default {
	
	async createFriend(client : WrapBlox, data : RawFriendData, friend : User | AuthedUser) {
		const Friend = (await import('../Friend.js')).default;
		
		return new Friend(client, data, friend);
	}
}