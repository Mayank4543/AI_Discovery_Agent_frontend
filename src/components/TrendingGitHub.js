// pages/TrendingGitHub.tsx

import Link from "next/link";

export default function TrendingGitHub() {
  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to bottom, #201B2C, #2D1F46)" }}
    >
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-white leading-tight">
          Trending on <span className="text-[#F2C94C]">GitHub</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-gray-300">
          Discover the hottest repositories and projects rising in popularity
          across the GitHub developer community.
        </p>

        <Link href="https://github.com/trending" target="_blank">
          <button className="bg-[#F2C94C] text-[#1B3B4A] px-6 py-2 rounded-full font-semibold hover:scale-105 transition duration-200 shadow">
            Explore on GitHub ↗
          </button>
        </Link>
      </section>

      {/* Trending Repo Cards */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <RepoCard
          title="openai/whisper"
          description="Robust speech recognition model by OpenAI"
          language="Python"
          stars="37k"
          forks="5.4k"
        />
        <RepoCard
          title="vercel/next.js"
          description="The React framework for production"
          language="JavaScript"
          stars="113k"
          forks="24.8k"
        />
        {/* Add more cards here */}
      </section>
    </div>
  );
}

function RepoCard({ title, description, language, stars, forks }) {
  return (
    <div className="bg-[#2D1F46] text-white rounded-2xl p-6 shadow-lg border border-[#3B2B64] hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-bold text-[#F2C94C] mb-2">{title}</h2>
      <p className="text-gray-300 text-sm mb-3">{description}</p>
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span>Language: {language}</span>
        <div className="flex gap-4">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
        </div>
      </div>
    </div>
  );
}
