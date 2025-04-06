// /scripts/newsletterCron.js
import cron from "node-cron";
import axios from "axios";
import mongoose from "mongoose";
import Subscriber from "../models/Subscriber.js"; // path to your Mongoose model

mongoose.connect(process.env.NEXT_PUBLIC_API_MONGODB_URI); // ensure DB is connected

// 12-hour cron logic
cron.schedule("0 */12 * * *", async () => {
  try {
    const subscribers = await Subscriber.find({ isActive: true });

    const hfRes = await axios.get(process.env.NEXT_PUBLIC_API_PAPERS);
    const githubRes = await axios.get(process.env.GITHUB_URL);

    const hfModels = hfRes.data.slice(0, 5);
    const githubRepos = githubRes.data.slice(0, 5);

    const content = `
      <h2>🧠 Trending Hugging Face Models</h2>
      <ul>
        ${hfModels
          .map((model) => `<li><a href="${model.url}">${model.name}</a></li>`)
          .join("")}
      </ul>

      <h2>📦 Trending GitHub Repositories</h2>
      <ul>
        ${githubRepos
          .map(
            (repo) =>
              `<li><a href="${repo.url}">${repo.name}</a> ⭐ ${repo.stars}</li>`
          )
          .join("")}
      </ul>

      <p style="color:gray;">
        You are receiving this email because you subscribed to Daily AI Updates.<br/>
        <a href="http://localhost:4000/unsubscribe/{{TOKEN}}">Unsubscribe</a>
      </p>
    `;

    for (const sub of subscribers) {
      const personalizedContent = content.replace(
        "{{TOKEN}}",
        sub.unsubscribeToken
      );

      await axios.post("https://nine1mail.onrender.com/api/send-newsletter", {
        content: personalizedContent,
        email: sub.email,
        subject: "🔥 Daily AI Trends & Tools Update",
      });

      console.log(`✅ Email sent to: ${sub.email}`);
    }
  } catch (err) {
    console.error("❌ Error in sending newsletter:", err.message);
  }
});
