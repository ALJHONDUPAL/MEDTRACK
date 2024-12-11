<?php

require_once "global.php"; 
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;

class Post extends GlobalMethods {
    private $pdo;
    private $key = "your_secret_key"; 

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function registerUser($data) {
        $firstname = $data->firstname;
        $lastname = $data->lastname;
        $domain_account = $data->domain_account;  // Updated to match the new column name
        $password = password_hash($data->password, PASSWORD_BCRYPT);
        
        $sql = "INSERT INTO users (firstname, lastname, domain_account, password) VALUES (:firstname, :lastname, :domain_account, :password)";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['firstname' => $firstname, 'lastname' => $lastname, 'domain_account' => $domain_account, 'password' => $password]);
            return $this->sendPayload(null, "success", "User registered successfully", 201);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }
    

    public function loginUser($data) {
        $domain_account = $data->domain_account;  // Updated to match the new column name
        $password = $data->password;
        
        $sql = "SELECT * FROM users WHERE domain_account = :domain_account";  // Changed 'username' to 'domain_account'
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['domain_account' => $domain_account]);
            $user = $stmt->fetch();
        
            if ($user && password_verify($password, $user['password'])) {
                $payload = [
                    'iss' => "http://example.org", 
                    'aud' => "http://example.com", 
                    'iat' => time(), 
                    'exp' => time() + 3600, 
                    'uid' => $user['id']  // Corrected field name from 'userID' to 'id'
                ];
                $jwt = JWT::encode($payload, $this->key, 'HS256');
                return $this->sendPayload(['token' => $jwt], "success", "Login successful", 200);
            } else {
                return $this->sendPayload(null, "error", "Invalid credentials", 401);
            }
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }
    

    public function loginClinic($data) {
        $domain_account = $data->domain_account;  // Updated to match the new column name
        $password = $data->password;
        
        $sql = "SELECT * FROM users WHERE email = : email";  // Changed 'username' to 'domain_account'
        try {
            $stmt = $this->pdo->prepare($sql);

            $stmt->execute(['email' => $domain_account]);
            $user = $stmt->fetch();
        
            if ($user && password_verify($password, $user['password'])) {
                $payload = [
                    'iss' => "http://example.org", 
                    'aud' => "http://example.com", 
                    'iat' => time(), 
                    'exp' => time() + 3600, 
                    'uid' => $user['id']  // Corrected field name from 'userID' to 'id'
                ];
                $jwt = JWT::encode($payload, $this->key, 'HS256');
                return $this->sendPayload(['token' => $jwt], "success", "Login successful", 200);
            } else {
                return $this->sendPayload(null, "error", "Invalid credentials", 401);
            }
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }
    
    
    public function createUserProfile($data) {
        $user_id = $data->user_id; // Assuming you pass the user ID
        $name = $data->name;
        $department = $data->department;
        $year_level = $data->year_level;
        $id_number = $data->id_number;
        $profile_image = isset($data->profile_image) ? base64_decode($data->profile_image) : null;
    
        $sql = "INSERT INTO user_profiles (user_id, name, department, year_level, id_number, profile_image) 
                VALUES (:user_id, :name, :department, :year_level, :id_number, :profile_image)";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'user_id' => $user_id,
                'name' => $name,
                'department' => $department,
                'year_level' => $year_level,
                'id_number' => $id_number,
                'profile_image' => $profile_image
            ]);
            return $this->sendPayload(null, "success", "Profile created successfully", 201);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }
    


    
}




















