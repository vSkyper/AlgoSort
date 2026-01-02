import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <div className='rounded-lg overflow-hidden border border-neutral-800 shadow-inner h-full bg-[#0f0f0f]'>
      <SyntaxHighlighter
        language='javascript'
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          backgroundColor: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          height: '100%',
          overflow: 'auto',
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: '2em',
          paddingRight: '1em',
          color: '#525252',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
