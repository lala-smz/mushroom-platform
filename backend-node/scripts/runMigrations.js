const { sequelize } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('=== 开始执行数据库迁移 ===');
    
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.js'));
    
    // 按文件名排序（按时间戳）
    files.sort();
    
    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      console.log(`\n执行迁移: ${file}`);
      
      try {
        const migration = require(migrationPath);
        
        // 检查是否已经执行过
        const migrationName = file.replace('.js', '');
        const executed = await sequelize.query(
          "SELECT * FROM SequelizeMeta WHERE name = ?",
          { replacements: [migrationName] }
        );
        
        if (executed[0].length > 0) {
          console.log(`  跳过（已执行）`);
          continue;
        }
        
        // 执行 up 方法
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        
        // 记录到 SequelizeMeta
        await sequelize.query(
          "INSERT INTO SequelizeMeta (name) VALUES (?)",
          { replacements: [migrationName] }
        );
        
        console.log(`  ✓ 执行成功`);
      } catch (error) {
        console.error(`  ✗ 执行失败: ${error.message}`);
        throw error;
      }
    }
    
    console.log('\n=== 迁移执行完成 ===');
    process.exit(0);
    
  } catch (error) {
    console.error('迁移执行失败:', error);
    process.exit(1);
  }
}

// 确保 SequelizeMeta 表存在
async function ensureMetaTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL PRIMARY KEY,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (error) {
    console.error('创建SequelizeMeta表失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  ensureMetaTable().then(runMigrations);
}