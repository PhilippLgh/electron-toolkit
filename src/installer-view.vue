<template>
<div>

    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active">Installer Settings</li>
    </ol>

    <ul class="nav nav-tabs nav-fill"  role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#basic-installer-info" role="tab" aria-controls="home" aria-selected="true">Basic</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#advanced-installer-info" role="tab" aria-controls="contact" aria-selected="false">Advanced</a>
        </li>
    </ul>

    <div class="installer-container" >

        <div class="tab-content" >

            <div class="tab-pane fade show active tab-row row" id="basic-installer-info" role="tabpanel" aria-labelledby="home-tab">

                <div class="col-12 col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
                
                    <fieldset>
                        <div class="form-group">
                            <label class="title-label" for="f1-app-image"><strong>Icon</strong></label>
                            <div class="row">
                                <div class="col-6 col-xs-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                                    <img name="f1-app-image" :src="model.appImage.data" class="img-thumbnail">
                                </div>
                                <div class="col-12 col-xs-12 col-sm-8 col-md-10 col-lg-10 col-xl-10">
                                    <input name="f1-app-icon" placeholder="Path to your app icon" v-model="model.appImage.path" @focus="focused = 'app-icon'" readonly class="form-control"></input>
                                </div>
                            </div>
                        </div>
                        <div v-for="field in schema" :key="field.label">
                            <input-group v-if="field.type == 'input'" :element="field" :model="model" @focused="focused = arguments[0]" ></input-group>
                            <text-area v-if="field.type == 'textarea'" :element="field" :model="model" @focused="focused = arguments[0]" ></text-area>
                            <multi-select v-if="field.type == 'multiselect'" :element="field" :model="model" @focused="focused = arguments[0]" ></multi-select>
                            <single-select v-if="field.type == 'select'" :element="field" :model="model" @focused="focused = arguments[0]" ></single-select>
                        </div>
                    </fieldset>
                </div>

                <div class="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 info">
                    <div class="info-icon">  <i class="fa fa-info-circle" aria-hidden="true"></i></div>
                    <div class="info-text" v-html="infoText">
                    </div>
                </div>
            </div>

            <div class="tab-pane fade tab-row row" id="advanced-installer-info" role="tabpanel" aria-labelledby="contact-tab">

                <div class="col-12 col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">

                    <div v-for="field in schema2" :key="field.label">
                        <input-group v-if="field.type == 'input'" :element="field" :model="model" @focused="focused = arguments[0]" ></input-group>
                        <text-area v-if="field.type == 'textarea'" :element="field" :model="model" @focused="focused = arguments[0]" ></text-area>
                        <multi-select v-if="field.type == 'multiselect'" :element="field" :model="model" @focused="focused = arguments[0]" ></multi-select>
                        <single-select v-if="field.type == 'select'" :element="field" :model="model" @focused="focused = arguments[0]" ></single-select>
                    </div>

                    
                    <div  id="export-settings-accordion" role="tablist" aria-multiselectable="true">

                        <div v-if="model.platforms.includes('Mac')" class="card">
                            <div class="card-header" role="tab" id="headingOne" data-toggle="collapse" data-parent="#export-settings-accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" >
                                <h5 class="mb-0">
                                    <a class="title-label" >
                                    Mac Settings
                                    </a>
                                </h5>
                            </div>

                            <div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
                                <div class="card-block">
                                    <div v-for="field in schema2.mac" :key="field.label">
                                        <input-group v-if="field.type == 'input'" :element="field" :model="model" @focused="focused = arguments[0]" ></input-group>
                                        <text-area v-if="field.type == 'textarea'" :element="field" :model="model" @focused="focused = arguments[0]" ></text-area>
                                        <multi-select v-if="field.type == 'multiselect'" :element="field" :model="model" @focused="focused = arguments[0]" ></multi-select>
                                        <single-select v-if="field.type == 'select'" :element="field" :model="model" @focused="focused = arguments[0]" ></single-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="model.platforms.includes('Windows')" class="card">
                            <div class="card-header collapsed" data-toggle="collapse" data-parent="#export-settings-accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" role="tab" id="headingTwo">
                                <h5 class="mb-0">
                                    <a class="title-label" > 
                                    Windows Settings
                                    </a>
                                </h5>
                            </div>
                            <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
                                <div class="card-block">
                                    <div v-for="field in schema2.win" :key="field.label">
                                        <input-group v-if="field.type == 'input'" :element="field" :model="model" @focused="focused = arguments[0]" ></input-group>
                                        <text-area v-if="field.type == 'textarea'" :element="field" :model="model" @focused="focused = arguments[0]" ></text-area>
                                        <multi-select v-if="field.type == 'multiselect'" :element="field" :model="model" @focused="focused = arguments[0]" ></multi-select>
                                        <single-select v-if="field.type == 'select'" :element="field" :model="model" @focused="focused = arguments[0]" ></single-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="model.platforms.includes('Linux')" class="card">
                            <div class="card-header collapsed" data-toggle="collapse" data-parent="#export-settings-accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree" role="tab" id="headingThree">
                            <h5 class="mb-0">
                                <a class="title-label" >
                                    Linux Settings
                                </a>
                            </h5>
                            </div>
                            <div id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
                                <div class="card-block">

                                    <div v-for="field in schema2.linux" :key="field.label">
                                        <input-group v-if="field.type == 'input'" :element="field" :model="model" @focused="focused = arguments[0]" ></input-group>
                                        <text-area v-if="field.type == 'textarea'" :element="field" :model="model" @focused="focused = arguments[0]" ></text-area>
                                        <multi-select v-if="field.type == 'multiselect'" :element="field" :model="model" @focused="focused = arguments[0]" ></multi-select>
                                        <single-select v-if="field.type == 'select'" :element="field" :model="model" @focused="focused = arguments[0]" ></single-select>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 info">
                    <div class="info-icon">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </div>
                    <div class="info-text" v-html="infoText">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <sticky-footer :class="{'console-mode': processStatus}">
            <div class="warning-message">
                <span v-if="model.platforms.length == 0">Please specify at least one build target</span>
                <span v-if="model.platforms.includes('Mac') && !processStatus && !model.mac.category">You should set a category for this target in the advanced view</span>
                <span v-if="processStatus" v-html="processStatus"></span>
            </div>
            <div class="button-wrapper">
                 <loading-button class="btn btn-secondary" fa="fa-cogs" @click="onGenerateSettings" :disabled="model.platforms.length == 0">Generate installer</loading-button>
            </div>
    </sticky-footer>
</div>

</template>

<script>
import Vue from "vue";
import store from "./store.js";
import app from './app.js';
import LoadingButton from './widgets/loading-button.vue'
import Footer from './widgets/sticky-footer.vue'

import bootstrap from 'bootstrap'

const Toolkit = window.Toolkit;

Vue.component('input-group', {
    props: ['element', 'model'],
    template: `
        <div class="form-group">
            <template v-if="!Array.isArray(element.elements)">
                <label  class="title-label" for="f1-app-id"><span :class="{'font-weight-bold': element.strong}">{{element.label}}</span></label>
                <div class="input-group mb-2 mr-sm-2 mb-sm-0">
                    <div v-if="element.addon" class="input-group-addon">v</div>
                    <input type="text" name="f1-app-id" class="form-control" :placeholder="element.placeholder" v-model="model[element.model]" @focus="$emit('focused', element)">
                </div>
            </template>
            <template v-if="Array.isArray(element.elements)">
                <label  class="title-label" ><span :class="{'font-weight-bold': element.strong}">{{element.label}}</span></label>
                <div class="row" >
                    <div v-for="el in element.elements" :key="el.label" class="col-sm-6" >
                        <div class="input-group mb-2 mr-sm-2 mb-sm-0">
                            <div v-if="el.addon" class="input-group-addon">v</div>
                            <input type="text" name="f1-app-id" class="form-control" :placeholder="el.placeholder" v-model="model[el.model]" @focus="$emit('focused', el)" >
                        </div>
                    </div>
                </div>
            </template>
        </div>
        `
})


Vue.component('text-area', {
    props: ['element', 'model'],
    template: `
        <div class="form-group">
            <label  class="title-label" for="f1-app-description">Description</label>
            <textarea id="f1-app-description" name="f1-app-description" placeholder="Your app description..." v-model="model[element.model]" @focus="$emit('focused', element)" class="form-control"></textarea>
        </div>
        `
})

Vue.component('multi-select', {
    props: ['element', 'model'],
    template: `
        <div class="form-group" @click="$emit('focused', element)">
            <label class="title-label" for="platform-select" >{{element.label}}</label>
            <div class="checkbox-wrapper">
                <div v-for="opt in element.options" class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" :value="opt" v-model="model[element.model]" @focus="$emit('focused', element)">
                        {{opt}}
                    </label>
                </div>
            </div>
        </div>
        `
})

Vue.component('single-select', {
    props: ['element', 'model'],
    template: `
        <div class="form-group">
            <label class="title-label" for="architecture-select">{{element.label}}</label>
            <select class="form-control" id="architecture-select" v-model="model[element.model]" @focus="$emit('focused', element)" >
                <option v-for="opt in element.options" :value="opt.val ? opt.val : opt[1]">{{opt.label ? opt.label : opt[0] }}</option>
            </select>
        </div>
        `
})


function getDefaultArchitecture(){
    const arch2values = {
        'arm' : '',
        'arm64' : '', 
        'ia32' : 'ia32', 
        'mips': '', 
        'mipsel' : '', 
        'ppc' : '', 
        'ppc64' : '', 
        's390' : '', 
        's390x' : '', 
        'x32' : '', 
        'x64' : 'x64', 
        'x86' : 'ia32'
    }
    var userArch = Toolkit.getSystemInfo().arch;
    return arch2values[userArch] || "all";
}

function getDefaultPlatform(){
     const platforms2values = {
        'win32' : 'Windows',
        'aix' : '',
        'darwin' : 'Mac',
        'freebsd' : 'Linux',
        'linux' : 'Linux',
        'openbsd' : 'Linux',
        'sunos' : ''
    }
    var userPlatform = Toolkit.getSystemInfo().platform;
    return platforms2values[userPlatform] || ['Windows', 'Mac', 'Linux'] ;
}

var schema = {
    nameVersion: {
        type: 'input',
        label: 'Name & Version',
        elements: [
            {
                label: 'Name',
                placeholder: 'App name...',
                info: `The author of this application as it is displayed and stored on the users' system`,
                model: 'productName',
                info: `
                    Allows you to specify a product name for your executable which contains spaces and other special characters not allowed in the project.json name property.
                    This will be the displayed name of the application. If none is provided, the name value is used.
                `
            },
            {
                label: 'Version',
                placeholder: '0.0.0',
                addon: true,
                info: `Your application's version`,
                model: 'version'
            }
        ]
    },
    appId: {
        type: 'input',
        label: 'App ID',
        strong: true,
        placeholder: 'App ID...',
        info: `<code>appId = com.electron.\${name}</code><br/>
                The application id as a reverse domain notation identifier for your application.
                Used as CFBundleIdentifier for MacOS and as Application User Model ID for Windows (NSIS target only, Squirrel.Windows not supported).
                It is strongly recommended that an explicit ID is set.`,
        model: 'appId'
    },
    authorCopy: {
        type: 'input',
        label: 'Author and Copyright',
        elements: [
            {
                label: 'Author',
                placeholder: 'Jon Doe',
                info: `The author of this application as it is displayed and stored on the users' system`,
                model: 'author'
            },
            {
                label: 'Copyright',
                placeholder: 'Jon Doe',
                info: `
                    The copyright information that is displayed in the applications information window. 
                    If none is provided it will default to <code>Copyright © year author</code>.
                    `,
                model: 'copyright'
            }
        ]
    },
    description: {
        type: 'textarea',        
        label: 'Description',
        info: 'The app description..',
        model: 'description'
    },
    platform: {
        type: 'multiselect',        
        label: 'Target platforms',
        options: ['Windows', 'Mac', 'Linux'],
        info: `
            <code>default = detected user platform</code><br/>
            Multi platform builds are error prone in <a href="https://www.electron.build/multi-platform-build">many different ways</a>.
            It is recommended that you only build for the platform you're currently on.
            This platform should get detected automatically.
            <br/><br/>
            However, if you like experiments: it can be possible to build for Linux and Windows on Mac with Wine, Mono and some extra configuration.
            <br/>
            Mac: <br/>
            <code>brew install wine --without-x11</code><br/>
            <code>brew install mono</code><br/>
            Linux: <br/>
            <code>brew install gnu-tar graphicsmagick xz</code><br/>
            <code>brew install rpm</code><br/>
            `,
        model: 'platforms'
            
    },
    /*
    architecture: {
        type: 'select',        
        label: 'Target architecture',
        options: [
            {label:'All', val: 'all'},
            {label:'32 Bit', val: 'ia32'},
            {label:'64 Bit', val: 'x64'},
        ],        
        info: `
            <code>default = detected system architecture</code><br/>
            You can build for 32 bit or 64 bit on both 32 and 64 bit systems.
            If <strong><i>all</i></strong> is selected together with NSIS the build will be one single, comparably large binary.
        `,
        model: 'architecture'
    },
    */
    electronVersion:{
        type: 'input',                
        label: 'Electron Version',
        addon: true,
        placeholder: '0.0.0',
        info: `
            <code>default = detected version</code><br/>
            If you want to specify exactly which version of Electron you want to package, set this value. It is
            recommended that you define this value; Especially if you are working in a team or on different systems be explicit or you might 
            distribute with an Electron version other than the one you developed and tested for.
        `,
        model: 'electronVersion'
        
    },
    asar:{
        type: 'multiselect',                
        label: 'Asar Bundle',
        options: ['Package as *.asar'],
        info: `
            Whether to package the application's source code into an archive, using <a href="http://electron.atom.io/docs/tutorial/application-packaging/">Electron's archive format</a>.
        `,
        model: 'asar'
    }

}


var installer = ""; //Toolkit.base64Asset("MacInstaller.PNG")


var schema2 = {
    /*
    general:{
        type: 'multiselect',        
        label: 'General Export Formats',
        options: ['7z', 'zip', 'tar.xz', 'tar.lz', 'tar.gz', 'tar.bz2', 'dir'],
    },
    */
    mac:{
        architecture: {
            type: 'select',        
            label: 'Target architecture',
            options: [
                //{label:'All', val: 'arch_all'},
                //{label:'32 Bit', val: 'ia32'},
                {label:'64 Bit', val: 'x64'},
            ],
            model: 'mac.arch'
        },
        categories:{
            type: 'select',        
            label: 'App Category',
            options: [
				['Business',  'public.app-category.business'],
				['Developer Tools', 'public.app-category.developer-tools'],
				['Education', 'public.app-category.education'],
				['Entertainment', 'public.app-category.entertainment'],
				['Finance', 'public.app-category.finance'],
				['Games', 'public.app-category.games'],
				['Graphics & Design', 'public.app-category.graphics-design'],
				['Healthcare & Fitness', 'public.app-category.healthcare-fitness'],
				['Lifestyle', 'public.app-category.lifestyle'],
				['Medical', 'public.app-category.medical'],
				['Music', 'public.app-category.music'],
				['News', 'public.app-category.news'],
				['Photography', 'public.app-category.photography'],
				['Productivity', 'public.app-category.productivity'],
				['Reference', 'public.app-category.reference'],
				['Social Networking', 'public.app-category.social-networking'],
				['Sports', 'public.app-category.sports'],
				['Travel', 'public.app-category.travel'],
				['Utilities', 'public.app-category.utilities'],
				['Video', 'public.app-category.video'],
				['Weather', 'public.app-category.weather']
            ],
            'info': `
            The application category type, as shown in the Finder via View -> Arrange by Application Category when viewing the Applications directory.
            See all <a href="https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8">Apple Categories</a>
           `,
           model: 'mac.category'

        },
        export:{
            type: 'multiselect',        
            label: 'Export Format Mac',
            options: ['dmg', 'dkg', 'mas', 'zip'],
            model: 'mac.target'        
        }
    },
    win: {
        architecture: {
            type: 'select',        
            label: 'Target architecture',
            options: [
                {label:'All', val: 'arch_all'},
                {label:'32 Bit', val: 'ia32'},
                {label:'64 Bit', val: 'x64'},
            ],
            model: 'win.arch'
        },
        export:{
            type: 'multiselect',        
            label: 'Export Format Windows',
            options: ['nsis', 'nsis-web', 'portable', 'AppX (Windows Store)', 'Squirrel.Windows'],
            model: 'win.target'                    
        } 
    },
    linux: {
        architecture: {
            type: 'select',        
            label: 'Target architecture',
            options: [
                {label:'All', val: 'arch_all'},
                {label:'32 Bit', val: 'ia32'},
                {label:'64 Bit', val: 'x64'},
            ],
            model: 'linux.arch'            
        },
        export:{
            type: 'multiselect',        
            label: 'Export Format Linux',
            options: ['AppImage', 'snap', 'debian package (deb)', 'rpm', 'freebsd', 'pacman', 'p5p', 'apk' ],
            model: 'linux.target'                    
        } 
    }
}

/*
winoptions = {
    name: 'target'
    name: 'signingHashAlgorithms'

    name: 'icon'
    default: 'build/icon.ico'
    type: 'string | null'
    hint: 'The path to application icon.'

    name: 'legalTrademarks'
    type: 'string | null'
    hint: 'The trademarks and registered trademarks.'
    
    name: 'certificateFile'
    type: 'string'
    hint: 'The path to the *.pfx certificate you want to sign with. Please use it only if you cannot use env variable CSC_LINK (WIN_CSC_LINK) for some reason. Please see Code Signing.'

    name: 'certificatePassword'
    type: 'string'
    hint: 'The password to the certificate provided in certificateFile. Please use it only if you cannot use env variable CSC_KEY_PASSWORD (WIN_CSC_KEY_PASSWORD) for some reason. Please see Code Signing.'

    name: 'certificateSubjectName'
    type: 'string'
    hint: 'The name of the subject of the signing certificate. Required only for EV Code Signing and works only on Windows.'

    name: 'certificateSha1'
    type: 'string'
    hint: 'The SHA1 hash of the signing certificate. The SHA1 hash is commonly specified when multiple certificates satisfy the criteria specified by the remaining switches. Works only on Windows.'

    name: 'additionalCertificateFile'
    type: 'string'
    hint: 'The path to an additional certificate file you want to add to the signature block.'

    name: 'rfc3161TimeStampServer',
    type: 'string'
    hint: 'The URL of the RFC 3161 time stamp server. Defaults to http://timestamp.comodoca.com/rfc3161.'

    name: 'timeStampServer'
    type: 'string'
    hint: 'The URL of the time stamp server. Defaults to http://timestamp.verisign.com/scripts/timstamp.dll.'

    name: 'publisherName'
    type: 'string | Array<string> | null'
    hint: 'The publisher name, exactly as in your code signed certificate. Several names can be provided. Defaults to common name from your code signing certificate.'

}
*/

export default {
    components:{
        'loading-button': LoadingButton,
        'sticky-footer': Footer
    },
    data: function(){
        return {

            model: {
                appImage: {},
                platforms: []
            },

            schema: schema,
            schema2: schema2,

            focused: '',

            processStatus: '',

            info: {
                '': `
                    This form will help you to setup a build process with <a href="https://github.com/electron-userland/electron-builder">electron-builder</a> and create binaries and installers ready for distribution. <br/><br/>
                    This form is already pre-configured with recommended settings based on your system and <code>package.json</code>. <br/><br/>
                    Please make sure that the correct <code>Name, Icon</code> and <code>App ID</code> are provided. Recommended fields have <strong>bold</strong> labels.<br/><br/>
                    The <code>Advanced</code> tab contains settings, specific for each possible build target. <br/><br/>
                    If you have questions see the <a href="https://www.electron.build/">electron-builder documentation</a> or <a href="https://github.com/PhilippLgh/electron-toolkit/issues">electron-toolkit issue tracker</a>.
                    `,
                'app-icon' : `
                    The icon used for the installer and the application. The icon needs to be provided in different formats for different targeted operating systems.
                    You can use the <a href="#/assets/appicon">Icon Generator</a> to create these formats from png or svg source files.
                    <br/><br/>
                    If no icon is found or provided, the application will have the default electron icon.
                `, 
                'test':`
                    <br/><br/>
                    <img src="${installer}" style="width:100%"></img>
                `,

           },
  
        }
    },

    methods:{
        onGenerateSettings: function(stateHandler){


            //Toolkit.generateBuildFile(this.model);

            var build = {
                appId: this.model.appId,
                copyright: this.model.copyright,
                productName: this.model.productName,
                electronVersion: this.model.electronVersion,
                asar: this.model.asar,
                directories: {
                    app: Toolkit.Config.PROJECT_DIR, //defaults to app, www or working directory
                    //'buildResources': 'build2', //Please note — build resources is not packed into the app. If you need to use some files, e.g. as tray icon, please include required files explicitly: `"files": ["**\/*", "build/icon.*"]`
                    output: "dist"
                },
                win: Object.assign({},this.model.win),
                mac: Object.assign({},this.model.mac),
                linux: Object.assign({},this.model.linux),

            };

            function expandTargets(platform){
                var arch = build[platform].arch;
                delete build[platform].arch;
                build[platform].target = build[platform].target.map(target => {
                    if(typeof target === 'object'){
                        target.arch = [arch]
                        return target
                    }
                    if(typeof target === 'string'){
                        return {
                            target: target,
                            "arch": [
                                arch
                            ]
                        }
                    }
                    return target;
                })
            }

            if(!this.model.platforms.includes('Mac')){
                delete build.mac;
            }else{
                expandTargets('mac')
            }
            if(!this.model.platforms.includes('Windows')){
                delete build.win;
            }else{
                expandTargets('win')                
            }
            if(!this.model.platforms.includes('Linux')){
                delete build.linux;
            }else{
                expandTargets('linux')                                
            }


            //these fields are only valid in package.json
            //and cause build errors when externally defined
            var packageJson = {
                //name String - The application name.       
                "description": this.model.description,
                //homepage String - The url to the project homepage (NuGet Package projectUrl (optional) or Linux Package URL (required)).
                //defaults to https://github.com/${user}/${project}
                //license String - linux-only. The license name.
                //author (name, email)
                //repository String | RepositoryInfo -
                build: build
            }

            console.log("generate artifacts from   ", packageJson)

            //1.) patch projectJson             
            Toolkit.readPackageJson()
            .then(data => {
                //console.log("package json data: ", data)
                Object.assign(data, packageJson)
                return JSON.stringify(data, null, 4);
            })
            .then(Toolkit.writePackageJson)

            //TODO should we wait here for write to finish?


            //2.) pass arguments to builder and generate installers
            var builderConfig={
                projectDir: Toolkit.Config.PROJECT_DIR,
                config: build
            }

            Toolkit.generateArtifacts(builderConfig)
                .then(proc => {
                    stateHandler.start()

                    proc.on("debug", data => {
                        this.processStatus = `<strong style="color:#26a95b"> $ > ${data} </strong>`;
                    })
                    proc.on("done", ()=>{
                        stateHandler.done()
                        this.processStatus = '';
                        app.showUserInfo('Generated <i class="fa fa-check" aria-hidden="true"></i>')
                    })
                    proc.on("error", data =>{
                        //TODO generate log file and link to it
                        var errorMessage = data || "";
                        stateHandler.done()      
                        this.processStatus = '';                                          
                        app.showUserError('An error occured during build <br/>'+errorMessage)
                    })
                })
                
        }
    },

    computed: {
        infoText: function(){
            return typeof this.focused == 'string' ? this.info[ this.focused ] : this.focused.info;
        }
    },
    mounted: function(){

        var logo = {
            path: 'electron_logo.png (default)',
            data: Toolkit.base64Asset('icon.png')
        }

        if(Array.isArray(store.logos) && store.logos.length > 0){
            var l = store.logos.find(logo => logo.filename.includes("128"))
            logo = l || logo;
        }

        var platforms = [ ];

        //FIXME we need conversion here because the settings that are possible in electron-toolkit 
        //are not complete and do not match electron-builder's which are more detailed
        function convertPlatformSettings(buildSettings, platform, platformName, defValues){

            if(!buildSettings || !buildSettings[platform]){
                return defValues;
            }

            platforms.push( platformName  )

            var ps = buildSettings[platform]; //get platform settings

            return {
                arch: ps.target && (ps.target.length > 0) && ps.target[0].arch && ( ps.target[0].arch.length > 0 ) ? ps.target[0].arch[0] : getDefaultArchitecture(),
                target: ps.target.map(t => t.target) //convert to string array
            }
        }

        var mac = convertPlatformSettings(store.product.build, 'mac', 'Mac', {
                arch: 'x64', //getDefaultArchitecture(), limit mac to x64 because of missing electron binaries / no 32 darwin support?
                category: '',
                target: ['dmg']
            })
        mac.category = store.product.build && store.product.build.mac ? store.product.build.mac.category : '';
            
        var win = convertPlatformSettings(store.product.build, 'win', 'Windows', {
                arch: getDefaultArchitecture(),
                target: ['nsis']
            })

        var linux = convertPlatformSettings(store.product.build, 'linux', 'Linux', {
                arch: getDefaultArchitecture(),
                target: ['AppImage', 'debian package (deb)']
            })

        if(platforms.length == 0){
            platforms.push( getDefaultPlatform() );
        }
        
        //note this will remove reactivity on store.product
        //when store is changed, model is NOT updated
        //when store is not initialized, values will stay uninitialized
        var model = {
            appImage : logo,
            appId: `com.electron.${store.product.name}`,
            productName: store.product.name,
            copyright: `Copyright © ${ (new Date()).getFullYear() } ${store.product.author}`,
            version: store.product.version,
            author: store.product.author,
            description: store.product.description || '',
            platforms: platforms,
            architecture: getDefaultArchitecture(),
            electronVersion: Toolkit.getSystemInfo().electron,
            asar: true,
            mac: mac,
            win: win,
            nsis: {},
            linux: linux,
            publish: {}
        }

        function getDeep(target, property){
            var parts = property.split('.')
            var obj = target;
            for (let i = 0; i < parts.length-1; i++) {
                var part = parts[i];
                if(!obj[ part ]){ obj[ part ] = {} }
                obj = obj[ part ];
            }
            return obj[ parts[parts.length-1] ]
        }

        function setDeep(target, property, value){
            var parts = property.split('.')
            var obj = target;
            for (let i = 0; i < parts.length-1; i++) {
                var part = parts[i];
                if(!obj[ part ]){ obj[ part ] = {} }
                obj = obj[ part ];
            }
            console.log("try set ", parts[parts.length-1] )
            obj[ parts[parts.length-1] ] = value;
            return obj;
        }

        //adds support for nested model properties
        //https://github.com/vuejs/vue/issues/1056
        var nested = ['win', 'mac', 'linux']
        nested.forEach(element => {            
            for (const key in model[element]) {
                let key_long = element+"."+key;      
                Object.defineProperty(model, key_long, {
                    get: function() {
                        var deep = getDeep(model, key_long);
                        return deep;
                    },
                    set: function(value) {
                        setDeep(model, key_long, value)
                    }
                });
            }
        });

        this.model = model;

    }
}
</script>

<style scoped>

.console-mode{
    background: #333;
}

.form-check.disabled .form-check-label {
    font-weight:100;
}
.tab-row{
    margin: 0 5%;
}
.installer-container{
    bottom: 60px;
    top: 125px;
    overflow: auto;
    width:100%;
    position: absolute;
}

.installer-container input:focus, .installer-container textarea:focus, .installer-container select:focus {
    box-shadow: rgba(0, 123, 255, 0.25) 0px 0px 0px 0.1rem;
}

.installer-container input, .installer-container select, .installer-container textarea {
    /*border-radius:3px*/

}
.installer-container .input-group-addon{
      background: #e0e0e0;
}
.installer-container label, .title-label{
    /* font-weight:900;*/
  /*  font-family: 'Cairo';*/
    color: #333;
}
  
.nav-tabs a{
    color: #52a5ff;
}

.form-group{
    margin-bottom:1.5rem
}

.tab-content>.active{
    display:flex;
}

.tab-content a{
    color: #333;
    font-size: 1rem;
    text-decoration: none;
}

.tab-content .info{
    border: 1px solid #e0e0e0;
    background: #fafafa;
    border-radius: 3px;
    margin-top: 2rem;
    padding: 0.5rem 1rem;
}

#basic-installer-info .info{
    margin-bottom: 7rem;
}

#advanced-installer-info .info{
    margin-bottom: 1rem;
}

.tab-content .info .info-text{
    margin-bottom: 0.5rem;
    color: #565555;
    line-height: 1.5;
   /* font-family:'Cairo';*/
}

.tab-content .info .info-icon{
    margin-bottom: 0.5rem;
}

#export-settings-accordion .card-header{
    cursor:pointer;
    border-bottom: none;
    border-radius: 2px;
    border:1px solid #f7f7f7;
    transition: all .2s linear;
}

#export-settings-accordion .card-header[aria-expanded="true"], #export-settings-accordion .card-header:hover {
    background: #f2f3f3;
    border: 1px solid #f2f3f3;
  /*  border-color: #afd5ff;*/
 }   

 #export-settings-accordion .card{
    margin-bottom: 1rem;
    border: none;
 }  

#export-settings-accordion .card-block{
    padding: 1.5rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    border-top: none;
}

.nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
   /* border-color: white white #ddd; */
}

.footer .button-wrapper{
    flex:1;
    text-align:right;
}

.warning-message{
    overflow: hidden;
    margin-right:1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.nav-tabs{
    border-bottom: none !important;
}

.nav-link{
    border-bottom: 1px solid #ddd !important;
}
.nav-link.active{
    border-bottom:none !important;
}


@media  (max-width:576px){
  .img-thumbnail{
      margin-bottom:1rem;
  }

  input{
      margin-bottom: 0.5rem;
  }

  .info{
      margin-top:0px;
  }
}


@media  (max-width:768px){

   
}

</style>


