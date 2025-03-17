import { useState } from 'react';
import axios from 'axios';
import { Button } from 'shadcn-ui';
import { Input } from 'shadcn-ui';
import 'tailwindcss/tailwind.css';

export default function Home() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/summarize', { text });
      setSummary(response.data[0].summary_text);
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">AI Text Summarizer</h1>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          rows={6}
        />
        <Button
          onClick={handleSummarize}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </Button>
        {summary && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <h2 className="font-semibold">Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
