# Electron Toolkit

"Command Line Gui Tools" to make launching Electron apps easier and faster

- __GUI for [electron-builder](https://github.com/electron-userland/electron-builder)__ - package and build your app
- __App Icon Generator__ - generate app icons for all platforms
  + ```.ico ``` for Windows
  + ``` .icns ``` for macOS
  + ``` .png ``` for Linux
- __Screen Capturer__ - create assets for mockups, store listings, online marketing...
  + Take screenshots 
  + Record videos
- __Website Builder__ - go public and launch a website for your app
  + Lean template for desktop apps
  + Responsive design
  + Custom styling options


<br>
<br>

## Screenshots

<br>

Overview       | 
:-------------------------:|
<a href="https://launchfox.co/docu/overview2.png"  target="_blank"> ![alt text](https://launchfox.co/docu/overview2.png)  </a>|

<br>

 Electron Builder GUI         | Icon Generator  
:-------------------------:|:-------------------------:
 <a href="https://launchfox.co/docu/electron_builder.png"  target="blank"> ![alt text](https://launchfox.co/docu/electron_builder.png) </a> | <a href="https://launchfox.co/docu/icon_generator.png"  target="_blank">  ![alt text](https://launchfox.co/docu/icon_generator.png) </a> 

<br>

  Screen Capturer       |  Website Builder
:-------------------------:|:-------------------------:
 <a href="https://launchfox.co/docu/screen_capture.png"  target="blank">   ![alt text](https://launchfox.co/docu/screen_capture.png) </a> | <a href="https://launchfox.co/docu/website_builder.png"  target="_blank">  ![alt text](https://launchfox.co/docu/website_builder.png) </a>|  



<br>

## Getting Started

1. Install electron-toolkit inside your Electron app directory
```
npm install electron-toolkit --save-dev
```
2. Add the electron-toolkit script to your package.json file
```
{
  ...
  "scripts": {
    "electron-toolkit": "electron ./node_modules/electron-toolkit"
  }
}
```
3. Make sure Electron and Electron Builder are installed.

```
npm install electron --save-dev
npm install electron-builder --save-dev
```

4. Now you can run electron-toolkit directly from your project directory
```
npm run electron-toolkit
```

<br>


## Supported Platforms
- Windows (32/64 bit)
- OS X (also known as macOS)


<br>

## Usage

See <a href="https://github.com/PhilippLgh/electron-toolkit/wiki" target="_blank">Wiki</a>

<br>

## Security Checklist

- [x] Only display secure (https) content:

 `<webview :src="'https://' + url" :preload="preloadScript" ></webview>`
- [x] Disable the Node integration in all renderers that display remote content (setting nodeIntegration to false in webPreferences)
- [x] Enable context isolation in all renderers that display remote content (setting contextIsolation to true in webPreferences)
- [ ] Use ses.setPermissionRequestHandler() in all sessions that load remote content
- [x] Do not disable webSecurity. Disabling it will disable the same-origin policy.
- [ ] Define a Content-Security-Policy , and use restrictive rules (i.e. script-src 'self')
- [ ] Override and disable eval , which allows strings to be executed as code.
- [x] Do not set allowRunningInsecureContent to true.
- [x] Do not enable experimentalFeatures or experimentalCanvasFeatures unless you know what you're doing.
- [x] Do not use blinkFeatures unless you know what you're doing.
- [x] WebViews: Do not add the nodeintegration attribute.
- [x] WebViews: Do not use disablewebsecurity
- [x] WebViews: Do not use allowpopups
- [x] WebViews: Do not use insertCSS or executeJavaScript with remote CSS/JS.
- [x] WebViews: Verify the options and params of all `<webview>` tags before they get attached using the will-attach-webview event
```javascript
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload
    delete webPreferences.preloadURL

    // Disable node integration
    webPreferences.nodeIntegration = false

    // Verify URL being loaded
    if (!params.src.startsWith('https://yourapp.com/')) {
      event.preventDefault()
    }
  })
})
```

<br>  

## Want to contribute?

We welcome and encourage all sorts of contributions that help us make this project more awesome.
Contact me philipplgh@gmail.com.

<br>

## License

1. License for electron-toolkit

    <a href="https://opensource.org/licenses/MIT" target="_blank">  MIT License </a>
    <br>
    Copyright (c) 2017 Philipp Langhans & Alina Sinelnikova / Hytag,inc
    <br>


2. License for website template (inside Website Builder)

   Copyright (c) 2017 Hytag, inc

   The License grants you, free of charge, an ongoing, non-exclusive, worldwide license to use, copy, modify, manipulate the template to      create a website for your commercial or non-commercial end product. 
   You are not allowed to sublicense, and/or sell the template.


