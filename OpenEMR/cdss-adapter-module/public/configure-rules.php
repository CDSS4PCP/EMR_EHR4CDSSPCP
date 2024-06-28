
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Rule Viewer</title>
    <style>
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
        .editable {
            background-color: #33fafa;
        }
        .hide {
            display: none;
        }
        .vaccine-link {
    background-color: #63e5ff;
    color: black;
    margin-right: 30px; /* Adjust the value as needed for more space */
    padding: 10px 20px;
    text-decoration: none; /* Removes underline from links */
    border-radius: 5px; /* Optional: rounds the corners of the button */
    display: inline-block; /* Makes padding work correctly */
    transition: background-color 0.3s; /* Smooth transition for hover effect */
}
        .vaccine-link:hover {
            background-color: navy;  /* Darker blue on hover */
        }
        .edit-btn {
            background-color: #4CAF50; /* Green background */
            color: white; /* White text */
            padding: 5px 10px; /* Padding around the text */
            border: none; /* No border */
            border-radius: 5px; /* Rounded corners */
            cursor: pointer; /* Mouse pointer changes to a hand icon */
            transition: background-color 0.3s; /* Smooth transition for hover effect */
        }

        .edit-btn:hover {
            background-color: #367c39; /* Darker green on hover */
        }
    </style>
</head>
<body>

<div id="file-list"></div>
<div id="table-container"></div>

<script>
// The keys that are editable
const editableKeys = ['RuleDescribe', 'Age1', 'Age2', 'Todo1', 'Todo2'];

function generateCQL(data) {
    
  //create new cql file based on the data and the rule requested 
  console.log(data);
}

function toggleEditSave(row, isEdit) {
    const cells = row.querySelectorAll('td');
    let data = {}; // Temporary storage for data

    if (isEdit) {
        // Populate the modal with input fields
        const form = document.getElementById('editForm');
        form.innerHTML = ''; // Clear previous contents
        cells.forEach((cell, index) => {
            if (index < cells.length - 1) { // Ignore the last cell containing the button
                const key = cell.getAttribute('data-key');
                const value = cell.textContent.trim();
                const field = editableKeys.includes(key) ?
                    `<input type="text" name="${key}" value="${value}">` :
                    `<input type="text" name="${key}" value="${value}" readonly>`;
                form.innerHTML += `<label>${key}: ${field}</label><br>`;
            }
        });
        document.getElementById('editModal').style.display = 'block'; // Show the modal
    }
}

function saveData() {
    const form = document.getElementById('editForm');
    const inputs = form.querySelectorAll('input');
    let data = {};
    inputs.forEach(input => {
        data[input.name] = input.value;
    });
    generateCQL(data); // Call the function to generate CQL with the new data
    closeModal(); // Close the modal after saving
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none'; // Hide the modal
}


// function toggleEditSave(row, isEdit) {
//     const cells = row.querySelectorAll('td');
//     let data = {}; // Object to hold updated data for CQL generation
    
//     cells.forEach((cell, index) => {
//         // The last cell contains the button
//         if (index === cells.length - 1) {
//             const button = cell.querySelector('button');
//             button.textContent = isEdit ? 'Save' : 'Edit';
//             if (!isEdit) {
//                 // If we are saving, call the function to generate the CQL file
//                 generateCQL(data);
//             }
//         } else {
//             // Check if the cell corresponds to an editable key
//             const key = cell.getAttribute('data-key');
//             if (editableKeys.includes(key)) {
//                 if (isEdit) {
//                     // Make field editable
//                     const input = document.createElement('input');
//                     input.type = 'text';
//                     input.value = cell.textContent.trim();
//                     cell.textContent = '';
//                     cell.appendChild(input);
//                 } else {
//                     // Save field value, make it non-editable, and add to data object for CQL
//                     const input = cell.querySelector('input');
//                     data[key] = input.value; // Add the updated value to the data object
//                     cell.textContent = input.value;
//                     input.remove();
//                 }
//             } else if (!isEdit) {
//                 // For non-editable fields, just include their current values for CQL
//                 data[key] = cell.textContent.trim();
//             }
//         }
//     });
// }

function toggleEditSave(row, isEdit) {
    if (isEdit) {
        const rowData = {};
        const cells = row.querySelectorAll('td[data-key]');
        cells.forEach(cell => {
            const key = cell.getAttribute('data-key');
            const value = cell.textContent.trim();
            rowData[key] = value;
        });

        // JSON.stringify the rowData and encode it to safely pass via URL
        const encodedData = encodeURIComponent(JSON.stringify(rowData));
        window.location.href = `edit_rule.php?data=${encodedData}`; // Redirect to the edit page with data
    }
}


function fetchAndDisplayJson(filePath) {
    fetch(filePath)
        .then(response => response.json())
        .then(jsonData => {
            const container = document.getElementById('table-container');
            container.innerHTML = ''; // Clear the existing table

            let table = document.createElement('table');

            // Create the header row
            let headerRow = document.createElement('tr');
            Object.keys(jsonData[1]).forEach(key => {
                let headerCell = document.createElement('th');
                headerCell.textContent = key.replace(/([A-Z])/g, ' $1').trim(); // Add space before capital letters
                headerRow.appendChild(headerCell);
            });
            headerRow.appendChild(document.createElement('th')); // Empty header for the Edit button
            table.appendChild(headerRow);

            // Create data rows
            Object.values(jsonData).forEach((obj, rowIndex) => {
                let row = document.createElement('tr');
                Object.entries(obj).forEach(([key, value]) => {
                    let cell = document.createElement('td');
                    cell.textContent = value;
                    cell.setAttribute('data-key', key); // Store the key in the data-key attribute
                    row.appendChild(cell);
                });

                // Create Edit/Save button cell
                let buttonCell = document.createElement('td');
                let editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'edit-btn'; 
                editBtn.onclick = function() {
                    // Determine if we're editing or saving
                    const isEdit = editBtn.textContent === 'Edit';
                    toggleEditSave(row, isEdit);
                };
                buttonCell.appendChild(editBtn);
                row.appendChild(buttonCell);

                table.appendChild(row);
            });

            container.appendChild(table); // Append the table to the container
        });
}

// Fetch the list of JSON files and create hyperlinks
// Fetch the list of JSON files and create hyperlinks
fetch('list_json_files.php') // This should be the path to your PHP script
    .then(response => response.json())
    .then(files => {
        const fileListContainer = document.getElementById('file-list');

        files.forEach(file => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = file.replace('.json', '');
            link.className = 'vaccine-link';  // Apply the button styling class
            link.onclick = function () {
                fetchAndDisplayJson(`vaccine_rules/${file}`);
                return false; // Prevent default anchor behavior
            };
            fileListContainer.appendChild(link);
            fileListContainer.appendChild(document.createElement('br'));
            fileListContainer.appendChild(document.createElement('br'));
        });
    });

</script>
<div id="editModal" class="hide">
    <div class="modal-content">
        <form id="editForm">
            <!-- Fields will be dynamically populated here -->
        </form>
    </div>
    <div class="modal-footer">
        <button onclick="saveData()">Save</button>
        <button onclick="closeModal()">Close</button>
    </div>
</div>


</body>
</html>
