import WrapBlox from "../src/index.js";
import dotenv from "dotenv";

const client = new WrapBlox();

test("getRawGroup", async () => {
	const group = await client.fetchRawGroup(10345148);
	console.log(group);
	expect(group).toBeDefined();
});

test("getGroup", async () => {
	const group = await client.fetchGroup(10345148);
	console.log(group);
	expect(group).toBeDefined();
});

test("getJoinRequests" , async () => {
	const group = await client.fetchGroup(10345148);
	const joinRequests = await group.fetchJoinRequests();
	console.log(joinRequests);
	expect(joinRequests).toBeDefined();
});
