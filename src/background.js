// Function to add the rule
function addBlockMainFrameRule() {
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            'id': 1,
            'priority': 1,
            'action': {
                'type': 'block',
            },
            'condition': {
                'urlFilter': '*',
                'resourceTypes': [
                    'main_frame',
                ]
            }
        }],
        removeRuleIds: [1]
    });
}

function createAllowTabRule(tabId) {
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            id: tabId,
            priority: 2,
            action: { type: "allow" },
            condition: {
                tabIds: [tabId],
                urlFilter: "*",
                resourceTypes: ["main_frame"]
            }
        }],
        removeRuleIds: [tabId]
    });
}

function removeAllowTabRule(tabId) {
    chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [tabId]
    });
}

chrome.runtime.onInstalled.addListener(() => {
    addBlockMainFrameRule();
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            createAllowTabRule(tab.id);
        });
    });
});

chrome.runtime.onStartup.addListener(() => {
    addBlockMainFrameRule();
})

chrome.tabs.onCreated.addListener((tab) => {
    setTimeout(() => {
        createAllowTabRule(tab.id);
    }, 1000)
});

chrome.tabs.onRemoved.addListener((tabId) => {
    removeAllowTabRule(tabId);
})