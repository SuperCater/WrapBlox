import WrapBlox from "../index.js";
import { BirthData, RawFriendData, RawFriendRequest, RawUserData } from "../Types/UserTypes.js";
import FriendRequest from "./FriendRequest.js";
import User from "./User.js";

class AuthedUser extends User {
	cookie : string;
	
	constructor(client : WrapBlox, data : RawUserData, cookie : string) {
		super(client, data);
		this.cookie = cookie;
	}
	
	async fetchBirthdate()  {
		return await this.client.fetchHandler.fetch('GET', 'Users', `/users/${this.id}/birthdate`, {cookie: this.cookie});
	}
	
	async setBirthdate(date : BirthData & {password : string}) : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Users', `/users/${this.id}/birthdate`, {cookie : this.cookie, body: date});
	}
	
	async setDescription(description : string) : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Users', `/users/${this.id}/description`, {cookie: this.cookie, body: {description}});
	}
	
	async fetchCountryCode() : Promise<string> {
		return (await this.client.fetchHandler.fetch('GET', 'Users', `/users/${this.id}/country`, {cookie: this.cookie})).countryCode;
	}
	
	async fetchFriendRequests() {
		const ret = await this.client.fetchHandler.fetchAll('GET', 'Friends', "/my/friend-requests", {cookie: this.cookie});
		
		return ret.map((friend : RawFriendRequest) => {
			return new FriendRequest(this.client, friend, this);
		});
	}
}

export default AuthedUser;