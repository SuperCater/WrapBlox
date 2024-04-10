import { RawFriendData, RawUserData } from "../Types/UserTypes.js";
import WrapBlox from "../index.js";
import Friend from "./Friend.js";

class User {
	rawData : RawUserData;
	id : number;
	name : string;
	displayName : string;
	description : string;
	client : WrapBlox;
	
	
	constructor(client : WrapBlox, rawdata : RawUserData) {
		this.rawData = rawdata;
		this.id = rawdata.id;
		this.name = rawdata.name;
		this.displayName = rawdata.displayName;
		this.description = rawdata.description;
		this.client = client;
	}
	
	async fetchFriends() : Promise<Friend[]> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends`);
		return ret.data.map((friend : RawFriendData) => {
			return new Friend(this.client, friend);
		});
	}
	
	async fetchFriendCount() : Promise<number> {
		return (await this.client.fetchHandler.fetch('GET', 'Friends', `/users/${this.id}/friends/count`)).count;
	}
	
	async fetchNameHistory(): Promise<string[]> {
		return (await this.client.fetchHandler.fetchAll('GET', 'Users', `/users/${this.id}/name-history`)).map((name : {name : string}) => name.name);
	}
}

export default User;