async function fetchPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const posts = await response.json();
        const table = document.getElementById('myTable');

        posts.forEach(post => {
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
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

fetchPosts();
