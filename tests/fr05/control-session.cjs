// Interactive control for disposable fixture/proxy and Metro lifecycle only.
const readline=require('node:readline');
const rl=readline.createInterface({input:process.stdin,output:process.stdout,terminal:false});
let chain=Promise.resolve();
rl.on('line', line => {
  chain=chain.then(async()=>{
    const c=JSON.parse(line);
    const response=await fetch('http://127.0.0.1:3002/__control',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)});
    if(!response.ok)throw Error(await response.text());
    console.log('CONTROL '+await response.text());
    if(c.reload)await new Promise((resolve,reject)=>{
      const ws=new WebSocket('ws://127.0.0.1:8081/message');
      ws.addEventListener('open',()=>{ws.send(JSON.stringify({version:2,method:'reload'}));ws.close();});
      ws.addEventListener('close',resolve);ws.addEventListener('error',reject);
    });
    console.log('READY '+(c.label||c.fixtureId));
  }).catch(e=>console.error('CONTROL_ERROR '+e.message));
});
console.log('FR05 control session ready; send JSON fixtureId/mode/delayMs/reload/label per line');
