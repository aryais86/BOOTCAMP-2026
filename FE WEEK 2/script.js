const itemsPerPage = 5;
let currentPage = 1;
let allPosts = [];

const table = document.getElementById('myTable');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const searchInput = document.getElementById('searchInput');
const sortField = document.getElementById('sortField');
const sortOrder = document.getElementById('sortOrder');

function parseStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    currentPage = Number(params.get('_page')) || 1;
    const limit = Number(params.get('_limit')) || itemsPerPage;
    const search = params.get('title_like') || '';
    const field = params.get('_sort') || 'id';
    const order = params.get('_order') || 'asc';

    if (limit > 0) {
        itemsPerPage = limit;
    }

    searchInput.value = search;
    sortField.value = field;
    sortOrder.value = order;

    return {
        _page: currentPage,
        _limit: limit,
        title_like: search,
        _sort: field,
        _order: order
    };
}

function updateUrl() {
    const params = new URLSearchParams();
    params.set('_page', currentPage);
    params.set('_limit', itemsPerPage);

    const searchValue = searchInput.value.trim();
    if (searchValue) {
        params.set('title_like', searchValue);
    }

    if (sortField.value) {
        params.set('_sort', sortField.value);
    }

    if (sortOrder.value) {
        params.set('_order', sortOrder.value);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, '', newUrl);
}

function getVisiblePosts() {
    let filteredPosts = [...allPosts];

    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchValue)
        );
    }

    const field = sortField.value;
    const order = sortOrder.value;

    filteredPosts.sort((a, b) => {
        const first = a[field];
        const second = b[field];

        if (typeof first === 'string' && typeof second === 'string') {
            return order === 'asc'
                ? first.localeCompare(second)
                : second.localeCompare(first);
        }

        return order === 'asc' ? first - second : second - first;
    });

    return filteredPosts;
}

function renderTable() {
    const visiblePosts = getVisiblePosts();
    const maxPage = Math.max(1, Math.ceil(visiblePosts.length / itemsPerPage));

    if (currentPage > maxPage) {
        currentPage = maxPage;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const postsToShow = visiblePosts.slice(start, end);

    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
        </tr>
    `;

    postsToShow.forEach(post => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = post.id;

        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;

        const bodyCell = document.createElement('td');
        bodyCell.textContent = post.body;

        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(bodyCell);
        table.appendChild(row);
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= maxPage;

    updateUrl();
}

async function fetchPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        allPosts = await response.json();
        parseStateFromUrl();
        renderTable();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
});

sortField.addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

sortOrder.addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextBtn.addEventListener('click', () => {
    const visiblePosts = getVisiblePosts();
    const maxPage = Math.max(1, Math.ceil(visiblePosts.length / itemsPerPage));

    if (currentPage < maxPage) {
        currentPage++;
        renderTable();
    }
});

window.addEventListener('popstate', () => {
    parseStateFromUrl();
    renderTable();
});

fetchPosts();
