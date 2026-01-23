import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSchemaInfo() {
  try {
    // Query for all tables and their columns
    const schemaQuery = `
      SELECT
        t.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default
      FROM information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name, c.ordinal_position;
    `;

    const rows = await prisma.$queryRawUnsafe(schemaQuery);

    return rows.map(row => ({
      table_name: row.table_name,
      column_name: row.column_name,
      data_type: row.data_type,
      is_nullable: row.is_nullable,
      column_default: row.column_default
    }));
  } catch (error) {
    console.error('Error fetching schema info:', error);
    return [];
  }
}
