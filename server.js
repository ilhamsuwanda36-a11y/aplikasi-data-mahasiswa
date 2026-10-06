const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = 3000;
//koneksi mysql
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ilham2008",
    database: "aplikasi_mahasiswa"
});
db.connect((err) => {
    if (err) {
        console.error("Koneksi MySQL gagal:", err)
        return;
    }
    console.log("MySQL berhasil terhubung!");
});

//Membaca data JSON dari request
app.use(express.json());

//Menyediakan file CSS,  JavaScript, dan file frontend lainnya
app.use(express.static(__dirname));

let mahasiswa = [
    {
        id: 1,
        nim: "1609080987",
        nama: "Rimuru",
        jurusan: "Teknik Informatika",
        semester: 3,
        email: "Rimuru34@gmail.com",
        noHp: "08226463"
    },
    {
        id: 2,
        nim: "1674568654",
        nama: "Rudeus",
        jurusan: "Teknik Informatika",
        semester: 3,
        email:"Rudeus34@gmail.com",
        noHp: "082277663445"
    },
];

//Halaman Utama
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Api GET
app.get("/api/mahasiswa", (req, res) => {
    const sql = "SELECT * FROM mahasiswa";
    db.query(sql,(err, hasil) => {
        if (err) {
            console.error("Gagal mengambil data", err);

            return res.status(500).json ({
                message: "Gagal mengambil data mahasiswa"
            });
        }
        res.json(hasil);
    });
});

//Api POST
app.post("/api/mahasiswa", (req, res) => {
    const sql =  `
        INSERT INTO mahasiswa
        (nim, nama, jurusan, semester, email, noHp)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const values = [
        req.body.nim,
        req.body.nama,
        req.body.jurusan,
        req.body.semester,
        req.body.email,
        req.body.noHp
        ];
    db.query(sql, values, (err, hasil) => {
        if (err) {
            console.error("Gagal menambahkan data:", err);

            return res.status(500).json({
                message: "Gagal menambahkan data mahasiswa"
            });
        }
        res.status(201).json({
            message: "Data mahasiswa berhasil ditambahkan",
            data: {
            id: hasil.insertId,
            ...req.body
            }
        })
    });
});

//PUT
app.put("/api/mahasiswa/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        UPDATE mahasiswa
        SET nim= ?,
            nama= ?,
            jurusan= ?,
            semester= ?,
            email= ?,
            noHp= ?
        WHERE id = ?
    `;

    const values = [
        req.body.nim,
        req.body.nama,
        req.body.jurusan,
        req.body.semester,
        req.body.email,
        req.body.noHp,
        id
    ];
    db.query(sql, values, (err, hasil) => {
        if (err) {
            console.error("Gagal mengubah data:", err);
            return res.status(500).json({
                message: "Data mahasiswa tidak ditemukan"
            });
        }
        if (hasil.affectedRows === 0) {
            return res.status(404).json({
                message: "Data mahasiswa tidak ditemukan"
            });
        }
        res.json({
            message: "Data mahasiswa berhasil diubah"
        });
    });
});

//DELETE
app.delete("/api/mahasiswa/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM mahasiswa WHERE id = ?";
    
    db.query(sql, [id], (err, hasil) => {
        console.log("Hasil DELETE:", hasil);

        if (err) {
            console.error("Gagal menghapus data:", err);

            return res.status(500).json({
                message: "Gagal menghapus data mahasiswa"
            });
        }
        if (hasil.affectedRows === 0) {
            return res.status(404).json({
                message: "Data mahasiswa tidak ditemukan"
            });
        }
        res.json({
            message:"Data mahasiswa berhasil dihapus"
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di  http://localhost:${PORT}`);
});