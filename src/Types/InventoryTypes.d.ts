export type OwnedAsset = {
	type: "Badge" | "Asset" | "GamePass" | "Bundle";
	id: number;
	name: string;
	instanceId: null;
};
