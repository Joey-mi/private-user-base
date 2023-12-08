# ICP Blog Management Canister

## Canister Methods + Descriptions
1. createUser: Create a user
2. removeUser: Remove user
3. changeUsername: Rename user
4. viewUsers: See all users
5. createPost: Create posts with text, video or audio
6. deletePost: Delete post
7. editPost: Change contents of a current post
8. getPosts: View all posts
9. postsByUser: View all posts under a specific user
10. flagPost: Flag post (report a post if it contains anything concerning)
11. viewMajorFlaggedPosts: View **frequently** flagged posts for moderation (View posts that've received **5+ flags**)
12. followUser: Follow another user. (Add to following list)
13. unfollow: Unfollow a user (Remove them from following list)
14. massUnfollow: Remove multiple users from following list
15. massRemoveFollowers: Remove multiple users from followers list

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
