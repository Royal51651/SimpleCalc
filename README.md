# Lets set the stage

Imagine this. You're sitting in your cubicle, filling out some paperwork like always. Your coffee has gone cold and boredom rears it's ugly head. But then, you remember something. You remember that you installed...

# SimpleCalc!!!

Despite the name, SimpleCalc is anything but simple. It includes the latest in advanced visual effects, engaging sound design, and a simplistic yet elegant user-interface. This all culminates in what is one of, if not the most interesting calculators to ever have been programmed!!! It's cross-platform, blazingly fast due to it's rust-backend, and beautiful thanks to hundreds of lines of carefully selected CSS and JSX. 

# But, Why?

SimpleCalc started off as a project to learn React, improve my CSS skills, and get familiar with the Tauri framework. However, I realized that there needed to be a distinct feature. Something that no other calculator had. I decided the best feature was visual and sound effects creating the most engaging calculator experience ever.

# I NEED IT!!!

You should be able to download the latest release from the release tab found here:  https://github.com/Royal51651/SimpleCalc/releases

Tauri is still a fairly new framework, so it doesn't yet have cross-compilation. Because of this, certain architectures and operating systems may be unavailable. To solve this, compile from soure.

How to compile from source:

Make sure you have git, and follow the prerequisites from the official Tauri site: https://v2.tauri.app/start/prerequisites/
Once you're done with that, clone the directory.

```git clone https://github.com/Royal51651/SimpleCalc```

Then cd into the folder

```cd SimpleCalc```

Install the dependencies

```npm install```

And finally run the project

```npm run tauri build --release```

From there, you should be presented with instructions to install based on your operating system.

