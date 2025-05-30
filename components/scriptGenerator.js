const { GoogleGenAI } = require("@google/genai");

async function generate(apodData) {
  const today = new Date();
  const options = { month: "short", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  console.log("Today's date:", formattedDate);
  let textPrompt = "";
  if (apodData) {
    textPrompt = `Write a script to generate a 30-second vertical video based on the following text:
    "${await apodData}",
    Generate a JSON array of 5 to 6 scenes. For each scene, include:
    🔹 imagePrompt
    A detailed, realistic-style image description for the scene
    
    Visually represents a moment or concept from the text
    
    Should be engaging, relevant, and intuitive
    
    Do NOT include any text in the image
    
    End the description with the phrase: "Realistic style."
    
    Do not use curly quotes (’); only use straight quotes (') or omit if not needed
    
    🔹 contentText
    Narration/dialogue for the scene based on the provided text
    
    Start the first scene with a hook, add any one of these lines:
    "Did you know? On ${formattedDate}, NASA featured this." or "Did you know? According to NASA's daily space feature...".
    
    Keep the entire contentText across all scenes within 60 to 70 words total
    
    Make it engaging, informative, and ideal for short-form vertical video
    
    Use surprising or awe-inspiring facts
    
    End the final scene with this line: "Don't forget to like and subscribe!"
    
    Do not use curly quotes (’); use only straight quotes (')
    
    
    🪐 Base the script on real astronomical facts or cosmic phenomena found in the text
    🎯 Total target duration: \~30 seconds
    🎬 Final output must be a valid JSON array
    `;
  } else {
    textPrompt = `Write a script to generate a 30-second vertical video on the topic: “Did you know?” space facts. The output should be a JSON array of 5 to 6 scenes. For each scene, include the following:
    
    imagePrompt:
    Provide a detailed, realistic-style image description for the scene that visually represents the space fact or concept. The image should be engaging, relevant, and visually intuitive.
    
    Do not include any text in the image.
    
    At the end of the description, clearly add this instruction: "Realistic style."
    
    Do not use curly quotes (like ’) in the imagePrompt. Use only straight quotes (') or omit them if not needed.
    
    contentText:
    Provide the narration or dialogue for each scene.
    
    Keep it engaging, informative, and hook-worthy, ideal for short-form video.
    
    Aim for facts that are surprising, little-known, or awe-inspiring.
    
    Avoid using curly quotes (like ’) in the contentText. Use straight apostrophes (') for contractions or omit if not required.
    
    ✅ In the final scene, end the contentText with a friendly call-to-action like: "Don't forget to like and subscribe!"
    
    🪐 The topic must be based on a real astronomical fact, space phenomenon, or cosmic curiosity that could wow viewers.
    🎯 Target total duration: ~30 seconds.
    🎬 Final output must be a valid JSON array.`;
  }
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    responseMimeType: "text/plain",
  };
  const model = "gemini-2.0-flash";

  //space facts promts
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Write a script to generate a 30-second vertical video on the topic: “Did you know?” space facts. The output should be a JSON array of 5 to 6 scenes. For each scene, include the following:

imagePrompt:
Provide a detailed, realistic-style image description for the scene that visually represents the space fact or concept. The image should be engaging, relevant, and visually intuitive.

Do not include any text in the image.

At the end of the description, clearly add this instruction: "Realistic style."

Do not use curly quotes (like ’) in the imagePrompt. Use only straight quotes (') or omit them if not needed.

contentText:
Provide the narration or dialogue for each scene.

Keep it engaging, informative, and hook-worthy, ideal for short-form video.

Aim for facts that are surprising, little-known, or awe-inspiring.

Avoid using curly quotes (like ’) in the contentText. Use straight apostrophes (') for contractions or omit if not required.

✅ In the final scene, end the contentText with a friendly call-to-action like: "Don't forget to like and subscribe!"

🪐 The topic must be based on a real astronomical fact, space phenomenon, or cosmic curiosity that could wow viewers.
🎯 Target total duration: ~30 seconds.
🎬 Final output must be a valid JSON array.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `[
  {
    "imagePrompt": "A view of deep space with a zoomed-in close-up of a supermassive black hole surrounded by a glowing accretion disk of swirling gas and light, bending the surrounding stars. Realistic style.",
    "contentText": "Did you know there's a black hole at the center of our galaxy that's over 4 million times more massive than the Sun?"
  },
  {
    "imagePrompt": "A detailed image of the Milky Way galaxy from the side, showing spiral arms, dust lanes, and a bright central bulge, with a label-free marker pointing to the center. Realistic style.",
    "contentText": "It's called Sagittarius A*, and it's sitting quietly 26,000 light-years from Earth."
  },
  {
    "imagePrompt": "A time-lapse view of a star getting pulled apart by a black hole, with light stretching and gas spiraling inwards, illustrating a process called spaghettification. Realistic style.",
    "contentText": "If you got too close, you'd be stretched into spaghetti by its gravity. Scientists literally call this 'spaghettification'."
  },
  {
    "imagePrompt": "An astronaut floating near a black hole with distant stars distorted and curved by gravitational lensing, showing how light bends near massive objects. Realistic style.",
    "contentText": "Black holes are so powerful, they can bend light and warp space itself—almost like time is slowing down near them."
  },
  {
    "imagePrompt": "A majestic star field showing a distant galaxy with another black hole colliding into it, sending out ripples symbolizing gravitational waves. Realistic style.",
    "contentText": "And when two black holes collide, they send out gravitational waves that ripple across the universe—waves we can now detect on Earth! Don't forget to like and subscribe for more amazing space facts!"
  }
]`,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `Write a script to generate a 30-second vertical video on the topic: “Did you know?” space facts. The output should be a JSON array of 5 to 6 scenes. For each scene, include the following:

imagePrompt:
Provide a detailed, realistic-style image description for the scene that visually represents the space fact or concept. The image should be engaging, relevant, and visually intuitive.

Do not include any text in the image.

At the end of the description, clearly add this instruction: "Realistic style."

Do not use curly quotes (like ’) in the imagePrompt. Use only straight quotes (') or omit them if not needed.

contentText:
Provide the narration or dialogue for each scene.

Keep it engaging, informative, and hook-worthy, ideal for short-form video.

Aim for facts that are surprising, little-known, or awe-inspiring.

Avoid using curly quotes (like ’) in the contentText. Use straight apostrophes (') for contractions or omit if not required.

✅ In the final scene, end the contentText with a friendly call-to-action like: "Don't forget to like and subscribe!"

🪐 The topic must be based on a real astronomical fact, space phenomenon, or cosmic curiosity that could wow viewers.
🎯 Target total duration: ~30 seconds.
🎬 Final output must be a valid JSON array.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `[
  {
    "imagePrompt": "A detailed view of Jupiter with its swirling cloud bands, storms, and the massive Great Red Spot dominating the planet's surface. Realistic style.",
    "contentText": "Did you know Jupiter's Great Red Spot is a storm that's been raging for over 350 years?"
  },
  {
    "imagePrompt": "A wide-angle space view showing Earth beside Jupiter to scale, emphasizing the sheer size difference between the two planets. Realistic style.",
    "contentText": "This massive storm is so big, it could fit three Earths inside it!"
  },
  {
    "imagePrompt": "An illustration of lightning storms on Jupiter, with bright flashes lighting up thick, multicolored clouds, showcasing the planet's violent weather. Realistic style.",
    "contentText": "And that's not all — Jupiter has lightning bolts that are more powerful than any ever recorded on Earth."
  },
  {
    "imagePrompt": "A probe flying close to Jupiter, capturing high-resolution clouds and magnetic field visuals, with deep shadows and sunlight reflections. Realistic style.",
    "contentText": "NASA's Juno spacecraft is orbiting Jupiter right now, giving us the closest look we've ever had."
  },
  {
    "imagePrompt": "A stunning composite image of Jupiter's magnetic field stretching out like giant loops around the planet, glowing against the blackness of space. Realistic style.",
    "contentText": "Jupiter also has the strongest magnetic field of any planet in our solar system—20,000 times stronger than Earth's! Don't forget to like and subscribe for more amazing space facts!"
  }
]
`,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: textPrompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  // console.log(JSON.parse(response.text))
  const content = [];
  for await (const chunk of response) {
    // console.log(chunk.text);
    content.push(chunk.text);
  }
  console.log("content", content);

  let text = Array.isArray(content) ? content.join("") : content;

  // Remove code block indicators like ``` or ```json
  text = text.replace(/```(?:json)?/g, "").trim();

  // Safely extract the JSON string between the first `[` and last `]`
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]") + 1;

  if (start === -1 || end === -1) {
    throw new Error("No JSON array found in the content.");
  }

  const jsonString = text.slice(start, end);
  // Parse the JSON
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON:", error.message);
    return null;
  }
  // }
}

// generate();

module.exports = generate;
