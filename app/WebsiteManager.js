  const EventEmitter = require("events");
  
  const fs = require('fs')
  const path = require('path')
  
  const { desktopCapturer, screen } = require("electron");

  const AppBridge = require("./AppBridge.js");
 
  
  class  WebsiteManager {
      constructor() {

        //  this.project_dir = projectDir;
      }
  /*

    prepareDirectory() {
        return new Promise((resolve, reject) => {
            const assetsDir = path.join(this.project_dir, "website");

            fs.mkdir(assetsDir, err => {
                if (err) {
                    if (err.code == "EEXIST") {
                        return resolve(assetsDir);
                    }
                    reject(err);
                } else {
                    resolve(assetsDir);
                }
            });
        });
    }
*/


    loadWebsiteData(){
        return new Promise((resolve, reject) => {
            this.prepareDirectory()
            .then(dir => {
                    var fullPath = path.join(dir, "website.json");
                    
                    fs.readFile(fullPath, 'utf8', function (err, data) {
                        if (err) {
                            console.log(err);
                            return resolve(null);
                            
                        }else{
                            var website = JSON.parse(data);
                            return resolve(website);
                        }
                        
                    });
                
                })
            .catch(err => {
                reject(err);
            });
        });            
    }
            
    saveWebsiteData(website){
        return new Promise((resolve, reject) => {
            this.prepareDirectory()
            .then(dir => {
                    var fullPath = path.join(dir, "website.json");
                    var json = JSON.stringify(website);
                    fs.writeFile(fullPath, json, function (err, data) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }else{
                            resolve();
                        }
                        
                    });
                
                })
            .catch(err => {
                reject(err);
            });
        });            


    
    }


      

  

  }
  
  module.exports = WebsiteManager;
  
  