import Place from "../src/Classes/Place.js";
import Universe from "../src/Classes/Universe.js";
import WrapBlox from "../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const universeId = 7065948;
let preFetchedUniverse: Universe;
const silent = true;

const log = (message: unknown, ...optionalParams: unknown[]) => {
	if (silent) return;
	console.log(message, ...optionalParams);
};

const authenticated = () => {
	if (!client.isLoggedIn()) {
		log("Not logged in, skipping...");
		return false;
	}

	return true;
};

beforeAll(async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...");
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE);
	log(`Logged in as ${user.name}:${user.id}`);

	expect(user).toBeDefined();
});

test("fetchUniverse", async () => {
	const universeById = await client.fetchUniverse(universeId);

	preFetchedUniverse = universeById;
	log(`Fetched universe: ${universeById.toString()}`);

	expect(universeById).toBeDefined();
	expect(universeById).toMatchObject<Universe>(universeById);
});

test("fetchRootPlace", async () => {
	const rootPlace = await preFetchedUniverse.fetchRootPlace();

	log(`Fetched root place: ${rootPlace.toString()}`);
	expect(rootPlace).toBeDefined();
	expect(rootPlace).toMatchObject<Place>(rootPlace);
});
