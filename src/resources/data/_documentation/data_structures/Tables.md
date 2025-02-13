# Tables

Tables contain structured information with columns and rows.

## Structure

Tables are found in *table.json* and each one has the following structure.

```
id          : string
type        : string
source      : string
tags        : []
eventtags   : {}
description : []
colnames    : []
items       : [table_item]
```

- **id** - The identifying value of the table, all tables start their id with "tb_".
- **type** - Used for broad categorization, all tables have the type "Table".
- **source** - Where the table came from. Currently, it's expected all tables will have the source "core".
- **tags** - A series of tags which identify what kind of table something is, see [Tags](../Tags.md) for more information.
- **name** - The name of the table.
- **description** - Specially formatted array of information included in the table, see [Description](../Description.md) for more informaiton.
- **colnames** - Array of columns, and their titles.
- **eventtags** - Used for code functionality.
- **items** - Collection of table items, each representing a row in the table. See below.

### Table Item

```
id          : string
type        : string
source      : string
tags        : []
eventtags   : {}
description : []
```

- **id** - The identifying value of the table item, all glossary rules start their id with "ti_".
- **type** - Used for broad categorization, all table items rules have the type "TableItem".
- **source** - Where the item came from. Currently, it's expected all table items will have the source "core".
- **tags** - A series of tags which identify what kind of item something is, see [Tags](../Tags.md) for more information.
- **eventtags** - Used for code functionality.
- **description** - Specially formatted array of information included in the table item, see [Description](../Description.md) for more informaiton. Each member of the array represents a different column in the table.

## Example

```
    {
        "id": "tb_default",
        "type": "Table",
        "source": "core",
        "tags": {},
        "eventtags": {},
        "colnames": ["Column_A", "Column_B"],
        "description": [
        ],
        "items": [
            {
                "id": "ti_default_01",
                "type": "TableItem",
                "source": "core",
                "tags": {},
                "eventtags": {},
                "description": [
                {
                    "tags": {"desc_type" : "desc"},
                    "content": "Test_A"
                },
                {
                    "tags": {"desc_type" : "desc"},
                    "content": "Test_B"
                }
                ]
            }
        ]
    }
```