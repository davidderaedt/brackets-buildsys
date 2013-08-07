/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** BuildSys Extension
    description
*/
define(function (require, exports, module) {
    'use strict';

    var CommandManager  = brackets.getModule("command/CommandManager");
    var Menus           = brackets.getModule("command/Menus");
    var AppInit         = brackets.getModule("utils/AppInit");
    var NodeConnection  = brackets.getModule("utils/NodeConnection");
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var KeyBindingManager   = brackets.getModule("command/KeyBindingManager");
    var FileUtils           = brackets.getModule("file/FileUtils");
    var NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem;
    var ProjectManager      = brackets.getModule("project/ProjectManager");
    var Resizer                 = brackets.getModule("utils/Resizer");
    var PanelManager            = brackets.getModule("view/PanelManager");
    var consoleTemplate     = require("text!htmlContent/bottom-panel.html");

    var EXEC_CMD_ID  = "buildsys.execs";
    var EXEC_MENU_NAME   = "Build";

    var NODE_DOMAIN_LOCATION = "node/BuildSysDomain";
    var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

    var nodeConnection;
    var config;
    var currentBuilderIndex = 0;
    var modulePath;
    
    var lastConsoleOutput = "";
    var $console;


    function executeCmdInNode(cmd) {

        lastConsoleOutput = "<p><code>" + cmd + "</code></p>";

        var promise = nodeConnection.domains.buildsys.execCmd(cmd);
        promise.fail(function (err) {
            console.error("[brackets-buildsys-node] failed to run buildsys.execCmd", err);
            alert("Oops. Build failed. Please check that your scripts exist and that you gave them the appropriate permissions.");
        });
        promise.done(function (returned) {
            //TODO output to a panel
            lastConsoleOutput += "<h4>OUTPUT:</h4><p><code>" + returned +  "</code></p>";
            $("#buildsys-console .console-container").html(lastConsoleOutput);
            toggleCollapsed(false);
        });
        return promise;
    }



    function execCurrentBuilder() {

        //console.log("Executing Command exec for last target");

        var currentDocPath = DocumentManager.getCurrentDocument().file.fullPath;
        //console.log(currentDocPath);

        var currentProjectPath = ProjectManager.getProjectRoot().fullPath;
        //console.log(currentProjectPath);

        if (currentBuilderIndex < 0) {
            alert("Please select a build type first");
        } else {
            var rawText = config[brackets.platform][currentBuilderIndex].cmd;
            rawText = rawText.replace("$file", currentDocPath);
            rawText = rawText.replace("$project", currentProjectPath.substr(0, currentProjectPath.length - 1));
            rawText = rawText.replace("$scripts", modulePath + "/scripts");
            executeCmdInNode(rawText);
        }
    }


    function setBuildSys(pIndex, name) {
        currentBuilderIndex = pIndex;
        var cmd = CommandManager.get(EXEC_CMD_ID);
        cmd.setName("Build (" + name + ")");
    }

    
    function createCustomBuildFunc(pIndex, name) {

        return function () {
            setBuildSys(pIndex, name);
            //execCurrentBuilder();
        };
    }
    



    function buildMenu() {

        var i = 0;
        var buildList = config[brackets.platform];
        var count = buildList.length;
        for (i = count - 1; i >= 0; i--) {
            var b = buildList[i];
            var cid = "buildsys." + b.name;
            var f = createCustomBuildFunc(i, b.name);
            CommandManager.register(b.name, cid, f);
            FILE_MENU.addMenuItem(cid, [], Menus.AFTER, EXEC_CMD_ID);
        }
        
        setBuildSys(0, buildList[0].name);
    }



    function loadConfig() {

        modulePath = FileUtils.getNativeModuleDirectoryPath(module);
        var moduleFolder = new NativeFileSystem.DirectoryEntry(modulePath);

        moduleFolder.getFile("config.json", {create: false}, function (buildFile) {
            FileUtils.readAsText(buildFile)
                .done(function (rawText, readTimestamp) {
                    try {
                        config = JSON.parse(rawText);
                    } catch (err) {
                        console.error("Buildsys Extension Error: invalid JSON configuration file");
                        return;
                    }
                    //console.log(config);
                    buildMenu();
                })
                .fail(function (err) {
                    console.error("Unable to load configuration file :" + err);
                });

        },
            function () {
                return;
            });
    }



    function initNodeCnx(location) {

        nodeConnection = new NodeConnection();

        var connectionPromise = nodeConnection.connect(true);
        connectionPromise.fail(function () {
            console.error("[brackets-node] failed to connect to node");
        });
        connectionPromise.done(function () {
            var path = ExtensionUtils.getModulePath(module, location);

            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function () {
                console.error("[brackets-node] failed to load domain " + location);
            });
            loadPromise.done(function () {
                //console.log("connected to " + location);
                loadConfig();
            });
        });

    }

    function toggleCollapsed(pClose) {

        if (pClose) {
            Resizer.hide($console);
        } else {
            Resizer.show($console);
        }
    }
    

    AppInit.appReady(function () {
        
        initNodeCnx(NODE_DOMAIN_LOCATION);

        var resultsPanel = PanelManager.createBottomPanel("buildsys.console", $(consoleTemplate), 100);
        $console = $("#buildsys-console");

        $("#buildsys-console .close").click(function () {
            toggleCollapsed(true);
        });

        toggleCollapsed(true);
    });

    CommandManager.register(EXEC_MENU_NAME, EXEC_CMD_ID, execCurrentBuilder);

    KeyBindingManager.addBinding(EXEC_CMD_ID, "Ctrl-B");

    FILE_MENU.addMenuDivider();
    FILE_MENU.addMenuItem(EXEC_CMD_ID);

});