<?php
/**
 * API Endpoint Router
 *
 * This PHP script serves as a simple API endpoint router, handling GET and POST requests for specific resources.
 */

// Allow requests from any origin
header('Access-Control-Allow-Origin: *');
// Allow specific HTTP methods
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight request
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization");
    header("Access-Control-Max-Age: 86400");
    header("Content-Length: 0");
    header("Content-Type: application/json");
    http_response_code(200);
    exit;
}

// Include required modules
require_once "./modules/get.php";
require_once "./modules/post.php";
require_once "./config/database.php";

$con = new Connection();
$pdo = $con->connect();

// Initialize Get and Post objects
$get = new Get($pdo);
$post = new Post($pdo);

// Check if 'request' parameter is set in the request
if (isset($_REQUEST['request'])) {
    // Split the request into an array based on '/'
    $request = explode('/', $_REQUEST['request']);
} else {
    // If 'request' parameter is not set, return a 404 response
    echo json_encode(["status" => "error", "message" => "Not Found"]);
    http_response_code(404);
    exit();
}

// Handle requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {

    // Handle GET requests
    case 'GET':
        switch ($request[0]) {
            // Get user profile by user ID
            // case 'getUserProfile':
            //     if (isset($request[1])) {
            //         $user_id = (int) $request[1];
            //         echo json_encode($get->getUserProfile($user_id));
            //     } else {
            //         echo json_encode(["status" => "error", "message" => "User ID is required"]);
            //         http_response_code(400);
            //     }
            //     break;

            // Get user profile by domain account (email or username)
            case 'getProfileByDomainAccount':
                if (isset($request[1])) {
                    $domain_account = $request[1];
                    echo json_encode($get->getProfileByDomainAccount($domain_account));
                } else {
                    echo json_encode(["status" => "error", "message" => "Domain account is required"]);
                    http_response_code(400);
                }
                break;

            // Get all user profiles (optional route)
            case 'getAllUserProfiles':
                echo json_encode($get->getAllUserProfiles());
                break;

            
                case 'getAllClinicStaff':
                    $get = new Get($pdo);
                    echo json_encode($get->getAllClinicStaff());
                    break;


            // get the firstname and lastname

            // Fetch the firstname and lastname of a user
           // Route to get user's firstname and lastname by userId
           // Route to get user's firstname and lastname by id
           case 'getUserFullNameByUsername':
            if (isset($_GET['username'])) {
                $username = $_GET['username']; // Get the username from the query parameter
                echo json_encode($get->getUserFullNameByUsername($username));
            } else {
                echo json_encode(["status" => "error", "message" => "Username is required"]);
                http_response_code(400);
            }
            break;
        
        
        
    break;



            
            default:
                echo json_encode(["status" => "error", "message" => "Invalid GET request"]);
                http_response_code(404);
                break;
        }
        break;

    // Handle POST requests    
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        switch ($request[0]) {

///////////////////////////STUDENT SIDE/////////////////////////////////////////////////////////////

            // User login route
            case 'userLogin':
                echo json_encode($post->loginUser($data));
                break;

            // User registration route
            case 'userRegister':
                echo json_encode($post->registerUser($data));
                break;
            
             case 'updateUserProfile':
                if (!empty($_FILES) || !empty($_POST)) {
                        // Directly pass $_POST and $_FILES to the controller
                        echo json_encode($post->updateUserProfile());
                    } else {
                        echo json_encode([
                            "status" => "error", 
                            "message" => "No data received"
                        ]);
                        http_response_code(400);
                    }
                    break;

        

///////////////////////////CLINIC SIDE/////////////////////////////////////////////////////////////

            case 'clinicLogin':
                echo json_encode($post->clinicLogin($data));
                break;
                  
        
            case 'addClinicStaff':
                echo json_encode($post->addClinicStaff($data));
                break;
                        
            case 'deleteClinicStaff':
                 if (isset($request[1])) {
                 echo json_encode($post->deleteClinicStaff($request[1]));}
                break;
                

            default:
                echo json_encode(["status" => "error", "message" => "Forbidden"]);
                http_response_code(403);
                break;
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not available"]);
        http_response_code(404);
        break;
}
?>
