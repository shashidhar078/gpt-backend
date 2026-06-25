import "dotenv/config";

const getGroqAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "qwen/qwen3.6-27b",  // Latest recommended model (replaces deprecated llama-3.1-70b-versatile)
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();
        
        // Check if API returned an error
        if (!response.ok || data.error) {
            console.error("Groq API Error:", data.error?.message || "Unknown error");
            throw new Error(data.error?.message || "Groq API failed");
        }
        
        // Check if response has expected structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Invalid response structure:", data);
            throw new Error("Invalid Groq response structure");
        }
        
        let content = data.choices[0].message.content;
        
        // Remove <think> tags if present (some models include thinking process)
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        return content;
    } catch(err) {
        console.error("Error in getGroqAPIResponse:", err.message);
        throw err;
    }
}

export default getGroqAPIResponse;