export class Image
{
    url: Url;
    altText?: string;

    static validate(image: Image): void
    {
        if (!image.url?.original) throw Error("[Image.url.original] cannot be null, undefined or empty string.");
    }
}

interface Url
{
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    original: string;
}
