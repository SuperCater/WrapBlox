/*
	This is a factory that creates any classes that are needed
	
	This is used to prevent circular dependencies

*/

import WrapBlox, { RawFriendData } from "../../index.js";


export default {
	
	async createFriend(client : WrapBlox, data : RawFriendData) {
		const Friend = (await import('../Friend.js')).default;
		
		return new Friend(client, data);
	}
}