"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Copy } from "lucide-react";
import { Sandpack } from "@codesandbox/sandpack-react";

export function AiCodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/codegenerator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const json = await res.json();
    console.log(json);

    setGeneratedCode(json.choices[0].message.content);
    setIsLoading(false);
    setIsCopied(false);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl flex flex-col min-h-screen bg-zinc-950">
      <h1 className="text-3xl font-bold text-center mb-4 text-white">
        AI Code Generator
      </h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow bg-zinc-900 text-white border-zinc-700"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </div>
      </form>

      <div className="flex-grow relative">
        {generatedCode ? (
          <>
            <Sandpack
              theme="dark"
              template="react-ts"
              options={{
                externalResources: [
                  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
                ],
                showNavigator: true,
                showTabs: true,
                editorHeight: "100vh",

                classes: {
                  "sp-wrapper": "h-full",
                  "sp-layout": "h-full",
                  "sp-stack": "h-full",
                },
              }}
              files={{
                "/App.tsx": {
                  code: generatedCode,
                  active: true,
                },
                "/styles.css": {
                  code: `
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #18181b;
                      color: #ffffff;
                      margin: 0;
                      padding: 0;
                    }
                  `,
                },
              }}
              customSetup={{
                dependencies: {
                  react: "^18.0.0",
                  "react-dom": "^18.0.0",
                },
              }}
            />
            <div className="absolute top-4 right-4">
              <Button
                onClick={handleCopy}
                variant="secondary"
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Copy className="h-4 w-4" />
                {isCopied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-zinc-900 rounded-lg">
            Your sandbox will appear here once code is generated...
          </div>
        )}
      </div>
    </div>
  );
}
