import { APICreator, APIGameData } from "../Types/GameTypes.js";
import WrapBlox, { ImageTypes, ThumbnailSize } from "../index.js";

class Game {
	rawdata : APIGameData;
	name : string;
	id : number;
	description : string;
	creator : APICreator;
	client : WrapBlox;
	playing : number;
	visits : number;
	maxPlayers : number;
	created : Date;
	updated : Date;
	constructor(client : WrapBlox, rawdata : APIGameData) {
		this.rawdata = rawdata;
		this.name = rawdata.name;
		this.id = rawdata.id;
		this.description = rawdata.description;
		this.creator = rawdata.creator;
		this.client = client;
		this.playing = rawdata.playing;
		this.visits = rawdata.visits;
		this.maxPlayers = rawdata.maxPlayers;
		
		this.created = new Date(rawdata.created);
		this.updated = new Date(rawdata.updated);
	}
	
	async fetchCreator() {
		return await this.client.fetchUser(this.creator.id);
	}
	
	async favorite() {
		return await this.client.fetchHandler.fetch('POST', 'Games', `/games/${this.id}/favorites`);
	}
	
	async fetchFavoriteCount() {
		return (await this.client.fetchHandler.fetch('GET', 'Games', `/games/${this.id}/favorites/count`)).count;
	}

	async fetchIcon(size: ThumbnailSize = ThumbnailSize["50x50"], format: ImageTypes = "Png", isCircular: boolean = false) {
		return (await this.client.fetchHandler.fetch('GET', 'Thumbnails', '/games/icons', {
			params: {
				universeIds: await this.client.PlaceIdToUniverseId(this.id),
				size: size,
				format: format,
				isCircular: isCircular
			}
		})).data.imageUrl
	}

	async fetchThumbnail(size: ThumbnailSize = ThumbnailSize["150x150"], format: ImageTypes = "Png", isCircular: boolean = false) {
		return (await this.client.fetchHandler.fetch('GET', 'Thumbnails', '/games/thumbnails', {
			params: {
				universeIds: await this.client.PlaceIdToUniverseId(this.id),
				size: size,
				format: format,
				isCircular: isCircular
			}
		})).data
	}
	
}

export default Game;