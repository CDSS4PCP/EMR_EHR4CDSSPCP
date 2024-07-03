<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Rule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        #ruleTitle {
            font-family: Arial, sans-serif;
            color: red;
        }
        .form-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px; /* Spacing between rows */
        }
        label {
            font-weight: bold;
            margin-right: 10px;
            white-space: nowrap;
            display: block;
            width: 140px;
            text-align: right;
            padding-right: 10px;
        }
        .input-container {
            flex-grow: 1;
        }
        input[type="text"], button {
            padding: 8px;
            box-sizing: border-box;
        }
        input[type="text"] {
            width: 25%; /* Set the width to 25% of their container */
        }
        input[readonly] {
            background-color: #e0e0e0;
            color: #555;
        }
        button {
            width: auto;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            margin-top: 10px; /* Additional space above the save button */
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h3 id="ruleTitle">Edit Rule</h3>
    <form id="editRuleForm" action="save_rule.php" method="post">
        <!-- Dynamic form fields will be populated here -->
    </form>


    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const params = new URLSearchParams(window.location.search);
        const ruleData = params.get('data');
        const editableKeys = ['operator1', 'Age1', 'operator2', 'Age2'];

        if (ruleData) {
            const ruleDetails = JSON.parse(decodeURIComponent(ruleData));
            const form = document.getElementById('editRuleForm');
            const title = document.getElementById('ruleTitle');

            if (ruleDetails.RuleDescribe) {
                title.textContent = ruleDetails.RuleDescribe;
                delete ruleDetails.RuleDescribe; // Remove it from the details so it won't be displayed as a field
            }

            Object.entries(ruleDetails).forEach(([key, value]) => {
                const row = document.createElement('div');
                row.className = 'form-row';

                const label = document.createElement('label');
                label.textContent = key + ':';
                row.appendChild(label);

                const inputContainer = document.createElement('div');
                inputContainer.className = 'input-container';
                const input = document.createElement('input');
                
                if (editableKeys.includes(key)) {
                    input.type = 'text';
                    input.name = key;
                    input.value = value;
                } else {
                    input.type = 'text';
                    input.name = key;
                    input.value = value;
                    input.readOnly = true;
                }
                
                inputContainer.appendChild(input);
                row.appendChild(inputContainer);
                form.appendChild(row);
            });

            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.textContent = 'Save';
            form.appendChild(saveButton);
        } else {
            document.getElementById('editRuleForm').textContent = 'No rule data provided.';
        }
    });
    </script>
</body>
</html>
