#Brackets BuildSys

A stupid simple build system for Brackets.

Hit `Cmd+B` (`Ctrl+B` on Windows) to run a `build.sh` (or `build.bat`) file, or whatever build system you configured.

##Install

1. Open the the Extension Manager from the File menu
2. Copy paste the URL of the github repo or zip file

Alternatively, you can unzip ZIP the project to Brackets' `/extensions/user` folder by selecting `Help > Show Extension Folder` in the menu. 

##Instructions

This extension will add a `Build` menu item in the `File` menu, followed by a list of build systems defined in a config file.

By default, it will try to run a `build.sh` file located at the root of your project.

But the whole point of this extension is that you can edit the build systems.

##Editing Build systems

Build systems are listed in a `config.json` file in this extension folder.

To edit this file, choose `Help > Show Extension Folder` and open `user/buildsys/config.json`. (You'll need to relaunch Brackets for the modifications to be effective.)

Here you'll find a list of build systems (aka builders), which look like this:

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
* `$scripts`: path to global scripts

##Global scripts

Your commands will most likely want to run shell scripts, batch scripts, commands or other executables.

If the executables are added to your PATH env. variable, then you can refer to it directly.

If it's not, then you can either refer to it by its absolute path, or use a relative path with our special keywords.

If you placed a copy of the scripts inside your project's folder, you can use the `$project` keyword. For instance, if the project currently open is `/my/project/`, to execute `my/project/scripts/deploy.sh`, your cmd is `$project/scripts/deploy.sh`.

If you want to share scripts globally (ie for all your projects) you can add the script file to the `scripts` folder located in this extension folder (which, again, you'll find by selecting `Help > Show Extension Folder` in the menu).



##Permissions, people

A quick reminder: executable files such as commands, shell scripts, batch scripts etc *will only work if you gave them the proper permissions*.

To give exec permssion on Mac OS, open the Terminal and type `chmod 755 ` , drag and drop your script on your Terminal, and hit enter.

##Where is my output?

The output is written to your developer tools console, which you can open from the `Debug` menu (or hitting `Alt+Ctrl+I`).

I'm just too lazy to create a dedicated bottom panel for now.



