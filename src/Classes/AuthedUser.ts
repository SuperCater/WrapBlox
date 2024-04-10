import { BirthData, RawFriendData, RawFriendRequest } from "../Types/UserTypes.js";
import FriendRequest from "./FriendRequest.js";
import User from "./User.js";

class AuthedUser extends User {
	
	async fetchBirthdate()  {
		return await this.client.fetchHandler.fetch('GET', 'Users', `/users/${this.id}/birthdate`);
	}
	
	async setBirthdate(date : BirthData & {password : string}) : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Users', `/users/${this.id}/birthdate`, undefined, date);
	}
	
	async setDescription(description : string) : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Users', `/users/${this.id}/description`, undefined, {description});
	}
	
	async fetchCountryCode() : Promise<string> {
		return (await this.client.fetchHandler.fetch('GET', 'Users', `/users/${this.id}/country`)).countryCode;
	}
	
	async fetchFriendRequests() {
		const ret = await this.client.fetchHandler.fetchAll('GET', 'Friends', "/my/friend-requests");
		
		return ret.map((friend : RawFriendRequest) => {
			return new FriendRequest(this.client, friend, this);
		});
	}
}

export default AuthedUser;