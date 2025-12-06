"use client";

import { fetchQuestion } from "@/app/utils/fetchQuestions";
import { useEffect, useState } from "react";
import type { Question } from "@/app/types/types";
import { Editor } from "@monaco-editor/react";

export default function QuestionForm({ id }: Readonly<{ id: string }>) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await fetchQuestion(id);
        setQuestion(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  const testCode = async () => {
    setIsRunning(true);
    setIsCorrect(false);
    setTestError(null);

    const response = await fetch("/api/questions/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        sample_input: question?.sample_input,
        sample_output: question?.sample_output,
      }),
    });

    const data = await response.json();
    setIsRunning(false);

    if (!response.ok) {
      setTestError(data.error || "Failed to test code");
      return;
    }

    setIsCorrect(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading question...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="w-full flex justify-center px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            {question?.title}
          </h1>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {question?.description}
          </p>

          {question?.sample_input && (
            <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Sample Input
              </h2>
              <pre className="bg-white p-4 rounded text-sm text-gray-800 overflow-x-auto shadow">
                {question.sample_input}
              </pre>
            </div>
          )}

          {question?.sample_output && (
            <div className="bg-green-50 p-4 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Sample Output
              </h2>
              <pre className="bg-white p-4 rounded text-sm text-gray-800 overflow-x-auto shadow">
                {question.sample_output}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-0 flex flex-col justify-start gap-4">
          <div className="space-y-2">
            {isRunning && (
              <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded-lg shadow">
                Executing your code...
              </div>
            )}

            {isCorrect && (
              <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-lg shadow">
                Correct Answer
              </div>
            )}

            {testError && (
              <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded-lg shadow">
                {testError}
              </div>
            )}
          </div>

          <div>
            <button
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
              onClick={testCode}
            >
              Test
            </button>
          </div>
          <Editor
            theme="vs-dark"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
