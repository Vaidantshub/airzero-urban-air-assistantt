# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Privacy by Design

AIRZERO is designed with a strict **Privacy-First & Zero-Trust** security architecture:

1. **Zero Personally Identifiable Information (PII) Storage**:
   - The application does not collect, store, or transmit any personally identifiable information, phone numbers, or health records.
   - All household profiles and checklist states are processed entirely client-side in browser memory.

2. **Client-Side Geolocation Security**:
   - GPS location detection is strictly opt-in and triggered exclusively by explicit user interaction via the W3C Geolocation API.
   - Exact latitude and longitude coordinates are never persisted to external databases; coordinates are passed solely to public weather stations (Open-Meteo) for micro-local particulate lookup.

3. **Content Security Policy (CSP) & Transport**:
   - All external API calls are enforced over HTTPS / TLS 1.3.
   - Zero dynamic code evaluation (`eval` or `Function()`) is utilized across the codebase.

4. **Dependency Integrity**:
   - All third-party dependencies are pinned and regularly audited via automated vulnerability scanners (`npm audit`).
   - Current status: **0 Known Vulnerabilities**.

## Reporting a Vulnerability

If you discover a security vulnerability within AIRZERO, please submit a detailed advisory:
- **Email**: `security@airzero.app` (or submit a confidential issue on GitHub)
- **Response SLA**: Initial triage within 24 hours; patch deployment within 72 hours.

Thank you for helping keep families and communities safe.
