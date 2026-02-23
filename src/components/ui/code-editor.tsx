'use client';

import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
    value: string;
    language: string;
    onChange?: (value: string | undefined) => void;
    readOnly?: boolean;
    height?: string;
}

export function CodeEditor({
    value,
    language,
    onChange,
    readOnly = false,
    height = '300px',
}: CodeEditorProps) {
    return (
        <div className="border-border bg-muted/10 overflow-hidden rounded-xl border">
            <Editor
                height={height}
                language={language}
                value={value}
                onChange={onChange}
                theme="vs-light"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    readOnly: readOnly,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                }}
                loading={
                    <div className="bg-muted/5 flex h-full w-full items-center justify-center">
                        <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    </div>
                }
            />
        </div>
    );
}
