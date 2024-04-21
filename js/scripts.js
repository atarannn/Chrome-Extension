window.onload = function () {
    const downloadButton = document.getElementById('downloadButton');
    const selectorInput = document.getElementById('selectorInput');

    downloadButton.addEventListener('click', function() {
        const selector = selectorInput.value.trim();

        if (selector === '') {
            alert('Please enter a CSS selector.');
            return;
        }
        downloadHTML(selector);
    });
};

function getSelectedHTML(selector) {
    const selectedElements = document.querySelectorAll(selector);
    let combinedHTML = '';
    selectedElements.forEach(function(element) {
        combinedHTML += element.outerHTML + '\n';
    });
    return combinedHTML;
}

function downloadHTML(selector) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getSelectedHTML,
            args: [selector]
        }, function(results) {
            if (results && results.length > 0 && results[0].result) {
                const htmlContent = results[0].result;
                if (htmlContent.trim() !== '') {
                    downloadFile(htmlContent, tab.url);
                } else {
                    alert('No element found with the specified CSS selector.');
                }
            } else {
                alert('No element found with the specified CSS selector.');
            }
        });
    });
}

function downloadFile(htmlContent, url) {
    const blob = new Blob([htmlContent], {type: 'text/html'});
    const urlObject = URL.createObjectURL(blob);
    const filename = 'index_' + url.replace(/[^a-z0-9]/gi, '_') + '.html';
    chrome.downloads.download({
        url: urlObject,
        filename: filename,
        saveAs: true
    });
}
