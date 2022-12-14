# GET /api/users

Lists all current users in the database. Each user has keys of "username", "name", "avatar_url" and "vote_increments".

## Examples

### Response

```
{
        "users": [
          {
            "username": "tickle122",
            "name": "Tom Tickle",
            "avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
            "vote_increments": "101111111122201111111111"
          },
          {
            "username": "grumpy19",
            "name": "Paul Grump",
            "avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
            "vote_increments": "121111112101111111100111"
          },
          ...
        ]
      }

```
