# GET /api/comments/:comment_id

Returns the requested comment. The comment has keys of "comment_id", "body", "review_id", "author", "votes" and "created_at".

## Examples

### Response

```
{
        "comment": {
          "comment_id": 59,
          "body": "I love this game!",
          "review_id": 1,
          "author": "jessjelly",
          "votes": 3,
          "created_at": "2021-03-27T19:48:58.110Z"
        }
      }
    }
```
