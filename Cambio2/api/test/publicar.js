"use strict";
var webdriver = require("selenium-webdriver"),
By = webdriver.By,
assert = require('assert'),
until = webdriver.until;
 

module.exports.publicar = async function(driver){
    try{
            driver.findElements(By.tagName('a')).then(btn => {
                btn[1].click().then(info => {
                    console.log("Llegue a publicacion");
                    driver.findElement(By.id('mat-input-1')).sendKeys('Montevideo');
                    driver.findElement(By.id('mat-select-0')).click().then(er =>{
                        driver.findElement(By.id('mat-option-1')).click().then(err =>{
                        driver.findElement(By.id('mat-select-1')).click().then(err =>{
                            driver.findElement(By.id('mat-option-5')).click();
                            driver.findElement(By.id('mat-input-2')).sendKeys('100');
                            driver.findElement(By.id('publicar')).click().then(btn => {
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
            });
        return driver;

    }

    catch(err){
        console.log(err);
    }

}