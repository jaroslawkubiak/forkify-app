import icons from 'url:../../img/icons.svg'; // parcel v2
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log('numPages:', numPages);
    // page 1, są inne strony
    if (curPage === 1 && numPages > 1) {
      return [
        this._generateMarkupPageCounter(curPage, numPages),
        this._generateMarkupNextPage(curPage),
      ].join('');
    }
    // jesteśmy na ostatniej stronie
    if (curPage === numPages && numPages > 1) {
      return [
        this._generateMarkupPrevPage(curPage),
        this._generateMarkupPageCounter(curPage, numPages),
      ];
    }
    // inne przypadki
    if (curPage < numPages) {
      return [
        this._generateMarkupPrevPage(curPage),
        this._generateMarkupPageCounter(curPage, numPages),
        this._generateMarkupNextPage(curPage),
      ].join('');
    }
    // page 1, nie ma innych stron
    return '';
  }

  _generateMarkupPrevPage(curPage) {
    return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `;
  }

  _generateMarkupPageCounter(curPage, numPages) {
    return `    
    <span class="pagination--page-count">${curPage} of ${numPages}</span>
    `;
  }

  _generateMarkupNextPage(curPage) {
    return `
        <button data-goto="${
          curPage + 1
        }"class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
  }
}

export default new PaginationView();
