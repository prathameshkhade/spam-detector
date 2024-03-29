#!/bin/bash

# Install npm
sudo apt install npm

# Check npm installation exit code
if [[ $? -eq 0 ]]; then
    printf "\n\n[+] Node.js installed successfully...\n\n"
    sleep 2 
    clear

    # Install Express
    printf "\n[+] Installing express server...\n\n"
    sleep 2
    npm install express

    # Check Express installation exit code
    if [[ $? -eq 0 ]]; then
	sleep 2
        printf "\n\n[+] Express installed successfully...\n\n"
	clear
    else
	sleep 1
        printf "\n\n[!] Error installing express..."
        exit 1
    fi
else
    sleep 1
    printf "\n\n[!] Unexpected error!"
    exit 1
fi

# Clear the screen and wait
clear && sleep 1

# Prompt for starting server
printf "[?] Do you want to start the express server? (y/n): "
read ans

if [[ $ans == "y" ]]; then
    printf "\n\n[+] Starting express server...\n"
    sleep 1
    node server.js
else
    printf "\n\n[!] Exiting..."
    exit 0
fi

