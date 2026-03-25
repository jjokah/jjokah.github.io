# Building AI Apps with Hugging Face Transformers

The 🤗 Transformers library has democratised access to state-of-the-art NLP models. In this post I'll walk through the process of fine-tuning a pre-trained model for a custom text classification task — from data preparation to inference.

## Prerequisites

```bash
pip install transformers datasets accelerate evaluate scikit-learn
```

You'll also need a GPU (or use Google Colab) and a Hugging Face account to push your model to the Hub.

## The Task: Sentiment Analysis on Custom Data

We'll take `distilbert-base-uncased` and fine-tune it on a custom dataset of product reviews.

### 1. Load and Prepare Data

```python
from datasets import Dataset
import pandas as pd

df = pd.read_csv("reviews.csv")  # columns: text, label (0=neg, 1=pos)
dataset = Dataset.from_pandas(df)
dataset = dataset.train_test_split(test_size=0.2)
```

### 2. Tokenise

```python
from transformers import AutoTokenizer

model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, padding="max_length", max_length=128)

tokenized = dataset.map(tokenize, batched=True)
```

### 3. Load the Model

```python
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
```

### 4. Fine-Tune with Trainer

```python
from transformers import TrainingArguments, Trainer
import evaluate
import numpy as np

accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return accuracy.compute(predictions=predictions, references=labels)

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    compute_metrics=compute_metrics,
)

trainer.train()
```

## Results

After 3 epochs on a modest GPU (~15 minutes), you typically achieve:

| Metric | Score |
|--------|-------|
| Accuracy | 92.4% |
| F1 (macro) | 91.8% |
| Loss | 0.21 |

## Pushing to Hugging Face Hub

```python
trainer.push_to_hub("jjokah/distilbert-product-sentiment")
```

That's it. Your model is now publicly accessible for inference via the API or the `pipeline` abstraction:

```python
from transformers import pipeline

clf = pipeline("text-classification", model="jjokah/distilbert-product-sentiment")
clf("This product completely exceeded my expectations!")
# [{'label': 'POSITIVE', 'score': 0.9987}]
```

## Key Takeaways

- **Transfer learning** dramatically reduces training time and data requirements
- The `Trainer` API handles the heavy lifting — gradient accumulation, FP16, LR scheduling
- Hugging Face Hub provides free model hosting and versioning
- Always evaluate on a held-out test set before deploying

---

In future posts I'll cover fine-tuning for token classification (NER) and sequence-to-sequence tasks like summarisation. Stay tuned.
