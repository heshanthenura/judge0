"use client";

import React, { useRef } from "react";

export default function Home() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = React.useState("");

  const handleInput = () => {
    const value = editorRef.current?.innerText || "";
    const encoded = btoa(value);
    setCode(encoded);
    console.log("User typed:", value);
    console.log("Base64 Encoded Code:", encoded);
  };

  const testCode = async () => {
    try {
      const res = await fetch("/api/testcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      console.log("API Response:", data);
      console.log(data.status.id);
      if (data.status.id === 3) {
        alert("Success! Your code passed the test case.");
      } else {
        alert("Failed! Your code did not pass the test case.");
      }
    } catch (err) {
      console.error("Error calling API:", err);
    }
  };

  return (
    <div className="w-full flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Coding Question</h2>

          <p className="text-gray-700 mb-4">
            Make code show the sum of <b>2 space-separated digits</b>.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <span className="text-gray-500 text-sm">Input</span>
            <code className="block bg-gray-200 p-2 rounded mt-1">2 3</code>

            <span className="text-gray-500 text-sm mt-3 block">Output</span>
            <code className="block bg-gray-200 p-2 rounded mt-1">5</code>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div
            ref={editorRef}
            onInput={handleInput}
            className="flex-1 bg-gray-900 text-white p-4 rounded-lg font-mono outline-none min-h-[200px]"
            contentEditable
            suppressContentEditableWarning
          ></div>

          <div className="flex gap-3 mt-4">
            {/* <button
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              onClick={testCode}
            >
              Test
            </button> */}

            <button
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={testCode}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
