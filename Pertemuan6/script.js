// File: script.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Tangkap Elemen DOM
    const btnFetch = document.querySelector("#btnFetch");
    const statusMessage = document.querySelector("#statusMessage");
    const userList = document.querySelector("#userList");
    const searchBox = document.querySelector("#searchBox");
    const searchInput = document.querySelector("#searchInput");

    let allUsers = []; // Menyimpan data master untuk fitur pencarian

    // Helper: Menampilkan Skeleton Loading Animation
    const showSkeletonLoading = () => {
        userList.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement("div");
            skeleton.className = "skeleton-card";
            skeleton.innerHTML = `
                <div class="skeleton-avatar"></div>
                <div class="skeleton-text-group">
                    <div class="skeleton-line" style="width: 60%;"></div>
                    <div class="skeleton-line" style="width: 80%;"></div>
                    <div class="skeleton-line" style="width: 40%;"></div>
                </div>
            `;
            userList.appendChild(skeleton);
        }
    };

    // Helper: Inisial Avatar (Dua Huruf Depan)
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('');
    };

    // 2. Fungsi Asinkronus Mengambil Data Pengguna dari API
    const fetchUsers = async () => {
        // UI Preparation
        btnFetch.disabled = true;
        statusMessage.className = "status-msg";
        statusMessage.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sedang menghubungkan ke server API...</span>`;
        
        showSkeletonLoading();

        try {
            // Request HTTP
            const response = await fetch("https://jsonplaceholder.typicode.com/users");

            if (!response.ok) {
                throw new Error(`Gagal mengambil data! Status HTTP: ${response.status}`);
            }

            allUsers = await response.json();

            // Berhasil
            statusMessage.className = "status-msg success";
            statusMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Berhasil memuat ${allUsers.length} data pengguna!</span>`;
            
            searchBox.classList.remove("hidden"); // Tampilkan kolom cari
            renderUsers(allUsers);

        } catch (error) {
            // Tangani Error
            statusMessage.className = "status-msg error";
            statusMessage.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Gagal memuat data: ${error.message}</span>`;
            userList.innerHTML = "";
        } finally {
            btnFetch.disabled = false;
        }
    };

    // 3. Fungsi Render Kartu Pengguna ke DOM
    const renderUsers = (users) => {
        userList.innerHTML = "";

        if (users.length === 0) {
            userList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #7A6060; padding: 20px;">Data pengguna tidak ditemukan.</p>`;
            return;
        }

        users.forEach((user, index) => {
            const card = document.createElement("div");
            card.className = "user-card";
            card.style.animationDelay = `${index * 0.05}s`; // Staggered Animation
            
            card.innerHTML = `
                <div class="user-avatar">${getInitials(user.name)}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">
                        <i class="fa-regular fa-envelope"></i> ${user.email}
                    </div>
                    <div class="user-company">
                        <i class="fa-regular fa-building"></i> ${user.company.name}
                    </div>
                </div>
            `;
            userList.appendChild(card);
        });
    };

    // 4. Fitur Tambahan: Live Filter / Search
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.company.name.toLowerCase().includes(query)
        );
        renderUsers(filteredUsers);
    });

    // 5. Event Listener Tombol Utama
    btnFetch.addEventListener("click", fetchUsers);
});