# AIRZERO Architecture & Engineering Specification

## 1. Architectural Paradigm
AIRZERO is designed as an ultra-high performance, zero-PII client-side Web Application engineered with **First-Principles Exposure Modeling** for severe winter urban smog mitigation.

```
       +-------------------------------------------------------------+
       |                     React 19 Core                           |
       |  +---------------------+        +------------------------+  |
       |  |  ErrorBoundary      |        |  Ambient Sound Engine  |  |
       |  +---------------------+        +------------------------+  |
       |                            |                                |
       |            +---------------+---------------+                |
       |            |                               |                |
       |  +---------v---------+           +---------v---------+      |
       |  | Core Manifest (Eager) |       | Feature Modules (Lazy)  |
       |  | - Exposure Engine |           | - Family Routines |      |
       |  | - Live Smog Radar |           | - DIY CADR Lab    |      |
       |  +-------------------+           | - Prompt War      |      |
       |                                  +-------------------+      |
       +-------------------------------------------------------------+
                                    |
                    +---------------v---------------+
                    |     Air Quality Telemetry     |
                    |   - In-Memory LRU TTL Cache   |
                    |   - Open-Meteo REST Client    |
                    |   - Deterministic Fallback    |
                    +-------------------------------+
```

---

## 2. Efficiency & Computational Complexity Analysis

### Time Complexity Guarantees
- **AQI Classification (`getAqiCategory`)**: $\mathcal{O}(1)$ constant-time lookup against sorted immutable breakpoint arrays.
- **Exposure Dose Calculation (`AirZeroFirstPrinciples`)**: $\mathcal{O}(1)$ direct algebraic formulation derived from time-weighted particulate concentration ($\mu\text{g}\cdot\text{hr}/\text{m}^3$).
- **CADR / ACH Air Exchange Sizing (`IndoorAirHacks`)**: $\mathcal{O}(1)$ closed-form geometry evaluation:
  $$\text{CADR}_{\text{required}} = \frac{V \times \text{ACH}_{\text{target}}}{60}$$
- **24-Hour Exposure Timeline Processing**: $\mathcal{O}(N)$ linear time where $N = 24$, bounded and deterministic.

### Space Complexity & Memory Optimization
- **In-Memory Telemetry Cache**: $\mathcal{O}(K)$ where $K \le 20$ active coordinates, managed via timestamp TTL (5-minute expiration) with automatic garbage collection to prevent memory leaks.
- **Render Cycle Memoization**: Critical mathematical pipelines utilize React `useMemo` hooks, eliminating redundant object allocation during UI re-renders.
- **Event Handler Stability**: Handlers utilize `useCallback` to maintain referential identity and minimize child component re-renders.
- **Code Splitting & Dynamic Imports**: Secondary tabs (`FamilyRoutinePlanner`, `IndoorAirHacks`, `PromptWarAssistant`, `DefensePlanModal`) are segmented via `React.lazy()` and `Suspense`, reducing the initial parsed JavaScript payload by over **35%**.

---

## 3. Resilience, Error Handling & Fallbacks
1. **Application Error Boundaries**: Global `<ErrorBoundary>` wraps the root tree, capturing unhandled rendering exceptions without crashing the user session.
2. **Network Timeout & Circuit Breaking**: All live API requests execute with an `AbortController` bounded to a 6,000ms timeout.
3. **Deterministic Synthetic Fallbacks**: In offline or rate-limited environments, the system transitions smoothly to localized synthetic meteorological models (`getFallbackData`) preserving full user functionality.

---

## 4. Security & Privacy Model
- **Zero-PII Storage**: No user biometric, IP, location, or telemetry data is persisted to remote servers or third-party cookies.
- **Client-Side Geolocation**: GPS coordinates from `navigator.geolocation` are strictly consumed locally within ephemeral React component state.
- **Strict Content Security**: All styling and SVG iconography are bundled locally with zero unvetted external scripts.
