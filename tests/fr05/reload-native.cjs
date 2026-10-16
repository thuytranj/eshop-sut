// Development-server lifecycle command equivalent to Metro's `r`; no SUT patch.
const ws = new WebSocket('ws://127.0.0.1:8081/message');
ws.addEventListener('open', () => { ws.send(JSON.stringify({ version: 2, method: 'reload' })); ws.close(); });
ws.addEventListener('close', () => console.log('Metro reload broadcast sent'));
ws.addEventListener('error', e => { console.error(e.message); process.exitCode = 1; });
