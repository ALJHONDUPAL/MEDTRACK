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
        if (!isset($data->domain_account) || !isset($data->password) || 
            !isset($data->first_name) || !isset($data->last_name) || 
            !isset($data->id_number)) {
            return [
                "status" => "error",
                "message" => "Missing required fields"
            ];
        }

        $domain_account = $data->domain_account;
        $password = password_hash($data->password, PASSWORD_BCRYPT);
        
        if (!preg_match('/^\d{9}@gordoncollege\.edu\.ph$/', $domain_account)) {
            return [
                "status" => "error",
                "message" => "Invalid email format. Must be a valid Gordon College email"
            ];
        }
        
        try {
            $this->pdo->beginTransaction();

            // Check if user already exists
            $checkSql = "SELECT domain_account FROM users WHERE domain_account = :domain_account";
            $checkStmt = $this->pdo->prepare($checkSql);
            $checkStmt->execute(['domain_account' => $domain_account]);
            if ($checkStmt->fetch()) {
                return [
                    "status" => "error",
                    "message" => "User already exists"
                ];
            }

            // Insert into users table
            $userSql = "INSERT INTO users (domain_account, password) VALUES (:domain_account, :password)";
            $userStmt = $this->pdo->prepare($userSql);
            $userStmt->execute([
                'domain_account' => $domain_account,
                'password' => $password
            ]);

            $userId = $this->pdo->lastInsertId();

            // Insert into user_profiles table
            $profileSql = "INSERT INTO user_profiles (user_id, first_name, last_name, middle_name, id_number) 
                          VALUES (:user_id, :first_name, :last_name, :middle_name, :id_number)";
            $profileStmt = $this->pdo->prepare($profileSql);
            $profileStmt->execute([
                'user_id' => $userId,
                'first_name' => $data->first_name,
                'last_name' => $data->last_name,
                'middle_name' => $data->middle_name ?? null,
                'id_number' => $data->id_number
            ]);

            $this->pdo->commit();
            return [
                "status" => "success",
                "message" => "User registered successfully"
            ];

        } catch (\PDOException $e) {
            $this->pdo->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
    

    public function loginUser($data) {
        try {
            if (!isset($data->domain_account) || !isset($data->password)) {
                return $this->sendPayload(null, "error", "Missing credentials", 400);
            }

            $domain_account = $data->domain_account;
            $password = $data->password;
            
            $sql = "SELECT * FROM users WHERE domain_account = :domain_account";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['domain_account' => $domain_account]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if (!$user) {
                return $this->sendPayload(null, "error", "User not found", 401);
            }

            if (!password_verify($password, $user['password'])) {
                return $this->sendPayload(null, "error", "Invalid password", 401);
            }

            $payload = [
                'iss' => 'localhost',
                'aud' => 'localhost',
                'iat' => time(),
                'exp' => time() + (60 * 60),
                'data' => [
                    'user_id' => $user['user_id'],
                    'domain_account' => $user['domain_account']
                ]
            ];
            
            $jwt = JWT::encode($payload, $this->key, 'HS256');
            
            return $this->sendPayload([
                'token' => $jwt,
                'user' => [
                    'user_id' => $user['user_id'],
                    'domain_account' => $user['domain_account']
                ]
            ], "success", "Login successful", 200);
            
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 500);
        }
    }

    public function updateUserProfile() {
        try {
            if (!isset($_POST['user_id'])) {
                return [
                    "status" => "error",
                    "message" => "User ID is required"
                ];
            }

            $userId = $_POST['user_id'];
            $updateFields = [];
            $params = ['user_id' => $userId];

            // Handle profile image upload if present
            if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = 'uploads/' . $userId . '/profile_images/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $fileExtension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
                $fileName = time() . '_' . uniqid() . '.' . $fileExtension;
                $filePath = $uploadDir . $fileName;

                if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $filePath)) {
                    $updateFields[] = "profile_image_path = :profile_image_path";
                    $params['profile_image_path'] = $filePath;
                }
            }

            // Handle other profile fields
            $fields = ['department', 'program', 'year_level', 'contact_number'];
            foreach ($fields as $field) {
                if (isset($_POST[$field])) {
                    $updateFields[] = "$field = :$field";
                    if ($field === 'year_level') {
                        $params[$field] = intval($_POST[$field]);
                    } else {
                        $params[$field] = $_POST[$field] === '' ? null : $_POST[$field];
                    }
                }
            }

            if (empty($updateFields)) {
                return [
                    "status" => "error",
                    "message" => "No fields to update"
                ];
            }

            try {
                $this->pdo->beginTransaction();

                // Check if profile exists
                $checkSql = "SELECT * FROM user_profiles WHERE user_id = :user_id";
                $checkStmt = $this->pdo->prepare($checkSql);
                $checkStmt->execute(['user_id' => $userId]);
                $existingProfile = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($existingProfile) {
                    $sql = "UPDATE user_profiles SET " . implode(", ", $updateFields) . " WHERE user_id = :user_id";
                } else {
                    $fields = array_keys($params);
                    $sql = "INSERT INTO user_profiles (" . implode(", ", $fields) . ") 
                            VALUES (:" . implode(", :", $fields) . ")";
                }

                $stmt = $this->pdo->prepare($sql);
                $result = $stmt->execute($params);

                if (!$result) {
                    throw new \Exception("Failed to update profile");
                }

                $selectSql = "SELECT * FROM user_profiles WHERE user_id = :user_id";
                $selectStmt = $this->pdo->prepare($selectSql);
                $selectStmt->execute(['user_id' => $userId]);
                $updatedProfile = $selectStmt->fetch(PDO::FETCH_ASSOC);

                $this->pdo->commit();

                return [
                    "status" => "success",
                    "message" => "Profile updated successfully",
                    "data" => $updatedProfile
                ];

            } catch (\Exception $e) {
                $this->pdo->rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    // Method to handle medical document uploads
    public function uploadMedicalDocument($userId, $documentType, $date = null, $location = null) {
        try {
            if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
                return [
                    "status" => "error",
                    "message" => "No document file uploaded or upload error"
                ];
            }

            // Verify user exists
            $stmt = $this->pdo->prepare("SELECT * FROM user_profiles WHERE user_id = ?");
            $stmt->execute([$userId]);
            $userProfile = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$userProfile) {
                return [
                    "status" => "error",
                    "message" => "User profile not found"
                ];
            }

            // Create upload directory
            $uploadDir = dirname(__FILE__) . "/../uploads/{$userId}/medical_documents/{$documentType}/";
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = time() . '_' . uniqid() . '_' . $_FILES['document']['name'];
            $filePath = $uploadDir . $fileName;
            $relativePath = "uploads/{$userId}/medical_documents/{$documentType}/" . $fileName;

            if (!move_uploaded_file($_FILES['document']['tmp_name'], $filePath)) {
                return [
                    "status" => "error",
                    "message" => "Failed to move uploaded file"
                ];
            }

            $this->pdo->beginTransaction();
            
            $sql = "INSERT INTO medical_documents (user_id, document_type, file_path, date, location, status) 
                    VALUES (?, ?, ?, ?, ?, 'Submitted')
                    ON DUPLICATE KEY UPDATE 
                    file_path = VALUES(file_path),
                    date = VALUES(date),
                    location = VALUES(location),
                    status = 'Submitted',
                    uploaded_at = CURRENT_TIMESTAMP";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $documentType, $relativePath, $date, $location]);
            $this->pdo->commit();

            return [
                "status" => "success",
                "message" => "Document uploaded successfully",
                "data" => [
                    "file_path" => $relativePath,
                    "document_type" => $documentType,
                    "date" => $date,
                    "location" => $location
                ]
            ];

        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            return [
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ];
        }
    }

    public function uploadVaccinationRecord($userId) {
        try {
            if (!isset($_POST['firstDoseType']) || !isset($_POST['firstDoseDate']) || 
                !isset($_POST['secondDoseType']) || !isset($_POST['secondDoseDate']) || 
                !isset($_FILES['document'])) {
                return [
                    "status" => "error",
                    "message" => "Missing required parameters"
                ];
            }

            // Create upload directory
            $uploadDir = dirname(__FILE__) . "/../uploads/{$userId}/vaccination_records/";
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = time() . '_' . uniqid() . '_' . $_FILES['document']['name'];
            $filePath = $uploadDir . $fileName;
            $relativePath = "uploads/{$userId}/vaccination_records/" . $fileName;

            if (!move_uploaded_file($_FILES['document']['tmp_name'], $filePath)) {
                return [
                    "status" => "error",
                    "message" => "Failed to move uploaded file"
                ];
            }

            // Prepare data for database insertion
            $firstDoseType = $_POST['firstDoseType'];
            $firstDoseDate = $_POST['firstDoseDate'];
            $secondDoseType = $_POST['secondDoseType'];
            $secondDoseDate = $_POST['secondDoseDate'];
            $boosterType = $_POST['boosterType'] ?? null;
            $boosterDate = $_POST['boosterDate'] ?? null;

            $sql = "INSERT INTO vaccination_records (user_id, first_dose_type, first_dose_date, second_dose_type, second_dose_date, booster_type, booster_date, document_path, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $firstDoseType, $firstDoseDate, $secondDoseType, $secondDoseDate, $boosterType, $boosterDate, $relativePath]);

            return [
                "status" => "success",
                "message" => "Vaccination record uploaded successfully"
            ];
        } catch (Exception $e) {
            return [
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ];
        }
    }


    // Helper method to handle file uploads
    private function handleFileUpload($file, $identifier, $subDirectory) {
        $baseUploadDir = "uploads/";
        $targetDir = $baseUploadDir . $identifier . "/" . $subDirectory . "/";
        
        // Create directories if they don't exist
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $newFileName = time() . '_' . uniqid() . '.' . $fileExtension;
        $targetPath = $targetDir . $newFileName;

        // Validate file size (10MB limit)
        if ($file['size'] > 10000000) {
            return false;
        }

        // Validate file type
        $allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
        if (!in_array($fileExtension, $allowedTypes)) {
            return false;
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return $targetPath;
        }

        return false;
    }

    private function sendErrorResponse($message) {
        echo json_encode([
            'status' => 'error',
            'message' => $message
        ]);
    }

    public function createAppointment($data) {
        try {
            error_log("Starting appointment creation with data: " . print_r($data, true));
            
            // Validate slot exists
            $slotCheck = $this->pdo->prepare("SELECT * FROM time_slots WHERE slot_id = ?");
            $slotCheck->execute([$data->slot_id]);
            if (!$slotCheck->fetch()) {
                return [
                    "status" => "error",
                    "message" => "Invalid time slot"
                ];
            }
            
            // Check if user already has an appointment for this slot
            $appointmentCheck = $this->pdo->prepare("SELECT * FROM appointments WHERE slot_id = ? AND user_id = ?");
            $appointmentCheck->execute([$data->slot_id, $data->user_id]);
            if ($appointmentCheck->fetch()) {
                return [
                    "status" => "error",
                    "message" => "You already have an appointment for this time slot"
                ];
            }
            
            $this->pdo->beginTransaction();
            
            $sql = "INSERT INTO appointments (slot_id, user_id, purpose, status) 
                    VALUES (:slot_id, :user_id, :purpose, :status)";
            
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                ':slot_id' => $data->slot_id,
                ':user_id' => $data->user_id,
                ':purpose' => $data->purpose,
                ':status' => 'Pending'
            ]);
            
            if (!$result) {
                throw new Exception("Failed to insert appointment");
            }
            
            $appointmentId = $this->pdo->lastInsertId();
            $this->pdo->commit();
            
            error_log("Appointment created successfully with ID: " . $appointmentId);
            
            return [
                "status" => "success",
                "message" => "Appointment created successfully",
                "appointment_id" => $appointmentId
            ];
            
        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log("Error in createAppointment: " . $e->getMessage());
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function deleteAppointment($appointmentId) {
        try {
            $sql = "DELETE FROM appointments WHERE appointment_id = :appointment_id";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([':appointment_id' => $appointmentId]);

            if ($result) {
                return [
                    "status" => "success",
                    "message" => "Appointment deleted successfully"
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Failed to delete appointment"
                ];
            }
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ];
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

    public function addTimeSlot($data) {
        try {
            // Convert date format from MM/DD/YYYY to YYYY-MM-DD
            $formattedDate = date('Y-m-d', strtotime($data->date));
            
            // Format times to include AM/PM
            $startTime = date('h:i A', strtotime($data->startTime));
            $endTime = date('h:i A', strtotime($data->endTime));
            
            $sql = "INSERT INTO time_slots (day_of_week, start_time, end_time, date, student_limit) 
                    VALUES (:day_of_week, :start_time, :end_time, :date, :student_limit)";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':day_of_week' => $data->dayOfWeek,
                ':start_time' => $startTime,
                ':end_time' => $endTime,
                ':date' => $formattedDate,
                ':student_limit' => $data->studentLimit
            ]);
            
            return array("status" => "success", "message" => "Time slot added successfully");
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }
    
    public function updateTimeSlot($data) {
        try {
            // Format the date and times
            $formattedDate = date('Y-m-d', strtotime($data->date));
            $startTime = date('h:i A', strtotime($data->startTime));
            $endTime = date('h:i A', strtotime($data->endTime));
            
            $sql = "UPDATE time_slots 
                    SET day_of_week = :day_of_week,
                        start_time = :start_time,
                        end_time = :end_time,
                        date = :date,
                        student_limit = :student_limit
                    WHERE slot_id = :slot_id";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':slot_id' => $data->slot_id,
                ':day_of_week' => $data->dayOfWeek,
                ':start_time' => $startTime,
                ':end_time' => $endTime,
                ':date' => $formattedDate,
                ':student_limit' => $data->studentLimit
            ]);
            
            return array("status" => "success", "message" => "Time slot updated successfully");
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }

    public function updateAppointmentStatus($data) {
        try {
            error_log("Updating appointment status with data: " . print_r($data, true));
            
            // Validate required fields
            if (!isset($data->appointmentId) || !isset($data->status)) {
                return [
                    "status" => "error",
                    "message" => "Missing required fields"
                ];
            }

            $sql = "UPDATE appointments 
                    SET status = :status,
                        remarks = :remarks 
                    WHERE appointment_id = :appointment_id";
                    
            $stmt = $this->pdo->prepare($sql);
            $params = [
                ':appointment_id' => $data->appointmentId,
                ':status' => $data->status,
                ':remarks' => $data->rejectionReason ?? null
            ];
            
            error_log("Executing SQL with params: " . print_r($params, true));
            
            $result = $stmt->execute($params);
            
            if ($result) {
                return [
                    "status" => "success",
                    "message" => "Appointment status updated successfully"
                ];
            } else {
                error_log("Update failed. PDO Error Info: " . print_r($stmt->errorInfo(), true));
                return [
                    "status" => "error",
                    "message" => "Failed to update appointment status"
                ];
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
    
    public function deleteTimeSlot($data) {
        try {
            $sql = "DELETE FROM time_slots WHERE slot_id = :slot_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':slot_id' => $data->slot_id]);
            
            if ($stmt->rowCount() > 0) {
                return array("status" => "success", "message" => "Time slot deleted successfully");
            } else {
                return array("status" => "error", "message" => "Time slot not found");
            }
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }

    public function updateDocumentStatus($data) {
        try {
            $sql = "UPDATE medical_documents 
                    SET status = :status 
                    WHERE user_id = :user_id 
                    AND document_type = :document_type";
                    
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                ':user_id' => $data->user_id,
                ':document_type' => $data->document_type,
                ':status' => $data->status
            ]);
            
            if ($result) {
                return [
                    "status" => "success",
                    "message" => "Document status updated successfully"
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Failed to update document status"
                ];
            }
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

}




















