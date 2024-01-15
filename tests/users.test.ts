import WrapBlox from "../src";

const wrapBlox = new WrapBlox();

test("getUser", async () => {
	const result = await wrapBlox.getUser(1);
	expect(result).toBeDefined();
});

test("getUsernameHistory", async() => {
	const result = await wrapBlox.getUsernameHistory(1);
	expect(result).toBeDefined();
})

test("getUserFromUsername", async() => {
	const result = await wrapBlox.getUserFromUsername("Roblox");
	expect(result).toBeDefined();
})

