import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateItinerary = async (destination: string, durationInDays: number, budget: number): Promise<string> => {
  if (!API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable to use this feature.";
  }
  
  const prompt = `
    Create a detailed, day-by-day travel itinerary for a trip to ${destination} for ${durationInDays} days.
    The budget is around ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(budget)} per person for activities and food.
    Please suggest a mix of popular attractions and local experiences.
    For each day, provide:
    1. A theme for the day (e.g., "Historical Exploration", "Culinary Adventure").
    2. Morning, Afternoon, and Evening activities.
    3. Suggestions for budget-friendly meals (breakfast, lunch, dinner).
    4. Estimated costs in INR for activities where applicable.
    
    Format the response as clear, readable text. Use headings for each day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return "Sorry, I couldn't generate an itinerary at the moment. Please check the console for more details.";
  }
};


export interface BudgetPrediction {
  predictedBudgetPerPerson: number;
  breakdown: string;
  currency: 'INR';
}

export const predictExpense = async (destination: string, durationInDays: number, numberOfPeople: number): Promise<BudgetPrediction> => {
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }

    const prompt = `Based on recent travel data, predict the per-person budget for a trip to ${destination} for ${durationInDays} days for ${numberOfPeople} people. This should be a mid-range budget.
Provide a brief breakdown explaining the estimate (e.g., accommodation, food, local travel, activities).
The currency must be in Indian Rupees (INR).
Return the response ONLY as a valid JSON object with the following structure:
{
  "predictedBudgetPerPerson": number,
  "breakdown": string,
  "currency": "INR"
}
Do not include any other text or markdown formatting outside of the JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const cleanedText = response.text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedText) as BudgetPrediction;
    } catch (error) {
        console.error("Error predicting expense:", error);
        throw new Error("Sorry, I couldn't predict the budget at the moment. The model may have returned an invalid format.");
    }
};
