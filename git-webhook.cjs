const http = require('http');
const { exec } = require('child_process');

const PORT = 3001;
const REPO_PATH_BACK = '/root/barbershop/backend';
const REPO_PATH_FRONT= '/root/barbershop/frontend';

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('Backend webhook received, updating app...');

            // Respond immediately to avoid timeout
            res.statusCode = 200;
            res.end('Backend webhook received');

            // Run git pull and docker rebuild in background
            exec(`cd ${REPO_PATH_FRONT} && git pull && pm2 restart 0`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error:', error);
                    return;
                }
                console.log('Frontend app updated successfully');
                console.log(stdout);
            });

            // Run git pull and docker rebuild in background
            exec(`cd ${REPO_PATH_BACK} && git pull && docker compose build && docker compose up -d`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error:', error);
                    return;
                }
                console.log('Backend app updated successfully');
                console.log(stdout);
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Backend webhook server running on port ${PORT}`);
});