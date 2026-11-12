// Export unmodified frames from the provider recording, including native browser chrome.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const args=process.argv.slice(2);
const runId=args[args.indexOf('--run-id')+1];
const ocr=args[args.indexOf('--ocr')+1];
if(!args.includes('--run-id') || !args.includes('--ocr'))throw new Error('Usage: node export-browser-frames.mjs --run-id ID --ocr OCR_EXECUTABLE');
const root=path.resolve(import.meta.dirname,'../../..');
process.loadEnvFile(path.join(root,'tests/gui/.env'));
const headers={Authorization:'Basic '+Buffer.from(process.env.BROWSERSTACK_USERNAME+':'+process.env.BROWSERSTACK_ACCESS_KEY).toString('base64')};
async function fetchProvider(url) {
  let lastError;
  for (let retry=0;retry<3;retry++) {
    try {
      const response=await fetch(url,{headers,signal:AbortSignal.timeout(60000)});
      if(response.ok)return response;
      throw new Error(`Provider HTTP ${response.status}`);
    } catch(error) { lastError=error; if(retry<2)await new Promise(r=>setTimeout(r,1500)); }
  }
  throw lastError;
}
const attempts=JSON.parse(fs.readFileSync(path.join(root,'artifacts/gui/cross-platform',runId,'attempts.json'),'utf8'));
const out=path.join(root,'docs/gui-checklist/cross-platform/browser-evidence/captures/browser-window',runId);
fs.mkdirSync(out,{recursive:true});
const manifestPath=path.join(out,'manifest.json');
const manifest=fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath,'utf8')) : [];
const gaps=[];
for(const attempt of attempts){
 try {
 const sessionId=attempt.environment.sessionId;
 if(!sessionId)throw new Error('No verified provider session: setup was blocked before UI execution');
 const previous=manifest.find(e=>e.sessionId===sessionId && e.itemId===attempt.itemId);
 if(previous && fs.existsSync(path.join(root,previous.image)) && crypto.createHash('sha256').update(fs.readFileSync(path.join(root,previous.image))).digest('hex')===previous.sha256){console.log('Verified existing frame',attempt.itemId);continue;}
 const response=await fetchProvider(`https://api.browserstack.com/automate/sessions/${sessionId}.json`);
 if(!response.ok)throw new Error(`Provider session HTTP ${response.status}`);
 const {automation_session:s}=await response.json();
 if(!s.video_url)throw new Error(`Recording unavailable: ${sessionId}`);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hw03-browser-frame-'));
 const cacheDir=path.join(root,'artifacts/gui/browser-video-cache');fs.mkdirSync(cacheDir,{recursive:true});
 const videoPath=path.join(cacheDir,sessionId+'.mp4');
 if(!fs.existsSync(videoPath)){
   const video=await fetchProvider(s.video_url);
   fs.writeFileSync(videoPath,Buffer.from(await video.arrayBuffer()));
 }
 const probe=JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_format','-of','json',videoPath],{encoding:'utf8'}));
 const duration=Number(probe.format.duration);
 const start=Math.max(0,duration-25);
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',String(start),'-i',videoPath,'-vf','fps=1','-frames:v','25',path.join(temp,'frame-%03d.png')]);
 const frames=fs.readdirSync(temp).filter(f=>f.endsWith('.png')).sort().map(f=>path.join(temp,f));
 const markerPath=path.join(root,'docs/gui-checklist/cross-platform/browser-evidence/captures',attempt.targetId,runId,`${attempt.itemId}-recording-marker.json`);
 const marker=JSON.parse(fs.readFileSync(markerPath,'utf8'));
 const review={itemId:attempt.itemId,platform:attempt.targetId,runId,sessionId,marker,start,frames,providerCreatedAt:s.created_at,videoSha256:crypto.createHash('sha256').update(fs.readFileSync(videoPath)).digest('hex')};
 fs.writeFileSync(path.join(out,`${attempt.itemId}-review.json`),JSON.stringify(review,null,2));
 if(args.includes('--prepare-only')) {
   fs.writeFileSync(path.join(out,`${attempt.itemId}-review.json`),JSON.stringify({itemId:attempt.itemId,platform:attempt.targetId,runId,sessionId,marker,start,frames,providerCreatedAt:s.created_at,videoSha256:crypto.createHash('sha256').update(fs.readFileSync(videoPath)).digest('hex')},null,2));
   console.log('Prepared manual frame review',attempt.itemId,temp);
   continue;
 }
 const expected=(Date.parse(marker.visibleFrom)-Date.parse(s.created_at))/1000+2;
 const target=Number.isFinite(expected) ? expected : duration-8;
 const ordered=frames.map((file,index)=>({file,index})).sort((a,b)=>Math.abs(start+a.index-target)-Math.abs(start+b.index-target));
 let chosen;
 if(args.includes('--candidate-frame')) {
   const index=Math.max(0,Math.min(frames.length-1,Math.round(duration-6-start)));
   chosen={path:frames[index],text:null};
 }
 for(const {file} of (chosen ? [] : ordered)){
   const raw=execFileSync(ocr,[file],{encoding:'utf8',maxBuffer:1024*1024,timeout:15000}).trim();
   if(!raw)continue;
   const result=JSON.parse(raw.split('\n')[0]);
   if(result.text.includes('23120367@student.hcmus.edu.vn')){chosen=result;break;}
 }
 if(!chosen)throw new Error(`No frame with readable student email: ${attempt.itemId}/${sessionId}. Inspect ${temp}`);
 const imagePath=path.join(out,`${attempt.itemId}-browser.png`);
 fs.copyFileSync(chosen.path,imagePath);
 const frameIndex=frames.indexOf(chosen.path);

 manifest.push({itemId:attempt.itemId,platform:attempt.targetId,runId,sessionId,
  dashboardURL:`https://automate.browserstack.com/dashboard/v2/sessions/${sessionId}`,
  source:'Unmodified frame from BrowserStack provider video; watermark rendered on the page during the actual run.',
  videoFrameSecondsApprox:start+frameIndex,providerCreatedAt:s.created_at,actualURL:marker.actualURL,identity:marker.context.identity,
  image:path.relative(root,imagePath),sha256:crypto.createHash('sha256').update(fs.readFileSync(imagePath)).digest('hex'),
  ocrText:chosen.text,selectionMethod:args.includes('--candidate-frame')?'Candidate from native provider video; requires direct visual review':'OCR candidate; requires direct visual review',visualReview:'pending'});
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log(`Exported ${attempt.itemId} / ${attempt.targetId}: ${imagePath}`);
 } catch(error) {
   gaps.push({itemId:attempt.itemId,platform:attempt.targetId,runId,error:String(error)});
   fs.writeFileSync(path.join(out,'gaps.json'),JSON.stringify(gaps,null,2));
   console.error('Frame needs follow-up:',attempt.itemId,String(error));
 }
}
fs.writeFileSync(path.join(out,'gaps.json'),JSON.stringify(gaps,null,2));
if(gaps.length)process.exitCode=1;
