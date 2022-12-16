# POST /api/reviews/:review_id/comments

Creates a new comment for the given review.

## Example Request

```
{
  "username": "cooljmessy",
  "body": "I really love this game!"
}
```

## Example Response

```
{
        "comment": {
          "comment_id": 60,
          "body": "I really love this game!",
          "review_id": 1,
          "author": "cooljmessy",
          "votes": 0,
          "created_at": "2021-03-27T14:15:38.110Z"
        }
      }
```
