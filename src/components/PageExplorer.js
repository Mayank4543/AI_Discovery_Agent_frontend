"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const TABS = ["research", "model", "dataset"];

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
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("research");

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  // Fetch research papers
  useEffect(() => {
    if (activeTab !== "research") return;
    const fetchPapers = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PAPERS}?timeFrame=${timeFrame}`
      );
      const data = await response.json();
      setPapers(data);
      setLoading(false);
    };
    fetchPapers();
  }, [timeFrame, activeTab]);

  // Fetch models
  useEffect(() => {
    if (activeTab !== "model") return;
    const fetchModels = async () => {
      setLoading(true);
      const response = await fetch(
        "https://fetch-url.onrender.com/fetch-url?url=https://huggingface.co/api/trending?limit=10&type=model&isapi=1"
      );
      const data = await response.json();
      setModels(data);
      setLoading(false);
    };
    fetchModels();
  }, [activeTab]);

  // Fetch datasets
  useEffect(() => {
    if (activeTab !== "dataset") return;
    const fetchDatasets = async () => {
      setLoading(true);
      const response = await fetch(
        "https://fetch-url.onrender.com/fetch-url?url=https://huggingface.co/api/trending?limit=10&type=dataset&isapi=1"
      );
      const data = await response.json();
      setDatasets(data);
      setLoading(false);
    };
    fetchDatasets();
  }, [activeTab]);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_SUBSCRIBE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("You've successfully subscribed!");
        setEmail("");
        setShowModal(false);
      } else {
        toast.error(result.error || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          INNOVATIVE <span className="text-[#F2C94C]">AI/ML</span> EXPLORER.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#e0e0e0] leading-relaxed">
          Explore trending Research Papers, AI Models, and Datasets from the
          HuggingFace community.
        </p>

        {/* Navigation Buttons */}
        <div className="flex justify-center flex-wrap gap-6 mb-6">
          <Link href="/trending-github">
            <button className="bg-[#F2C94C] text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-400 transition duration-200">
              View on GitHub
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === tab
                  ? "bg-[#F2C94C] text-black"
                  : "border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black transition"
              }`}
            >
              {tab === "research"
                ? "Research Papers"
                : tab === "model"
                ? "Models"
                : "Datasets"}
            </button>
          ))}
        </div>

        {/* Timeframe selector only for papers */}
        {activeTab === "research" && (
          <>
            <TimeFrameSelector
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <p className="text-[#F2C94C] mt-3 font-medium tracking-wide">
              {loading ? "" : `Showing ${papers.length} papers`}
            </p>
          </>
        )}

        {/* Subscribe Button */}
        <div className="mt-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition"
          >
            📩 Subscribe for Updates
          </button>
        </div>
      </section>

      {/* Data Section */}
      <section className="mt-16 space-y-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
          </div>
        ) : activeTab === "research" ? (
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
        ) : activeTab === "model" ? (
          models.map((model, index) => (
            <ModelDatasetCard
              key={index}
              item={model}
              type="model"
              
              username={model.username}
              avatar={dev.avatar}
              description={dev.description}
              language={dev.repo_url}
              stars={dev.stars}
              forks={dev.forks}
            />
          ))
        ) : (
          datasets.map((dataset, index) => (
            <ModelDatasetCard key={index} item={dataset} type="dataset" />
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

// Select timeframe
function TimeFrameSelector({ timeFrame, setTimeFrame }) {
  return (
    <div className="relative inline-block mt-4">
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
    </div>
  );
}

// Research Paper Row
function PaperRow({ title, image, upvotes, link, comments, submittedBy }) {
  const arxivId = link.split("/").pop();
  const arxivPdfLink = `https://arxiv.org/pdf/${arxivId}`;

  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 md:flex">
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
              className="block text-xl font-semibold text-white hover:underline mb-2"
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
            <span className="bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300">
              ⬆ {upvotes}
            </span>
            <span className="text-gray-400">💬 {comments}</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <a
            href={link}
            target="_blank"
            className="bg-[#F2C94C] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition duration-300"
          >
            View on HuggingFace
          </a>
          <a
            href={arxivPdfLink}
            target="_blank"
            className="border border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black font-bold py-2 px-4 rounded transition duration-300"
          >
            View PDF
          </a>
        </div>
      </div>
    </div>
  );
}

// Model / Dataset Card
function ModelDatasetCard({ item, type }) {
  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
      <h3 className="text-xl font-bold text-[#F2C94C] mb-2">{item.id}</h3>
      <p className="text-gray-300 mb-2 text-sm">
        {item.description || "No description provided."}
      </p>
      <div className="text-sm text-gray-400">
        🧠 Likes: {item.likes || 0} | 👤 Author: {item.author || "N/A"}
      </div>
      <a
        href={`https://huggingface.co/${type}s/${item.id}`}
        target="_blank"
        className="inline-block mt-4 bg-[#F2C94C] hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded transition"
      >
        View on HuggingFace
      </a>
    </div>
  );
}
