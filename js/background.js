// const SEARCH_ENDPOINT = "https://fathomless-tundra-65369.herokuapp.com/search"
const SEARCH_ENDPOINT = "http://127.0.0.1:8080/"
var historyObjectsCache;

function fetchAllHistory(){
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

function filterHistory(query, historyObjs){
  const urls = historyObjs.map(o => o.url)
  console.dir({query, urls})
  fetch(SEARCH_ENDPOINT, fetchInit('POST',{query, urls}))
    .then(function(result){
      if(result.status == 200){
        const request_id = result.body
        console.info(request_id)

      }
    }).catch(function(error){
      console.error(error);
    })
}

function pollingResults(request_id){

  return new Promise(function(resolve, reject){
    const pollingIntervalId = setInterval(pollResults, 1000)
    var requestsCounter = 0
    const MAX_REQUESTS = 200
    function pollResults(req_id){
      fetch(SEARCH_ENDPOINT + req_id,fetchInit('GET')).then((result)=> {
        console.dir(result)
        if(result.status == 200){
          clearInterval(pollingIntervalId)
          resolve(result.body)
        }else if(result.status != 404 || requestsCounter > MAX_REQUESTS){
          clearInterval(pollingIntervalId)
          reject(result)
        }
      })
    }
  })
}

chrome.omnibox.onInputStarted.addListener((text, suggest) => {
  fetchAllHistory().then((historyObjs) => {
    filterHistory(text, historyObjs)
  })
})

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  fetchAllHistory().then((historyObjs) => {
    filterHistory(text, historyObjs)
  })
})

chrome.omnibox.onInputEntered.addListener((text,disposition)=>{

})

chrome.omnibox.onInputCancelled.addListener((text,disposition)=>{

})

chrome.omnibox.setDefaultSuggestion({ description:"all"})
