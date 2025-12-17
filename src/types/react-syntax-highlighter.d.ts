declare module 'react-syntax-highlighter/dist/esm/light' {
    import { ComponentType } from 'react';
    export const Light: ComponentType<any> & {
        registerLanguage: (name: string, language: any) => void;
    };
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
    export const atomOneDark: Record<string, any>;
    export const atomOneLight: Record<string, any>;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/javascript' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/typescript' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/python' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/css' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/bash' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/json' {
    const language: any;
    export default language;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/xml' {
    const language: any;
    export default language;
}
