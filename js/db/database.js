/**
 * database.js - Wrapper SQLite WebAssembly qua sql.js
 * Hỗ trợ nạp trực tiếp từ file sqlite/vietjet.db và lưu bền vững vào LocalStorage
 */
import { SCHEMA_SQL } from './schema.js';
import { SEED_SQL } from './seed.js';

const DB_STORAGE_KEY = 'vietjet_sqlite_db_v1';

class VietjetDatabase {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.initPromise = null;
    }

    async init() {
        if (this.db) return this.db;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            // 1. Tải thư viện sql.js từ WebAssembly CDN
            if (typeof window.initSqlJs !== 'function') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js');
            }

            this.SQL = await window.initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // 2. Kiểm tra dữ liệu đã lưu trong localStorage (để bảo toàn giỏ hàng, đơn hàng)
            const savedDb = localStorage.getItem(DB_STORAGE_KEY);
            if (savedDb) {
                try {
                    const binaryString = atob(savedDb);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    this.db = new this.SQL.Database(bytes);
                    console.log('✅ Khôi phục SQLite Database từ LocalStorage thành công');
                    return this.db;
                } catch (err) {
                    console.warn('⚠️ Lỗi giải mã DB từ LocalStorage, thử tải từ file sqlite/vietjet.db:', err);
                }
            }

            // 3. Nếu chưa có trong LocalStorage, nạp trực tiếp từ file sqlite/vietjet.db
            try {
                // Xác định đường dẫn tương đối tới sqlite/vietjet.db tùy theo trang đang đứng
                const dbPath = this.getDbFilePath();
                const response = await fetch(dbPath);
                if (response.ok) {
                    const buffer = await response.arrayBuffer();
                    if (buffer.byteLength > 0) {
                        this.db = new this.SQL.Database(new Uint8Array(buffer));
                        this.save();
                        console.log(`✅ Nạp trực tiếp thành công SQLite Database từ file: ${dbPath} (${buffer.byteLength} bytes)`);
                        return this.db;
                    }
                }
            } catch (err) {
                console.warn('⚠️ Không thể nạp qua fetch (có thể do xem qua file:///), chuyển sang nạp Schema & Seed Data dự phòng:', err);
            }

            // 4. Dự phòng nếu không fetch được file: Tạo mới trong RAM và chạy Schema + Seed
            this.db = new this.SQL.Database();
            this.db.run(SCHEMA_SQL);
            this.db.run(SEED_SQL);
            this.save();
            console.log('✅ Khởi tạo SQLite Database & nạp Seed Data mới thành công');
            return this.db;
        })();

        return this.initPromise;
    }

    getDbFilePath() {
        // Tự động điều chỉnh đường dẫn file sqlite/vietjet.db
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/')) {
            return '../../sqlite/vietjet.db';
        }
        return 'sqlite/vietjet.db';
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Không thể tải script ${src}`));
            document.head.appendChild(script);
        });
    }

    save() {
        if (!this.db) return;
        try {
            const data = this.db.export();
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < data.length; i += chunkSize) {
                binary += String.fromCharCode.apply(null, data.subarray(i, i + chunkSize));
            }
            localStorage.setItem(DB_STORAGE_KEY, btoa(binary));
        } catch (e) {
            console.error('Không thể lưu Database vào LocalStorage:', e);
        }
    }

    query(sql, params = []) {
        if (!this.db) throw new Error('Database chưa được khởi tạo!');
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    queryOne(sql, params = []) {
        const results = this.query(sql, params);
        return results.length > 0 ? results[0] : null;
    }

    execute(sql, params = []) {
        if (!this.db) throw new Error('Database chưa được khởi tạo!');
        this.db.run(sql, params);
        this.save();
        return true;
    }

    resetDatabase() {
        localStorage.removeItem(DB_STORAGE_KEY);
        this.db = null;
        this.initPromise = null;
        return this.init();
    }

    exportDatabaseFile(filename = 'vietjet.db') {
        if (!this.db) throw new Error('Database chưa được khởi tạo!');
        const data = this.db.export();
        const blob = new Blob([data], { type: 'application/x-sqlite3' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importDatabaseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const bytes = new Uint8Array(reader.result);
                    this.db = new this.SQL.Database(bytes);
                    this.save();
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
}

export const dbInstance = new VietjetDatabase();
