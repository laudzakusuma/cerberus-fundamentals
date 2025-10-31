#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if Cerberus is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️  Cerberus Setup Verification\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function check(name, condition, errorMsg, isWarning = false) {
  if (condition) {
    console.log(`✅ ${name}`);
    checks.passed++;
  } else {
    if (isWarning) {
      console.log(`⚠️  ${name}: ${errorMsg}`);
      checks.warnings++;
    } else {
      console.log(`❌ ${name}: ${errorMsg}`);
      checks.failed++;
    }
  }
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
check(
  'Node.js version',
  majorVersion >= 18,
  `Node.js 18+ required, found ${nodeVersion}`
);

// Check if node_modules exists
check(
  'Dependencies installed',
  fs.existsSync('node_modules'),
  'Run: npm install'
);

// Check if .env exists
check(
  'Environment file',
  fs.existsSync('.env'),
  'Copy .env.example to .env',
  true
);

// Check if database exists
check(
  'Database initialized',
  fs.existsSync('prisma/dev.db'),
  'Run: npm run seed',
  true
);

// Check if Prisma client is generated
check(
  'Prisma client',
  fs.existsSync('node_modules/.prisma'),
  'Run: npm run seed',
  true
);

// Check critical files
const criticalFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'prisma/schema.prisma',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/styles/design-tokens.ts',
];

criticalFiles.forEach((file) => {
  check(
    `File: ${file}`,
    fs.existsSync(file),
    'File missing - project may be corrupted'
  );
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${checks.passed}`);
if (checks.warnings > 0) {
  console.log(`⚠️  Warnings: ${checks.warnings}`);
}
if (checks.failed > 0) {
  console.log(`❌ Failed: ${checks.failed}`);
}
console.log('='.repeat(50) + '\n');

if (checks.failed === 0) {
  console.log('🎉 Setup looks good! Run: npm run dev\n');
  
  if (checks.warnings > 0) {
    console.log('💡 Tip: Address warnings above for best experience\n');
  }
  
  console.log('Demo Login:');
  console.log('  Email: demo@cerberus.dev');
  console.log('  Password: demo123\n');
  
  process.exit(0);
} else {
  console.log('⚠️  Please fix the errors above before running\n');
  process.exit(1);
}
