// config.js

// You can set these from environment variables during build (recommended for security)
// If not provided, it falls back to default values

const config = {
  API_BASE_URL:   "http://localhost:3000"|| "https://your-backend.onrender.com/api",
  FILE_UPLOAD_URL:  "https://your-s3-bucket-url.amazonaws.com",
  APP_NAME: "Resource Sharing Platform",
  VERSION: "1.0.0"
};

export default config;
