export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'changeUsername' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'createPost' : IDL.Func(
        [
          IDL.Principal,
          IDL.Record({
            'title' : IDL.Text,
            'content' : IDL.Text,
            'audio' : IDL.Vec(IDL.Nat8),
            'video' : IDL.Vec(IDL.Nat8),
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'audio' : IDL.Vec(IDL.Nat8),
              'video' : IDL.Vec(IDL.Nat8),
              'createdAt' : IDL.Nat64,
              'creatorId' : IDL.Principal,
              'updatedAt' : IDL.Opt(IDL.Nat64),
              'reports' : IDL.Int8,
            }),
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'createUser' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'id' : IDL.Principal,
            'name' : IDL.Text,
            'posts' : IDL.Vec(IDL.Principal),
            'followers' : IDL.Vec(IDL.Principal),
            'following' : IDL.Vec(IDL.Principal),
          }),
        ],
        [],
      ),
    'deletePost' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'audio' : IDL.Vec(IDL.Nat8),
              'video' : IDL.Vec(IDL.Nat8),
              'createdAt' : IDL.Nat64,
              'creatorId' : IDL.Principal,
              'updatedAt' : IDL.Opt(IDL.Nat64),
              'reports' : IDL.Int8,
            }),
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'editPost' : IDL.Func(
        [
          IDL.Principal,
          IDL.Record({
            'title' : IDL.Text,
            'content' : IDL.Text,
            'audio' : IDL.Vec(IDL.Nat8),
            'video' : IDL.Vec(IDL.Nat8),
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'audio' : IDL.Vec(IDL.Nat8),
              'video' : IDL.Vec(IDL.Nat8),
              'createdAt' : IDL.Nat64,
              'creatorId' : IDL.Principal,
              'updatedAt' : IDL.Opt(IDL.Nat64),
              'reports' : IDL.Int8,
            }),
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'flagPost' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'followUser' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'getPosts' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'audio' : IDL.Vec(IDL.Nat8),
              'video' : IDL.Vec(IDL.Nat8),
              'createdAt' : IDL.Nat64,
              'creatorId' : IDL.Principal,
              'updatedAt' : IDL.Opt(IDL.Nat64),
              'reports' : IDL.Int8,
            })
          ),
        ],
        ['query'],
      ),
    'massRemoveFollowers' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal)],
        [
          IDL.Variant({
            'Ok' : IDL.Bool,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'massUnfollow' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal)],
        [
          IDL.Variant({
            'Ok' : IDL.Bool,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'postsByUser' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Principal,
                'title' : IDL.Text,
                'content' : IDL.Text,
                'audio' : IDL.Vec(IDL.Nat8),
                'video' : IDL.Vec(IDL.Nat8),
                'createdAt' : IDL.Nat64,
                'creatorId' : IDL.Principal,
                'updatedAt' : IDL.Opt(IDL.Nat64),
                'reports' : IDL.Int8,
              })
            ),
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        ['query'],
      ),
    'removeUser' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'unfollow' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'OutOfBounds' : IDL.Text,
              'PostDoesNotExist' : IDL.Principal,
              'UserDoesNotExist' : IDL.Principal,
            }),
          }),
        ],
        [],
      ),
    'viewFlaggedPosts' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'audio' : IDL.Vec(IDL.Nat8),
              'video' : IDL.Vec(IDL.Nat8),
              'createdAt' : IDL.Nat64,
              'creatorId' : IDL.Principal,
              'updatedAt' : IDL.Opt(IDL.Nat64),
              'reports' : IDL.Int8,
            })
          ),
        ],
        ['query'],
      ),
    'viewUsers' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'name' : IDL.Text,
              'posts' : IDL.Vec(IDL.Principal),
              'followers' : IDL.Vec(IDL.Principal),
              'following' : IDL.Vec(IDL.Principal),
            })
          ),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
