# HouseLook M-Pesa Server

This is the M-Pesa payment server for HouseLook that handles STK Push requests.

## Setup Instructions

### 1. Install Dependencies
```bash
cd mpesa
npm install
```

### 2. Start the Server
```bash
npm start
```

Or use the batch file from the root directory:
```bash
start-mpesa-server.bat
```

### 3. Verify Server is Running
The server should start on `http://localhost:3001`

You should see: `M-Pesa server running at localhost:3001`

## API Endpoints

- `GET /` - Server health check
- `POST /stk` - Initiate M-Pesa STK Push
- `POST /callback` - M-Pesa callback (for production)

## Troubleshooting

### Common Issues:

1. **Port 3001 already in use**
   - Change the port in `index.js` or kill the process using port 3001

2. **M-Pesa API errors**
   - Check if the consumer key and secret are correct
   - Ensure you're using the sandbox environment for testing

3. **CORS errors**
   - The server is configured to allow all origins for development
   - For production, configure specific origins

## Development

For development with auto-restart:
```bash
npm run dev
```

## Production Deployment

1. Set up environment variables
2. Configure proper CORS origins
3. Set up SSL certificates
4. Use a process manager like PM2 