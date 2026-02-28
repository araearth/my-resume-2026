// ฟังก์ชันสำหรับสลับภาษา EN/TH
function toggleLanguage() {
    // เมื่อกดปุ่ม ถ้ามี class thai-active ให้ลบออก ถ้าไม่มีให้เพิ่ม
    const isThai = document.body.classList.toggle('thai-active');
    const toggleBtn = document.getElementById('langToggleBtn');

    // ถ้าเปิดภาษาไทยอยู่ ให้ซ่อนภาษาอังกฤษ และปุ่มแสดงข้อความ EN เพื่อสลับกลับ
    if(isThai) {
        document.querySelectorAll('.lang-en').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.lang-th').forEach(el => el.classList.remove('hidden'));
        toggleBtn.innerText = 'EN';
    } else {
        // ถ้าเป็นภาษาอังกฤษ (Default) ให้ซ่อนภาษาไทย
        document.querySelectorAll('.lang-en').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.lang-th').forEach(el => el.classList.add('hidden'));
        toggleBtn.innerText = 'TH';
    }
}

// ฟังก์ชันเปิด/ปิด Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const menuIcon = document.getElementById('menuIcon');
    
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('active');

    // หมุนรูปภาพ menus.png เพื่อแสดงสถานะเปิด/ปิดเมนู
    if(sidebar.classList.contains('active')) {
        menuIcon.style.transform = 'rotate(90deg)';
    } else {
        menuIcon.style.transform = 'rotate(0deg)';
    }
}

// ฟังก์ชันเปิด/ปิด Sub Menu
function toggleSubmenu(event, menuId) {
    event.preventDefault();
    const submenu = document.getElementById(menuId);
    const parentLink = event.currentTarget;
    
    submenu.classList.toggle('show');
    parentLink.classList.toggle('open');
}

// ทำให้เมนูกดแล้วเลื่อนมา "ตรงกลางจอ" พอดี (รวมถึงเมนูย่อย)
document.querySelectorAll('.menu-link, .sub-menu a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            // ป้องกันการ scroll ถ้ากดตรงปุ่มที่เป็นตัวเปิดเมนูย่อย (ให้มันเปิด/ปิดอย่างเดียว)
            if (this.classList.contains('has-submenu')) {
                return;
            }

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            }
        }
    });
});

// ระบบตรวจจับการ Scroll เพื่อเพิ่ม/ลดคลาส .section-focus และเปลี่ยนกรอบขาว Active Menu
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-container');
    const menuLinks = document.querySelectorAll('.menu-link'); // ดึงเมนูหลักทั้งหมดมาเพื่อเปลี่ยนกรอบขาว
    
    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -25% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ใส่เอฟเฟคให้ตัว Section
                entry.target.classList.add('section-focus');
                
                // อัพเดทแถบสีขาวบนเมนู (Active state)
                const activeId = entry.target.getAttribute('id');
                menuLinks.forEach(link => {
                    link.classList.remove('active');
                    // ถ้าลิงก์ไหนมี href ตรงกับ id ของ Section ที่เห็น ให้ใส่คลาส active
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });

            } else {
                entry.target.classList.remove('section-focus');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// ฟังก์ชันสำหรับควบคุม Modal (เพิ่มการรับค่า 2 ภาษา)
function openModal(imgSrcs, descEn, descTh) {
    const modal = document.getElementById('certModal');
    const imgContainer = document.getElementById('modalImgContainer');
    const modalDescEn = document.getElementById('modalDescEn');
    const modalDescTh = document.getElementById('modalDescTh');

    // ล้างรูปภาพเก่าใน Container ออกก่อน
    imgContainer.innerHTML = '';

    // เช็คว่าส่งมาเป็น Array หรือไม่ ถ้าไม่ใช่ให้แปลงเป็น Array เพื่อให้รองรับการทำงานเหมือนกัน
    const images = Array.isArray(imgSrcs) ? imgSrcs : [imgSrcs];

    // วนลูปสร้างแท็ก <img> ใส่เข้าไปใน Container ตามจำนวนรูป
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Portfolio Image';
        // เผื่อรูปหาไม่เจอ
        img.onerror = function() { 
            this.src = '[https://via.placeholder.com/800x600?text=Image+Not+Found](https://via.placeholder.com/800x600?text=Image+Not+Found)'; 
        };
        imgContainer.appendChild(img);
    });

    // กำหนดข้อความรายละเอียดตามภาษา
    modalDescEn.innerText = descEn;
    modalDescTh.innerText = descTh;

    // แสดงผล Modal
    modal.classList.add('show');
    
    // ปิดการ scroll พื้นหลังชั่วคราวขณะดู Modal
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('show');
    
    // เปิดการ scroll คืน
    document.body.style.overflow = 'auto';
}

// ถ้าผู้ใช้คลิกที่พื้นที่สีดำ (นอกกรอบสีขาว) ให้ปิด Modal ทันที
window.onclick = function(event) {
    const modal = document.getElementById('certModal');
    if (event.target == modal) {
        closeModal();
    }
}

// ทำให้เมนูเปิดเป็นค่าเริ่มต้นเฉพาะในหน้าจอคอมพิวเตอร์
window.onload = function() {
    if (window.innerWidth > 768) {
        toggleSidebar();
    }
};
