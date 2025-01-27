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

public function getUserProfile($user_id) {
    try {
        $sql = "SELECT up.*, u.domain_account 
                FROM user_profiles up 
                JOIN users u ON u.user_id = up.user_id 
                WHERE up.user_id = :user_id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($profile) {
            return $this->sendPayload($profile, "success", "User profile fetched successfully", 200);
        } else {
            // If no profile exists, get basic user info and return empty profile
            $userSql = "SELECT user_id, domain_account FROM users WHERE user_id = :user_id";
            $userStmt = $this->pdo->prepare($userSql);
            $userStmt->execute(['user_id' => $user_id]);
            $user = $userStmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $emptyProfile = [
                    'user_id' => $user['user_id'],
                    'domain_account' => $user['domain_account'],
                    'first_name' => '',
                    'last_name' => '',
                    'middle_name' => '',
                    'id_number' => '',
                    'department' => '',
                    'program' => '',
                    'year_level' => '',
                    'profile_image_path' => null
                ];
                return $this->sendPayload($emptyProfile, "success", "Empty profile created", 200);
            }
            return $this->sendPayload(null, "error", "User not found", 404);
        }
    } catch (\PDOException $e) {
        return $this->sendPayload(null, "error", $e->getMessage(), 500);
    }
}

public function getMedicalDocuments($user_id) {
    try {
        $sql = "SELECT * FROM medical_documents WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendPayload($documents, "success", "Medical documents retrieved successfully", 200);
    } catch (\PDOException $e) {
        return $this->sendPayload(null, "error", $e->getMessage(), 500);
    }
}

public function getVaccinationRecords($user_id) {
    try {
        $sql = "SELECT * FROM vaccination_records WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendPayload($records, "success", "Vaccination records retrieved successfully", 200);
    } catch (\PDOException $e) {
        return $this->sendPayload(null, "error", $e->getMessage(), 500);
    }
}

//CLINIC SIDE  medical details component
public function getStudentProfiles($department = null, $year = null) {
    try {
        $sql = "
            SELECT 
                up.user_id,
                up.first_name,
                up.last_name,
                up.middle_name,
                up.department,
                up.program,
                up.year_level AS yearLevel,
                up.id_number AS idNumber,
                up.profile_image_path
            FROM user_profiles up
            WHERE 1=1
        ";

        // Add department filter if provided
        if (!empty($department)) {
            $sql .= " AND up.department = :department";
            $params[':department'] = $department;
        }

        // Add year filter if provided
        if (!empty($year)) {
            $sql .= " AND up.year_level = :year";
            $params[':year'] = $year;
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params ?? []);
        $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format the profile image paths
        foreach ($profiles as &$profile) {
            if (!empty($profile['profile_image_path'])) {
                $profile['profile_image_path'] = 'uploads/' . $profile['user_id'] . '/profile_images/' . basename($profile['profile_image_path']);
            }
        }

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
        $sql = "
            SELECT 
                up.first_name,
                up.last_name,
                up.middle_name,
                up.department,
                up.program,
                up.year_level,
                up.id_number,
                up.contact_number,
                up.profile_image_path,
                m.document_type,
                m.status as document_status,
                m.file_path,
                m.date as document_date,
                m.location as document_location,
                v.first_dose_type,
                v.first_dose_date,
                v.second_dose_type,
                v.second_dose_date,
                v.booster_type,
                v.booster_date,
                v.document_path as vaccination_document,
                v.status as vaccination_status
            FROM user_profiles up
            LEFT JOIN medical_documents m ON up.user_id = m.user_id
            LEFT JOIN vaccination_records v ON up.user_id = v.user_id
            WHERE up.user_id = :userId
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':userId' => $userId]);
        $profile = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format the response
        $formattedProfile = [];
        foreach ($profile as $row) {
            if (!isset($formattedProfile['basic'])) {
                $formattedProfile['basic'] = [
                    'name' => $row['first_name'] . ' ' . $row['last_name'],
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'middle_name' => $row['middle_name'],
                    'department' => $row['department'],
                    'program' => $row['program'],
                    'year_level' => $row['year_level'],
                    'id_number' => $row['id_number'],
                    'contact_number' => $row['contact_number'],
                    'profile_image_path' => $row['profile_image_path'],
                    'vaccination' => [
                        'first_dose_type' => $row['first_dose_type'],
                        'first_dose_date' => $row['first_dose_date'],
                        'second_dose_type' => $row['second_dose_type'],
                        'second_dose_date' => $row['second_dose_date'],
                        'booster_type' => $row['booster_type'],
                        'booster_date' => $row['booster_date'],
                        'document_path' => $row['vaccination_document'],
                        'status' => $row['vaccination_status']
                    ]
                ];
            }
            
            if ($row['document_type']) {
                $formattedProfile['documents'][$row['document_type']] = [
                    'status' => $row['document_status'] ?? 'Need Submission',
                    'file_path' => $row['file_path'],
                    'date' => $row['document_date'],
                    'location' => $row['document_location'],
                    'document_type' => $row['document_type']
                ];
            }
        }

        // Add COVID vaccination status to documents if vaccination record exists
        if (!empty($formattedProfile['basic']['vaccination']['first_dose_type']) || 
            !empty($formattedProfile['basic']['vaccination']['second_dose_type'])) {
            $formattedProfile['documents']['covidVaccination'] = [
                'status' => 'Submitted',
                'file_path' => $formattedProfile['basic']['vaccination']['document_path'],
                'date' => $formattedProfile['basic']['vaccination']['first_dose_date'] ?? 
                         $formattedProfile['basic']['vaccination']['second_dose_date'],
                'document_type' => 'covidVaccination'
            ];
        }

        return [
            "status" => "success",
            "data" => $formattedProfile
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
                a.appointment_id,
                a.slot_id,
                a.user_id,
                a.purpose,
                a.status,
                a.remarks,
                t.start_time,
                t.end_time,
                t.day_of_week,
                t.date,
                up.first_name,
                up.last_name,
                up.department,
                up.program,
                up.year_level,
                up.profile_image_path,
                up.id_number as studentId
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
        
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format the appointments data
        $formattedAppointments = array_map(function($appointment) {
            return [
                'id' => $appointment['appointment_id'],
                'slotId' => $appointment['slot_id'],
                'userId' => $appointment['user_id'],
                'studentId' => $appointment['studentId'],
                'purpose' => $appointment['purpose'],
                'status' => $appointment['status'],
                'remarks' => $appointment['remarks'],
                'date' => $appointment['date'],
                'time' => $appointment['start_time'] . ' - ' . $appointment['end_time'],
                'day' => $appointment['day_of_week'],
                'userName' => $appointment['first_name'] . ' ' . $appointment['last_name'],
                'department' => $appointment['department'],
                'program' => $appointment['program'],
                'yearLevel' => $appointment['year_level'],
                'userImage' => $appointment['profile_image_path'] ?? 'assets/default-avatar.png'
            ];
        }, $appointments);

        return array("status" => "success", "data" => $formattedAppointments);
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
                a.remarks,
                ts.date,
                ts.start_time,
                ts.end_time,
                up.first_name,
                up.last_name,
                up.department,
                up.program,
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
        
        // Format the appointments data
        $formattedAppointments = array_map(function($appointment) {
            return [
                'id' => $appointment['appointment_id'],
                'studentName' => $appointment['first_name'] . ' ' . $appointment['last_name'],
                'studentId' => $appointment['id_number'],
                'department' => $appointment['department'],
                'program' => $appointment['program'],
                'date' => $appointment['date'],
                'time' => $appointment['start_time'] . ' - ' . $appointment['end_time'],
                'purpose' => $appointment['purpose'],
                'yearLevel' => $appointment['year_level'],
                'avatar' => $appointment['profile_image_path'] ?? 'assets/default-avatar.png',
                'status' => $appointment['status'],
                'remarks' => $appointment['remarks']
            ];
        }, $appointments);

        return [
            "status" => "success",
            "data" => $formattedAppointments
        ];
    } catch (PDOException $e) {
        return [
            "status" => "error",
            "message" => $e->getMessage()
        ];
    }
}

public function getDocumentDistributionByDepartment() {
    try {
        $sql = "SELECT 
                    up.department,
                    COUNT(DISTINCT md.user_id) as student_count
                FROM user_profiles up
                LEFT JOIN medical_documents md ON up.user_id = md.user_id
                GROUP BY up.department";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $distribution = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendPayload($distribution, "success", "Document distribution retrieved successfully", 200);
    } catch (PDOException $e) {
        return $this->sendPayload(null, "error", $e->getMessage(), 400);
    }
}

public function getStudentAppointments($userId) {
    try {
        $sql = "SELECT a.appointment_id as id, a.slot_id as slotId, 
                a.user_id as userId, a.purpose, a.status, a.remarks,
                t.date, t.start_time, t.end_time, t.day_of_week as day,
                u.name as userName, u.id_number as studentId,
                up.department, up.program, up.year_level as yearLevel,
                u.profile_image_path as userImage
                FROM appointments a
                JOIN time_slots t ON a.slot_id = t.slot_id
                JOIN users u ON a.user_id = u.user_id
                JOIN user_profiles up ON u.user_id = up.user_id
                WHERE a.user_id = :user_id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format the time for each appointment
        foreach ($appointments as &$appointment) {
            $appointment['time'] = $appointment['start_time'] . ' - ' . $appointment['end_time'];
            unset($appointment['start_time'], $appointment['end_time']);
        }

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


//clinic for dashboard 
public function getListStudentProfiles($department = null, $year = null) {
    try {
        $sql = "
        SELECT 
            up.user_id,
            up.first_name,
            up.last_name,
            up.middle_name,
            up.department,
            up.program,
            up.year_level AS yearLevel,
            up.id_number AS idNumber,
            
       
            IFNULL(JSON_ARRAYAGG(
                DISTINCT JSON_OBJECT(
                    'user_id', md.user_id,
                    'document_type', md.document_type,
                    'date', md.date,
                    'status', md.status,
                    'location', md.location,
                    'uploaded_at', md.uploaded_at
                )
            ), '[]') AS medical_documents,

            
            IFNULL(JSON_ARRAYAGG(
                DISTINCT JSON_OBJECT(
                    'user_id', vr.user_id,
                    'first_dose_type', vr.first_dose_type,
                    'first_dose_date', vr.first_dose_date,
                    'second_dose_type', vr.second_dose_type,
                    'second_dose_date', vr.second_dose_date,
                    'booster_type', vr.booster_type,
                    'booster_date', vr.booster_date,
                    'status', vr.status,
                    'uploaded_at', vr.uploaded_at
                )
            ), '[]') AS vaccination_records
        FROM user_profiles up
        LEFT JOIN medical_documents md ON md.user_id = up.user_id
        LEFT JOIN vaccination_records vr ON vr.user_id = up.user_id
        WHERE 1=1
        ";
        
        $params = [];

        // Add filters
        if (!empty($department)) {
            $sql .= " AND up.department = :department";
            $params[':department'] = $department;
        }
        if (!empty($year)) {
            $sql .= " AND up.year_level = :year";
            $params[':year'] = $year;
        }

        // Group results by user_id for proper aggregation
        $sql .= " GROUP BY up.user_id, up.first_name, up.last_name, up.middle_name, up.department, up.program, up.year_level, up.id_number";

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















}
