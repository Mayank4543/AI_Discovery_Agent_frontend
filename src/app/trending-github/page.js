"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function TrendingGitHub() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL);
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch trending repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
  }, []);

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

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // Trending Repo Cards
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {repos.map((repo, index) => (
            <RepoCard
              key={index}
              username={repo.username}
              avatar={repo.avatar}
              description={repo.description}
              language={repo.repo_url}
              stars={repo.stars}
              forks={repo.forks}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function RepoCard({ avatar, username, description, language, stars, forks }) {
  return (
    <div className="bg-[#2D1F46] text-white rounded-2xl p-6 shadow-lg border border-[#3B2B64] hover:shadow-2xl transition-all duration-300">
      {/* Avatar and Username */}
      <div className="flex items-center gap-4 mb-3">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-10 h-10 rounded-full border border-[#F2C94C]"
        />
        <div>
          <h2 className="text-lg font-bold text-[#F2C94C]">{username}</h2>
          <a
            href={language}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 underline"
          >
            Visit Repo
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-3">{description}</p>

      {/* Language, Stars, Forks */}
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span className="text-blue-400">Repo_URL:{language}</span>
        <div className="flex gap-4">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
        </div>
      </div>
    </div>
  );
}
