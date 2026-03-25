# System Design Principles Every ML Engineer Should Know

Most ML courses teach you how to train models. Very few teach you how to **deploy** them reliably, at scale, and sustainably. Here are the system design principles that have shaped how I build ML systems in production.

## 1. Separate Concerns: Training vs. Serving

Training and serving have fundamentally different requirements:

| Concern | Training | Serving |
|---------|----------|---------|
| Latency | Not critical | P99 matters |
| Throughput | High (batch) | Variable |
| State | Stateless + checkpoint | Stateless |
| Hardware | GPU | CPU / GPU |
| Failure mode | Retry | Fallback |

**Design implication**: Never share a codebase between training and serving. Use separate pipelines.

## 2. Feature Stores Are Not Optional

The hidden cost of ML systems is **feature recomputation**. Without a feature store:

- Training features are recomputed from scratch each run
- Online serving recalculates features expensively at request time
- Features drift silently between training and serving (training-serving skew)

A feature store (Feast, Tecton, or even Redis + S3) solves all three:

```
Raw Data → Feature Pipeline → Feature Store
                                ↓           ↓
                           Offline Store  Online Store
                                ↓           ↓
                           Training     Serving
```

## 3. Model Registry + Versioning

Models are artefacts. Treat them like code:

```python
# Every model version gets a unique ID, metrics, and lineage
{
    "model_id": "v1.4.2",
    "trained_at": "2026-03-10T08:00:00Z",
    "accuracy": 0.924,
    "dataset_hash": "sha256:abc123",
    "parent_model": "v1.4.1",
    "tags": ["production", "sentiment"]
}
```

Use MLflow, Weights & Biases, or Hugging Face Hub as your registry.

## 4. Shadow Mode Before Full Rollout

Never replace model v1 with v2 cold. Use **shadow mode**:

1. Route 100% of traffic to v1 (live)
2. Simultaneously send requests to v2 (shadow — logs predictions, serves nothing)
3. Compare v2's predictions to v1 offline
4. Gradually shift traffic: 1% → 5% → 20% → 100%

This is the safest way to catch regression before users feel it.

## 5. Monitor the Right Things

Don't just monitor infrastructure (CPU, latency). Monitor the **model behaviour**:

- **Data drift**: Are input feature distributions shifting?
- **Prediction drift**: Are output distributions shifting?
- **Concept drift**: Has the real-world relationship between features and labels changed?

```python
# Simple KL-divergence check for feature drift
from scipy.stats import entropy
import numpy as np

def check_drift(baseline_dist, current_dist, threshold=0.1):
    kl = entropy(current_dist + 1e-10, baseline_dist + 1e-10)
    return {"kl_divergence": kl, "drifted": kl > threshold}
```

## 6. Idempotent Pipelines

Every step in your ML pipeline should be **idempotent** — running it twice produces the same result. This enables:

- Safe retries on failure
- Reproducible experiments
- Auditable model lineage

Practical rule: write outputs with content-addressable names (e.g., hash of inputs), not timestamps.

## 7. The Fallback Hierarchy

In production, models fail. Have a hierarchy:

```
Primary Model (v2)
  └── Fallback Model (v1, lighter)
        └── Rule-based Heuristic
              └── Default Response
```

This ensures your system degrades **gracefully** rather than breaking entirely.

---

## Closing Thoughts

Good ML systems are boring. They run reliably, fail gracefully, and alert loudly when something is wrong. The goal isn't the model — it's the outcome the model enables.

Invest in the infrastructure around your model as much as the model itself. That's what separates prototypes from products.

---

*If you found this useful, let me know on [X](https://x.com/JohnJohnsonOkah).*
