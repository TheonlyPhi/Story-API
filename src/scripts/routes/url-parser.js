const UrlParser = {
  parseActiveUrl() {
    const url = window.location.hash.slice(1).toLowerCase();
    const [_, resource, id] = url.split('/');
    return {
      resource: resource || null,
      id: id || null,
    };
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const segments = url.split('/');
    return `/${segments[1] || ''}`;
  },
};

export default UrlParser;
