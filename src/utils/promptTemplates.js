export const recipePrompt = (query) => `
You are a cooking assistant. Please provide a detailed recipe with the following structure:
{
  "title": "Recipe Name",
  "prepTime": "preparation time",
  "cookTime": "cooking time",
  "servings": number,
  "ingredients": [
    { "amount": number, "unit": "unit", "name": "ingredient name" }
  ],
  "steps": [
    { 
      "instruction": "step instruction",
      "timer": optional_time_in_seconds
    }
  ]
}

Recipe request: ${query}
`;

export const techniquePrompt = (query) => `
You are a cooking expert. Please explain the following cooking technique:
{
  "name": "Technique Name",
  "description": "Brief description",
  "steps": ["step 1", "step 2", ...],
  "mistakes": ["common mistake 1", "common mistake 2", ...],
  "tips": ["pro tip 1", "pro tip 2", ...]
}

Technique: ${query}
`;
