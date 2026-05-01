(function() {
    var input = document.getElementById('search-input');
    var resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;

    var index = null;

    function initIndex() {
        if (index) return;
        if (typeof elasticlunr === 'undefined' || typeof searchIndex === 'undefined') return;
        index = elasticlunr.Index.load(searchIndex);
    }

    function doSearch(query) {
        initIndex();
        if (!index) return [];
        return index.search(query, { expand: true }).slice(0, 10);
    }

    function renderResults(results) {
        if (results.length === 0) {
            resultsContainer.hidden = true;
            return;
        }

        var html = '';
        results.forEach(function(result) {
            var doc = result.doc;
            var body = doc.body || '';
            if (body.length > 150) body = body.substring(0, 150) + '...';
            html += '<a class="search-result-item" href="' + doc.id + '">';
            html += '<div class="search-result-title">' + (doc.title || 'Untitled') + '</div>';
            html += '<div class="search-result-body">' + body + '</div>';
            html += '</a>';
        });
        resultsContainer.innerHTML = html;
        resultsContainer.hidden = false;
    }

    var debounceTimer;
    input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        var query = input.value.trim();
        if (query.length < 2) {
            resultsContainer.hidden = true;
            return;
        }
        debounceTimer = setTimeout(function() {
            renderResults(doSearch(query));
        }, 200);
    });

    document.addEventListener('click', function(e) {
        if (!resultsContainer.contains(e.target) && e.target !== input) {
            resultsContainer.hidden = true;
        }
    });

    input.addEventListener('focus', function() {
        if (input.value.trim().length >= 2) {
            renderResults(doSearch(input.value.trim()));
        }
    });
})();
