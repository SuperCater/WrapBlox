import WrapBlox, { RawFriendRequest } from "../index.js";

class FriendRequest {
	client : WrapBlox;
	rawdata : RawFriendRequest;
	senderId : number;
	created : Date;
	constructor(client : WrapBlox, rawdata : RawFriendRequest) {
		this.client = client;
		this.rawdata = rawdata;
		this.senderId = rawdata.friendRequest.senderId;
		this.created = new Date(rawdata.friendRequest.sentAt);
	}
	
	async fetchUser() {
		return await this.client.fetchUser(this.senderId);
	}
	
	async accept() : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Friends', `/users/${this.senderId}/accept-friend-request`);
	}
	
	async decline() : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Friends', `/users/${this.senderId}/decline-friend-request`);
	}
	
	
	
}

export default FriendRequest;