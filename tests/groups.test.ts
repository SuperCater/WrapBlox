import WrapBlox from "../src";

const wrapBlox = new WrapBlox();

test("getGroup", async () => {
	const result = await wrapBlox.getGroup(1);
	expect(result).toBeDefined();
})