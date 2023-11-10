import {
    Canister,
    ic,
    Opt,
    query,
    Record,
    StableBTreeMap,
    text,
    blob,
    update,
    Vec,
    Result,
    nat64,
    int8,
    Err,
    bool,
    Principal,
    Variant,
    Ok,
    None,
    Some
} from 'azle';

const Post = Record ({
    id: Principal,
    creatorId: Principal,
    title: text,
    content: text,
    video: blob,
    audio: blob,
    reports: int8,
    createdAt: nat64,
    updatedAt: Opt(nat64)
});

const User = Record ({
    id: Principal,
    name: text,
    posts: Vec(Principal),
    followers: Vec(Principal),
    following: Vec(Principal)
});

const PostPayload = Record ({
    title: text,
    content: text,
    video: blob,
    audio: blob
});

const PostingError = Variant({
    PostDoesNotExist: Principal,
    UserDoesNotExist: Principal,
    OutOfBounds: text
});

const blogCanister = Canister({
    massUnfollow: update([Principal, Vec(Principal)], Result(bool, PostingError)),
    massRemoveFollowers: update([Principal, Vec(Principal)], Result(bool, PostingError))
});

const thisCanister = blogCanister(
    ic.id()
);

let PostStorage = StableBTreeMap(Principal, Post, 1); 
let UserBase = StableBTreeMap(Principal, User, 0);

const reportLimit = 10;

export default Canister({

    createUser: update([text], User, (username) => {
        const userid = generateId();

        const newUser: typeof User = {
            id: userid,
            name: username,
            posts: [],
            followers: [],
            following: []
        };

        UserBase.insert(userid, newUser);
        return newUser;
    }),
    // remove user
    removeUser: update([Principal], Result(text, PostingError), async (userId) => {
        const deletingUserOpt = UserBase.get(userId);

        if ('None' in deletingUserOpt) {
            return Err ({
                UserDoesNotExist: userId
            });
        }

        const deletingUser = deletingUserOpt.Some;
        // grab followers and call unfollow
        
        await ic.call(thisCanister.massUnfollow, {
            args: [deletingUser.id, deletingUser.following]
        });

        await ic.call(thisCanister.massRemoveFollowers, {
            args: [deletingUser.id, deletingUser.followers]
        });

        for (let i = 0; i < deletingUser.posts.length; i++) {
            PostStorage.remove(deletingUser.posts[i]);
        }

        let username = deletingUser.name;

        UserBase.remove(userId);
        const removalSuccess = username + ' was successfully removed';
        return Ok(removalSuccess);
    }),
    // Change userName
    changeUsername: update([Principal, text], Result(text, PostingError), (userid, newusername) => {
        const userOpt = UserBase.get(userid);

        if ('None' in userOpt) {
            return Err ({
                UserDoesNotExist: userid
            })
        }

        const changedUser = userOpt.Some;

        const theChange: typeof User = {
            ...changedUser,
            name: newusername
        }

        UserBase.insert(userid, theChange);

        return Ok('Your username is now ' + newusername);
    }),
    viewUsers: query([], Vec(User), () => {
        return UserBase.values();
    }),
    // create post
    createPost: update([Principal, PostPayload], Result(Post, PostingError), (userid, newpost) => {
        const postId = generateId();
        const userOpt = UserBase.get(userid);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: userid
            });
        }
        const actualUser = userOpt.Some;

        const newPost: typeof Post = {
            id: postId,
            creatorId: userid,
            ...newpost,
            reports: 0,
            createdAt: ic.time(),
            updatedAt: None
        };

        const addPostToUser: typeof User = {
            ...actualUser,
            posts: [...actualUser.posts, postId]
        };

        UserBase.insert(userid, addPostToUser);
        PostStorage.insert(postId, newPost);
        return Ok(newPost);
    }),

    // delete post
    deletePost: update([Principal], Result(Post, PostingError), (postId) => {
        const postOpt = PostStorage.get(postId);

        if ('None' in postOpt) {
            return Err ({
                PostDoesNotExist: postId
            })
        }

        const thePost = postOpt.Some;
        const creator = UserBase.get(thePost.creatorId).Some;

        const removePostFromCreator: typeof User = {
            ...creator,
            posts: creator.posts ? creator.posts.filter(
                (deletePostId: Principal) =>
                    deletePostId && deletePostId.toText() !== postId?.toText()
            ) : []
        }

        const creatorUserId: Principal = creator.id;
        UserBase.insert(creatorUserId, removePostFromCreator);
        PostStorage.remove(postId);

        return Ok(thePost);
    }),

    // edit post
    editPost: update([Principal, PostPayload], Result(Post, PostingError), (postId, updates) => {
        const postOpt = PostStorage.get(postId);

        if ('None' in postOpt) {
            return Err ({
                PostDoesNotExist: postId
            })
        }

        const thePost = postOpt.Some;

        const updatedPost: typeof Post = {
            postId,
            ...thePost,
            ...updates,
            updatedAt: Some(ic.time())
        }

        PostStorage.insert(postId, updatedPost);
        return Ok(updatedPost);
    }),

    // view all posts
    getPosts: query([], Vec(Post), () => {
        return PostStorage.values();
    }),

    // add followers user
    followUser: update([Principal, Principal], Result(text, PostingError), (followerid, userid) => {
        const toBeFollowedUserOpt = UserBase.get(userid);
        const followerOpt = UserBase.get(followerid);

        if ('None' in toBeFollowedUserOpt) {
            return Err ({
                UserDoesNotExist: userid
            });
        } else if ('None' in followerOpt) {
            return Err ({
                UserDoesNotExist: followerid
            });
        }

        const toBeFollowedUser = toBeFollowedUserOpt.Some;
        const followerUser = followerOpt.Some;

        const updateUser: typeof User = {
            ...toBeFollowedUser,
            followers: [...toBeFollowedUser.followers, followerid]
        }

        const updateFollower: typeof User = {
            ...followerUser,
            following: [...followerUser.following, userid]
        }

        UserBase.insert(userid, updateUser);
        UserBase.insert(followerid, updateFollower);

        const success = "You are now a follower of " + updateUser.name;
        return Ok(success);
    }),
    // unfollow
    unfollow: update([Principal, Principal], Result(text, PostingError), (userId, unfollowFromId) => {
        const userOpt = UserBase.get(userId);
        const unfollowFromOpt = UserBase.get(unfollowFromId);

        if ('None' in userOpt) {
            return Err ({
                UserDoesNotExist: userId
            });
        } else if ('None' in unfollowFromOpt) {
            return Err ({
                UserDoesNotExist: unfollowFromId
            });
        }

        const theUser = userOpt.Some;
        const unfollowedUser = unfollowFromOpt.Some;

        const updateOurUser: typeof User = {
            ...theUser,
            following: theUser.following ? theUser.following.filter(
                (followingId: Principal) =>
                followingId && followingId.toText() !== unfollowedUser.id.toText()
            ) : []
        };

        const updateUnfollowedUser: typeof User = {
            ...unfollowedUser,
            followers: unfollowedUser.followers ? unfollowedUser.followers.filter(
                (exFollowerId: Principal) =>
                exFollowerId && exFollowerId.toText() !== theUser.id.toText()
            ) : []
        };

        UserBase.insert(userId, updateOurUser);
        UserBase.insert(unfollowFromId, updateUnfollowedUser);

        return Ok("You have unfollowed " + updateUnfollowedUser.name);
    }),
    massUnfollow: update([Principal, Vec(Principal)], Result(bool, PostingError), (userId, exFollowedIds) => {
        const userOpt = UserBase.get(userId);

        if('None' in userOpt) {
            return Err({
                UserDoesNotExist: userId
            });
        }

        const theUser = userOpt.Some;

        const readableIds = exFollowedIds.map(id => id.toText());

        let remainingFollowed = theUser.following ? theUser.following.filter(
            (exFollowerId: Principal) =>
            exFollowerId && !(readableIds.some((readId) => readId === exFollowerId.toText()))
        ) : [];

        let exFollow: typeof User;
        let unfollowedUser: typeof User;
        for (let i = 0; i < exFollowedIds.length; i++) {
            exFollow = UserBase.get(exFollowedIds[i]).Some;

            unfollowedUser = {
                ...exFollow,
                followers: exFollow.followers ? exFollow.followers.filter(
                    (exFollowerId: Principal) =>
                    exFollowerId && exFollowerId.toText() !== userId.toText()
                ) : []
            };

            UserBase.insert(exFollowedIds[i], unfollowedUser);
        }

        const resultingUser: typeof User = {
            ...theUser,
            following: remainingFollowed
        };

        UserBase.insert(userId, resultingUser);

        return Ok(true);
    }),
    massRemoveFollowers: update([Principal, Vec(Principal)], Result(bool, PostingError), (userId, exFollowerIds) => {
        const userOpt = UserBase.get(userId);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: userId
            });
        }

        const theUser = userOpt.Some;

        const readableIds = exFollowerIds.map(id => id.toText());

        let remainingFollowers = theUser.followers ? theUser.followers.filter(
            (exFollowerId: Principal) =>
            exFollowerId && !(readableIds.some((readId) => readId === exFollowerId.toText()))
        ) : [];

        let exFollower: typeof User;
        let exfollowerUser: typeof User;

        for (let i = 0; i < exFollowerIds.length; i++) {
            exFollower = UserBase.get(exFollowerIds[i]).Some;

            exfollowerUser = {
                ...exFollower,
                following: exFollower.following ? exFollower.following.filter(
                    (unFollowedId: Principal) =>
                    unFollowedId && unFollowedId.toText() !== userId.toText()
                ) : []
            };

            UserBase.insert(exFollowerIds[i], exfollowerUser);
        }

        const resultingUser: typeof User = {
            ...theUser,
            followers: remainingFollowers
        };

        UserBase.insert(userId, resultingUser);

        return Ok(true);
    }),
    // load posts by username
    postsByUser: query([Principal], Result(Vec(Post), PostingError), (userid) => {
        const userOpt = UserBase.get(userid);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: userid
            });
        }

        let usersPosts = PostStorage.values() ? PostStorage.values().filter(
            (aPost: typeof Post) =>
            aPost.id && aPost.creatorId.toText() === userid.toText()
        ): [];

        return Ok(usersPosts);
    }),
    flagPost: update([Principal], Result(text, PostingError), (reportedPostId) => {
        const reportedPostOpt = PostStorage.get(reportedPostId);

        if ('None' in reportedPostOpt) {
            return Err ({
                PostDoesNotExist: reportedPostId
            });
        }

        const reportedPost = reportedPostOpt.Some;

        const strikeThePost: typeof Post = {
            ...reportedPost,
            reports: (reportedPost.reports + 1)
        }

        PostStorage.insert(reportedPostId, strikeThePost);

        return Ok('The post has been reported');
    }),
    viewFlaggedPosts: query([], Vec(Post), () => {
        let allFlaggedPosts = PostStorage.values();

        allFlaggedPosts = allFlaggedPosts.filter(
            (findBigFlags: typeof Post) =>
            findBigFlags.reports >= reportLimit
        );

        allFlaggedPosts = allFlaggedPosts.sort((x: typeof Post,y: typeof Post) => x.reports > y.reports);

        return allFlaggedPosts;
    })

});

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}