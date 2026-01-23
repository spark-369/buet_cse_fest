import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({
      status: 'error',
      database: 'disconnected'
    }, { status: 500 });
  }
}