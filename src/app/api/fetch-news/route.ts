import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from 'next/server'
import type { Article } from "@/lib/types";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  });
}

const db = getFirestore();

// Helper function to fetch news from NewsAPI
async function fetchNews() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("News API key is not configured.");
  }
  const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`News API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data.articles;
}

// API route handler
export async function GET() {
  try {
    const articles = await fetchNews();
    const batch = db.batch();

    for (const articleData of articles) {
      if (!articleData.title || !articleData.description || !articleData.urlToImage || !articleData.publishedAt || !articleData.source.name) {
        continue;
      }
      
      const article: Omit<Article, 'id'> = {
        title: articleData.title,
        description: articleData.description,
        source: articleData.source.name,
        // Assign a default category, as NewsAPI free tier doesn't provide it
        category: 'General', 
        imageUrl: articleData.urlToImage,
        imageHint: "news article",
        publishedAt: articleData.publishedAt,
        createdAt: Timestamp.now().toDate().toISOString(),
      };
      
      const docRef = db.collection("articles").doc(Buffer.from(articleData.title).toString('base64'));
      batch.set(docRef, article, { merge: true });
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Successfully fetched and stored ${articles.length} articles.` });
  } catch (error: any) {
    console.error("Error fetching or storing news:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
