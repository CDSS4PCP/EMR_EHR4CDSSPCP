<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Rule</title>
    <style>
        body {
            font-family: Arial, sans-serif; /* Makes font more modern */
            padding: 20px; /* Adds padding around the form */
        }
        label {
            font-weight: bold; /* Makes label text bold */
            margin-right: 10px; /* Adds space between label and input */
            display: inline-block; /* Keeps label on the same line as input */
            min-width: 120px; /* Ensures alignment for all labels */
        }
        input {
            margin-bottom: 10px; /* Adds space below each input */
            padding: 8px; /* Pads the input text for better readability */
        }
        input[readonly] {
            background-color: #f2f2f2; /* Light grey background for readonly fields */
        }
        button {
            padding: 10px 20px; /* Larger click area for the save button */
            background-color: #4CAF50; /* A nice shade of green */
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049; /* Slightly darker green on hover */
        }
    </style>
</head>
<body>
    <h1>Edit Rule</h1>
    <form id="editRuleForm" action="save_rule.php" method="post">
        <!-- Dynamic form fields will be populated here -->
    </form>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const params = new URLSearchParams(window.location.search);
        const ruleData = params.get('data');
        const editableKeys = ['operator1', 'Age1', 'operator2', 'Age2']; // Define which keys are editable

        if (ruleData) {
            const ruleDetails = JSON.parse(decodeURIComponent(ruleData));
            const form = document.getElementById('editRuleForm');
            Object.entries(ruleDetails).forEach(([key, value]) => {
                const label = document.createElement('label');
                label.textContent = key + ': ';
                const input = document.createElement('input');
                
                if (editableKeys.includes(key)) {
                    input.type = 'text';
                    input.name = key;
                    input.value = value;
                } else {
                    input.type = 'text';
                    input.name = key;
                    input.value = value;
                    input.readOnly = true; // Make it read-only
                }
                
                label.appendChild(input);
                form.appendChild(label);
                form.appendChild(document.createElement('br'));
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
