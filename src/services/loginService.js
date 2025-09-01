import database from '../repository/mysql.js';

async function login(email, password) {
    const sql = "SELECT * FROM tbl_usuario WHERE email = ? AND senha = ? AND deletado = 0";

    const loginData = [email, password];

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, loginData);
    conn.end();
    return rows;
}

async function checkEmail(email) {
    const sql = "SELECT * FROM tbl_usuario WHERE email = ?";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, email);
    conn.end();
    return rows;
}

async function changePassword(email, newPassword) {
    const sql = "UPDATE tbl_usuario set senha = ? WHERE email = ?";

    const dataNewPass = [newPassword, email];

    const conn = await database.connectDB();
    await conn.query(sql, dataNewPass);
    conn.end();
}

export default {login, checkEmail, changePassword};