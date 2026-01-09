const telegramUsername = "YourActualID"; // Change this
const exchangeRate = 128;
const ADMIN_PASSWORD = "owner123";

let cart = [];
let currentCategory = 'all';
let searchQuery = "";

const products = [
    { id: 1, usdPrice: 400, i18nKey: "p1", category: "phones", img: "images/phone.jpg" },
    { id: 2, usdPrice: 900, i18nKey: "p2", category: "laptops", img: "laptop.jpg" }
];

const translations = {
    en: { title: "Modern Electronics", cart: "Cart", addToCart: "Add to Cart", searchPlaceholder: "Search...", catAll: "All", catPhones: "Phones", catLaptops: "Laptops", orderTitle: "Order Details", namePlaceholder: "Your Name", locPlaceholder: "Location", sendOrderTelegram: "Send via Telegram", p1: "Smartphone X", p2: "Laptop Pro", supportLabel: "Chat with us", share: "Share", receiptTitle: "Order Receipt", total: "Total", orderMsg: "Order from [NAME]:\n[ITEMS]\nTo: [LOC]" },
    am: { title: "ዘመናዊ ኤሌክትሮኒክስ", cart: "ጋሪ", addToCart: "ወደ ጋሪ ጨምር", searchPlaceholder: "ፈልግ...", catAll: "ሁሉም", catPhones: "ስልኮች", catLaptops: "ላፕቶፖች", orderTitle: "የትዕዛዝ መረጃ", namePlaceholder: "ስምዎ", locPlaceholder: "አድራሻ", sendOrderTelegram: "በትዕዛዝዎ በቴሌግራም ይላኩ", p1: "ስማርት ስልክ X", p2: "ላፕቶፕ ፕሮ", supportLabel: "ያነጋግሩን", share: "ያጋሩ", receiptTitle: "ደረሰኝ", total: "ጠቅላላ", orderMsg: "ትዕዛዝ ከ [NAME]:\n[ITEMS]\nአድራሻ: [LOC]" }
};

function changeLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.body.className = lang === 'am' ? 'lang-am' : '';
    document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = translations[lang][el.dataset.i18n]);
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = translations[lang][el.dataset.i18nPlaceholder]);
    renderProducts();
}

function renderProducts() {
    const lang = localStorage.getItem('lang') || 'en';
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    products.filter(p => (currentCategory === 'all' || p.category === currentCategory) && translations.en[p.i18nKey].toLowerCase().includes(searchQuery)).forEach(p => {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(translations[lang][p.i18nKey])}`;
        grid.innerHTML += `
            <div class="product-card">
                <img src="images/${p.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${translations[lang][p.i18nKey]}</h3>
                <p>${lang === 'am' ? (p.usdPrice * exchangeRate).toLocaleString() + ' ብር' : '$' + p.usdPrice}</p>
                <div class="card-actions">
                    <button class="add-btn" onclick="addToCart(${p.id})">${translations[lang].addToCart}</button>
                    <a href="${shareUrl}" target="_blank" class="share-btn">${translations[lang].share}</a>
                </div>
            </div>`;
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const loc = document.getElementById('customer-location').value;
    const items = cart.map(i => translations.en[i.i18nKey]).join(", ");
    const lang = localStorage.getItem('lang') || 'en';
    
    window.open(`https://t.me/${telegramUsername}?text=${encodeURIComponent(translations[lang].orderMsg.replace("[NAME]", name).replace("[ITEMS]", items).replace("[LOC]", loc))}`);
    
    document.getElementById('receipt-items').innerText = items;
    document.getElementById('receipt-total-price').innerText = cart.reduce((a, b) => a + b.usdPrice, 0);
    document.getElementById('receipt-modal').style.display = 'flex';
}

function updateShopStatus() {
    const et = new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Addis_Ababa"}));
    const open = (et.getDay() !== 0) && (et.getHours() >= 9 && et.getHours() < 19);
    document.getElementById('shop-status-dot').className = open ? 'status-open' : 'status-closed';
    document.getElementById('shop-status-text').innerText = open ? "Open" : "Closed";
}

function addToCart(id) { cart.push(products.find(p => p.id === id)); document.getElementById('cart-count').innerText = cart.length; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleDarkMode() { document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
function handleSearch() { searchQuery = document.getElementById('product-search').value.toLowerCase(); renderProducts(); }
function filterProducts(c) { currentCategory = c; renderProducts(); }

window.onload = () => { changeLanguage(localStorage.getItem('lang') || 'en'); updateShopStatus(); document.getElementById('telegram-support').href = `https://t.me/${telegramUsername}`; 

// Inside translations.en
translations.en.aboutTitle = "About Our Store";
translations.en.aboutBody = "Based in the heart of Addis Ababa, we are your trusted partner for original smartphones, laptops, and accessories. Our mission is to provide quality tech at competitive prices with fast delivery across Ethiopia.";
translations.en.statYears = "Years of Trust";
translations.en.statClients = "Satisfied Customers";

// Inside translations.am
translations.am.aboutTitle = "ስለ እኛ";
translations.am.aboutBody = "በአዲስ አበባ እምብርት የሚገኘው ድርጅታችን ኦሪጅናል ስልኮችን፣ ላፕቶፖችን እና መለዋወጫዎችን ለደንበኞቻችን በማቅረብ ይታወቃል። ጥራት ያላቸውን የቴክኖሎጂ ውጤቶች በተመጣጣኝ ዋጋ እና ፈጣን በሆነ አቅርቦት ማድረስ ዋነኛ ዓላማችን ነው።";
translations.am.statYears = "የታማኝነት ዓመታት";
translations.am.statClients = "ረክተው የተገበያዩ ደንበኞች";

