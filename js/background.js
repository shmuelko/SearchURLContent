// const SEARCH_ENDPOINT = "https://fathomless-tundra-65369.herokuapp.com/search"
const SEARCH_ENDPOINT = "http://127.0.0.1:8080/"
var historyObjectsCache;

function allHistory(){
  if(historyObjectsCache) return Promise.resolve(historyObjectsCache)
  return new Promise(function(resolve,reject){
    chrome.history.search({text:"", maxResults: 10}, function(results){
      historyObjectsCache = results
      resolve(results)
    })
  })
}

function fetchInit(method,content){
  const headers = new Headers({
    'Content-Type': 'application/json'
  })
  return { method: method,
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: content ? JSON.stringify(content) : undefined}
}

function getQueryId(query, historyObjs){
  const urls = historyObjs.map(o => o.url)
  console.dir({query, urls})
  return new Promise(function(resolve,reject){
    fetch(SEARCH_ENDPOINT, fetchInit('POST',{query, urls}))
    .then(function(response){
      if(response.status == 200){
        resolve(response.text())
      }
    }).catch(function(error){
      reject(error)
    })
  })
}

function pollResults(request_id){
  return new Promise(function(resolve, reject){
    const pollingIntervalId = setInterval(() => queryResults(request_id), 1500)
    var requestsCounter = 0, errorCounter = 0
    const MAX_REQUESTS = 20
    const MAX_ERRORS = 15
    function queryResults(req_id){
      fetch(SEARCH_ENDPOINT + req_id,fetchInit('GET')).then((response)=> {
        if(response.status == 200){
          response.json().then(function(searchResults){
            if(searchResults.status === "finished"){
              clearInterval(pollingIntervalId)
              resolve(searchResults)
            }
          })

        }else if(response.status != 404 || requestsCounter > MAX_REQUESTS || errorCounter > MAX_ERRORS){
          clearInterval(pollingIntervalId)
          reject(response)
        }else{
          errorCounter++
        }
      }).catch((error) => clearInterval(pollingIntervalId))
    }
  })
}

chrome.omnibox.onInputStarted.addListener((text, suggest) => {

})

chrome.omnibox.onInputChanged.addListener((text, suggest) => {

})

chrome.omnibox.onInputEntered.addListener((text,disposition)=>{
  allHistory().then((historyObjs) => {
    getQueryId(text, historyObjs).then((queryId)=>{
      pollResults(queryId).then(function(results){
        const filtered = historyObjs
                          .filter(obj => results.found_urls.includes(obj.url))
        if(filtered.length > 0) chrome.tabs.create({url:filtered[0].url})
      })
    })
  })
})

chrome.omnibox.onInputCancelled.addListener((text,disposition)=>{

})

// chrome.omnibox.setDefaultSuggestion({ description:"all"})
