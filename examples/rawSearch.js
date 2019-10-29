function rawSearch(value, books) {
  var queryParam = value.toLowerCase();

  return books.filter(function(book) {
    var found = Object.entries(book).some(([, prop]) => {
      return prop.toLowerCase().search(queryParam) !== -1;
    });

    if (!found) {
      return;
    }

    return book;
  });
}
