import React, { PropsWithChildren } from 'react';
import { MDXProvider } from '@mdx-js/react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';

const components = {
  pre: (props: any) => <div {...props}></div>,
  code: CodeblockRender,
};

function CodeblockRender(props: PropsWithChildren<{ className: string }>) {
  const { children, className = 'txt' } = props;
  const language = className.replace(/language-/, '');

  return (
    <Highlight
      {...defaultProps}
      code={children as string}
      language={language as Language}
      theme={dracula}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function Highlighter(props: PropsWithChildren<{}>) {
  return <MDXProvider components={components}>{props.children}</MDXProvider>;
}

export default Highlighter;
