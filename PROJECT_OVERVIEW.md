# NagrikSetu (नागरिकसेतु) — Project Overview

> **AI-Powered Civic Grievance Triage & Citizen Assistance Platform for India**  
> *Developed for Social Impact Hackathon 2026*

---

## 1. Project Title
**NagrikSetu (नागरिकसेतु)**  
*Smart Citizen Grievance Triage, Authority Routing & Government Service Navigator*

---

## 2. Tagline
**"Bridging Citizens and Civic Governance with Multilingual AI Triage, Verified Authority Routing, and Procedural Guidance."**

---

## 3. 50-Word Project Summary
NagrikSetu is an AI-powered GovTech assistance platform that helps Indian citizens articulate civic grievances and navigate government services. Using Google Gemini AI with deterministic fallbacks, it converts informal complaints into formal administrative representations, routes them to verified local authorities (like Agra Nagar Nigam), intercepts dangerous emergencies, and simplifies state certificate workflows.

---

## 4. 150-Word Project Summary
Navigating urban governance and public services in India is often hindered by jurisdictional ambiguity, language barriers, and fragmented portals. NagrikSetu addresses this challenge through an intelligent, citizen-first bridge:

1. **Civic Grievance Triage:** Citizens report issues in everyday English, Hindi, or Hinglish (via text or voice). NagrikSetu categorizes the issue, assesses urgency, generates a formal citizen-charter grievance draft, and maps the exact responsible municipal department (e.g., Agra Nagar Nigam, Jal Sansthan, DVVNL).
2. **Emergency Pre-Flight Interception:** Detects acute physical hazards (e.g., sparking live wires, open manholes) and instantly provides emergency guidance and helplines (112, 1912) before municipal filing.
3. **Government Service Navigator:** Provides verified application requirements, document checklists, and direct links to official government portals (UP eDistrict, Delhi e-District, Passport Seva).
4. **Resilient AI Architecture:** Couples Google Gemini AI with rule-based deterministic fallback engines for offline resilience and privacy safety.

---

## 5. Detailed Project Description
In many Indian municipalities, citizens frequently struggle to resolve basic civic issues—such as overflowing waste heaps, unpaved potholes, malfunctioning streetlights, and contaminated water pipelines—not because civic bodies are unwilling to act, but because complaints are filed through the wrong channels, lack critical actionable details, or are submitted to departments outside their jurisdiction. Furthermore, applying for essential statutory documents (e.g., Income Certificates, Domicile Certificates, Birth Certificates, Passports) often leaves citizens vulnerable to touts due to opaque procedural requirements.

**NagrikSetu** transforms this experience into a guided, dignified digital journey:
- **Intelligent Articulation:** Rather than expecting citizens to understand administrative terminology or legal formats, NagrikSetu allows citizens to describe problems in colloquial terms. The system structures the submission, flags missing location landmarks, and formats a formal petition adhering to administrative standards.
- **Location-Based Authority Resolution:** Uses a verified jurisdictional directory covering municipal corporations (MCD, Agra Nagar Nigam), urban development bodies (ADA, GDA, NOIDA), utility boards (Delhi Jal Board, Jal Sansthan Agra), and power distribution companies (Torrent Power, DVVNL, BSES) to eliminate the "wrong department" bounce.
- **Public Safety Shield:** Recognizes life-threatening hazards before administrative processing, guiding citizens to immediate safety and direct emergency responder hotlines.
- **GovTech Information Integrity:** Only references verified official government portals (`.gov.in` and `.nic.in`), clearly distinguishing between local prototype records and official government submissions.

---

## 6. Problem Statement
1. **Jurisdictional Confusion:** In urban Indian cities, multiple authorities operate simultaneously (e.g., Municipal Corporation vs. Development Authority vs. PWD vs. Jal Sansthan vs. Power Discoms). Citizens rarely know which agency owns a specific service or street width.
2. **Incomplete or Informal Complaints:** Grievances submitted via phone or raw text frequently omit crucial landmarks, photo evidence, or severity descriptions, leading to high rejection or inaction rates.
3. **Procedural Complexity in Public Services:** Applying for statutory certificates often involves obscure document criteria, unclear appointment mandates, and scattered web portals, fostering reliance on informal intermediaries.
4. **Safety Hazard Blindspots:** Generic grievance systems often queue life-threatening emergencies (e.g., hanging high-tension wires) alongside non-urgent routine maintenance, risking fatal delays.
5. **Language & Digital Literacy Divide:** Existing government portals often lack responsive interfaces, intuitive voice input, and seamless bilingual support (Hindi/English/Hinglish).

---

## 7. Proposed Solution
NagrikSetu introduces a unified, citizen-centric intelligence layer between residents and public administrative bodies:
- **Dual-Engine Multilingual Understanding:** Integrates Google Gemini AI for contextual reasoning and colloquial language processing, backed by a deterministic client-server NLP fallback engine that guarantees instant offline availability.
- **Pre-Flight Emergency Interceptor:** Prioritizes safety above all by isolating acute hazards and presenting emergency contact actions (112/1912).
- **Automated Formal Grievance Generation:** Automatically translates unstructured citizen voice or text inputs into a structured formal citizen-charter grievance letter with proper subject lines, category tagging, SLA timelines, and jurisdiction metadata.
- **Verified Authority Recommendation Engine:** Analyzes geographic context (state, city, locality, road type) to identify the specific governing authority, its official website, and grievance channel.
- **Service Navigator & Interactive Checklist:** Guides users through certificate prerequisites with localized document checklists that track citizen preparation without requiring uploads of sensitive identity cards.
- **Unified Conversational Assistant:** Offers a single conversational entry point across 7 distinct intents (civic complaints, government services, document checklists, appointments, emergencies, general guidance, and fallback handling).

---

## 8. Target Users
1. **Urban Residents & Community Volunteers:** Citizens seeking rapid resolution for local neighborhood civic issues (garbage disposal, drainage overflow, street lighting, road repairs).
2. **First-Time Government Service Applicants:** Students, job seekers, and families navigating statutory applications (income certificate for scholarships, domicile certificate for admissions, birth certificates).
3. **Elderly and Non-Technical Citizens:** Users who benefit from voice dictation, conversational guidance, and clear Hindi/English instructions rather than complex administrative forms.
4. **Civic Activists & Ward Representatives:** Community organizers drafting structured, well-documented representations for municipal ward committees.

---

## 9. Innovation and Uniqueness
| Feature | Traditional Government Portals | NagrikSetu Innovation |
| :--- | :--- | :--- |
| **Input Style** | Rigid forms requiring technical administrative department codes | Natural language text or speech in English, Hindi, or Hinglish |
| **Grievance Drafting** | Citizen must manually draft text | AI generates formal administrative letter aligned with citizen charter standards |
| **Department Routing** | Manual selection from hundreds of confusing departments | Automatic location-aware authority matching with confidence rating |
| **Emergency Handling** | Queued with ordinary maintenance tickets | Pre-flight interception displaying emergency warnings & direct helplines (112/1912) |
| **Service Guidance** | Long static PDFs or fragmented state sites | Interactive checklists with state-aware requirements and direct `.gov.in` portal links |
| **Resilience & Fallback**| High failure rate on slow networks | Hybrid architecture: Gemini AI with deterministic local NLP backup |
| **Data Privacy** | Requires uploading unencrypted Aadhaar copies | Zero sensitive document uploads; client-side checklist tracking only |

---

## 10. Expected Social Impact
1. **Democratizing Administrative Access:** Empowers citizens regardless of digital fluency or educational background to demand their statutory civic rights.
2. **Reducing Administrative Backlog:** By structuring complaints with verified categories, severity indicators, and precise landmarks, municipal officers receive actionable, high-quality reports that can be resolved faster.
3. **Saving Lives in Emergencies:** Diverts acute physical dangers away from administrative queues to first responders within seconds.
4. **Transparency & Fraud Reduction:** Directs citizens to official government portals (`edistrict.up.gov.in`, `mcdonline.nic.in`), eliminating dependence on unauthorized touts and middlemen.
5. **Civic Participation:** Cultivates trust between citizens and local urban local bodies (ULBs) by giving citizens a structured tracking ledger and clear SLA expectations.

---

## 11. Current MVP vs. Future Vision

NagrikSetu maintains a transparent distinction between current operational capabilities and long-term agentic goals:

| Aspect | Current Operational MVP | Future Long-Term Vision |
| :--- | :--- | :--- |
| **Citizen Interface** | Natural language voice & text input (English, Hindi, Hinglish) | Voice-first conversational AI supporting all major regional languages |
| **Grievance Drafting** | AI structures complaints & generates formal administrative representations | AI prepares pre-filled petition drafts aligned with specific state portal schemas |
| **Authority Routing** | Location-aware authority recommendations (e.g., Agra Nagar Nigam, Jal Sansthan) | Automated discovery & deep-linking of verified official submission endpoints |
| **Service Guidance** | Interactive requirements, document checklists & official portal links | Citizen-authorized agentic navigation of supported government workflows |
| **Submission Model** | Citizen reviews draft and files manually on official government portals | Citizen explicitly authorizes AI to assist with supported form fields where permitted |
| **Tracking Model** | Local client-side tracking prototype | Official status verification through government portal APIs where supported |

---

## 12. Strategic Product Roadmap

### Stage 1: AI Guidance and Complaint Preparation (Current MVP)
- Multilingual natural language triage (English, Hindi, Hinglish).
- AI grievance analysis & formal letter generation.
- Emergency pre-flight hazard interception (112, 1912).
- Authority recommendation engine for Agra, UP, and Delhi.
- Government Service Navigator with localized document checklists.

### Stage 2: AI-Assisted Government Portal Navigation (Planned)
- Direct deep-linking to verified state and central submission endpoints.
- Visual step-by-step guidance overlays for complex municipal portals.
- Dynamic form requirements extraction from public portal schemas.

### Stage 3: Citizen-Approved Form Automation (Planned, Subject to Portal Permissions)
- Pre-filling supported form fields using citizen-approved details.
- Human-in-the-loop review screens before any state interaction.
- Strict compliance with official portal terms of service and security standards.

### Stage 4: Authorized Submission and Status Tracking (Long-Term Vision)
- Authorized submission via authenticated citizen sessions where official APIs permit.
- Real-time status retrieval directly from official public portal endpoints.
- Multi-tier escalation assistance when statutory SLAs are breached.

---

## 13. Security, Ethics & Citizen Control Guardrails

Future automation and agentic features operate under strict non-negotiable ethical rules:
1. **Explicit Citizen Consent:** No action, form fill, or submission occurs without affirmative user authorization.
2. **Respect Official Portal Rules:** Zero automated bypasses of terms of service; operate strictly within permitted API and interface parameters.
3. **No CAPTCHA or OTP Bypass:** Human citizens must personally solve CAPTCHAs and enter two-factor OTP credentials.
4. **No Unauthorized Impersonation:** The platform never impersonates a citizen without direct, active oversight.
5. **Data Minimization:** No storage of unencrypted sensitive identity documents (Aadhaar, PAN). Checklists are tracked locally.
6. **Authentic Tracking Verification:** Official tracking IDs and confirmations are displayed only after the government portal actually confirms successful submission.
7. **Manual Fallback Always Available:** Citizens can always download their draft and submit via traditional offline or web channels.
8. **No False Government Affiliation:** Transparently disclaims status as an independent civic assistance platform, never claiming to be an official government entity.
