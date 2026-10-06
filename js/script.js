const form = document.getElementById("formMahasiswa");
const tabel = document.getElementById("tabelMahasiswa");
const search = document.getElementById("search");

let mahasiswa = [];

//Menampilkan data
function tampilkanData(data = mahasiswa) {
    tabel.innerHTML = "";
    
    data.forEach((mahasiswa, index) => {

        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${mahasiswa.nim}</td>
            <td>${mahasiswa.nama}</td>
            <td>${mahasiswa.jurusan}</td>
            <td>${mahasiswa.semester}</td>
            <td>${mahasiswa.email}</td>
            <td>${mahasiswa.noHp}</td>
            
            <td>
            <button class="btn-edit" onclick="editData(${mahasiswa.id})">Edit</button>
            <button class="btn-delete" onclick="hapusData(${mahasiswa.id})">Hapus</button>
            </td>
        `;
        tabel.appendChild(row);
    });
}

//Tambah data
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const dataBaru = {
        nim: document.getElementById("nim").value,
        nama: document.getElementById("nama").value,
        jurusan: document.getElementById("jurusan").value,
        semester: document.getElementById("semester").value,
        email: document.getElementById("email").value,
        noHp: document.getElementById("noHp").value,
    };
    try {
        let response;
        //jika sedang edit
        if (window.idEdit) {
            response = await fetch(`/api/mahasiswa/${window.idEdit}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataBaru)
            });
        }else {
            //jika menambah data baru
            response = await fetch("/api/mahasiswa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataBaru)
            });
        }
        const hasil = await response.json();
        if (response.ok) {
            alert(hasil.message);
            form.reset();
            window.idEdit = null;
            ambilDataMahasiswa();
        }else {
            alert("hasil.message");
        }
        }catch (error) {
        console.error("Error", error);
        alert("Terjadi kesalahan pada server")
    };
});

//Ambil data
async function ambilDataMahasiswa() {
    try {
        const response = await fetch("/api/mahasiswa");
        const data = await response.json();

        mahasiswa = data
        tampilkanData(mahasiswa);
    }catch (error) {
        console.error("Error", error)
    }
};

//Hapus data
async function hapusData(id) {
    const mhs = mahasiswa.find(function(data) {
        return data.id === id;
    });
    if (!mhs) {
        alert("Data mahasiswa tidk ditemukan");
        return;
    }
    if (confirm(`Apakah yakin ingin menghapus ${mhs.nama}?`)) {

        try {
            const response = await fetch(`/api/mahasiswa/${mhs.id}`, {
                method: "DELETE"
            });

            const hasil = await response.json();

            if (response.ok) {
                alert(hasil.message)

                //ambil ulang data dari backend
                ambilDataMahasiswa();
            }else {
                alert(hasil.message);
            }
        }catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan pada server")
        };
    };
};
// Edit data
function editData(id) {
    const mhs = mahasiswa.find(function(data) {
        return data.id === id;
    });
    if (!mhs) {
        alert("Data mahasiswa tidak ditemukan");
        return;
    }
    
    document.getElementById("nim").value = mhs.nim;
    document.getElementById("nama").value = mhs.nama;
    document.getElementById("jurusan").value = mhs.jurusan;
    document.getElementById("semester").value = mhs.semester;
    document.getElementById("email").value = mhs.email;
    document.getElementById("noHp").value = mhs.noHp;

    //simpan id mahasiswa yang sedang diedit
    window.idEdit = mhs.id;
};

//Search
search.addEventListener("input", function() {
    const keyword = search.value.toLowerCase();
    const hasil = mahasiswa.filter(function(mhs) {
        return (
            mhs.nim.toLowerCase().includes(keyword)||
            mhs.nama.toLowerCase().includes(keyword)||
            mhs.jurusan.toLowerCase().includes(keyword)
        );
    });
    tampilkanData(hasil);
});

// Jalankan saat halaman dibuka
tampilkanData();
ambilDataMahasiswa();