"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HuggingFaceStyledUI({
  initialPapers,
  initialTimeFrame,
}) {
  const [timeFrame, setTimeFrame] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTimeFrame") || initialTimeFrame;
    }
    return initialTimeFrame;
  });

  const [papers, setPapers] = useState(initialPapers || []);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      const response = await fetch(`/api/papers?timeFrame=${timeFrame}`);
      const newPapers = await response.json();
      setPapers(newPapers);
      setLoading(false);
    };

    fetchPapers();

    const titleMap = {
      today: "Today",
      three_days: "Last 3 Days",
      week: "This Week",
      month: "This Month",
    };
    document.title = `HuggingFace Papers - Top ${titleMap[timeFrame]}`;
  }, [timeFrame]);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("You've successfully subscribed!");
        setEmail("");
        setShowModal(false);
      } else {
        alert(result.error || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          INNOVATIVE <span className="text-[#F2C94C]">AI/ML</span> EXPLORER.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#e0e0e0] leading-relaxed">
          Passionate about AI research and web technologies. Explore trending
          papers from the HuggingFace community with elegant, user-focused
          design.
        </p>

        {/* Buttons */}
        <div className="flex justify-center flex-wrap gap-6 mb-10">
          <Link href="/trending-github">
            <button className="bg-[#F2C94C] text-black px-6 py-3 rounded-full cursor-pointer font-semibold shadow-lg hover:bg-yellow-400 transition duration-200">
              View on GitHub
            </button>
          </Link>
          <button className="border border-[#F2C94C] text-[#F2C94C] px-6 py-3 rounded-full font-semibold hover:bg-[#F2C94C] hover:text-black transition duration-200">
            Original Papers
          </button>
        </div>

        {/* Timeframe Selector */}
        <TimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />

        <p className="text-[#F2C94C] mt-3 font-medium tracking-wide">
          {loading ? "" : `Showing ${papers.length} unique papers`}
        </p>

        {/* Subscribe Button */}
        <div className="mt-10">
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition"
          >
            📩 Subscribe for Updates
          </button>
        </div>
      </section>

      {/* Paper Cards Section */}
      <section className="mt-20 space-y-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
          </div>
        ) : (
          papers.map((paper, index) => (
            <PaperRow
              key={index}
              title={paper.title}
              image={paper.image || "/placeholder.jpg"}
              link={paper.link}
              upvotes={paper.upvotes}
              comments={paper.comments}
              submittedBy={paper.submittedBy || "Unknown"}
            />
          ))
        )}
      </section>

      {/* Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black rounded-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Subscribe to Email Digest
            </h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubscribe}
                className="bg-yellow-400 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition"
              >
                Subscribe
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeFrameSelector({ timeFrame, setTimeFrame }) {
  return (
    <div className="relative inline-block">
      <select
        value={timeFrame}
        onChange={(e) => {
          setTimeFrame(e.target.value);
          localStorage.setItem("selectedTimeFrame", e.target.value);
        }}
        className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-full px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg font-semibold cursor-pointer"
      >
        <option value="today">Top Today</option>
        <option value="three_days">Top Last 3 Days</option>
        <option value="week">Top This Week</option>
        <option value="month">Top This Month</option>
      </select>
      <svg
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function PaperRow({ title, image, upvotes, link, comments, submittedBy }) {
  const arxivId = link.split("/").pop();
  const arxivPdfLink = `https://arxiv.org/pdf/${arxivId}`;

  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl md:flex">
      <div className="md:flex-shrink-0">
        <img
          className="h-56 w-full object-cover md:w-56"
          src={image}
          alt={title}
        />
      </div>
      <div className="p-8 w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <a
              href={link}
              className="block text-xl leading-tight font-semibold text-white hover:underline mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
            <div className="text-sm text-gray-400">
              Submitted by {submittedBy}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300">
              ⬆ {upvotes}
            </div>
            <div className="flex items-center text-gray-400">💬 {comments}</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F2C94C] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
          >
            View on HuggingFace
          </a>
          <a
            href={arxivPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
          >
            View PDF
          </a>
        </div>
      </div>
    </div>
  );
}
