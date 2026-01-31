const API_URL = 'https://api.escuelajs.co/api/v1/products';

const tableBody = document.getElementById('product-data');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const pageSizeSelect = document.getElementById('pageSize');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;

async function getAllProducts() {
    const res = await fetch(API_URL);
    allProducts = await res.json();
    filteredProducts = [...allProducts];
    render();
}

function render() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredProducts.slice(start, end);

    tableBody.innerHTML = '';

    pageData.forEach(product => {
        const row = document.createElement('tr');

        let imagesHtml = '<div class="images-cell">';
        if (product.images?.length) {
            product.images.forEach(img => {
                imagesHtml += `<img src="${img}" onerror="this.src='https://placehold.co/100x100'">`;
            });
        }
        imagesHtml += '</div>';

       row.dataset.description = product.description;

row.innerHTML = `
    <td>${product.id}</td>
    <td class="title-cell">${product.title}</td>
    <td>$${product.price}</td>
    <td>${product.category?.name || 'N/A'}</td>
    <td>${imagesHtml}</td>
`;

        tableBody.appendChild(row);
    });

    pageInfo.textContent = `Trang ${currentPage} / ${Math.ceil(filteredProducts.length / pageSize)}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === Math.ceil(filteredProducts.length / pageSize);
}

/* 🔍 Search */
searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    applySort();
});

/* 🔃 Sort */
sortSelect.addEventListener('change', applySort);

function applySort() {
    const value = sortSelect.value;

    if (value === 'name-asc')
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    if (value === 'name-desc')
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    if (value === 'price-asc')
        filteredProducts.sort((a, b) => a.price - b.price);
    if (value === 'price-desc')
        filteredProducts.sort((a, b) => b.price - a.price);

    render();
}

/* 📄 Page size */
pageSizeSelect.addEventListener('change', () => {
    pageSize = +pageSizeSelect.value;
    currentPage = 1;
    render();
});

/* ⏮ ⏭ Pagination */
prevBtn.onclick = () => {
    currentPage--;
    render();
};
nextBtn.onclick = () => {
    currentPage++;
    render();
};

getAllProducts();
