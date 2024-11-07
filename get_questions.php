<?php
header('Content-Type: application/json');

// 讀取 JSON 文件
$questionsFile = file_get_contents('questions.json');
$questionsData = json_decode($questionsFile, true);

// 返回問題數據
echo json_encode($questionsData['questions']);