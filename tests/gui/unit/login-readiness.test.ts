import test from 'node:test';
import assert from 'node:assert/strict';
import { loginViaUi } from '../fixtures/session.ts';

test('login waits for hydrated form and authentication before returning', async () => {
  const events: string[] = [];
  const locator: any = {
    or: () => locator, first: () => locator, filter: () => locator,
    waitFor: async () => { events.push('ready'); },
    isVisible: async () => { assert.ok(events.includes('ready')); return true; },
    fill: async () => {}, press: async () => { events.push('submit'); }, click: async () => { events.push('submit'); },
  };
  const page: any = {
    goto: async () => {}, getByRole: () => locator,
    getByPlaceholder: () => locator, locator: () => locator,
    waitForFunction: async () => { assert.ok(events.includes('submit')); events.push('authenticated'); },
  };
  await loginViaUi(page, 'http://admin.test', { email: 'admin@test.com', password: 'test' });
  assert.ok(events.includes('authenticated'));
});

test('admin setup submits with Enter while the mobile keyboard is open', async () => {
  const events:string[]=[];
  const field:any={or:()=>field,first:()=>field,filter:()=>field,waitFor:async()=>{},isVisible:async()=>true,fill:async()=>{},press:async(key:string)=>events.push(key),click:async()=>{throw new Error('coordinate click blocked by Android keyboard');}};
  const page:any={goto:async()=>{},getByRole:()=>field,getByPlaceholder:()=>field,locator:()=>field,waitForFunction:async()=>{}};
  await loginViaUi(page,'http://admin.test',{email:'admin@test.com',password:'test'});
  assert.deepEqual(events,['Enter']);
});
