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

    // Method to get the profile of a specific user by their ID
    public function getUserProfile($user_id) {
        $sql = "SELECT * FROM user_profiles WHERE user_id = :user_id";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['user_id' => $user_id]);
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
}
?>
