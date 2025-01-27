"use strict";
var webdriver = require("selenium-webdriver"),
By = webdriver.By,
assert = require('assert'),
until = webdriver.until;
var login = require ('./loginTest.js');
var oferta = require ('./ofertar.js');

async function runScript(){
    var driver = new webdriver.Builder().forBrowser('chrome').build();
    await driver.get('https://cambionelson.karenstoletniy1996.now.sh');
    login.login(driver).then(driver => oferta.offer(driver));

    
    //await login.registre(driver);
}

runScript();


