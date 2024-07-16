let logOutBtn=document.getElementById('logOutBtn');
function logOut()
{
    location.href='../index.html';
    localStorage.removeItem('userName');
}
logOutBtn.addEventListener('click',logOut)

let newChart;
// Fetch data from JSON file
async function getData() {
    try{
        const response = await fetch('../api/data.json');
        // console.log(response);
        if(!response.ok){
            throw new Error ('failed to fetch your data');
        }
        return response.json();    
    }
    catch(err){
        throw new Error (err);
    }
}

// fill the table with data
function putDataInTable(customers, transactions) {
    let tableBody = document.querySelector('#customer-table tbody');
    // console.log(tableBody);
    tableBody.innerHTML = '';
    transactions.forEach(transaction => {
        const customer = customers.find(customer => customer.id === transaction.customer_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
        `;
        // console.log(row);
        tableBody.appendChild(row);
    });
}

// Filter table based on search input (customer || transaction)
function filterTable(customers, transactions, searchTerm) {
    const filteredTransactions = transactions.filter(transaction => {
        const customer = customers.find(customer => customer.id === transaction.customer_id);
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               transaction.amount.toString().includes(searchTerm);
    });
    putDataInTable(customers, filteredTransactions);
}

// Render chart for the selected customer
function renderChart(transactions) {
    const ctx = document.getElementById('transaction-chart').getContext('2d');
    const dates = transactions.map(t => t.date);
    const amounts = transactions.map(t => t.amount);
    if (newChart) {
        document.getElementById('transaction-chart').classList.replace('d-block','d-none');
        newChart.destroy();
    }
    newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Transactions',
                data: amounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try{
        const data = await getData(); // this function return response and assign it in data
        // console.log(data);
        const { customers, transactions } = data;// Destructuring Assignment (data) 
        putDataInTable(customers, transactions);
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Filter table based on search input
            filterTable(customers, transactions, searchTerm);
            // Find customer by name
            const customer = customers.find(customer => customer.name.toLowerCase().includes(searchTerm));
            if (customer) {
                const customerTransactionsByName = transactions.filter(t => t.customer_id === customer.id);
                renderChart(customerTransactionsByName);
                document.getElementById('transaction-chart').classList.replace('d-none','d-block')
                document.getElementById('alert').classList.replace('d-block' , 'd-none')
            } 
            else {
                // If no customer is found, remove the chart
                if (!customer) {
                    document.getElementById('transaction-chart').classList.replace('d-block','d-none')
                    document.getElementById('alert').classList.replace('d-none' , 'd-block')
                }
            }
        });
    }
    catch(err){
        throw new Error (err)
    }
});
