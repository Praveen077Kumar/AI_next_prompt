import Prompt from "@models/prompt";
import connectToDatabase from "@utils/database";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
    try {
        await connectToDatabase()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDatabase();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
  try {
    // Wait for params
    const user_id = params?.id;

    if (!user_id) {
      return new Response("ID parameter is missing", { status: 400 });
    }

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return new Response("Invalid ID format", { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Delete the document
    const deletedPrompt = await Prompt.findByIdAndRemove(user_id);

    if (!deletedPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting prompt:", error.message);
    return new Response("Error deleting prompt", { status: 500 });
  }
};