export default function renderCards(cards) {
  return cards
    .map(card => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = card;
      return `<div class="photo-card">
    <div class="img-container">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span> 
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span> 
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>     
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>     
    </p>
  </div>
</div></a>`;
    })
    .join('');
}
