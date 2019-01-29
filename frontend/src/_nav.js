export default {
  items: [
    {
      title: true,
      name: 'Statistics',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'History',
      url: '/history',
      icon: 'fa fa-bar-chart'
    },
    {
      name: 'Predictions',
      url: '/predictions',
      icon: 'fa fa-line-chart'
    },
    {
      title: true,
      name: 'Infrastructure',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Monitor',
      url: '/monitor',
      icon: 'icon-speedometer',
    },
    {
      name: 'Bundle',
      url: '/library/2',
      icon: 'fa fa-book',
    }
    
  ],
};
