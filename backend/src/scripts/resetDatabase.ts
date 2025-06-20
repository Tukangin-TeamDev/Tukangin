/**
 * Script untuk mereset database development
 * Gunakan dengan hati-hati, hanya untuk keperluan development
 *
 * Menjalankan: ts-node src/scripts/resetDatabase.ts
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask confirmation
function confirm(question: string): Promise<boolean> {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function resetDatabase() {
  console.log('⚠️ WARNING: This will delete all data in your development database!');

  // Get confirmation from user
  const confirmed = await confirm('Are you sure you want to proceed? (y/N): ');

  if (!confirmed) {
    console.log('❌ Operation cancelled');
    rl.close();
    return;
  }

  try {
    const prisma = new PrismaClient();

    console.log('🔄 Starting database reset...');

    // Drop all tables
    console.log('🗑️ Dropping all tables...');
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE`);
    await prisma.$executeRawUnsafe(`CREATE SCHEMA public`);

    // Apply migrations
    console.log('🔄 Applying migrations...');
    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Generate Prisma client
    console.log('🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('✅ Database reset successful!');

    // Disconnect from database
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }

  rl.close();
}

resetDatabase();
