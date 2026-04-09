#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const today = new Date().toISOString().split("T")[0];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function generateEquityResearchTemplate(ticker) {
  const title = `${ticker} - Equity Research Report`;
  const slug = `${today}-${slugify(ticker)}`;
  const excerpt = `Comprehensive equity research report and investment analysis for ${ticker}.`;

  const content = `---
title: "${title}"
publishedAt: "${today}"
author: "Meridian Research"
category: "equity-research"
tags: ["${ticker}", "equity-research", "stocks", "valuation"]
excerpt: "${excerpt}"
---

# ${title}

**Ticker:** ${ticker}
**Report Date:** ${today}
**Analyst:** Meridian Research Team

## Executive Summary

[Provide a compelling 2-3 sentence overview of your investment thesis for ${ticker}. Include key valuation metrics and recommendation if available.]

---

## Investment Thesis

[Outline the core investment case. What are the key drivers that support or challenge this stock?]

### Bull Case

- **Growth Catalyst 1:** [Describe the first positive factor]
- **Growth Catalyst 2:** [Describe the second positive factor]
- **Valuation Opportunity:** [Explain why valuation is attractive]

### Bear Case

- **Risk Factor 1:** [Describe the first risk]
- **Risk Factor 2:** [Describe the second risk]
- **Macro Headwinds:** [Discuss external pressures]

---

## Industry Overview

### Market Structure

[Describe the industry dynamics, competitive landscape, and market size.]

### Key Trends

- **Trend 1:** [Explain emerging industry trend]
- **Trend 2:** [Explain another relevant trend]
- **${ticker}'s Position:** [How does this company fit in the industry?]

---

## Financial Analysis

### Historical Performance

| Metric | 2024 | 2023 | 2022 |
|--------|------|------|------|
| Revenue | --- | --- | --- |
| EBITDA Margin | --- | --- | --- |
| Free Cash Flow | --- | --- | --- |
| EPS | --- | --- | --- |

### Key Metrics

- **Revenue Growth:** [YoY growth rate and trend]
- **Profitability:** [Gross margin, operating margin trends]
- **Cash Generation:** [Free cash flow and capital allocation]
- **Balance Sheet:** [Debt levels, liquidity position]

---

## Valuation Analysis

### Relative Valuation

- **P/E Multiple:** [Compare to sector and peers]
- **EV/EBITDA:** [Industry comparison]
- **Price-to-Book:** [Assess accounting value]
- **PEG Ratio:** [Growth-adjusted valuation]

### DCF Valuation

**Base Case Assumptions:**
- Revenue CAGR (5-year): [%]
- Terminal EBITDA Margin: [%]
- WACC: [%]
- Terminal Growth Rate: [%]

**Valuation Range:** \$[low] - \$[high]

---

## Risks to Thesis

1. **Execution Risk:** [Management execution or strategic challenges]
2. **Market Risk:** [Macroeconomic or sector-wide risks]
3. **Regulatory Risk:** [Any regulatory headwinds]
4. **Competitive Risk:** [Competitive pressures or disruption]
5. **Valuation Risk:** [Potential for multiple compression]

---

## Conclusion

[Summarize your investment perspective. Reiterate the key reasons to own or avoid this stock. Include any price targets or timing considerations if relevant.]

### Investment Recommendation

**Rating:** [Buy / Hold / Sell]
**Price Target:** \$[target]
**Upside/Downside:** [%]

---

*This research is for informational purposes only. Please conduct your own due diligence and consult with a financial advisor.*
`;

  return { slug, content };
}

function generateWeeklyRecapTemplate() {
  const slug = `${today}-weekly-market-recap`;
  const excerpt = "Weekly market recap and analysis of major market developments.";

  const content = `---
title: "Weekly Market Recap - ${today}"
publishedAt: "${today}"
author: "Meridian Research"
category: "market-intelligence"
tags: ["market-recap", "weekly", "macro", "equities"]
excerpt: "${excerpt}"
---

# Weekly Market Recap

**Week of:** [Date range]
**Report Date:** ${today}

## Executive Summary

[Provide a 3-5 sentence overview of the week's most significant market movements and developments.]

---

## Market Overview

### Equities

| Index | Close | Weekly Change | YTD Change |
|-------|-------|----------------|-----------|
| S&P 500 | --- | --- | --- |
| Nasdaq-100 | --- | --- | --- |
| Russell 2000 | --- | --- | --- |
| Dow Jones | --- | --- | --- |

### Fixed Income & Currencies

- **10Y Treasury Yield:** [Current level and change]
- **Credit Spreads:** [IG and HY spreads]
- **USD Index:** [Level and direction]

---

## Weekly Themes

### Theme 1: [Primary Market Driver]

[Detailed analysis of the week's dominant theme. Include specific events, data releases, or corporate actions that drove markets.]

### Theme 2: [Secondary Market Driver]

[Analysis of another significant development or trend.]

### Theme 3: [Tertiary Development]

[Discussion of additional market influences.]

---

## Sector Performance

| Sector | Weekly % | Outperformance | Key Driver |
|--------|----------|-----------------|-----------|
| Technology | --- | --- | --- |
| Finance | --- | --- | --- |
| Industrials | --- | --- | --- |
| Healthcare | --- | --- | --- |
| Energy | --- | --- | --- |
| Consumer | --- | --- | --- |

**Best Performer:** [Sector and explanation]
**Worst Performer:** [Sector and explanation]

---

## Earnings Highlights

### Major Earnings This Week

- **Company 1:** [Key metrics and guidance]
- **Company 2:** [Key metrics and guidance]
- **Company 3:** [Key metrics and guidance]

---

## Economic Data

### Key Data Points

| Release | Actual | Consensus | Previous |
|---------|--------|-----------|----------|
| [Indicator 1] | --- | --- | --- |
| [Indicator 2] | --- | --- | --- |
| [Indicator 3] | --- | --- | --- |

---

## Macro Commentary

### Monetary Policy

[Discussion of central bank decisions, rate expectations, and policy implications.]

### Fiscal Policy

[Comments on government spending, tax policy, or other fiscal developments.]

### Geopolitics

[Overview of any geopolitical developments affecting markets.]

---

## Outlook for Next Week

### Key Events

- **[Day]: [Economic data or event]**
- **[Day]: [Earnings or announcement]**
- **[Day]: [Market catalyst]**

### Positioning Thoughts

[Discuss how recent moves have affected valuations and what to watch for.]

---

*Commentary reflects market conditions as of ${today}. Past performance does not guarantee future results.*
`;

  return { slug, content };
}

function generateMacroSummaryTemplate() {
  const slug = `${today}-macro-summary`;
  const excerpt = "Comprehensive macroeconomic analysis and outlook.";

  const content = `---
title: "Macro Summary - ${today}"
publishedAt: "${today}"
author: "Meridian Research"
category: "market-intelligence"
tags: ["macro", "economics", "analysis"]
excerpt: "${excerpt}"
---

# Macroeconomic Summary & Outlook

**Report Date:** ${today}

## Executive Overview

[Provide a comprehensive summary of the current macroeconomic environment and outlook for the next 3-12 months.]

---

## Global Economic Landscape

### United States

#### Growth & Activity

- **GDP Growth:** [Current estimate and trend]
- **Labor Market:** [Unemployment, jobless claims, wage growth]
- **Inflation:** [CPI, PCE, and trend]
- **Consumption:** [Retail sales, consumer sentiment]

#### Policy Environment

- **Federal Reserve:** [Current rate, forward guidance, and expectations]
- **Fiscal Position:** [Budget deficit, government spending]
- **Trade Policy:** [Tariffs, trade negotiations]

### Europe

[Brief overview of European economic conditions, ECB policy, and key risks.]

### Asia-Pacific

[Brief overview of Asian economic conditions, monetary policy, and growth outlook.]

---

## Key Macro Themes

### Theme 1: [Primary Macro Driver]

[Deep dive analysis of the most important macroeconomic driver for the medium term.]

**Implications for Markets:**
- Equities: [Impact on stock valuations]
- Fixed Income: [Impact on bond markets]
- Currencies: [FX implications]

### Theme 2: [Secondary Theme]

[Analysis of another significant macroeconomic trend.]

### Theme 3: [Emerging Risk]

[Discussion of potential macro risks or headwinds.]

---

## Inflation Dynamics

### Current State

- **Headline Inflation:** [Current level and trend]
- **Core Inflation:** [Core measure and direction]
- **Wage Growth:** [Employment cost index, wage trends]

### Inflation Drivers

1. **Demand-side factors:** [Discussion]
2. **Supply-side factors:** [Discussion]
3. **External factors:** [Energy, commodities, FX]

### Deflation Risks

[Any risks of deflation or disinflation to monitor.]

---

## Central Bank Policy Outlook

### Federal Reserve

- **Current Rate:** [Fed Funds rate]
- **Forward Guidance:** [Powell's messaging]
- **Market Expectations:** [Implied rates from swaps]
- **Next Move:** [Probability of hike/cut/hold]

### ECB & Other Major Central Banks

[Brief overview of policy stance and expectations.]

---

## Valuation Framework

### Equity Valuations

- **Forward P/E:** [Current multiple vs. history]
- **Dividend Yield:** [Current vs. historical]
- **Earnings Growth Expectations:** [Consensus revisions]

### Bond Valuations

- **10Y Real Yield:** [Level and implications]
- **Credit Spreads:** [IG and HY levels]
- **Duration:** [Market positioning]

---

## Risk Factors

### Downside Risks

1. **[Risk 1]:** [Description and probability]
2. **[Risk 2]:** [Description and probability]
3. **[Risk 3]:** [Description and probability]

### Upside Surprises

1. **[Opportunity 1]:** [Description]
2. **[Opportunity 2]:** [Description]

---

## Sector Implications

[Discuss how the macro environment affects different sectors and asset classes.]

---

## 12-Month Outlook

### Base Case

[Most likely scenario for economic growth, inflation, and policy over the next 12 months.]

### Bull Case

[More optimistic scenario.]

### Bear Case

[More pessimistic scenario.]

---

*This macro analysis is for informational purposes. Consult with your investment advisor for personalized guidance.*
`;

  return { slug, content };
}

function generateStocksToWatchTemplate() {
  const slug = `${today}-stocks-to-watch`;
  const excerpt = "Curated list of stocks and opportunities to monitor.";

  const content = `---
title: "Stocks to Watch - ${today}"
publishedAt: "${today}"
author: "Meridian Research"
category: "market-intelligence"
tags: ["watchlist", "stocks", "opportunities", "earnings"]
excerpt: "${excerpt}"
---

# Stocks to Watch

**Date:** ${today}

## Overview

[Brief introduction to this week's watchlist and key themes.]

---

## High Conviction Opportunities

### Stock 1: [Ticker - Company Name]

**Price:** \$[Price]
**52-Week Range:** \$[Low] - \$[High]
**Market Cap:** \$[Market Cap]

**Why We're Watching:**
- [Key reason 1]
- [Key reason 2]
- [Key reason 3]

**Catalysts:**
- **Near-term:** [Catalyst 1 - timing]
- **Medium-term:** [Catalyst 2 - timing]

**Key Metrics:**
| Metric | Value |
|--------|-------|
| P/E Ratio | --- |
| EV/EBITDA | --- |
| Free Cash Flow Yield | --- |

**Risk/Reward:** [Analysis of risk/reward profile]

---

### Stock 2: [Ticker - Company Name]

[Follow same format as Stock 1]

---

### Stock 3: [Ticker - Company Name]

[Follow same format as Stock 1]

---

## Earnings Calendar - Next 2 Weeks

### This Week

| Company | Ticker | Earnings Date | Expectations |
|---------|--------|---------------|--------------|
| [Company] | [Ticker] | [Date] | [What to watch] |

### Next Week

| Company | Ticker | Earnings Date | Expectations |
|---------|--------|---------------|--------------|
| [Company] | [Ticker] | [Date] | [What to watch] |

---

## Sector Rotation Watch

### Heating Up

[Sectors showing relative strength and why to pay attention.]

### Cooling Off

[Sectors showing weakness and potential opportunities in weakness.]

---

## Macro-Sensitive Plays

### Interest Rate Sensitive

[Stocks to watch if rates move up/down.]

### Inflation Play

[Stocks benefiting from or hurt by inflation.]

### Dollar Strength/Weakness

[Companies affected by USD movements.]

---

## Momentum & Technical Watch

### Breaking Out

[Stocks breaking out of technical patterns with fundamental backing.]

### Support Levels to Watch

[Key technical support/resistance levels for important names.]

---

## Contrarian Opportunities

[Stocks that are heavily sold but may have attractive risk/reward.]

---

## M&A & Corporate Actions

### Potential Targets

[Companies that could be acquisition targets based on valuation/strategy.]

### Announced Deals

[Recent M&A announcements and impact on stock prices.]

---

## Biotech & Small Cap Spotlight

### BioTech Watch

[Interesting biotech names with upcoming clinical data.]

### Small Cap Opportunities

[Sub-$5B market cap names with potential catalysts.]

---

## Newsletter Disclaimer

*This watchlist is for informational purposes and does not constitute investment advice. Past performance does not guarantee future results. Please conduct your own due diligence and consult with a financial advisor.*
`;

  return { slug, content };
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateResearch(command, param) {
  let template;
  let outputDir;

  switch (command) {
    case "equity-research":
      if (!param) {
        console.error("Error: equity-research requires a ticker symbol");
        console.error("Usage: node scripts/generate-research.mjs equity-research AAPL");
        process.exit(1);
      }
      template = generateEquityResearchTemplate(param.toUpperCase());
      outputDir = path.join(rootDir, "posts/equity-research");
      break;

    case "weekly-recap":
      template = generateWeeklyRecapTemplate();
      outputDir = path.join(rootDir, "posts/market-intelligence");
      break;

    case "macro-summary":
      template = generateMacroSummaryTemplate();
      outputDir = path.join(rootDir, "posts/market-intelligence");
      break;

    case "stocks-to-watch":
      template = generateStocksToWatchTemplate();
      outputDir = path.join(rootDir, "posts/market-intelligence");
      break;

    default:
      console.error("Unknown command:", command);
      console.error("\nAvailable commands:");
      console.error("  - weekly-recap");
      console.error("  - equity-research [TICKER]");
      console.error("  - macro-summary");
      console.error("  - stocks-to-watch");
      process.exit(1);
  }

  ensureDirectoryExists(outputDir);

  const fileName = `${template.slug}.mdx`;
  const filePath = path.join(outputDir, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, template.content);

  console.log(`Research draft created successfully!`);
  console.log(`File: ${filePath}`);
  console.log(`Slug: ${template.slug}`);
  console.log("\nNext steps:");
  console.log("1. Open the file and fill in the bracketed sections");
  console.log("2. Add actual data, analysis, and insights");
  console.log("3. Remove placeholder sections you don't need");
  console.log("4. Test the post on your local site");
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Error: No command provided");
  console.error("\nUsage:");
  console.error("  node scripts/generate-research.mjs weekly-recap");
  console.error("  node scripts/generate-research.mjs equity-research AAPL");
  console.error("  node scripts/generate-research.mjs macro-summary");
  console.error("  node scripts/generate-research.mjs stocks-to-watch");
  process.exit(1);
}

generateResearch(args[0], args[1]);
