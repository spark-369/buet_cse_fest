import { getSchemaInfo } from "./schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSQLFromQuestion(question, llm) {
  try {
    const schema = await getSchemaInfo();
    const schemaText = schema
      .map((r) => `${r.table_name}.${r.column_name}`)
      .join("\n");

    const prompt = `
You are an expert SQL generator for PostgreSQL.
You are given database schema columns:
${schemaText}

Generate a PostgreSQL SQL query for the question below.
Return only the SQL query, no explanation or markdown formatting.

Question: ${question}
`;

    const model = genAI.getGenerativeModel({ model: llm || "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sql = response.text().trim();

    // Clean up the response - remove any markdown formatting
    const cleanSql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('Generated SQL:', cleanSql);
    return cleanSql;
  } catch (error) {
    console.error('Error generating SQL:', error);
    // Return a fallback query
    return "SELECT 'Error generating SQL' as error";
  }
}
