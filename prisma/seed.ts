import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cerberus.dev' },
    update: {},
    create: {
      email: 'demo@cerberus.dev',
      passwordHash,
      name: 'Demo User',
      role: 'admin',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample events
  const eventTypes = [
    { type: 'security_alert', level: 'critical', message: 'Failed login attempt detected from unknown IP' },
    { type: 'system_status', level: 'info', message: 'System health check completed successfully' },
    { type: 'user_action', level: 'info', message: 'User profile updated' },
    { type: 'api_call', level: 'warning', message: 'Rate limit threshold reached' },
    { type: 'security_alert', level: 'error', message: 'Suspicious activity detected in session' },
    { type: 'system_status', level: 'info', message: 'Database backup completed' },
    { type: 'api_call', level: 'info', message: 'API endpoint /status called' },
    { type: 'user_action', level: 'info', message: 'New user registration' },
  ];

  for (const event of eventTypes) {
    await prisma.event.create({
      data: {
        ...event,
        source: '192.168.1.' + Math.floor(Math.random() * 255),
        metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0',
          sessionId: Math.random().toString(36).substring(7),
        }),
        userId: demoUser.id,
      },
    });
  }

  console.log(`✅ Created ${eventTypes.length} sample events`);
  console.log('\n🎉 Seeding completed!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@cerberus.dev');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
