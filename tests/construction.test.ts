import WrapBlox from "../src";

const wrapBlox = new WrapBlox();

test("WrapBlox is defined", () => {
	  expect(wrapBlox).toBeDefined();
});

test("setCookie works", async () => {
	await wrapBlox.setCookie("test");
});