
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import readline from 'readline';

const execAsync = promisify(exec);

async function restoreDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // List available backups
    const backupDir = 'backups';
    if (!fs.existsSync(backupDir)) {
      console.log('No backups directory found');
      process.exit(1);
    }

    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      console.log('No backup files found');
      process.exit(1);
    }

    console.log('Available backups:');
    backupFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('Select backup file number (or press Enter for latest): ', resolve);
    });
    rl.close();

    const selectedFile = answer.trim() === '' ? backupFiles[0] : backupFiles[parseInt(answer) - 1];
    
    if (!selectedFile) {
      console.log('Invalid selection');
      process.exit(1);
    }

    const backupPath = `${backupDir}/${selectedFile}`;
    
    console.log(`⚠️  WARNING: This will replace all data in your database!`);
    console.log(`Restoring from: ${selectedFile}`);
    
    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const confirm = await new Promise(resolve => {
      rl2.question('Type "YES" to confirm: ', resolve);
    });
    rl2.close();

    if (confirm !== 'YES') {
      console.log('Restore cancelled');
      process.exit(0);
    }

    console.log('Starting database restore...');
    
    // Use psql to restore backup
    const { stdout, stderr } = await execAsync(`psql "${databaseUrl}" < ${backupPath}`);
    
    if (stderr) {
      console.error('Restore stderr:', stderr);
    }
    
    console.log('✅ Database restore completed');
    
  } catch (error) {
    console.error('Restore failed:', error);
    process.exit(1);
  }
}

restoreDatabase();
