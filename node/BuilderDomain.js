/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";
    
    var sys = require('sys');
    var exec = require('child_process').exec;
    var os = require('os');
    var fs = require('fs');
    
    var isMac;
    
    
    function log(pMsg) {
        //console.log(pMsg);
        /*
        var sep = (isMac) ? "/" : "\\";
        fs.appendFile(__dirname + sep + "nodelog.txt", pMsg + "\r\n");
        */
    }

    
    function execCmd(cmd, cb) {
        
        exec(cmd, function (error, stdout, stderr) {
            if (error !== null) {
                log(error);
                cb(error, null);
            } else {
                //stdout = stdout.replace(/[\r\n]/g, "");//remove linebreaks
                log("stdout:" + stdout + "--");
                cb(null, stdout);
            }
        });
    }
    
  
    /**
     * @private
     * Initializes domain by setting permissions and enabling debug mode 
     * @return string the path of the home directory
     */
     /*
    function cmdInitialize() {
        
        setExecPermissions();
        var home = (process.env.HOME || process.env.USERPROFILE);
        return home;
    }
        */
    
    
    /**
     * Initializes the test domain with several commands.
     * @param {DomainManager} DomainManager The DomainManager for the server
     */
    function init(DomainManager) {
        
        isMac = os.platform() === "darwin";
        
        log("start " + new Date().toString() + " -- Platform: " + os.platform());

        if (!DomainManager.hasDomain("execscript")) {
            DomainManager.registerDomain("execscript", {major: 0, minor: 1});
        }

                        
        DomainManager.registerCommand(
            "builder",       // domain name
            "execCmd",    // command name
            execCmd,   // command handler function
            true,          // this command is synchronous
            "Copies the extension template to the appropriate location",
            [
                {
                    name: "command",
                    type: "String",
                    description: "command to execute"
                }
            ],// parameters
            [{name: "stoud",
                type: "String",
                description: "returned data"}]
        );
    }
        
    exports.init = init;
    
}());
