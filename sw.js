const CACHE = 'qa-architect-v1';

const CORE = [
  'fullpage.html',
  'app.js',
  'styles.css',
  'icons/icon32.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

const DOCS = [
  'Last_45min_Revision_Set.md',
  'Master_Interview_QA_Bank.md',
  'Programming_Practice_Guide.md',
  'Java_Strings_Interview_Questions.md',
  'Java_Arrays_Interview_Questions.md',
  'Java_LinkedList_Interview_Questions.md',
  'Java_Collections_Framework_Interview_Questions.md',
  'NeetCode_150_Easy.md',
  'NeetCode_150_Medium.md',
  'NeetCode_150_Hard.md',
  'QA_Testing_Interview_Questions.md',
  'Playwright_BDD_Cucumber_Interview_Questions.md',
  'Playwright_RestAssured_Practice_Suite.md',
  'SOLID_Principles_QA_Guide.md',
  'LEARNING.md',
  'FRAMEWORK_CREATION_GUIDE.md',
  'GUIDE.md',
  'FRAMEWORK_VISUALISER.md',
  'AI_LLM_Testing_Guide.md',
  'Jenkins_CICD_Testing_Guide.md',
  'Flaky_Tests_CICD_Production_Interview_Questions.md',
  'INTERVIEW_QA.md',
  'Resume_Interview_QA.md',
  'README.md',
  'How_to_Design_Framework.MD'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([...CORE, ...DOCS])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for everything — works fully offline after first load
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp && resp.status === 200) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
