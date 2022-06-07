// add the files that should be cached using relative pathing
const FILES_TO_CACHE = [
  './index.html',
  './events.html',
  './tickets.html',
  './schedule.html',
  './assets/css/style.css',
  './assets/css/bootstrap.css',
  './assets/css/tickets.css',
  './dist/app.bundle.js',
  './dist/events.bundle.js',
  './dist/tickets.bundle.js',
  './dist/schedule.bundle.js',
];
// define global constants
const APP_PREFIX = 'footFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION; // defines which cache to use

// service workers run before the window object is created. the context of self refers to the service worker object

// listens for the install phase of the service worker
self.addEventListener('install', function(e){ 
  // .waitUntil() tells the browser to wait until the work is complete before terminating the service worker's current phase. 
  // This ensures it doesn't move on from the installing phase until it's finished executing all of it's code
  e.waitUntil(
    // open the cache to store the files
    caches.open(CACHE_NAME).then(function(cache){
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE) // adds all files to the cache storage
    })
  )
});

// listens for the activation phase of the service worker
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keyList){ // .keys() returns a promise with an array of all cache names under <username>.github.io
      let cacheKeepList = keyList.filter(function(key){ // using that list, filter out the names that contain our APP_PREFIX & save the key # to an array
        return key.indexOf(APP_PREFIX); 
      });
      cacheKeepList.push(CACHE_NAME); // add the current cache to the keeplist.

      return Promise.all( // returns a promise that resolves once ALL promises are completed
        keyList.map(function(key, i){ // deletes all old versions of the cache
          if(cacheKeepList.indexOf(key) === -1){ // if the item is not in the keepList...
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    }) 
  );
});
// listen for the fetch event. Tells the service worker what you want to do with something in the cache
self.addEventListener('fetch', function(e){
  console.log('fetch request : ' + e.request.url); // log the url of the requested resource
  e.respondWith( // prevents the browser's default fetch handling, intercepting the http request, and allows us to provide a promise for a response
    caches.match(e.request).then(function(request){ // match the request provided with the cache
      if(request){ // if the resource in the cache exist, return that cached resource
        console.log('responding with cache : ' + e.request.url)
        return request;
      } else { // if the resource is not in the cache, allow the resource to be retrieved from the online network as usual
        console.log('file is not cached, fetching : ' + e.request.url);
        return fetch(e.request);
      }
      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})