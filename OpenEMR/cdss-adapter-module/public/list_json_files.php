<?php
// Set the correct path to the directory containing your JSON files.
$dirPath = "vaccine_rules";
$jsonFiles = array();

// Open a directory, and read its contents
if (is_dir($dirPath)) {
    if ($dh = opendir($dirPath)) {
        while (($file = readdir($dh)) !== false) {
            if (pathinfo($file, PATHINFO_EXTENSION) == 'json') {
                $jsonFiles[] = $file; // Add the file to the array
            }
        }
        closedir($dh);
    }
}

// Return JSON encoded array of file names
echo json_encode($jsonFiles);
?>