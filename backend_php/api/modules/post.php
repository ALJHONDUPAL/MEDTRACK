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


 //////////////////////////////////////////////STUDENT SIDE/////////////////////////////////////////////////////////////////////////
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
    

///////////////////////////////////////////CLINIC SIDE///////////////////////////////////////////////////////////////////////////////////////////////
    public function clinicLogin($data) {
        // Extract domain account and password from the request
        $domain_account = $data->domain_account ?? null;
        $password = $data->password ?? null;
    
        // Check if credentials are provided
        if (!$domain_account || !$password) {
            return $this->sendPayload(null, "error", "Missing credentials", 400);
        }
    
        // Query the database for the clinic staff
        $sql = "SELECT * FROM clinicstaff WHERE domain_account = :domain_account AND is_active = 1";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['domain_account' => $domain_account]);
            $staff = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Check if staff exists and password matches
            if (!$staff || !password_verify($password, $staff['password'])) {
                return $this->sendPayload(null, "error", "Invalid credentials", 401);
            }
    
            // Generate JWT token
            $payload = [
                'staff_id' => $staff['staff_id'],
                'domain_account' => $staff['domain_account'],
                'role' => $staff['role'],
                'exp' => time() + 3600 // Token expiration: 1 hour
            ];
            $jwt = JWT::encode($payload, $this->key, 'HS256');
    
            // Return success response with token
            return $this->sendPayload(['token' => $jwt], "success", "Login successful", 200);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 500);
        }
    }

    public function addClinicStaff($data) {
        // Validate required fields
        if (empty($data->firstName) || empty($data->lastName) || empty($data->email)) {
            return $this->sendPayload(null, "error", "Missing required fields", 400);
        }
    
        // Generate domain_account and hash password
        $domain_account = strtok($data->email, '@');
        $password = !empty($data->password) ? password_hash($data->password, PASSWORD_BCRYPT) : password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT);
    
        $sql = "INSERT INTO clinicstaff (first_name, last_name, domain_account, email, password, address, contact_number, role, is_active)
                VALUES (:firstName, :lastName, :domain_account, :email, :password, :address, :contactNumber, :role, 1)";
    
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'firstName' => $data->firstName,
                'lastName' => $data->lastName,
                'domain_account' => $domain_account,
                'email' => $data->email,
                'password' => $password,
                'address' => $data->address ?? '',
                'contactNumber' => $data->contactNumber ?? '',
                'role' => $data->role ?? 'staff'
            ]);
    
            return $this->sendPayload(
                ['staff_id' => $this->pdo->lastInsertId()],
                "success",
                "Clinic staff added successfully",
                201
            );
        } catch (\PDOException $e) {
            $errorMessage = ($e->getCode() == 23000) ? "Email or domain account already exists" : $e->getMessage();
            return $this->sendPayload(null, "error", $errorMessage, 400);
        }
    }
    
    
    
    public function deleteClinicStaff($staffId) {
        $sql = "UPDATE clinicstaff SET is_active = 0 WHERE staff_id = :staffId";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['staffId' => $staffId]);
            
            return $this->sendPayload(null, "success", "Clinic staff deleted successfully", 200);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }
    


    
}




















