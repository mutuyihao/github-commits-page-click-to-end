// ==UserScript==
// @name         Github commits最后一页
// @namespace    http://tampermonkey.net/
// @version      0.1
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
        if (document.querySelector(".Details strong")) {
            let commits = document.querySelector(".Details strong").innerText
            sessionStorage.setItem("commits", commits)
        }
    }

    function insertBtn() {
        let commitsStr = sessionStorage.getItem("commits")
        let btnGroup = document.querySelector(".BtnGroup")
        let btnToNext = document.querySelector(".BtnGroup a")
        let btnToEnd = document.createElement('a')
        btnToEnd.className = "btn btn-outline BtnGroup-item"
        let commitsNum = parseInt(commitsStr.replace(/,/, ""), 10)
        btnToEnd.href = btnToNext.href.replace(/\+\d+/g, `+${commitsNum - 34}`)
        btnToEnd.innerText = "Click To End"
        btnGroup.appendChild(btnToEnd)
    }
})();