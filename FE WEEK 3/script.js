const transactions = [
	{ id: "TX00001", customerName: "James Anderson", amount: 1245.75, date: "2025-09-28", type: "credit" },
	{ id: "TX00002", customerName: "Emily Johnson", amount: 89.40, date: "2025-10-04", type: "debit" },
	{ id: "TX00003", customerName: "Michael Williams", amount: 15780.00, date: "2025-10-17", type: "credit" },
	{ id: "TX00004", customerName: "Sarah Brown", amount: 432.18, date: "2025-10-29", type: "debit" },
	{ id: "TX00005", customerName: "David Jones", amount: 2765.99, date: "2025-11-06", type: "credit" },
	{ id: "TX00006", customerName: "Jessica Garcia", amount: 63.25, date: "2025-11-19", type: "debit" },
	{ id: "TX00007", customerName: "Christopher Miller", amount: 9800.50, date: "2025-12-02", type: "credit" },
	{ id: "TX00008", customerName: "Ashley Davis", amount: 118.72, date: "2025-12-14", type: "debit" },
	{ id: "TX00009", customerName: "Matthew Rodriguez", amount: 654.30, date: "2025-12-27", type: "credit" },
	{ id: "TX00010", customerName: "Amanda Martinez", amount: 1945.67, date: "2026-01-08", type: "debit" },
	{ id: "TX00011", customerName: "Joshua Hernandez", amount: 20000.00, date: "2026-01-21", type: "credit" },
	{ id: "TX00012", customerName: "Jennifer Lopez", amount: 247.16, date: "2026-02-03", type: "debit" },
	{ id: "TX00013", customerName: "Daniel Gonzalez", amount: 3860.45, date: "2026-02-15", type: "credit" },
	{ id: "TX00014", customerName: "Elizabeth Wilson", amount: 76.80, date: "2026-02-28", type: "debit" },
	{ id: "TX00015", customerName: "Anthony Anderson", amount: 729.55, date: "2026-03-12", type: "credit" },
	{ id: "TX00016", customerName: "Megan Thomas", amount: 5120.10, date: "2026-03-25", type: "debit" },
	{ id: "TX00017", customerName: "Andrew Taylor", amount: 15432.88, date: "2026-04-07", type: "credit" },
	{ id: "TX00018", customerName: "Samantha Moore", amount: 305.49, date: "2026-04-19", type: "debit" },
	{ id: "TX00019", customerName: "Joseph Jackson", amount: 1875.00, date: "2026-05-02", type: "credit" },
	{ id: "TX00020", customerName: "Lauren Martin", amount: 42.99, date: "2026-05-16", type: "debit" },
	{ id: "TX00021", customerName: "Ryan Lee", amount: 8450.25, date: "2026-06-01", type: "credit" },
	{ id: "TX00022", customerName: "Nicole Perez", amount: 678.34, date: "2026-06-18", type: "debit" },
	{ id: "TX00023", customerName: "Robert Thompson", amount: 11999.95, date: "2026-07-09", type: "credit" },
	{ id: "TX00024", customerName: "Stephanie White", amount: 221.60, date: "2026-08-11", type: "debit" },
	{ id: "TX00025", customerName: "Kevin Harris", amount: 2675.42, date: "2026-09-23", type: "credit" }
];

const table = document.getElementById("myTable");
const sortField = document.getElementById("sortField");
const sortAlgorithm = document.getElementById("sortAlgorithm");
const searchCustomerInput = document.getElementById("searchCustomerInput");
const searchIDInput = document.getElementById("searchIDInput");
const transactionsSortedById = [...transactions].sort((first, second) => first.id.localeCompare(second.id));

function linearSearchByCustomer(items, searchTerm) {
	const normalizedTerm = searchTerm.toLowerCase();

	return items.filter((transaction) =>
		transaction.customerName.toLowerCase().includes(normalizedTerm)
	);
}

function binarySearchById(sortedItems, searchId) {
	let left = 0;
	let right = sortedItems.length - 1;

	while (left <= right) {
		const middle = Math.floor((left + right) / 2);
		const comparison = sortedItems[middle].id.localeCompare(searchId);

		if (comparison === 0) {
			return sortedItems[middle];
		}

		if (comparison < 0) {
			left = middle + 1;
		} else {
			right = middle - 1;
		}
	}

	return null;
}

function compareTransactions(first, second, field) {
	let comparison;

	if (field === "amount") {
		comparison = first.amount - second.amount;
	} else if (field === "date") {
		comparison = new Date(first.date) - new Date(second.date);
	} else {
		comparison = first.customerName.localeCompare(second.customerName);
	}

	return comparison;
}

function bubbleSort(items, field) {
	const sortedItems = [...items];

	for (let end = sortedItems.length - 1; end > 0; end--) {
		for (let index = 0; index < end; index++) {
			if (compareTransactions(sortedItems[index], sortedItems[index + 1], field) > 0) {
				[sortedItems[index], sortedItems[index + 1]] = [sortedItems[index + 1], sortedItems[index]];
			}
		}
	}

	return sortedItems;
}

function mergeSort(items, field) {
	if (items.length <= 1) {
		return items;
	}

	const middle = Math.floor(items.length / 2);
	const left = mergeSort(items.slice(0, middle), field);
	const right = mergeSort(items.slice(middle), field);
	const merged = [];
	let leftIndex = 0;
	let rightIndex = 0;

	while (leftIndex < left.length && rightIndex < right.length) {
		if (compareTransactions(left[leftIndex], right[rightIndex], field) <= 0) {
			merged.push(left[leftIndex++]);
		} else {
			merged.push(right[rightIndex++]);
		}
	}

	return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function getSearchResults() {
	const customerSearch = searchCustomerInput.value.trim();
	const idSearch = searchIDInput.value.trim().toUpperCase();
	let searchResults = [...transactions];

	if (customerSearch) {
		searchResults = linearSearchByCustomer(searchResults, customerSearch);
	}

	if (idSearch) {
		const matchingTransaction = binarySearchById(transactionsSortedById, idSearch);
		searchResults = matchingTransaction && searchResults.includes(matchingTransaction)
			? [matchingTransaction]
			: [];
	}

	return searchResults;
}

function renderTable() {
	const searchResults = getSearchResults();
	const sortedTransactions = sortAlgorithm.value === "bubble"
		? bubbleSort(searchResults, sortField.value)
		: mergeSort(searchResults, sortField.value);

	table.innerHTML = `
		<tr>
			<th>ID</th>
			<th>Customer</th>
			<th>Amount</th>
			<th>Date</th>
			<th>Type</th>
		</tr>
	`;

	if (sortedTransactions.length === 0) {
		const row = table.insertRow();
		const cell = row.insertCell();
		cell.colSpan = 5;
		cell.textContent = "No transactions found.";
		return;
	}

	sortedTransactions.forEach((transaction) => {
		const row = table.insertRow();
		row.insertCell().textContent = transaction.id;
		row.insertCell().textContent = transaction.customerName;
		row.insertCell().textContent = `$${transaction.amount.toFixed(2)}`;
		row.insertCell().textContent = transaction.date;
		row.insertCell().textContent = transaction.type;
	});
}

sortField.addEventListener("change", renderTable);
sortAlgorithm.addEventListener("change", renderTable);
searchCustomerInput.addEventListener("input", renderTable);
searchIDInput.addEventListener("input", renderTable);

renderTable();
