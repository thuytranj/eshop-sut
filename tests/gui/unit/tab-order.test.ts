import test from 'node:test';
import assert from 'node:assert/strict';
import { captureTabOrder } from '../support/ui-assertions.ts';

test('tab sampling leaves focus on the final observed page control', async () => {
  const states=['email input','submit button','back link','native browser address'];
  let focused=0;
  const page:any={evaluate:async()=>states[focused],keyboard:{press:async(key:string)=>{assert.equal(key,'Tab');focused++;}}};
  const start:any={focus:async()=>{focused=0;}};
  const sampled=await captureTabOrder(page,start,3);
  assert.deepEqual(sampled,['email input','submit button','back link']);
  assert.equal(states[focused],sampled.at(-1),'Sampling must not move focus to an unobserved native browser control');
});
