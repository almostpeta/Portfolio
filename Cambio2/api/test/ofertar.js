"use strict";
var webdriver = require("selenium-webdriver"),
By = webdriver.By,
assert = require('assert'),
until = webdriver.until;
 

module.exports.offer = async function(driver){
    try{
        console.log("duerme oferta");
        await driver.sleep(15000).then(err =>{
            console.log("despierta oferta");
            driver.findElements(By.className('mat-raised-button')).then(btn => {
                btn[1].click().then(info => {
                    driver.findElement(By.id('mat-input-1')).sendKeys('100');
                    driver.findElement(By.id('mat-select-0')).click().then(er =>{
                        driver.findElement(By.id('mat-option-1')).click();
                        driver.findElement(By.id('btn-ofertar')).click().then(err =>{
                            driver.sleep(10000).then(err =>{
                                driver.switchTo().alert().then(alert => {
                                    assert.notEqual(alert.getText(), undefined);
                                });
                                
                            });
                        });
                    });

                });
            });
        });
        return driver;

    }

    catch(err){
        console.log(err);
    }

}