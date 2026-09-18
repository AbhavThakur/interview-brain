#!/usr/bin/env python3
"""
Automated Knowledge Harvester & Sync Engine
Ingests top tech engineering blogs, architectures, and resources.
Updates resources.json and synchronizes content to web/content/.
"""

import os
import json
import urllib.request
import xml.etree.ElementTree as ET
import subprocess
import re

REPO_ROOT = "/Users/A3100515/Proj/interview-brain"
RESOURCES_PATH = os.path.join(REPO_ROOT, "resources.json")
WEB_COPY_SCRIPT = os.path.join(REPO_ROOT, "web/copy-content.js")

ENGINEERING_FEEDS = [
    {
        "platform": "Uber Engineering",
        "category": "blogs",
        "url": "https://www.uber.com/blog/engineering/",
        "feed": "https://www.uber.com/blog/engineering/rss/",
        "tags": ["uber", "distributed-systems", "architecture", "mobile", "microservices"]
    },
    {
        "platform": "Netflix TechBlog",
        "category": "blogs",
        "url": "https://netflixtechblog.com/",
        "feed": "https://netflixtechblog.com/feed",
        "tags": ["netflix", "cdn", "streaming", "concurrency", "distributed-systems", "resilience"]
    },
    {
        "platform": "Cloudflare Blog",
        "category": "blogs",
        "url": "https://blog.cloudflare.com/",
        "feed": "https://blog.cloudflare.com/rss/",
        "tags": ["cloudflare", "networking", "ddos", "rate-limiting", "cdn", "edge"]
    },
    {
        "platform": "Meta Engineering",
        "category": "blogs",
        "url": "https://engineering.fb.com/",
        "feed": "https://engineering.fb.com/feed/",
        "tags": ["meta", "react-native", "graphql", "systems", "ai", "performance"]
    },
    {
        "platform": "Stripe Engineering",
        "category": "blogs",
        "url": "https://stripe.com/blog/engineering",
        "feed": "https://stripe.com/blog/engineering/rss.xml",
        "tags": ["stripe", "payments", "idempotency", "api-design", "distributed-systems"]
    }
]

def load_existing_resources():
    if os.path.exists(RESOURCES_PATH):
        try:
            with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {RESOURCES_PATH}: {e}")
    return []

def save_resources(resources):
    with open(RESOURCES_PATH, "w", encoding="utf-8") as f:
        json.dump(resources, f, indent=2, ensure_ascii=False)
    print(f"Updated {RESOURCES_PATH} with {len(resources)} total resources.")

def fetch_rss_feed(feed_url, timeout=6):
    try:
        req = urllib.request.Request(
            feed_url,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.read()
    except Exception as e:
        print(f"Failed to fetch {feed_url}: {e}")
        return None

def parse_rss_items(xml_data, source_meta):
    items = []
    try:
        root = ET.fromstring(xml_data)
        channel = root.find("channel")
        entries = channel.findall("item") if channel is not None else root.findall("{http://www.w3.org/2005/Atom}entry")
        
        for entry in entries[:5]:
            title_elem = entry.find("title") or entry.find("{http://www.w3.org/2005/Atom}title")
            link_elem = entry.find("link") or entry.find("{http://www.w3.org/2005/Atom}link")
            desc_elem = entry.find("description") or entry.find("{http://www.w3.org/2005/Atom}summary")
            
            title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
            link = ""
            if link_elem is not None:
                link = link_elem.get("href") or (link_elem.text.strip() if link_elem.text else "")
            
            description = ""
            if desc_elem is not None and desc_elem.text:
                description = re.sub(r"<[^>]+>", "", desc_elem.text).strip()[:240] + "..."

            if title and link:
                slug = re.sub(r"[^a-z0-9]+", "-", f"{source_meta['platform']}-{title}".lower()).strip("-")[:64]
                items.append({
                    "id": slug,
                    "title": f"[{source_meta['platform']}] {title}",
                    "category": "blogs",
                    "platform": source_meta["platform"],
                    "url": link,
                    "difficulty": "Senior SDE",
                    "estimatedTime": "10-15m read",
                    "tags": source_meta["tags"],
                    "description": description or f"In-depth architectural breakdown and production engineering insights from {source_meta['platform']}.",
                    "whyItMatters": f"Real-world case study tested at scale by {source_meta['platform']}."
                })
    except Exception as e:
        print(f"XML parse error for {source_meta['platform']}: {e}")
    return items

def harvest():
    print("🚀 Starting Automated Knowledge Harvester...")
    existing = load_existing_resources()
    existing_urls = {r.get("url") for r in existing if "url" in r}
    new_added = 0

    for feed_info in ENGINEERING_FEEDS:
        print(f"📡 Checking {feed_info['platform']}...")
        xml_bytes = fetch_rss_feed(feed_info["feed"])
        if xml_bytes:
            articles = parse_rss_items(xml_bytes, feed_info)
            for art in articles:
                if art["url"] not in existing_urls:
                    existing.append(art)
                    existing_urls.add(art["url"])
                    new_added += 1
                    print(f"  + Added: {art['title']}")

    if new_added > 0:
        save_resources(existing)
    else:
        print("All engineering feeds up-to-date! No new articles found.")

    print("🔄 Running web/copy-content.js...")
    try:
        subprocess.run(["node", WEB_COPY_SCRIPT], check=True, cwd=REPO_ROOT)
        print("✅ Content successfully synced to web runtime!")
    except Exception as e:
        print(f"Error executing copy-content.js: {e}")

    return {
        "status": "success",
        "newResourcesAdded": new_added,
        "totalResources": len(existing)
    }

if __name__ == "__main__":
    result = harvest()
    print(f"Result: {json.dumps(result, indent=2)}")
