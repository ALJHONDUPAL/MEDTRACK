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

    // // Method to get the profile of a specific user by their ID
    // public function getUserProfile($user_id) {
    //     $sql = "SELECT * FROM user_profiles WHERE user_id = :user_id";

    //     try {
    //         $stmt = $this->pdo->prepare($sql);
    //         $stmt->execute(['user_id' => $user_id]);
    //         $profile = $stmt->fetch();
            
    //         if ($profile) {
    //             return $this->sendPayload($profile, "success", "User profile fetched successfully", 200);
    //         } else {
    //             return $this->sendPayload(null, "error", "Profile not found", 404);
    //         }
    //     } catch (\PDOException $e) {
    //         return $this->sendPayload(null, "error", $e->getMessage(), 403);
    //     }
    // }

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

}
?>
