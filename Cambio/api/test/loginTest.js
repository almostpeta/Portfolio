"use strict";
var webdriver = require("selenium-webdriver"),
By = webdriver.By,
assert = require('assert'),
until = webdriver.until;
 

module.exports.login = async function(driver){
    try{

        await driver.findElement(By.id('mat-input-0')).sendKeys('user@mail.com')
        await driver.findElement(By.id('mat-input-1')).sendKeys('1234');
        var loginButton = await driver.findElements(By.className('mat-raised-button'));
        await loginButton[0].click();
        console.log("duerme login")
        await driver.sleep(15000).then(el => {
            var currentTitle = driver.getCurrentUrl().then(function(url) {
                console.log("The title is: " + url)
                assert.equal(url, "https://cambionelson.karenstoletniy1996.now.sh/publicaciones");
            });})
        return driver;
    }

    catch(err){
        console.log(err);
    }

}

module.exports.registre = async function(driver){
    try{
        await driver.findElement(By.id('mat-input-0')).sendKeys('user42@mail.com');
        await driver.findElement(By.id('mat-input-1')).sendKeys('User42');
        await driver.findElement(By.id('mat-input-2')).sendKeys('0991234567');
        await driver.findElement(By.id('mat-input-3')).sendKeys('12345678');
        var loginButton = await driver.findElements(By.className('mat-raised-button'));
        await loginButton[0].click();
        console.log("duerme registre")
        await driver.sleep(15000).then(el => {
            var currentTitle = driver.getCurrentUrl().then(function(url) {
                console.log("The title is: " + url)
                assert.equal(url, "https://cambionelson.karenstoletniy1996.now.sh/publicaciones");
                
            });})
        return driver;
    }

    catch(err){
        console.log(err);
    }

}
module.exports.logOut =  async function(driver){
    try{
        var loginButton = await driver.findElements(By.className('mat-raised-button'));
        await  loginButton[0].click();
        console.log("duerme logout")
        await driver.sleep(1000).then(el => {
            var currentTitle = driver.getCurrentUrl().then(function(url) {
                console.log("The title is: " + url)
                assert.equal(url, "https://cambionelson.karenstoletniy1996.now.sh/login");
            });})
        return driver;
    }

    catch(err){
        console.log(err);
    }

}
