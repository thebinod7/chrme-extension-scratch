(() => {
    console.log("Content script!!")
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("Obj==>",obj)
    });
})();