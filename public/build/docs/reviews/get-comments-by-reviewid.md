# GET /api/reviews/:review_id/comments

Lists all comments for the given review.

## Examples

### Response

```
{
        "comments": [
          {
            "comment_id": 60,
            "body": "I really love this game!",
            "review_id": 1,
            "author": "cooljmessy",
            "votes": 17,
            "created_at": "2021-03-27T14:15:38.110Z"
          },
          {
            "comment_id": 61,
            "body": "Where did you find this?!",
            "review_id": 1,
            "author": "weegembump",
            "votes": 1,
            "created_at": "2021-03-27T14:15:36.110Z"
          }
        ]
      }
```
