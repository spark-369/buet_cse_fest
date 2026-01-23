export function isExternalQuestion(question) {
  const q = question.toLowerCase();
  return (
    q.includes("conversion rate") ||
    q.includes("latitude") ||
    q.includes("convert")
  );
}

export async function handleExternalQuestion(question) {
  // Example for currency conversion
  if (question.toLowerCase().includes("conversion rate")) {
    return {
      question,
      llm: "external",
      result_type: "scalar",
      columns: ["rate"],
      rows: [[0.92]],
      meta: { row_count: 1, source: "external" },
    };
  }

  // Add other external endpoints similarly
}
