import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self):
        self.model = None
        self.chunks = []
        self.embeddings = None
        self._load_knowledge()

    def _load_knowledge(self):
        file_path = os.path.join(os.path.dirname(__file__), 'data', 'me.json')
        with open(file_path, 'r') as f:
            self.chunks = json.load(f)

    def _ensure_model_loaded(self):
        if self.model is None:
            print("Loading embedding model...")
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.embeddings = self.model.encode(self.chunks, normalize_embeddings=True)
            print(f"Vector store ready with {len(self.chunks)} chunks.")

    def search(self, query, top_k=3):
        self._ensure_model_loaded()
        query_embedding = self.model.encode(query, normalize_embeddings=True)
        scores = np.dot(self.embeddings, query_embedding)
        top_indices = np.argsort(scores)[::-1][:top_k]
        # Return (chunk, score) tuples
        return [(self.chunks[i], float(scores[i])) for i in top_indices]

vector_store = VectorStore()
