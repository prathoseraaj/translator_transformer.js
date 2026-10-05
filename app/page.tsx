"use client";

import { useEffect, useRef, useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import Progress from "@/components/Progress";

export default function Home() {
  const worker = useRef<Worker | null>(null);

  const [ready, setReady] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(false);

  const [progressItems, setProgressItems] = useState<any[]>([]);

  const [input, setInput] = useState(
    "I love walking my dog."
  );

  const [sourceLanguage, setSourceLanguage] =
    useState("eng_Latn");

  const [targetLanguage, setTargetLanguage] =
    useState("fra_Latn");

  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../workers/worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
          setReady(false);

          setProgressItems((prev) => [
            ...prev,
            e.data,
          ]);

          break;

        case "progress":
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return {
                  ...item,
                  progress: e.data.progress,
                };
              }

              return item;
            })
          );

          break;

        case "done":
          setProgressItems((prev) =>
            prev.filter(
              (item) => item.file !== e.data.file
            )
          );

          break;

        case "ready":
          setReady(true);
          break;

        case "update":
          setOutput((current) => {
            return current + e.data.output;
          });

          break;

        case "complete":
          setDisabled(false);
          break;
      }
    };

    worker.current.addEventListener(
      "message",
      onMessageReceived
    );

    return () => {
      worker.current?.removeEventListener(
        "message",
        onMessageReceived
      );
    };
  }, []);

  const translate = () => {
    if (!worker.current) return;

    setDisabled(true);
    setOutput("");

    worker.current.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold">
          Transformers.js Translator
        </h1>

        <p className="text-gray-600 mt-2">
          Translate text directly in your browser.
        </p>

        <div className="flex gap-4 mt-8">
          <LanguageSelector
            type="Source"
            defaultLanguage="eng_Latn"
            onChange={(e) =>
              setSourceLanguage(e.target.value)
            }
          />

          <LanguageSelector
            type="Target"
            defaultLanguage="fra_Latn"
            onChange={(e) =>
              setTargetLanguage(e.target.value)
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <textarea
            value={input}
            rows={8}
            onChange={(e) =>
              setInput(e.target.value)
            }
            className="border rounded-lg p-4 w-full"
            placeholder="Enter text..."
          />

          <textarea
            value={output}
            rows={8}
            readOnly
            className="border rounded-lg p-4 w-full bg-gray-50"
            placeholder="Translation..."
          />

        </div>

        <button
          disabled={disabled}
          onClick={translate}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg disabled:opacity-50"
        >
          {disabled ? "Translating..." : "Translate"}
        </button>

        <div className="mt-6">

          {ready === false && (
            <p className="mb-2">
              Loading model...
            </p>
          )}

          {progressItems.map((data) => (
            <Progress
              key={data.file}
              text={data.file}
              percentage={data.progress}
            />
          ))}

        </div>

      </div>
    </main>
  );
}