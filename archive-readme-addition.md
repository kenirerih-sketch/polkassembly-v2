---

## Archive note

Polkassembly ran as the primary governance interface for Polkadot and Kusama from 2020 to 2026. The business is closed. The codebase stays public.

**What you're looking at:**
Six years of production governance infrastructure — OpenGov integration, multi-track conviction delegation, treasury proposal workflows, Technical Fellowship tooling, identity verification, Proof of Personhood, Klara AI assistant, and PolkaSafe multisig. Built across ~15,000 commits by 60+ contributors, serving 250,000+ participants across 50+ Substrate-based networks.

**If you're building governance tooling:**
The hard problems in this repo are already solved. Multi-network Substrate support, the OpenGov track system with parallel voting, conviction weighting, delegation dashboards, proposal lifecycle state machines, identity-linked discussion threads — these took years to get right. Fork liberally.

The parts most worth studying or reusing:

- OpenGov multi-track implementation and voting state
- Conviction-based delegation with per-track granularity
- Treasury proposal workflow and spend-period tracking
- Identity and on-chain profile linking
- Governance analytics pipeline

**If you're researching:**
The governance record — every proposal, referendum, discussion, and vote from 2020 to 2026 — remains accessible at [polkadot.polkassembly.io](https://polkadot.polkassembly.io) while the archive is live (through May 31, 2026).

Company history, product record, and impact metrics: [polkassembly.io](https://polkassembly.io)

Issues and PRs remain open. If you build something useful for governance from this — that's the point.

— Jaskirat Singh & Nikhil Ranjan
