const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Fungsi untuk menjalankan command dan menangkap output
function runCommand(command, cwd = process.cwd()) {
  try {
    return execSync(command, { cwd, encoding: 'utf8' });
  } catch (error) {
    return error.output.join('\n');
  }
}

console.log(chalk.blue('🔍 Memulai pengecekan error pada proyek...\n'));

// 1. Memeriksa package.json dan dependensi
console.log(chalk.yellow('📦 Memeriksa package.json dan dependensi...'));
if (fs.existsSync('package.json')) {
  console.log('Menjalankan npm audit...');
  console.log(runCommand('npm audit'));
} else {
  console.log(chalk.red('❌ package.json tidak ditemukan!'));
}

// 2. Memeriksa TypeScript errors (jika ada)
console.log(chalk.yellow('\n🔍 Memeriksa TypeScript errors...'));
if (fs.existsSync('tsconfig.json')) {
  console.log(runCommand('npx tsc --noEmit'));
} else {
  console.log(chalk.gray('TypeScript tidak dikonfigurasi dalam proyek ini.'));
}

// 3. Memeriksa ESLint errors (jika ada)
console.log(chalk.yellow('\n🔍 Memeriksa ESLint errors...'));
if (fs.existsSync('.eslintrc.js') || fs.existsSync('.eslintrc.json')) {
  console.log(runCommand('npx eslint . --ext .js,.jsx,.ts,.tsx'));
} else {
  console.log(chalk.gray('ESLint tidak dikonfigurasi dalam proyek ini.'));
}

// 4. Memeriksa Frontend
if (fs.existsSync('frontend')) {
  console.log(chalk.yellow('\n🌐 Memeriksa Frontend...'));
  console.log(runCommand('npm run build', './frontend'));
}

// 5. Memeriksa Backend
if (fs.existsSync('backend')) {
  console.log(chalk.yellow('\n⚙️ Memeriksa Backend...'));
  console.log(runCommand('npm run build', './backend'));
}

console.log(chalk.green('\n✅ Pengecekan selesai!'));
