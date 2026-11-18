import {test,expect}from'@playwright/test';
test.beforeEach(async({page})=>{await page.route('**/api/programs',r=>r.fulfill({json:{data:[]}}));await page.route('**/api/cohorts',r=>r.fulfill({json:{data:[]}}))});
test('homepage and responsive layout',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{level:1,name:/Your next chapter/})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await expect(page.getByText('Program offerings, training authorization')).toBeVisible();for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect(img).toHaveJSProperty('complete',true);expect(await img.evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBeGreaterThan(0)}await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`test-results/home-${test.info().project.name}.png`,fullPage:true})});
test('programs do not advertise unverified offerings',async({page})=>{await page.goto('/programs');await expect(page.getByRole('heading',{name:'Program announcements are on the way.'})).toBeVisible();await expect(page.getByRole('link',{name:'Read the overview'})).toHaveAttribute('href','/programs/certified-nursing-assistant')});
test('application validates fields and stops at unavailable programs',async({page})=>{await page.goto('/apply');await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByText('Enter your first name')).toBeVisible();await page.getByLabel('First name').fill('Example');await page.getByLabel('Last name').fill('Applicant');await page.getByLabel('Email address').fill('example@example.com');await page.getByLabel('Phone number').fill('5551234567');await page.getByLabel('City and state').fill('Example, TX');await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByText('No programs are open for applications yet.')).toBeVisible();await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByText('Select an available program')).toBeVisible()});
test('faq is keyboard-operable and policies are labeled as drafts',async({page})=>{await page.goto('/admissions');const question=page.getByRole('button',{name:'How long does CNA training take?'});await question.focus();await page.keyboard.press('Enter');await expect(question).toHaveAttribute('aria-expanded','true');await page.goto('/policies/privacy');await expect(page.getByText('ACADEMY POLICIES · DRAFT')).toBeVisible()});
test('portal requires authentication',async({page})=>{await page.route('**/api/auth/me',r=>r.fulfill({status:401,json:{error:'Please sign in'}}));await page.goto('/student/dashboard');await expect(page.getByText('Sign in to access your academy workspace.')).toBeVisible()});
test('scroll feedback and reduced-motion preferences',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.locator('header')).toHaveCSS('position','sticky');
  await page.evaluate(()=>window.scrollTo({top:1000,behavior:'instant'}));
  await expect(page.locator('html')).toHaveClass(/has-scrolled/);
  await expect(page.getByRole('button',{name:'Back to top'})).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.hero-photo')).toHaveCSS('animation-name','none');
  await page.getByRole('button',{name:'Back to top'}).click();
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
});
test('signature motion responds to scrolling and pointer input',async({page,isMobile})=>{
  await page.goto('/');
  await expect(page.locator('.heartbeat-signature svg')).toBeVisible();
  const card=page.locator('.program-feature');
  if(!isMobile){
    await card.hover();
    await expect.poll(()=>card.evaluate(e=>(e as HTMLElement).style.getPropertyValue('--light-x'))).not.toBe('');
  }
  await page.locator('.steps').scrollIntoViewIfNeeded();
  await expect(page.locator('.journey-wire')).toHaveCount(2);
  await expect.poll(()=>page.locator('.steps').evaluate(e=>Number((e as HTMLElement).style.getPropertyValue('--journey-progress')))).toBeGreaterThan(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.heartbeat-ink')).toHaveCSS('animation-name','none');
  await expect.poll(()=>page.locator('.steps').evaluate(e=>(e as HTMLElement).style.getPropertyValue('--journey-progress'))).toBe('1');
});
