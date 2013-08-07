#Brackets BuildSys

A stupid simple build system for Brackets.

Hit `Cmd+B` (`Ctrl+B` on Windows) to run a `build.sh` (or `build.bat`) file, or whatever build system you configured.

The output is displayed on a bottom panel.

##Install

1. Open the the Extension Manager from the File menu
2. Copy paste the URL of the github repo or zip file

Alternatively, you can unzip ZIP the project to Brackets' `/extensions/user` folder by selecting `Help > Show Extension Folder` in the menu. 

##Instructions

This extension will add a `Build` menu item in the `File` menu, followed by a list of build systems defined in a config file.

By default, it will try to run a `build.sh` shell script, if any. So, if you have simple needs, just create this `build.sh` at the root of your project, and you're ready to go.

But that's only the default behavior, and of course, the whole point of this extension is that you can add your own build systems.

##Editing Build systems

Build systems are listed in a `config.json` file which you can edit by selecting `Edit Config` from the menu. 

> You'll need to relaunch Brackets for the modifications to be effective.

Here you'll find a list of build systems, organized by platform ("disabled" is just a place for you to store disabled build systems since comments are not supported in JSON files).

Build systems look like this:

	{
        "name":"build.sh", 
        "desc":"Default build system (Mac OS): runs a build.sh file located at the root of your project, if any",
        "cmd":"'$project/build.sh'"
    },

Here:

* The `name` property is used to display the menu item in Bracket's `File` menu. No spaces are allowed.
* The `desc` property is not used, but it's the only way to describe the build system since you can't comment JSON files.
* The `cmd` property tells node.js what to execute.

##About the cmd property

To put it simply, the `cmd` property corresponds to what you would enter in your Terminal or Windows command prompt.

But here, you can use special keywords to help you:

* `$project`: path to the folder of the project currently open
* `$file`: path to the currently open file
* `$scripts`: path to the "global scripts" folder (see below).

##Scripts and executables

Your commands will most likely want to run shell scripts, batch scripts, commands or other executables.

If the executables are added to your PATH env. variable, then you should be able to refer to it directly (e.g. `ant`), but if it doesn't work, simply add the path to the executable (e.g. `/usr/local/bin/node` rather than just `node`).

Other scripts and executables can be refered to by absolute or relative paths.

If you placed a copy of the scripts inside your project's folder, you can use the `$project` keyword. For instance, if the project currently open is `/my/project/`, to execute `my/project/scripts/deploy.sh`, your cmd is `$project/scripts/deploy.sh`.

If you want to share scripts globally (ie for all your projects) without having to add it to your PATH environment variable, you can copy the script file to the `scripts` folder located in this extension folder (which you can open by selecting `Help > Show Extension Folder` in the menu and browse to `user/buildsys`).

> A quick reminder: executable files such as commands, shell scripts, batch scripts etc *will only work if you gave them the proper permissions*. To give exec permssion on Mac OS, open the Terminal and type `chmod 755 ` , drag and drop your script on your Terminal, and hit enter.


##Executing Build Systems

By default, the `Build` command (`Cmd+B`) executes the first build system in the `builders` list of the configuration file.

Once you add more build systems, you should see them in the file menu under the `Build` command. If you select a build system it will make it the default build system, so that the next time you hit `Cmd+B`, this one get executed.



