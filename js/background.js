// const SEARCH_ENDPOINT = "https://fathomless-tundra-65369.herokuapp.com/search"
const SEARCH_ENDPOINT = "http://127.0.0.1:8080/search"
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

function fetchPostInit(content){
  var headers = new Headers({
    'Content-Type': 'application/json'
  })
  return { method: 'POST',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: JSON.stringify(content)}
}

function filterHistory(query, historyObjs){
  fetch(SEARCH_ENDPOINT,fetchPostInit(historyObjs))
    .then(function(result){
      debugger
    }).catch(function(error){
      debugger
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
