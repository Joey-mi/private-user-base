import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'changeUsername' : ActorMethod<
    [Principal, string],
    { 'Ok' : string } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'createPost' : ActorMethod<
    [
      Principal,
      {
        'title' : string,
        'content' : string,
        'audio' : Uint8Array | number[],
        'video' : Uint8Array | number[],
      },
    ],
    {
        'Ok' : {
          'id' : Principal,
          'title' : string,
          'content' : string,
          'audio' : Uint8Array | number[],
          'video' : Uint8Array | number[],
          'createdAt' : bigint,
          'creatorId' : Principal,
          'updatedAt' : [] | [bigint],
          'reports' : number,
        }
      } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'createUser' : ActorMethod<
    [string],
    {
      'id' : Principal,
      'name' : string,
      'posts' : Array<Principal>,
      'followers' : Array<Principal>,
      'following' : Array<Principal>,
    }
  >,
  'deletePost' : ActorMethod<
    [Principal],
    {
        'Ok' : {
          'id' : Principal,
          'title' : string,
          'content' : string,
          'audio' : Uint8Array | number[],
          'video' : Uint8Array | number[],
          'createdAt' : bigint,
          'creatorId' : Principal,
          'updatedAt' : [] | [bigint],
          'reports' : number,
        }
      } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'editPost' : ActorMethod<
    [
      Principal,
      {
        'title' : string,
        'content' : string,
        'audio' : Uint8Array | number[],
        'video' : Uint8Array | number[],
      },
    ],
    {
        'Ok' : {
          'id' : Principal,
          'title' : string,
          'content' : string,
          'audio' : Uint8Array | number[],
          'video' : Uint8Array | number[],
          'createdAt' : bigint,
          'creatorId' : Principal,
          'updatedAt' : [] | [bigint],
          'reports' : number,
        }
      } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'flagPost' : ActorMethod<
    [Principal],
    { 'Ok' : string } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'followUser' : ActorMethod<
    [Principal, Principal],
    { 'Ok' : string } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'getPosts' : ActorMethod<
    [],
    Array<
      {
        'id' : Principal,
        'title' : string,
        'content' : string,
        'audio' : Uint8Array | number[],
        'video' : Uint8Array | number[],
        'createdAt' : bigint,
        'creatorId' : Principal,
        'updatedAt' : [] | [bigint],
        'reports' : number,
      }
    >
  >,
  'massRemoveFollowers' : ActorMethod<
    [Principal, Array<Principal>],
    { 'Ok' : boolean } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'massUnfollow' : ActorMethod<
    [Principal, Array<Principal>],
    { 'Ok' : boolean } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'postsByUser' : ActorMethod<
    [Principal],
    {
        'Ok' : Array<
          {
            'id' : Principal,
            'title' : string,
            'content' : string,
            'audio' : Uint8Array | number[],
            'video' : Uint8Array | number[],
            'createdAt' : bigint,
            'creatorId' : Principal,
            'updatedAt' : [] | [bigint],
            'reports' : number,
          }
        >
      } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'removeUser' : ActorMethod<
    [Principal],
    { 'Ok' : string } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'unfollow' : ActorMethod<
    [Principal, Principal],
    { 'Ok' : string } |
      {
        'Err' : { 'OutOfBounds' : string } |
          { 'PostDoesNotExist' : Principal } |
          { 'UserDoesNotExist' : Principal }
      }
  >,
  'viewFlaggedPosts' : ActorMethod<
    [],
    Array<
      {
        'id' : Principal,
        'title' : string,
        'content' : string,
        'audio' : Uint8Array | number[],
        'video' : Uint8Array | number[],
        'createdAt' : bigint,
        'creatorId' : Principal,
        'updatedAt' : [] | [bigint],
        'reports' : number,
      }
    >
  >,
  'viewUsers' : ActorMethod<
    [],
    Array<
      {
        'id' : Principal,
        'name' : string,
        'posts' : Array<Principal>,
        'followers' : Array<Principal>,
        'following' : Array<Principal>,
      }
    >
  >,
}
