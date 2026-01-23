import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { generateSQLFromQuestion } from "@/lib/llm";
import { isExternalQuestion } from "@/lib/external";

const prisma = new PrismaClient();

export async function POST(req) {
  const { question, llm } = await req.json();

  // External-only questions
  if (isExternalQuestion(question)) {
    const externalResponse = await handleExternalQuestion(question);
    return NextResponse.json(externalResponse);
  }

  // 1) Generate SQL via Gemini
  const sql = await generateSQLFromQuestion(question, llm);

  console.log(sql);

  // 2) Execute SQL
  const rows = await prisma.$queryRawUnsafe(sql);

  // 3) Determine result_type
  let resultType = "table";
  if (rows.length === 1 && Object.keys(rows[0]).length === 1) {
    resultType = "scalar";
  } else if (rows.length === 1) {
    resultType = "record";
  }

  const response = {
    question,
    llm,
    result_type: resultType,
    columns: rows.length ? Object.keys(rows[0]) : [],
    rows: rows.map((r) => Object.values(r)),
    meta: { row_count: rows.length, source: "database" },
  };

  return NextResponse.json(response);
}
