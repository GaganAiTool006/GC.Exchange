<?php
declare(strict_types=1);
/**
 * GC Exchange authentication API (PHP 8.1+, MySQL 8+).
 * Configure DB_* environment variables; never store credentials in source control.
 * This endpoint handles account authentication only, not real crypto custody/trading.
 */
session_name('gcx_session');
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Lax']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function respond(int $status, array $data): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_SLASHES); exit; }
function body(): array { $raw=file_get_contents('php://input'); $data=json_decode($raw ?: '{}',true); return is_array($data)?$data:[]; }
function csrf_token(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32)); return $_SESSION['csrf']; }
function require_csrf(): void { $sent=$_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''; if (!is_string($sent) || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'],$sent)) respond(403,['ok'=>false,'error'=>'Security token expired. Refresh and try again.']); }
function db(): PDO {
 static $pdo=null; if ($pdo instanceof PDO) return $pdo;
 $host=getenv('DB_HOST') ?: '127.0.0.1'; $name=getenv('DB_NAME') ?: 'gc_exchange'; $user=getenv('DB_USER') ?: ''; $pass=getenv('DB_PASS') ?: '';
 if ($user==='') respond(500,['ok'=>false,'error'=>'Server database credentials are not configured.']);
 try { $pdo=new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]); return $pdo; }
 catch (Throwable $e) { error_log('GCX database connection failed: '.$e->getMessage()); respond(500,['ok'=>false,'error'=>'Service temporarily unavailable.']); }
}
function user_payload(array $u): array { return ['id'=>(int)$u['id'],'email'=>$u['email'],'displayName'=>$u['display_name'],'createdAt'=>$u['created_at']]; }

$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';
$action=$_GET['action'] ?? '';
if ($method==='GET' && $action==='csrf') respond(200,['ok'=>true,'csrf'=>csrf_token()]);
if ($method==='GET' && $action==='me') {
 if (empty($_SESSION['user_id'])) respond(200,['ok'=>true,'authenticated'=>false,'csrf'=>csrf_token()]);
 $q=db()->prepare('SELECT id,email,display_name,created_at FROM users WHERE id=?'); $q->execute([(int)$_SESSION['user_id']]); $u=$q->fetch();
 if (!$u) { $_SESSION=[]; session_regenerate_id(true); respond(200,['ok'=>true,'authenticated'=>false,'csrf'=>csrf_token()]); }
 respond(200,['ok'=>true,'authenticated'=>true,'user'=>user_payload($u),'csrf'=>csrf_token()]);
}
if ($method!=='POST') respond(405,['ok'=>false,'error'=>'Method not allowed.']);
require_csrf();
$data=body();
if ($action==='register') {
 $email=strtolower(trim((string)($data['email']??''))); $password=(string)($data['password']??''); $name=trim((string)($data['displayName']??''));
 if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>254) respond(422,['ok'=>false,'error'=>'Enter a valid email address.']);
 if (strlen($password)<12 || strlen($password)>200) respond(422,['ok'=>false,'error'=>'Password must be 12–200 characters.']);
 if ($name==='' || mb_strlen($name)>80) $name=explode('@',$email)[0];
 try { $q=db()->prepare('INSERT INTO users (email,password_hash,display_name) VALUES (?,?,?)'); $q->execute([$email,password_hash($password,PASSWORD_DEFAULT),$name]); }
 catch (PDOException $e) { if ($e->getCode()==='23000') respond(409,['ok'=>false,'error'=>'An account with this email already exists.']); error_log('GCX registration failed: '.$e->getMessage()); respond(500,['ok'=>false,'error'=>'Could not create account.']); }
 session_regenerate_id(true); $_SESSION['user_id']=(int)db()->lastInsertId(); $_SESSION['csrf']=bin2hex(random_bytes(32));
 $q=db()->prepare('SELECT id,email,display_name,created_at FROM users WHERE id=?'); $q->execute([$_SESSION['user_id']]); respond(201,['ok'=>true,'authenticated'=>true,'user'=>user_payload($q->fetch()),'csrf'=>$_SESSION['csrf']]);
}
if ($action==='login') {
 $email=strtolower(trim((string)($data['email']??''))); $password=(string)($data['password']??'');
 if (!filter_var($email,FILTER_VALIDATE_EMAIL) || $password==='') respond(422,['ok'=>false,'error'=>'Email and password are required.']);
 $q=db()->prepare('SELECT id,email,password_hash,display_name,created_at FROM users WHERE email=?'); $q->execute([$email]); $u=$q->fetch();
 if (!$u || !password_verify($password,$u['password_hash'])) { usleep(250000); respond(401,['ok'=>false,'error'=>'Email or password is incorrect.']); }
 if (password_needs_rehash($u['password_hash'],PASSWORD_DEFAULT)) { $hash=password_hash($password,PASSWORD_DEFAULT); $up=db()->prepare('UPDATE users SET password_hash=? WHERE id=?'); $up->execute([$hash,$u['id']]); }
 session_regenerate_id(true); $_SESSION['user_id']=(int)$u['id']; $_SESSION['csrf']=bin2hex(random_bytes(32)); unset($u['password_hash']);
 respond(200,['ok'=>true,'authenticated'=>true,'user'=>user_payload($u),'csrf'=>$_SESSION['csrf']]);
}
if ($action==='logout') { $_SESSION=[]; if (ini_get('session.use_cookies')) { $p=session_get_cookie_params(); setcookie(session_name(),'', ['expires'=>time()-42000,'path'=>$p['path'],'domain'=>$p['domain'],'secure'=>$p['secure'],'httponly'=>$p['httponly'],'samesite'=>'Lax']); } session_regenerate_id(true); respond(200,['ok'=>true,'authenticated'=>false,'csrf'=>csrf_token()]); }
respond(404,['ok'=>false,'error'=>'Unknown action.']);
