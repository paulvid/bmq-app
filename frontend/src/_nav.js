export default {
  items: [
    {
      title: true,
      name: 'Dashboard',
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
      name: 'Model Training',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Library',
      url: '/library',
      icon: 'fa fa-book',
    },
    {
      name: 'Monitor',
      url: '/monitor',
      icon: 'icon-speedometer',
    }
    
  ],
};
