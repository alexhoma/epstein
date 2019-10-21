function epstein(documents) {
  return {
    search(query) {
      return documents.filter(doc => doc === query);
    },
  };
}

export default epstein;
