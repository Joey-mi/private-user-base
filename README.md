# ICP Blog Management Canister

## Features
1. Create a user
2. Create posts with text, video or audio
3. Flag post (report a post if it contains anything concerning)
4. View frequently flagged posts for moderation (View posts that've received 10+ flags)
5. Follow a user
6. Unfollow another user
7. Delete post
6. Remove user

## Required Downloads
Follow the basic installation instructions from https://demergent-labs.github.io/azle/installation.html
Also make sure that rust is installed


## Deploy Canister
```bash
dfx start --background --clean
dfx deploy
```

## View Backend Canister with the Candid Interface:
Copy the url that's given to you in the terminal after running ```bash dfx deploy ``` and paste
it into a search bar.

Should start with http://127.0.0.1:4943/?canisterId=

## Stop dfx
```bash
dfx stop
```
