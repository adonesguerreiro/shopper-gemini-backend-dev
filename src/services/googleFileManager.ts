import { fileManager } from "../helpers/fileManager";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export const googleFileManager = async (base64String: string) => {
	try {
		const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
		const imageBuffer = Buffer.from(base64Data, "base64");
		const outputPath = path.join("src/img/", `output-image${uuidv4()}.jpg`);
		await fs.writeFile(outputPath, imageBuffer);

		const uploadResponse = await fileManager.uploadFile(outputPath, {
			mimeType: "image/jpeg",
		});

		const getResponse = await fileManager.getFile(uploadResponse.file.name);

		return { outputPath, getResponse };
	} catch (error) {
		console.error(error);
		throw new Error("Failed to upload file");
	}
};
