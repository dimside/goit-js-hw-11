import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalHits = null;
  }

  fetchPhotos() {
    const BASE_URL = `https://pixabay.com/api/`;
    const options = {
      params: {
        key: '35646558-4fb195c270d7d7b6dafa6281b',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    };

    return axios.get(BASE_URL, options).then(response => {
      return response.data;
    });
  }

  setQuery(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
