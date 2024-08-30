import { GoogleAIFileManager } from "@google/generative-ai/server";

export const fileManager = new GoogleAIFileManager(
	process.env.GEMINI_API_KEY as string
);
