import React from "react";
import MarkdownComponent from "react-markdown/with-html";
import GFM from "remark-gfm";
import MarkdownStyles from "../sass/markdown.scss";

export class Markdown
{
    static get CSS(): string
    {
        return MarkdownStyles["markdown"];
    }

    static render(text: string): JSX.Element
    {
        return (<MarkdownComponent plugins={[GFM]} allowDangerousHtml>{text}</MarkdownComponent>);
    }
}
