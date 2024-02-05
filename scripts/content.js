const bannedUrlWords = ['porn', 'xhamster', 'tukif', 'xvideo', 'xnxx', 'spankbang', 'pussy', 'dick', 'cock', 'vagina', 'clitoris', 'penis', 'kamasutra', 'nudity', 'vierge', 'virginity', 'nude', 'naked', 'sexy', 'penis'];
const bannedContentWords = ['porno', ' sex', ' dick', ' cock ', ' vagina', ' kamasutra', ' nude', ' vierge', ' penis', ' naked', 'clitoris'];
const minAcceptedBannedWordCount = 4;

const errorPageHtml = "<div style='width:100vw;height:100vh;background:black;color:white;padding-top:25vh'><center><h1 style='color:red;'>ALERT !</h1><h2>$text</h2></center></div>";
const textToShow = "This page is dangerous, please exit quickly.";

/**
 * Search banned word in url content.
 */
function isUrlSafe() {
    const pageUrl = window.location.href.toLowerCase();
    for (let bannedWord of bannedUrlWords) {
        if (pageUrl.includes(bannedWord)) {
            return false;
        }
    }
    return true;
}


/**
 * Search banned word in body content. 
 * Safe if less than {minAcceptedBannedWordCount}
 */
function isPageContentSafe() {
    let countBannedWordInPage = 0;
    const pageContent = document.body.innerHTML + "";
    for (let bannedWord of bannedContentWords) {
        if (pageContent.includes(bannedWord)) {
            countBannedWordInPage++;
        }
    }
    return countBannedWordInPage <= minAcceptedBannedWordCount;
}

/**
 * Change content to text error
 */
function hidePage() {
    translate(textToShow, {
        onDone: function (traduction) {
            document.body.innerHTML = errorPageHtml.replace('$text', traduction);
        }
    });
}

/**
 * Translate text
 * @param {*} text 
 * @param {*} handler 
 */
function translate(text, handler) {
    const defaultLanguage = 'en';
    const userLanguage = navigator.language || navigator.userLanguage;

    if (defaultLanguage === userLanguage.toLowerCase()) {
        return text;
    }

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${defaultLanguage}&tl=${userLanguage}&dt=t&q=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            var traduction = data[0][0][0];
            if (traduction) {
                handler.onDone(traduction)
            } else {
                handler.onDone(text);
            }
        })
        .catch(error => handler.onDone(text));
}

/**
 * Main function
 * Hide the page content first so that no content is displayed before the site is crawled 
 */
function startProtection() {
    const originalPageContent = document.body.innerHTML + "";
    document.body.innerHTML = "";

    if (!isUrlSafe() || !isPageContentSafe()) {
        hidePage();
    } else {
        document.body.innerHTML = originalPageContent;
    }
}

startProtection();


