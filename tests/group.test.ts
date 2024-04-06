import WrapBlox from "../src/index.js";

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
