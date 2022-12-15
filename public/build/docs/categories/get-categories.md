# GET /api/categories

Lists all current board game categories. Each category has keys of "slug" and "description".

## Examples

### Response

```
{
    "categories": [
        {
            "slug": "dexterity",
            "description": "Games involving physical skill, something like Gladiators, for Board Games!"
          },
          {
            "slug": "push-your-luck",
            "description": "Games that allow you to take bigger risks to achieve increasingly valuable rewards - or to decide to keep what you’ve got before you lose everything."
          },
          ...
        ]
}

```
