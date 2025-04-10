"use server";

import OpenAI from "openai";

export type StoryPrompt = {
  title: string;
  genre: string;
  mainCharacter: string;
  setting: string;
  mood: string;
  theme: string;
};

export type StorySegment = {
  type: "text" | "video";
  content?: string;
  description?: string;
  videoUrl?: string;
};

// Helper function for polling
async function pollPrediction(
  getUrl: string,
  token: string,
  maxAttempts = 30,
  interval = 3000
): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Polling attempt ${attempt + 1}/${maxAttempts}: ${getUrl}`);
    const pollResponse = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!pollResponse.ok) {
      const errorBody = await pollResponse.text();
      throw new Error(
        `Polling failed with status ${pollResponse.status}: ${errorBody}`
      );
    }

    const prediction = await pollResponse.json();
    console.log(`Polling status: ${prediction.status}`);

    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return prediction; // Return the final prediction object
    }

    // Wait before the next attempt
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Prediction timed out after ${maxAttempts} attempts.`);
}

async function generateVideo(prompt: string, index: number): Promise<string> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN is not set");
  }

  const apiUrl =
    "https://api.replicate.com/v1/models/wavespeedai/wan-2.1-t2v-480p/predictions";

  const payload = {
    input: {
      prompt,
    },
  };

  try {
    console.log(
      `Submitting prediction for video ${index} with prompt: ${prompt.substring(
        0,
        100
      )}...`
    );

    // Initial POST request to start the prediction
    const initialResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        // Prefer: "wait", // Remove Prefer: wait, we will poll
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `Initial response status for video ${index}: ${initialResponse.status}`
    );

    if (!initialResponse.ok) {
      const errorBody = await initialResponse.text();
      console.error(
        `Initial error response body for video ${index}:`,
        errorBody
      );
      throw new Error(
        `Replicate API request failed with status ${initialResponse.status}: ${errorBody}`
      );
    }

    const initialPrediction = await initialResponse.json();
    console.log(
      `Initial prediction response for video ${index}:`,
      JSON.stringify(initialPrediction, null, 2)
    );

    // Check if prediction started successfully and we have a GET URL
    if (!initialPrediction.urls || !initialPrediction.urls.get) {
      throw new Error(
        `Failed to get polling URL from initial response: ${JSON.stringify(
          initialPrediction
        )}`
      );
    }

    // Poll the prediction status
    const finalPrediction = await pollPrediction(
      initialPrediction.urls.get,
      REPLICATE_API_TOKEN
    );

    console.log(
      `Final prediction response for video ${index}:`,
      JSON.stringify(finalPrediction, null, 2)
    );

    // 1. Check for explicit failure in the final prediction
    if (
      finalPrediction.status === "failed" ||
      finalPrediction.status === "canceled"
    ) {
      const errorMessage = finalPrediction.error || "Unknown error";
      console.error(
        `Replicate prediction failed for video ${index}:`,
        errorMessage
      );
      throw new Error(`Replicate prediction failed: ${errorMessage}`);
    }

    // 2. Check for the output URL in the final prediction
    let outputUrl: string | null = null;
    if (finalPrediction.output) {
      if (
        typeof finalPrediction.output === "string" &&
        finalPrediction.output.startsWith("http")
      ) {
        outputUrl = finalPrediction.output;
      } else if (
        Array.isArray(finalPrediction.output) &&
        finalPrediction.output.length > 0 &&
        typeof finalPrediction.output[0] === "string" &&
        finalPrediction.output[0].startsWith("http")
      ) {
        outputUrl = finalPrediction.output[0];
      }
    }

    // 3. If URL found, return it
    if (outputUrl) {
      console.log(
        `Video ${index} URL: ${outputUrl} (Status: ${finalPrediction.status})`
      );
      return outputUrl;
    }

    // 4. If status is succeeded but no valid URL, throw error
    throw new Error(
      `Prediction succeeded but no valid output URL found for video ${index}. Status: ${
        finalPrediction.status
      }. Response: ${JSON.stringify(finalPrediction)}`
    );
  } catch (error) {
    console.error(`Error generating video ${index}:`, error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        `An unknown error occurred during video generation: ${String(error)}`
      );
    }
  }
}

export async function generateStory(
  prompt: StoryPrompt
): Promise<StorySegment[]> {
  const { title, genre, mainCharacter, setting, mood, theme } = prompt;

  const systemPrompt = `You are a story generation AI. Generate a story based on the following parameters. Return ONLY a JSON array containing exactly three objects with 'content' fields. Do not include any markdown formatting, code blocks, or explanatory text.

Parameters:
- Title: ${title || "Untitled Story"}
- Genre: ${genre || "fantasy"}
- Main Character: ${mainCharacter || "a protagonist"}
- Setting: ${setting || "a mysterious land"}
- Mood: ${mood || "mysterious"}
- Theme: ${theme || "discovery"}

The story should be in three acts:
1. Setup - Introduce the character and setting
2. Confrontation - Present the main conflict
3. Resolution - Show how the character overcomes challenges

Example format (replace with actual story):
[{"content":"Act 1 content..."},{"content":"Act 2 content..."},{"content":"Act 3 content..."}]`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.QWEN_API_KEY,
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: "You are a story generation AI." },
        { role: "user", content: systemPrompt },
      ],
    });

    const text = completion.choices[0].message.content;
    if (!text) throw new Error("No response from AI");

    // Clean up the response - remove any markdown or code block formatting
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^\s*\[\n?/, "[")
      .replace(/\n?\]\s*$/, "]")
      .trim();

    const parsedResponse = JSON.parse(cleanedText);

    if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
      throw new Error("Invalid story format received");
    }

    // Convert the 3 acts into a story with interspersed video segments
    const storySegments: StorySegment[] = [];

    // Generate video prompts based on the story content
    const videoPrompt1 = `Based on this Act 1 content: "${parsedResponse[0].content}" - Channel the sweeping establishing shots of Peter Jackson's Lord of the Rings, as a drone shot glides through ${setting}. Use a color palette inspired by Studio Ghibli's rich naturalism, with ${mood} undertones achieved through subtle color grading. When introducing ${mainCharacter}, employ intimate handheld shots reminiscent of Terrence Malick's naturalistic style, capturing candid moments that establish their character. The ${genre} elements should be subtly woven in through production design details, while maintaining a grounded documentary-like authenticity. Consider using magic hour lighting to enhance the ${theme}'s visual metaphor.`;
    // console.log("Video 1 Prompt:", videoPrompt1); // Keep logging prompts if useful

    // Act 1 with video
    storySegments.push({
      type: "text",
      content: parsedResponse[0].content,
    });

    const video1 = await generateVideo(videoPrompt1, 1);
    storySegments.push({
      type: "video",
      description: `Scene 1: Opening sequence in ${setting}`,
      videoUrl: video1,
    });

    const videoPrompt2 = `Based on this Act 2 content: "${parsedResponse[1].content}" - Draw inspiration from Denis Villeneuve's sense of scale and Christopher Nolan's tension-building techniques. Use dramatic lighting contrasts and dynamic camera movements to heighten the conflict. The ${setting} should feel alive and threatening, with environmental effects inspired by Mad Max: Fury Road's practical effects mixed with subtle CGI enhancements. For the ${mood} atmosphere, reference Blade Runner 2049's masterful use of color and fog. The ${genre} elements should be portrayed with practical effects where possible, using CGI only to enhance rather than create. Consider using Dutch angles and increasing handheld camera work to amplify tension.`;
    // console.log("Video 2 Prompt:", videoPrompt2);

    // Act 2 with video
    storySegments.push({
      type: "text",
      content: parsedResponse[1].content,
    });

    const video2 = await generateVideo(videoPrompt2, 2);
    storySegments.push({
      type: "video",
      description: `Scene 2: Confrontation in ${setting}`,
      videoUrl: video2,
    });

    const videoPrompt3 = `Based on this Act 3 content: "${parsedResponse[2].content}" - Blend the visual grandeur of Dune with the emotional intimacy of Arrival. The ${setting} should be captured with IMAX-style sweeping shots that gradually transition to close-up character moments, emphasizing ${mainCharacter}'s emotional journey. Use techniques from Roger Deakins' cinematography - strong silhouettes, precise lighting, and meaningful composition. The ${genre} elements should feel both spectacular and grounded, taking inspiration from Alex Garland's practical-meets-digital approach. The ${theme}'s resolution should be reflected in the transition of color palettes, perhaps drawing from Barry Jenkins' use of color to convey emotion.`;
    // console.log("Video 3 Prompt:", videoPrompt3);

    // Act 3 with video
    storySegments.push({
      type: "text",
      content: parsedResponse[2].content,
    });

    const video3 = await generateVideo(videoPrompt3, 3);
    storySegments.push({
      type: "video",
      description: `Scene 3: Resolution in ${setting}`,
      videoUrl: video3,
    });

    console.log("Story generation complete with video URLs:", storySegments);
    return storySegments;
  } catch (error) {
    console.error("Error generating story:", error);
    // Rethrow to ensure the frontend knows about the failure
    throw new Error(
      `Story generation failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
