/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface MimeoApp {
    }
    interface MimeoArticle {
        "slug": string;
    }
}
declare global {
    interface HTMLMimeoAppElement extends Components.MimeoApp, HTMLStencilElement {
    }
    var HTMLMimeoAppElement: {
        prototype: HTMLMimeoAppElement;
        new (): HTMLMimeoAppElement;
    };
    interface HTMLMimeoArticleElement extends Components.MimeoArticle, HTMLStencilElement {
    }
    var HTMLMimeoArticleElement: {
        prototype: HTMLMimeoArticleElement;
        new (): HTMLMimeoArticleElement;
    };
    interface HTMLElementTagNameMap {
        "mimeo-app": HTMLMimeoAppElement;
        "mimeo-article": HTMLMimeoArticleElement;
    }
}
declare namespace LocalJSX {
    interface MimeoApp {
    }
    interface MimeoArticle {
        "slug": string;
    }
    interface IntrinsicElements {
        "mimeo-app": MimeoApp;
        "mimeo-article": MimeoArticle;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "mimeo-app": LocalJSX.MimeoApp & JSXBase.HTMLAttributes<HTMLMimeoAppElement>;
            "mimeo-article": LocalJSX.MimeoArticle & JSXBase.HTMLAttributes<HTMLMimeoArticleElement>;
        }
    }
}
