<?php
require_once "global.php";

class Get extends GlobalMethods {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    // General execute query method for custom queries
    public function executeQuery($sql) {
        $data = array(); // Placeholder for retrieved records
        $errmsg = ""; // Error message
        $code = 0; // Status code

        try {
            $result = $this->pdo->query($sql)->fetchAll();
            if ($result) {
                $data = $result;
                $code = 200; // Success status code
            } else {
                $errmsg = "No records found";
                $code = 404; // Not found status code
            }
        } catch(\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403; // Forbidden status code
        }

        return array("code" => $code, "errmsg" => $errmsg, "data" => $data);
    }
    // Method to get all user profiles (optional, depending on your needs)
    public function getAllUserProfiles() {
        $sql = "SELECT * FROM user_profiles";

        return $this->executeQuery($sql); // Reuse the executeQuery method to fetch all profiles
    }

    // Method to get user profile by their domain_account or email
    public function getProfileByDomainAccount($domain_account) {
        $sql = "SELECT user_profiles.* FROM user_profiles
                JOIN users ON users.id = user_profiles.user_id
                WHERE users.domain_account = :domain_account";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['domain_account' => $domain_account]);
            $profile = $stmt->fetch();
            
            if ($profile) {
                return $this->sendPayload($profile, "success", "User profile fetched successfully", 200);
            } else {
                return $this->sendPayload(null, "error", "Profile not found", 404);
            }
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 403);
        }
    }
    public function sendPayload($data, $status, $message, $code) {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data,
            'code' => $code
        ];
    }
    
    public function getAllClinicStaff() {
        $sql = "SELECT 
            staff_id,
            first_name as firstName,
            last_name as lastName,
            email,
            domain_account,
            address,
            contact_number as contactNumber,
            role
        FROM clinicstaff 
        WHERE is_active = 1";
    
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $clinicStaff = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            return $this->sendPayload($clinicStaff, "success", "Clinic staff retrieved successfully", 200);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, "error", $e->getMessage(), 400);
        }
    }

//student side getting the firstname and lastname
public function getUserFullNameByUsername($username) {
    $sql = "SELECT firstname, lastname FROM users WHERE domain_account = :username"; // Adjust as per your column name

    try {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['username' => $username]); 
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user) {
            return $this->sendPayload($user, "success", "User full name retrieved successfully", 200);
        } else {
            return $this->sendPayload(null, "error", "User not found", 404);
        }
    } catch (\PDOException $e) {
        return $this->sendPayload(null, "error", $e->getMessage(), 403);
    }
}

public function getUserProfile($userId) {
    try {
        $stmt = $this->pdo->prepare("
            SELECT 
                up.name,
                up.department,
                up.year_level as yearLevel,
                up.id_number as idNumber,
                CASE 
                    WHEN up.profile_image_path IS NOT NULL 
                    THEN up.profile_image_path
                    ELSE 'assets/default-avatar.png'
                END as profileImage
            FROM user_profiles up
            WHERE up.user_id = ?
        ");
        
        $stmt->execute([$userId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($profile) {
            // Modify the profile image path to include the correct base URL
            if ($profile['profileImage'] && !str_starts_with($profile['profileImage'], 'assets/')) {
                $profile['profileImage'] = 'uploads/' . $userId . '/profile_images/' . basename($profile['profileImage']);
            }
            
            return [
                "status" => "success",
                "data" => $profile
            ];
        } else {
            return [
                "status" => "error",
                "message" => "Profile not found"
            ];
        }
    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

public function getMedicalDocuments($userId) {
    try {
        $stmt = $this->pdo->prepare("SELECT * FROM medical_documents WHERE user_id = ? ORDER BY uploaded_at DESC");
        $stmt->execute([$userId]);
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "status" => "success",
            "data" => $documents
        ];
    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

public function getVaccinationRecords($userId) {
    try {
        $stmt = $this->pdo->prepare("SELECT * FROM vaccination_records WHERE user_id = ?");
        $stmt->execute([$userId]);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($records) {
            return [
                "status" => "success",
                "data" => $records
            ];
        } else {
            return [
                "status" => "error",
                "message" => "No vaccination records found"
            ];
        }
    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

//CLINIC SIDE  medical details component
public function getStudentProfiles($department = null, $year = null) {
    try {
        // Base SQL query
        $sql = "
            SELECT 
                up.user_id,
                up.name,
                up.department,
                up.year_level AS yearLevel,
                up.id_number AS idNumber,
                up.profile_image_path AS profileImage
            FROM user_profiles up
            WHERE 1=1
        ";

        // Array to hold parameters
        $params = [];

        // Add filtering conditions dynamically
        if (!empty($department)) {
            $sql .= " AND up.department = :department";
            $params[':department'] = $department;
        }

        if (!empty($year)) {
            $sql .= " AND up.year_level = :year";
            $params[':year'] = $year;
        }

        // Prepare and execute the query
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "status" => "success",
            "data" => $profiles
        ];
    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

//CLINIC SIDE  medical details component
public function getStudentBasicDetails($userId)
{
    try {
        // SQL query to fetch basic details for a specific student
        $sql = "
        SELECT s.*, m.*, v.*
        FROM user_profiles s
        LEFT JOIN medical_documents m ON s.user_id = m.user_id
        LEFT JOIN vaccination_records v ON s.user_id = v.user_id
        WHERE s.user_id = :userId
    ";
    
        // Prepare and execute the query
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':userId' => $userId]);

        // Fetch the profile
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        // Log the fetched profile for debugging
        error_log('Fetched profile: ' . print_r($profile, true));

        // If no profile is found, return an error message
        if (!$profile) {
            return [
                "status" => "error",
                "message" => "No profile found for user ID: " . $userId
            ];
        }

        return [
            "status" => "success",
            "data" => $profile
        ];

    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

public function getTimeSlots($dayOfWeek) {
    try {
        $sql = "SELECT t.*, 
                (SELECT COUNT(*) FROM appointments a WHERE a.slot_id = t.slot_id AND a.status != 'Cancelled') as current_bookings 
                FROM time_slots t 
                WHERE t.day_of_week = :day_of_week";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':day_of_week' => $dayOfWeek]);
        $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            "status" => "success",
            "data" => $slots
        ];
    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => $e->getMessage()
        ];
    }
}

public function getAppointments($userId = null) {
    try {
        $sql = "SELECT 
                a.*,
                t.start_time,
                t.end_time,
                t.day_of_week,
                t.date,
                up.name as userName,
                up.profile_image_path as userImage,
                up.department,
                up.year_level as yearLevel
            FROM appointments a 
            JOIN time_slots t ON a.slot_id = t.slot_id
            JOIN user_profiles up ON a.user_id = up.user_id";
        
        if ($userId) {
            $sql .= " WHERE a.user_id = :userId";
        }
        
        $sql .= " ORDER BY t.date, t.start_time";
        
        $stmt = $this->pdo->prepare($sql);
        if ($userId) {
            $stmt->execute(['userId' => $userId]);
        } else {
            $stmt->execute();
        }
        
        return array("status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        return array("status" => "error", "message" => $e->getMessage());
    }
}

public function getClinicAppointments() {
    try {
        $sql = "SELECT 
                a.appointment_id, 
                a.purpose, 
                a.status,
                ts.date,
                ts.start_time,
                ts.end_time,
                up.name,
                up.department,
                up.year_level,
                up.id_number,
                up.profile_image_path
            FROM appointments a
            JOIN time_slots ts ON a.slot_id = ts.slot_id
            JOIN user_profiles up ON a.user_id = up.user_id
            ORDER BY ts.date DESC, ts.start_time ASC";
            
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            "status" => "success",
            "data" => $appointments
        ];
    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => $e->getMessage()
        ];
    }
}

}
