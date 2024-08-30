import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileManager } from "../helpers/fileManager";
import { googleFileManager } from "./googleFileManager";

export const gemini = async (base64String: string) => {
	try {
		const { outputPath } = await googleFileManager(base64String);

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-pro",
		});

		const uploadResponse = await fileManager.uploadFile(outputPath, {
			mimeType: "image/jpeg",
		});

		const result = await model.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
					fileUri: uploadResponse.file.uri,
				},
			},
			{
				text: "Return the consumption number of a reading",
			},
		]);

		const matches = result.response.text().match(/\d+/g);
		const number = matches ? Number(matches) : 0;

		return number;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};
