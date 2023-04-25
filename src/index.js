import Notiflix from 'notiflix';
import PixabayApiService from './pixabay-service';
import renderCards from './renderPhotoCard';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApiService = new PixabayApiService();

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreButtonEl: document.querySelector('.load-more'),
};
// ---------------Smooth Scroll ----------------------------
// function smoothScroll() {
//   const { height: cardHeight } =
//     refs.galleryEl.firstElementChild.getBoundingClientRect();
//   window.scrollBy({
//     top: (cardHeight + 20) * 10,
//     behavior: 'smooth',
//   });
// }
// ---------------------------------------------------------

// ---------------Infinity Scroll ---------------------------
function callback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadButton();
    }
  });
}
const options = { rootMargin: '50px' };
const observer = new IntersectionObserver(callback, options);
// ----------------------------------------------------------

// ----------------Fetch and Markup Cards -----------------
async function fetchCards() {
  try {
    const cards = await pixabayApiService.fetchPhotos();
    const markup = renderCards(cards.hits);
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);

    let gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    gallery.refresh();

    pixabayApiService.totalHits = cards.totalHits;
  } catch (error) {
    console.log(error);

    throw new Error(
      JSON.stringify({
        name: error.name,
        message: error.message,
      })
    );
  }
}
// --------------------------------------------------------


// -----------------OnSubmit event ---------------------------------------------
refs.formEl.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  observer.disconnect();

  refs.galleryEl.innerHTML = '';
  pixabayApiService.resetPage();
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  pixabayApiService.setQuery(searchQuery);
  try {
    await fetchCards();

    if (pixabayApiService.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(
        `Hooray! We found ${pixabayApiService.totalHits} images.`
      );
      pixabayApiService.incrementPage();
      console.log(pixabayApiService.page);
      observer.observe(refs.loadMoreButtonEl);
      // refs.loadMoreButtonEl.classList.remove('hidden');
      //  smoothScroll();
    }
  } catch (error) {
    console.log('I catch:', error);
  }
}
// ---------------------------------------------------------------------------------

// -------------------Load More Cards Event -------------------------------------
refs.loadMoreButtonEl.addEventListener('click', onLoadButton);

async function onLoadButton() {
  await fetchCards();
  pixabayApiService.incrementPage();

  // smoothScroll();

  console.log(pixabayApiService.page);

  if (
    pixabayApiService.totalHits <
    pixabayApiService.per_page * pixabayApiService.page
  ) {
    observer.disconnect();
    // refs.loadMoreButtonEl.classList.add('hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
// -------------------------------------------------------------------------------