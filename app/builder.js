const path = require("path");
const fs = require("fs");



function killProcess() {
    try {
        process.removeAllListeners();
    } catch (error) {
        //fs.appendFileSync("log.txt", JSON.stringify(error) + "\n");
    }

    try {
        process.exit(1);
    } catch (error) {
        //fs.appendFileSync("log.txt", JSON.stringify(error) + "\n");
    }

    try {
        process.kill(process.pid);
    } catch (error) {
        //fs.appendFileSync("log.txt", JSON.stringify(error) + "\n");
    }
}

//we have basically 4 options to create the build process
//1: spawn process of cli.js in the same way npm scripts are doing it
//2: use electron-builder's programmatic api: https://www.electron.build/api/electron-builder
// a) with patched package.json
// b) with separate electron-builder.json
// c) with config object

function build(config) {
    var builder;
    try {
        builder = require(path.join(config.projectDir, "node_modules", "electron-builder", "out", "index.js"));
    } catch (error) {
        process.send({ type: "error", data: "electron builder not found.<br/>try: npm install electron-builder --save-dev" });
        setTimeout(() => {
            process.exit();
        }, 500);
        return;
    }
    const Platform = builder.Platform;
    //const builder = require(path.join(PROJECT_DIR, "node_modules", "electron-builder", "out", "cli", "cli.js"));

    /**
     missing settings...
https://github.com/electron-userland/electron-builder/blob/master/packages/electron-builder-lib/src/configuration.ts


     afterPack?,
     apk?, 
appImage?,
  appx?, 
  artifactName?,
    asarUnpack?, 
    beforeBuild?, 
    buildDependenciesFromSource?,
     buildVersion?, 
     compression?, 
     , deb?, 
     detectUpdateChannel?, 
     , dmg?, 
     electronCompile?, electronDist?, 
     electronDownload?, , extends?, 
     extraFiles?, extraMetadata?, extraResources?, 
     fileAssociations?, files?, forceCodeSigning?, freebsd?, 
     generateUpdatesFilesForAllChannels?, icon?, linux?, mac?, 
     mas?, msi?, muonVersion?, nodeGypRebuild?, npmArgs?, 
     npmRebuild?, npmSkipBuildFromSource?, nsis?, nsisWeb?, p5p?, 
     pacman?, pkg?, portable?, 
     , protocols?, 
     publish?, releaseInfo?, rpm?, snap?, squirrelWindows?, target?, win? 
     */

    /**
      https://github.com/electron-userland/electron-builder/blob/master/packages/electron-builder-lib/src/packagerApi.ts
      export interface PackagerOptions {
        targets?: Map<Platform, Map<Arch, Array<string>>>

        mac?: Array<string>
        linux?: Array<string>
        win?: Array<string>

        projectDir?: string | null

        cscLink?: string | null
        cscKeyPassword?: string | null

        cscInstallerLink?: string | null
        cscInstallerKeyPassword?: string | null

        platformPackagerFactory?: ((info: Packager, platform: Platform) => PlatformPackager<any>) | null

        readonly config?: Configuration | string | null

        readonly effectiveOptionComputed?: (options: any) => Promise<boolean>

        readonly prepackaged?: string | null
        }
      */

    /**
 build expects CliOptions:

 interface CliOptions extends PackagerOptions, PublishOptions
  arch?: string
  x64?: boolean
  ia32?: boolean
  armv7l?: boolean
  dir?: boolean
  platform?: string
  project?: string
 */

    //Without target configuration, electron-builder builds Electron app for current platform and current arch using default target.
    //macOS - DMG and ZIP for Squirrel.Mac.
    //Windows - NSIS.
    //Linux - AppImage.
    //config.targets = Platform.WINDOWS.createTarget();

    builder
        .build(config)
        .then(result => {
            // handle result
            try {
                process.send({
                    type: "done"
                })
            } catch (error) {
                //fs.appendFileSync("log.txt", JSON.stringify(error) + "\n");
            }

            killProcess()

        })
        .catch(error => {
            // handle error
            console.error("error during build", error);
            process.send({
                type: "error",
                error: process.pid + JSON.stringify(error)
            })

            //fs.appendFileSync("log.txt", JSON.stringify(error) + "\n");

            killProcess()

        });
}


if (typeof process.send === "function") {
    console.log("~~~"); //signal 'ready'

    process.on("message", message => {
        console.log("builder received message: " + message.type);

        if (message.type === 'build') {
            var config = message.data;
            /*
            console.log = (text) => {
                process.send({
                    type: 'console',
                    data: text
                })
            }
            */
            build(config)
        }


    });
} else {

    process.send = () => {} //provide no-op for 'ipc-less' testing
    process.on = () => {} //provide no-op for 'ipc-less' testing

    console.log("!~~~"); //signal 'failed'
}


/*
var testConfig = {
/...
}


build(testConfig);
*/