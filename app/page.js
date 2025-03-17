// frontend/app/page.js
'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SummarizePage = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/summarize' // Local URL for development
        : 'https://ai-text-summarizer-nfk5.onrender.com/summarize'; // Production URL for Render

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSummary(data.summary || 'Failed to summarize');
    } catch (error) {
      console.error('Error occurred:', error);
      setSummary('Failed to summarize');
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-bold text-center text-blue-600 mb-8 tracking-tight">
        Victoria's AI Text Summarizer
      </h1>
      <h5 className="text-5xl font-bold text-center text-blue-600 mb-8 tracking-tight">
        Using TextRazor's API I will extract the Who, What, Why from your pasted in text
      </h5>
      <textarea
        className="w-full p-5 mb-6 text-lg rounded-xl border-2 border-gray-300 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
        rows="6"
        placeholder="Enter the text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="flex justify-center items-center space-x-4">
        {loading ? (
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <button
            onClick={handleSummarize}
            className="bg-blue-600 text-white px-10 py-3 rounded-xl shadow-2xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Summarize
          </button>
        )}
      </div>
      
      {summary && (
        <motion.div
          className="mt-8 p-8 bg-gray-50 rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-blue-600">Summary</h2>
          <p className="mt-4 text-xl text-gray-700">{summary}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SummarizePage;
