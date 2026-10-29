import 'dotenv/config';
import prisma from './lib/prisma.js';
try {
    await prisma.$connect();
    console.log('✅ GradeLens AI database connected successfully!');
    const result = await prisma.$queryRaw `SELECT current_database() AS database`;
    console.log('Database:', result);
}
catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exitCode = 1;
}
finally {
    await prisma.$disconnect();
}
//# sourceMappingURL=test-db.js.map