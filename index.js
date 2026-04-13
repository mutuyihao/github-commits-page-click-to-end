// ==UserScript==
// @name         Github commits最后一页
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This will help users get a button to click to end of the github commits page.
// @author       Mutu
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470176/Github%20commits%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/470176/Github%20commits%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let reg = new RegExp("\/commits\/")
    var isInsert = false
    var timer = setInterval(() => {
        if (isInsert) {
            if (reg.test(window.location.pathname)) {
            } else {
                getCommits()
                isInsert = false
            }
        } else {
            if (reg.test(window.location.pathname)) {
                insertBtn()
                isInsert = true
            } else {
                getCommits()
            }
        }
    }, 1000);

    function getCommits() {
        let commitsEl = document.querySelector("a.fgColor-default span") || document.querySelector("a[href*='/commits/'] span");
        if (commitsEl) {
            let commitsStr = commitsEl.innerText.replace(/[^0-9]/g, "");
            sessionStorage.setItem("commits", commitsStr)
            console.log('[Github-Commits-End] Found commits:', commitsStr)
        } else {
            console.log('[Github-Commits-End] Fail to find out commit number')
        }
    }

    function insertBtn() {
        let commitsStr = sessionStorage.getItem("commits")
        if (!commitsStr) return;

        let btnToNext = document.querySelector('a[aria-label="Next Page"]')
        if (!btnToNext) return;

        // Avoid duplicate insertion
        if (document.querySelector('#click-to-end-btn')) return;

        let btnGroup = btnToNext.parentNode
        let btnToEnd = document.createElement('a')

        // Copy classes and styles
        btnToNext.classList.forEach(cls => btnToEnd.classList.add(cls));
        btnToEnd.id = 'click-to-end-btn'
        btnToEnd.style.marginLeft = '8px'; // Add some spacing

        let commitsNum = parseInt(commitsStr, 10)
        // Adjust the offset to go to the very end
        btnToEnd.href = btnToNext.href.replace(/\+\d+/g, `+${commitsNum - 35}`)
        btnToEnd.innerText = "Click To End"

        btnGroup.appendChild(btnToEnd)
        console.log('[Github-Commits-End] Button inserted');
    }
})();