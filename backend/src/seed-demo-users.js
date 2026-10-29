import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Role } from './generated/prisma/client.js';
import prisma from './lib/prisma.js';
function getRequiredEnv(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`${name} is missing from backend/.env`);
    }
    return value;
}
async function upsertDemoUser(name, email, password, role) {
    if (password.length < 12 || password.length > 72) {
        throw new Error(`${role} demo password must be 12–72 characters`);
    }
    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.upsert({
        where: { email },
        update: { name, passwordHash, role },
        create: { name, email, passwordHash, role },
        select: { id: true, name: true, email: true, role: true },
    });
}
async function main() {
    const admin = await upsertDemoUser('Demo Admin', getRequiredEnv('DEMO_ADMIN_EMAIL').toLowerCase(), getRequiredEnv('DEMO_ADMIN_PASSWORD'), Role.ADMIN);
    const teacher = await upsertDemoUser('Demo Teacher', getRequiredEnv('DEMO_TEACHER_EMAIL').toLowerCase(), getRequiredEnv('DEMO_TEACHER_PASSWORD'), Role.TEACHER);
    console.log('Demo users provisioned successfully:');
    console.log(admin);
    console.log(teacher);
}
main()
    .catch((error) => {
    console.error('Demo user seeding failed:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-demo-users.js.map