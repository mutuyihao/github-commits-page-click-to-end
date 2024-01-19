// ==UserScript==
// @name         Github commits最后一页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
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
        const spanList = document.getElementsByTagName('span')
        let commits
        for (let ele of spanList) {
            let index = ele.innerText.indexOf('Commits')
            if (index > 0) {
                commits = ele.innerText.slice(0, index).replace(',', '')
                break
            }
        }
        if (commits > 0) {
            sessionStorage.setItem("commits", commits)
        }
    }
    function insertBtn() {
        let commitsStr = sessionStorage.getItem("commits")
        let btnGroup = getBtnGroup()
        let btnToNext = btnGroup.lastElementChild
        let btnToEnd = document.createElement('a')
        btnToEnd.className = btnToNext.classList.value
        let commitsNum = parseInt(commitsStr.replace(/,/, ""), 10)
        btnToEnd.href = btnToNext.href.replace(/\+\d+/g, `+${commitsNum - 34}`)
        btnToEnd.innerText = "Click To End"
        btnGroup.appendChild(btnToEnd)
    }
    function getBtnGroup() {
        const spanList = document.getElementsByTagName('span')
        let temp;
        for (let ele of spanList) {

            if (ele.innerText == 'Next') {
                temp = ele
                break
            }
        }
        return temp.parentElement.parentElement
    }
})();