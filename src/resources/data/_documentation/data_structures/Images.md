# Images

Image data contains links to visuals, used in some object types.

## Structure

Images are found in *images.json* and each one has the following structure.

```
tags    : []
caption : string
img_src : string
```

- **tags** - A series of tags which identify what kind of image something is, see [Tags](../Tags.md) for more information. These tags contain the IDs of the other items to show this image with.
- **caption** - Additional information/context for the image.
- **img_src** - URL referencing the image source.

## Example

```

    {
        "tags": {
            "id_name": true
        },
        "img_src": "https://i.pinimg.com/originals/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg",
        "caption": ""
    }
```