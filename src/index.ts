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
    Some,
    isNone
} from 'azle';

const Post = Record({
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

const User = Record({
    id: Principal,
    name: text,
    posts: Vec(Principal),
    followers: Vec(Principal),
    following: Vec(Principal)
});

const PostPayload = Record({
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

const thisCanister = blogCanister(ic.id());

let PostStorage = StableBTreeMap(Principal, Post, 1);
let UserBase = StableBTreeMap(Principal, User, 0);

const reportLimit = 10;

export default Canister({
    createUser: update([text], User, (username) => {
        const userId = generateId();

        const newUser: typeof User = {
            id: userId,
            name: username,
            posts: [],
            followers: [],
            following: []
        };

        UserBase.insert(userId, newUser);
        return newUser;
    }),

    removeUser: update([Principal], Result(text, PostingError), async (userId) => {
        try {
            const deletingUserOpt = UserBase.get(userId);

            if (isNone(deletingUserOpt)) {
                throw Err({
                    UserDoesNotExist: userId
                });
            }

            const deletingUser = deletingUserOpt.Some;

            await ic.call(thisCanister.massUnfollow, {
                args: [deletingUser.id, deletingUser.following]
            });

            await ic.call(thisCanister.massRemoveFollowers, {
                args: [deletingUser.id, deletingUser.followers]
            });

            for (const postId of deletingUser.posts) {
                PostStorage.remove(postId);
            }

            const username = deletingUser.name;

            UserBase.remove(userId);
            return Ok(`${username} was successfully removed`);
        } catch (error) {
            return error;
        }
    }),

    changeUsername: update([Principal, text], Result(text, PostingError), (userId, newUsername) => {
        try {
            const userOpt = UserBase.get(userId);

            if (isNone(userOpt)) {
                throw Err({
                    UserDoesNotExist: userId
                });
            }

            const user = userOpt.Some;

            const updatedUser: typeof User = {
                ...user,
                name: newUsername
            };

            UserBase.insert(userId, updatedUser);
            return Ok(`Your username is now ${newUsername}`);
        } catch (error) {
            return error;
        }
    }),

    createPost: update([Principal, PostPayload], Result(Post, PostingError), (userId, newPost) => {
        try {
            const postId = generateId();
            const userOpt = UserBase.get(userId);

            if (isNone(userOpt)) {
                throw Err({
                    UserDoesNotExist: userId
                });
            }

            const actualUser = userOpt.Some;

            const post: typeof Post = {
                id: postId,
                creatorId: userId,
                ...newPost,
                reports: 0,
                createdAt: ic.time(),
                updatedAt: None
            };

            const updatedUser: typeof User = {
                ...actualUser,
                posts: [...actualUser.posts, postId]
            };

            UserBase.insert(userId, updatedUser);
            PostStorage.insert(postId, post);
            return Ok(post);
        } catch (error) {
            return error;
        }
    }),

    // The rest of the functions remain unchanged...

    viewFlaggedPosts: query([], Result(Vec(Post), PostingError), () => {
        try {
            let allFlaggedPosts = PostStorage.values();

            allFlaggedPosts = allFlaggedPosts.filter(
                (findBigFlags: typeof Post) =>
                    findBigFlags.reports >= reportLimit
            );

            allFlaggedPosts = allFlaggedPosts.sort((x: typeof Post, y: typeof Post) => y.reports - x.reports);

            return Ok(allFlaggedPosts);
        } catch (error) {
            return Err({
                OutOfBounds: 'Error viewing flagged posts'
            });
        }
    })
});

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}
