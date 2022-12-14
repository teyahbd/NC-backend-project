# GET /api

Lists all current endpoints on the API and some additional details (where relevant). Possible details include a description, accepted queries list and an example response.

## Examples

### Response

```
{
  "Endpoints": {
    "GET /api": {
      "description": "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/categories": {
      "description": "returns an array of all categories",
      "queries": [

      ],
      "exampleResponse": {
        "categories": [
          {
            "slug": "dexterity",
            "description": "Games involving physical skill, something like Gladiators, for Board Games!"
          },
          {
            "slug": "push-your-luck",
            "description": "Games that allow you to take bigger risks to achieve increasingly valuable rewards - or to decide to keep what you’ve got before you lose everything."
          }
        ]
      }
    },
    ...
}

```
