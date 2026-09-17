# 🌊 RippleLab Dashboard (Manipal Hackathon Submission)
> **🚀 Live Demo:** (  https://dependency-sonar.lovable.app/ )
## 📌 About The Project
RippleLab is a project built for the Manipal Hackathon. *("It is based on Dependency Risk Intelligence & Simulation").*
### 💡 Our Solution
*(Modern applications sit atop deeply nested open-source packages. A single vulnerability in a low-level dependency can propagate silently through the entire chain, yet traditional scanners only surface isolated risks, not ecosystem-wide ripple effects. )*
---
## 🛠️ Built With
* [Lovable](https://lovable.dev/) - AI web builder
* React
* Vite
* Tailwind CSS

---
## 👨‍💻 Team
* **Mohammed Rayhan** - [GitHub Profile](https://github.com/Rayhan-xar)
* *Team Members 
* (Mukund S Belawadi)
* (Maahi Sachin Nale)
* (Aisiri Rajesh)
* (Poorvashree S)

# RippleLab Dashboard

┌──────────────────────────────────────────────────────┐

│  HEADER: RippleLab logo │ Dashboard │ Simulate │     │

│          Explain │ About                             │

├──────────────────────────────────────────────────────┤

│                                                      │

│  1. DASHBOARD (Landing)                              │

│     ├── Ecosystem overview stats                     │

│     ├── Top 5 critical packages (by Ripple Score)    │

│     ├── Full interactive dependency graph            │

│     └── Package search/filter                        │

│                                                      │

│  2. SIMULATION VIEW                                  │

│     ├── Select compromised package                   │

│     ├── Animated ripple propagation                  │

│     ├── Blast radius summary panel                   │

│     └── Affected path traces                         │

│                                                      │

│  3. COMPARE VIEW                                     │

│     ├── Side-by-side: Patch vs Isolate vs Replace    │

│     ├── Metric deltas (before/after)                 │

│     └── Recommendation with reasoning               │

│                                                      │

│  4. EXPLAIN VIEW                                     │

│     ├── AI narrative of current analysis             │

│     ├── Risk timeline                                │

│     └── Exportable report                            │

│                                                      │

│  5. ABOUT / TEAM                                     │

│     ├── Problem statement                            │

│     ├── How it works (4-step flow)                   │

│     └── Team ECLIPSE members                         │

│                                                      │

└──────────────────────────────────────────────────────┘  Build a complete, production-quality single-page web application called "RippleLab" — an intelligent open-source supply chain risk analysis and simulation platform. This is a hackathon prototype for a cybersecurity competition. The design should be visually stunning, dark-themed, and feel like a premium security dashboard.

## TECH STACK

- React 18+ with Vite

- TypeScript

- Tailwind CSS for styling

- Framer Motion for animations

- react-force-graph-2d (from "react-force-graph" package) for the interactive dependency graph visualization

- Lucide React for icons

- No backend needed — all data is hardcoded/mock, all analysis is computed client-side

## DESIGN SYSTEM

- **Theme**: Dark mode with deep navy/slate background (#0f172a as base, #1e293b for cards)

- **Accent colors**: 

  - Teal/cyan (#06b6d4) for safe/normal state

  - Amber/orange (#f59e0b) for warning/medium risk

  - Red (#ef4444) for critical/compromised

  - Emerald (#10b981) for mitigated/resolved

  - Purple (#8b5cf6) for highlighted/selected

- **Typography**: Inter or system font stack, clean and modern

- **Card style**: Subtle glass-morphism effect with bg-opacity and backdrop-blur

- **Graph**: Particles flowing along edges, force-directed layout, smooth zoom/pan

- **Animations**: Smooth page transitions, ripple wave animation on simulation, pulsing nodes

## DEPENDENCY GRAPH DATA (Hardcoded)

Create a realistic npm-like dependency ecosystem with these exact nodes and edges. Each node has: id, name, version, type (one of: "application", "library", "foundational"), riskLevel (0-1 float).

### Applications (top-level, type="application"):

1. { id: "app-auth", name: "auth-service", version: "2.1.0", type: "application" }

2. { id: "app-payment", name: "payment-gateway", version: "3.0.1", type: "application" }

3. { id: "app-dashboard", name: "user-dashboard", version: "1.8.0", type: "application" }

4. { id: "app-api", name: "api-gateway", version: "4.2.0", type: "application" }

5. { id: "app-notify", name: "notification-service", version: "1.3.0", type: "application" }

6. { id: "app-analytics", name: "analytics-engine", version: "2.0.0", type: "application" }

### Libraries (mid-level, type="library"):

7. { id: "lib-express", name: "express", version: "4.18.2", type: "library" }

8. { id: "lib-axios", name: "axios", version: "1.6.0", type: "library" }

9. { id: "lib-jsonwebtoken", name: "jsonwebtoken", version: "9.0.0", type: "library" }

10. { id: "lib-mongoose", name: "mongoose", version: "7.5.0", type: "library" }

11. { id: "lib-bcrypt", name: "bcrypt", version: "5.1.0", type: "library" }

12. { id: "lib-cors", name: "cors", version: "2.8.5", type: "library" }

13. { id: "lib-helmet", name: "helmet", version: "7.0.0", type: "library" }

14. { id: "lib-winston", name: "winston", version: "3.10.0", type: "library" }

15. { id: "lib-joi", name: "joi", version: "17.9.0", type: "library" }

16. { id: "lib-redis", name: "ioredis", version: "5.3.0", type: "library" }

17. { id: "lib-socket", name: "socket.io", version: "4.7.0", type: "library" }

18. { id: "lib-bull", name: "bull", version: "4.11.0", type: "library" }

19. { id: "lib-nodemailer", name: "nodemailer", version: "6.9.0", type: "library" }

20. { id: "lib-stripe", name: "stripe", version: "13.0.0", type: "library" }

### Foundational packages (deep, type="foundational"):

21. { id: "found-lodash", name: "lodash", version: "4.17.21", type: "foundational" }

22. { id: "found-debug", name: "debug", version: "4.3.4", type: "foundational" }

23. { id: "found-ms", name: "ms", version: "2.1.3", type: "foundational" }

24. { id: "found-semver", name: "semver", version: "7.5.4", type: "foundational" }

25. { id: "found-colors", name: "colors", version: "1.4.0", type: "foundational" }

26. { id: "found-minimist", name: "minimist", version: "1.2.8", type: "foundational" }

27. { id: "found-qs", name: "qs", version: "6.11.0", type: "foundational" }

28. { id: "found-safer-buffer", name: "safer-buffer", version: "2.1.2", type: "foundational" }

29. { id: "found-inherits", name: "inherits", version: "2.0.4", type: "foundational" }

30. { id: "found-depd", name: "depd", version: "2.0.0", type: "foundational" }

### Edges (directed: source DEPENDS ON target):

Create a dense, realistic dependency web. Here are the edges:

- app-auth → lib-express, lib-jsonwebtoken, lib-bcrypt, lib-mongoose, lib-helmet, lib-cors, lib-winston

- app-payment → lib-express, lib-stripe, lib-mongoose, lib-helmet, lib-joi, lib-winston

- app-dashboard → lib-express, lib-axios, lib-redis, lib-socket, lib-cors, lib-winston

- app-api → lib-express, lib-helmet, lib-cors, lib-joi, lib-winston, lib-axios

- app-notify → lib-express, lib-bull, lib-nodemailer, lib-redis, lib-winston

- app-analytics → lib-express, lib-mongoose, lib-redis, lib-axios, lib-winston

- lib-express → found-debug, found-qs, found-depd, found-safer-buffer

- lib-axios → found-lodash, found-debug

- lib-jsonwebtoken → found-lodash, found-ms, found-semver

- lib-mongoose → found-lodash, found-debug, found-ms, found-semver

- lib-bcrypt → found-inherits

- lib-helmet → found-depd

- lib-winston → found-colors, found-debug, found-inherits

- lib-joi → found-lodash, found-semver

- lib-redis → found-lodash, found-debug, found-ms

- lib-socket → found-debug, found-ms

- lib-bull → found-lodash, found-debug, found-semver, found-ms

- lib-nodemailer → found-lodash

- lib-stripe → found-lodash, found-qs

- lib-cors → found-lodash

Note: These edges mean "A depends on B" (A → B), so if B is compromised, A is affected. 

In the graph visualization, draw arrows from dependency TO dependent (B → A direction) to show "compromise flows upstream to dependents". But internally, the propagation algorithm should do a reverse BFS: starting from the compromised node, find all nodes that transitively depend on it.

## PAGE STRUCTURE

### 1. SIDEBAR NAVIGATION (fixed left, collapsible)

- RippleLab logo at top (use a simple ripple/wave SVG icon + "RippleLab" text)

- Nav items with icons: Dashboard, Simulate, Compare, Explain, About

- Active state with accent highlight

- Collapsed state shows only icons

- Bottom: "Team ECLIPSE" small text with MIT Manipal badge

### 2. DASHBOARD PAGE (default landing)

Top stats bar with 4 metric cards (glass-morphism style):

  - Total Packages: 30

  - Applications: 6

  - Dependency Edges: (count from edges above)

  - Critical Packages: (packages with RippleScore > 0.7)

Below the stats: the full interactive force-directed dependency graph using react-force-graph-2d:

  - Nodes colored by type: applications=purple circles, libraries=cyan circles, foundational=amber circles

  - Node size proportional to Ripple Score (computed client-side)

  - Edges shown as curved arrows with low opacity

  - Hovering a node highlights it and all its edges, shows tooltip with name, version, type, Ripple Score

  - Clicking a node opens a detail sidebar panel showing: name, version, type, Ripple Score (with gauge visualization), degree centrality, betweenness centrality, direct dependents list, direct dependencies list

  - "Simulate Compromise" button in the detail panel (navigates to Simulation page with this node pre-selected)

  - Graph should have zoom, pan, and a "reset view" button

  - Add a legend showing node type colors

  - Search bar above graph to filter/highlight packages by name

Right sidebar panel (when a node is selected):

  - Package name and version

  - Type badge (Application / Library / Foundational)

  - Ripple Score: shown as a circular gauge (0-100 scale)

  - Metrics: Degree Centrality, Betweenness Centrality, Downstream Reach

  - List of Direct Dependents

  - List of Direct Dependencies

  - "Simulate Compromise" CTA button

### 3. SIMULATE PAGE

Left panel (controls):

  - Dropdown or searchable select to pick a package to compromise

  - "Compromised package" info card showing selected package details

  - "Run Simulation" button with a ripple animation effect

  - Simulation speed slider (slow/normal/fast)

  - "Reset" button

Center: The dependency graph again, but now in "simulation mode":

  - When simulation runs, implement an ANIMATED ripple propagation:

    1. The selected compromised node turns RED and pulses

    2. After 500ms, its direct dependents turn ORANGE with an expanding ring animation

    3. After another 500ms, the next level of dependents turns ORANGE

    4. Continue level-by-level until all affected nodes are colored

    5. Final state: compromised = red, affected = orange gradient (darker for closer, lighter for farther), unaffected = original color but dimmed

    6. Affected edges glow red, unaffected edges dim significantly

  - The animation should feel like a shockwave/ripple spreading through the graph

Right panel (Blast Radius Results — appears after simulation completes):

  - **Blast Radius Summary Card**:

    - Total packages affected: N

    - Applications exposed: N/6 (with list)

    - Max propagation depth: N levels

    - Ecosystem exposure: N% of all packages

  - **Critical Paths**: List the shortest paths from the compromised package to each affected application. Show as: `colors → winston → auth-service` with depth indicators

  - **Affected Packages Table**: sortable table with columns: Package Name, Type, Depth from Compromise, Ripple Score

  - **Risk Severity Breakdown**: Mini donut chart showing affected by type (applications vs libraries)

### 4. COMPARE PAGE (Mitigation Scenarios)

This page shows three side-by-side comparison cards for a selected compromised package. Use the same package that was last simulated, or allow re-selection.

Three strategy cards (in a horizontal 3-column layout on desktop):

**Card 1: PATCH**

- Title: "Patch the Vulnerability"

- Description: "Apply a security fix to the compromised package. It remains in the graph but its vulnerability is neutralized."

- Visual: Mini graph showing the node turns GREEN, all edges remain intact

- Metrics: Disruption=Low, Blast Radius After=0 (if perfect patch), Orphaned Packages=0, Effort=Low

- Risk: "Assumes a patch is available and fully effective"

**Card 2: ISOLATE**

- Title: "Isolate the Package"  

- Description: "Sever all connections to the compromised package. Dependent packages must find alternatives or lose functionality."

- Visual: Mini graph showing the node greyed out, edges cut (dashed red lines), orphaned packages highlighted yellow

- Metrics: Disruption=High, Blast Radius After=0, Orphaned Packages=N (compute this), Effort=High

- Risk: "May break N dependent packages that have no alternative"

**Card 3: REPLACE**

- Title: "Replace with Alternative"

- Description: "Swap the compromised package with a safe alternative. Dependencies are redirected."

- Visual: Mini graph showing the old node removed, new GREEN node in its place with redirected edges

- Metrics: Disruption=Medium, Blast Radius After=0, Orphaned Packages=0, Effort=Medium

- Risk: "Requires API-compatible alternative to exist"

Below the three cards:

- **AI Recommendation box**: A highlighted card with a lightbulb icon that says something like: "Recommended: REPLACE. For [package name], replacing with [alternative] achieves full risk elimination with moderate effort. Patching is viable only if the maintainer releases a fix within your risk window. Isolation would orphan N packages and is not recommended unless containment is urgent."

- **Comparison table**: Side-by-side metrics for all three strategies

### 5. EXPLAIN PAGE

This page provides the AI-powered narrative explanation of the analysis.

Top section: "Analysis Report" heading with a generated timestamp

Content sections (each in a card):

**Executive Summary Card**:

A 3-4 sentence paragraph that reads like: "This dependency ecosystem contains 30 packages serving 6 applications through 89 dependency relationships. Analysis identified 3 critical chokepoints with Ripple Scores above 0.7. The most critical package is lodash (Ripple Score: 0.92), which sits on the dependency path of 5 out of 6 applications. A single compromise of lodash could expose 83% of the ecosystem."

**Critical Dependencies Ranking** (table):

Ranked list of top 5 packages by Ripple Score with: Rank, Package, Ripple Score (bar), Type, Downstream Apps Affected, Recommended Action

**Risk Heat Map**: 

A simplified matrix showing packages (rows) vs applications (columns), colored by whether the package is on the dependency path of each application. Use: green = not on path, yellow = indirect dependency (depth > 2), red = direct/close dependency (depth ≤ 2).

**Propagation Analysis Narrative**:

For the top 3 critical packages, show a paragraph each explaining WHY they're critical:

"lodash (v4.17.21) — Ripple Score: 0.92

lodash is the most structurally important package in this ecosystem. It serves as a direct dependency for 8 intermediate libraries (axios, jsonwebtoken, mongoose, joi, ioredis, bull, nodemailer, stripe, cors), giving it the highest degree centrality. Through these intermediaries, it reaches all 6 end-user applications. Its betweenness centrality of 0.84 means it sits on 84% of all shortest paths between foundational and application layers. A compromise of lodash would be the highest-impact single-point-of-failure in this ecosystem."

**Mitigation Priorities**:

Numbered list: "1. Establish vendor monitoring for lodash, debug, and ms. 2. Evaluate alternative packages for any with Ripple Score > 0.7. 3. Implement dependency pinning for all foundational packages. 4. Add runtime integrity checks for packages on critical paths."

### 6. ABOUT PAGE

- Problem statement section (rewritten clearly)

- "How RippleLab Works" — the 4-step process with icons: Dependency Extraction → Graph Construction → Propagation Simulation → Interactive Analysis

- Ripple Score formula explanation with visual breakdown

- Tech stack badges (React, TypeScript, Cytoscape.js, NetworkX, FastAPI, LLM)

- Team ECLIPSE section with 5 member names in a grid: Mohammed Rayhan, Mukund S Belawadi, Poorvashree S, Aisiri Rajesh, Maahi Sachin Nale

- "Built for Manipal Hackathon 2026 · Cybersecurity Track"

## GRAPH ANALYSIS ALGORITHMS (implement client-side in TypeScript)

### Ripple Score Calculation

```typescript

function computeRippleScore(nodeId, graph): number {

  const degreeCentrality = computeDegreeCentrality(nodeId, graph);

  const betweennessCentrality = computeBetweennessCentrality(nodeId, graph);

  const downstreamReach = computeDownstreamReach(nodeId, graph); // fraction of applications reachable

  

  const alpha = 0.3, beta = 0.4, gamma = 0.3;

  return alpha * degreeCentrality + beta * betweennessCentrality + gamma * downstreamReach;

}   Degree Centrality

Number of nodes that directly depend on this node, normalized by (total nodes - 1).

Betweenness Centrality

Fraction of all shortest paths between all pairs of nodes that pass through this node. Use Brandes' algorithm or a simplified BFS-based approach.

Downstream Reach

Do a reverse BFS from the node: find all nodes that transitively depend on it. Count how many of those are "application" type, divide by total applications.

Blast Radius Computation

From a compromised node, do a reverse BFS through the dependency edges. Every node reachable is "affected." Return: list of affected nodes, max depth, affected applications, affected edges.

Propagation Simulation

Level-by-level BFS with timing delays for the animation. Return levels: [{nodes at depth 0}, {nodes at depth 1}, ...].

IMPORTANT IMPLEMENTATION NOTES

Graph direction: In the hardcoded data, edges go from dependent → dependency (A depends on B: A→B). For COMPROMISE propagation, you need to traverse in REVERSE (from dependency to dependents: B→A). Pre-compute an adjacency list in the reverse direction for BFS traversal.

The ripple animation is the most important visual. When "Run Simulation" is clicked:

Use Framer Motion for the pulsing/expanding ring effects on nodes

Transition node colors level by level with 400-600ms delays between levels

The graph should stay interactive during animation (users can zoom/hover)

Add a sound effect option or at minimum a satisfying visual "wave"

Responsive design: The app should work on desktop (primary) and tablet. Mobile is not required but the sidebar should collapse.

Performance: The graph has only ~30 nodes so performance won't be an issue. Make it look smooth.

Color-blind accessibility: Use shapes in addition to colors (circles for apps, squares for libraries, triangles for foundational). Add pattern fills or icons inside nodes.

All the "AI explanations" are pre-computed template strings. Do NOT call any actual AI API. Generate the text deterministically based on the graph analysis results using template literals.

Add a loading/splash screen on initial load with the RippleLab logo and a ripple animation.  src/

├── App.tsx                    # Main app with router

├── main.tsx                   # Entry point

├── index.css                  # Tailwind imports + custom CSS

├── data/

│   └── ecosystem.ts           # All hardcoded nodes, edges, and mock data

├── utils/

│   ├── graphAnalysis.ts       # Ripple Score, centrality, BFS algorithms

│   ├── simulation.ts          # Propagation simulation logic

│   └── explanations.ts        # Template-based AI explanation generator

├── components/

│   ├── Layout/

│   │   ├── Sidebar.tsx        # Navigation sidebar

│   │   └── Header.tsx         # Page header

│   ├── Dashboard/

│   │   ├── StatsBar.tsx       # Top metric cards

│   │   ├── DependencyGraph.tsx # Main force graph component

│   │   ├── NodeDetail.tsx     # Selected node detail panel

│   │   └── SearchBar.tsx      # Package search

│   ├── Simulate/

│   │   ├── SimulationControls.tsx

│   │   ├── SimulationGraph.tsx    # Graph with animation

│   │   └── BlastRadiusPanel.tsx   # Results panel

│   ├── Compare/

│   │   ├── StrategyCard.tsx       # Individual strategy card

│   │   ├── ComparisonTable.tsx    # Side-by-side metrics

│   │   └── Recommendation.tsx     # AI recommendation

│   ├── Explain/

│   │   ├── ExecutiveSummary.tsx

│   │   ├── CriticalRanking.tsx

│   │   ├── RiskHeatMap.tsx

│   │   └── MitigationPriorities.tsx

│   ├── About/

│   │   └── AboutPage.tsx

│   └── shared/

│       ├── RippleScoreGauge.tsx    # Circular gauge component

│       ├── MetricCard.tsx          # Reusable stat card

│       └── Badge.tsx               # Type badge component

└── hooks/

    ├── useGraphData.ts            # Graph data processing hook

    └── useSimulation.ts           # Simulation state management   Complete 30-node dependency graph with edges

5 pages: Dashboard, Simulate, Compare, Explain, About

The ripple animation (your money shot for judges)

Graph analysis algorithms in TypeScript

Full file structure

Dark theme design system with glass-morphism

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dependency-sonar.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/23dc6550-55f2-4fb7-8681-c3f96b112875).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
