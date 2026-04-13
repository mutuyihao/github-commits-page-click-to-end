// ==UserScript==
// @name         Github commits最后一页
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This will help users get a button to click to end of the github commits page.
// @author       Mutu
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const SELECTORS = {
        COMMIT_COUNT: 'a.fgColor-default span, a[href*="/commits/"] span, .NumbersSummary-item a[href*="/commits/"] strong',
        NEXT_BTN: 'a[aria-label="Next Page"]',
        NAV_BAR: 'nav[aria-label="Pagination"]'
    };

    let totalCommits = sessionStorage.getItem("commits");
    let lastUrl = location.href;

    function log(...args) {
        console.log('[Github-Commits-End]', ...args);
    }

    async function fetchCommitCount() {
        try {
            const repoUrl = window.location.pathname.split('/commits/')[0];
            log('Fetching commit count from:', repoUrl);
            const response = await fetch(repoUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const commitsEl = doc.querySelector(SELECTORS.COMMIT_COUNT);
            if (commitsEl) {
                const count = commitsEl.innerText.replace(/[^0-9]/g, "");
                sessionStorage.setItem("commits", count);
                totalCommits = count;
                log('Fetched count from home:', count);
                return count;
            }
        } catch (e) {
            log('Error fetching count:', e);
        }
        return null;
    }

    async function runLogic() {
        if (!window.location.pathname.includes('/commits/')) {
            const el = document.querySelector(SELECTORS.COMMIT_COUNT);
            if (el) {
                let count = el.innerText.replace(/[^0-9]/g, "");
                if (count && count !== totalCommits) {
                    totalCommits = count;
                    sessionStorage.setItem("commits", totalCommits);
                    log('Updated count from current page:', totalCommits);
                }
            }
            return;
        }

        // On commits page
        if (!totalCommits || totalCommits === "undefined") {
            totalCommits = await fetchCommitCount();
        }

        if (totalCommits && totalCommits !== "undefined") {
            insertBtn();
        }
    }

    function insertBtn() {
        if (document.getElementById('click-to-end-btn')) return;

        const nextBtn = document.querySelector(SELECTORS.NEXT_BTN);
        if (!nextBtn) return;

        const navBar = document.querySelector(SELECTORS.NAV_BAR);
        if (!navBar) return;

        const btnToEnd = document.createElement('a');

        // Copy standard classes
        nextBtn.classList.forEach(cls => btnToEnd.classList.add(cls));
        btnToEnd.id = 'click-to-end-btn';
        btnToEnd.innerText = "Click To End";

        // Styling to avoid 'crowding' and maintain layout
        btnToEnd.style.display = 'inline-flex';
        btnToEnd.style.alignItems = 'center';
        btnToEnd.style.marginLeft = '12px';
        btnToEnd.style.paddingLeft = '12px';
        btnToEnd.style.paddingRight = '12px';
        btnToEnd.style.border = '1px solid var(--color-border-default, #d0d7de)';
        btnToEnd.style.borderRadius = '6px';
        btnToEnd.style.color = 'var(--color-accent-fg, #0969da)';
        btnToEnd.style.fontSize = '14px';
        btnToEnd.style.textDecoration = 'none';

        const commitsNum = parseInt(totalCommits, 10);
        // Robust regex replacement for after parameter
        if (nextBtn.href.includes('+')) {
            btnToEnd.href = nextBtn.href.replace(/\+\d+/, `+${commitsNum - 35}`);
        } else {
            btnToEnd.href = nextBtn.href + `+${commitsNum - 35}`;
        }

        // Insert after the next button
        navBar.insertAdjacentElement('beforeend', btnToEnd);
        log('Button inserted successfully');
    }

    // Handle soft navigations and DOM updates
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            runLogic();
        } else if (window.location.pathname.includes('/commits/') && !document.getElementById('click-to-end-btn')) {
            runLogic();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial execution
    runLogic();
})();